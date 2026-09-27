import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplyJobButton from "@/components/ApplyJobButton";
import FavoriteJobButton from "@/components/FavoriteJobButton";
import ReportJobButton from "@/components/ReportJobButton";
import ShareButton from "@/components/ShareButton";

import { createClient } from "@/lib/supabase/server";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // 공고 정보 불러오기
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  // 공고가 없을 경우
  if (error || !job) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              공고를 찾을 수 없습니다.
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              삭제되었거나 존재하지 않는 공고입니다.
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // 조회수 증가
  await supabase.rpc("increment_job_view", {
    job_id_input: job.id,
  });

  // 현재 로그인 사용자
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 최근 본 공고 저장
  if (user) {
    await supabase
      .from("recent_jobs")
      .upsert(
        {
          user_id: user.id,
          job_id: job.id,
          viewed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,job_id",
        }
      );
  }

  let initialFavorite = false;
  let initialApplied = false;

  // 로그인한 경우 관심 공고 / 지원 여부 확인
  if (user) {
    const [
      { data: favorite },
      { data: application },
    ] = await Promise.all([
      supabase
        .from("favorite_jobs")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle(),

      supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle(),
    ]);

    initialFavorite = !!favorite;
    initialApplied = !!application;
  }

  const isClosed =
    job.status === "closed";

  const phoneLink = job.contact_phone
    ? job.contact_phone.replace(
        /[^0-9+]/g,
        ""
      )
    : "";

  const locationText =
    job.sub_location
      ? `${job.location ?? ""} ${job.sub_location}`
      : job.location || "협의";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-8 md:p-10">
            {/* 상태 / 조회수 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {isClosed ? (
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600 sm:text-sm">
                    모집 마감
                  </span>
                ) : (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 sm:text-sm">
                    모집중
                  </span>
                )}

                {job.urgent &&
                  !isClosed && (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600 sm:text-sm">
                      급구
                    </span>
                  )}
              </div>

              <p className="text-sm text-gray-400">
                조회수{" "}
                {(job.view_count ?? 0) +
                  1}
              </p>
            </div>

            {/* 제목 */}
            <h1 className="mt-5 break-words text-2xl font-bold leading-snug text-gray-900 sm:text-3xl md:text-4xl">
              {job.title}
            </h1>

            {/* 업체명 */}
            <p className="mt-3 break-words text-base font-medium text-gray-600 sm:text-lg">
              {job.company}
            </p>

            {/* 마감 안내 */}
            {isClosed && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-bold text-gray-700">
                  이 공고는 모집이
                  마감되었습니다.
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  현재는 새로운 지원을 받고 있지
                  않습니다.
                </p>
              </div>
            )}

            {/* 기본 정보 */}
            <div className="mt-7 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:mt-8 sm:grid-cols-2">
              {/* 근무 지역 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  근무지역
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {locationText}
                </p>
              </div>

              {/* 장비 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  장비
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {job.equipment ||
                    "협의"}
                </p>
              </div>

              {/* 급여 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  급여
                </p>

                <p
                  className={`mt-2 break-words text-lg font-bold ${
                    isClosed
                      ? "text-gray-600"
                      : "text-orange-600"
                  }`}
                >
                  {job.salary || "협의"}
                </p>
              </div>

              {/* 경력 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  경력
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {job.experience ||
                    "경력무관"}
                </p>
              </div>

              {/* 고용형태 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  고용형태
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {job.work_type ||
                    "협의"}
                </p>
              </div>

              {/* 숙소 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  숙소
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {job.accommodation ||
                    "협의"}
                </p>
              </div>

              {/* 근무일 */}
              <div className="border-b border-gray-200 p-4 sm:border-b-0 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  근무일
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {job.work_days ||
                    "협의"}
                </p>
              </div>

              {/* 연락처 */}
              <div className="p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  담당자 연락처
                </p>

                {job.contact_phone ? (
                  <a
                    href={`tel:${phoneLink}`}
                    className="mt-2 block break-all font-bold text-gray-900 transition hover:text-orange-500"
                  >
                    {job.contact_phone}
                  </a>
                ) : (
                  <p className="mt-2 font-bold text-gray-500">
                    연락처 미등록
                  </p>
                )}
              </div>
            </div>

            {/* 상세 내용 */}
            <section className="mt-8 border-t border-gray-200 pt-7 sm:mt-10 sm:pt-8">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                상세 내용
              </h2>

              <p className="mt-4 break-words whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:mt-5 sm:text-base sm:leading-8">
                {job.description ||
                  "등록된 상세 내용이 없습니다."}
              </p>
            </section>

            {/* 주요 버튼 */}
            <section className="mt-8 border-t border-gray-200 pt-7 sm:mt-10 sm:pt-8">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* 지원하기 */}
                <div className="[&>*]:min-h-12 [&>*]:w-full">
                  {isClosed ? (
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-bold text-gray-600"
                    >
                      모집 마감
                    </button>
                  ) : (
                    <ApplyJobButton
                      jobId={job.id}
                      initialApplied={
                        initialApplied
                      }
                    />
                  )}
                </div>

                {/* 전화문의 */}
                {job.contact_phone ? (
                  <a
                    href={`tel:${phoneLink}`}
                    className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 active:bg-orange-700"
                  >
                    ☎ 전화 문의
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="min-h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 font-bold text-gray-400"
                  >
                    연락처 미등록
                  </button>
                )}

                {/* 관심 공고 */}
                <div className="[&>*]:min-h-12 [&>*]:w-full">
                  <FavoriteJobButton
                    jobId={job.id}
                    initialFavorite={
                      initialFavorite
                    }
                  />
                </div>

                {/* 공유 */}
                <div className="[&>*]:min-h-12 [&>*]:w-full">
                  <ShareButton
                    title={job.title}
                    text={`${job.company} 채용 공고`}
                  />
                </div>
              </div>
            </section>

            {/* 신고 */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex justify-center sm:justify-end">
                <ReportJobButton
                  jobId={job.id}
                />
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}