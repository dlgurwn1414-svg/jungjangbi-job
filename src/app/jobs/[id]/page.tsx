import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplyJobButton from "@/components/ApplyJobButton";
import FavoriteJobButton from "@/components/FavoriteJobButton";
import ReportJobButton from "@/components/ReportJobButton";
import { createClient } from "@/lib/supabase/server";
import ShareButton from "@/components/ShareButton";

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

    await supabase.rpc("increment_job_view", {
  job_id_input: job.id,
});

  if (error || !job) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              공고를 찾을 수 없습니다.
            </h1>

            <p className="mt-3 text-gray-600">
              삭제되었거나 존재하지 않는 공고입니다.
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // 현재 로그인 사용자
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // 로그인한 경우 관심공고 / 지원 여부 확인
  if (user) {
    const [{ data: favorite }, { data: application }] = await Promise.all([
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

  const isClosed = job.status === "closed";

  // 전화 링크용
  const phoneLink = job.contact_phone
    ? job.contact_phone.replace(/[^0-9+]/g, "")
    : "";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <article className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
            {/* 상태 */}
            <div className="flex flex-wrap items-center gap-2">
              {isClosed ? (
                <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-600">
                  모집 마감
                </span>
              ) : (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                  모집중
                </span>
              )}

              {job.urgent && !isClosed && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
                  급구
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-400">
  조회수 {(job.view_count ?? 0) + 1}
</p>

            {/* 제목 */}
            <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
              {job.title}
            </h1>

            {/* 업체명 */}
            <p className="mt-3 text-lg font-medium text-gray-600">
              {job.company}
            </p>

            {/* 마감 안내 */}
            {isClosed && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-bold text-gray-700">
                  이 공고는 모집이 마감되었습니다.
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  현재는 새로운 지원을 받고 있지 않습니다.
                </p>
              </div>
            )}

            {/* 기본 정보 */}
            <div className="mt-8 grid gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  근무지역
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.location || "협의"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  장비
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.equipment || "협의"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  급여
                </p>

                <p
                  className={`mt-2 text-lg font-bold ${
                    isClosed
                      ? "text-gray-600"
                      : "text-orange-600"
                  }`}
                >
                  {job.salary || "협의"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  경력
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.experience || "경력무관"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  고용형태
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.work_type || "협의"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  숙소
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.accommodation || "협의"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  근무일
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.work_days || "협의"}
                </p>
              </div>

              {/* 담당자 연락처 */}
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  담당자 연락처
                </p>

                <p className="mt-2 text-base font-bold text-gray-900">
                  {job.contact_phone || "연락처 미등록"}
                </p>
              </div>
            </div>

            {/* 상세 내용 */}
            <section className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900">
                상세 내용
              </h2>

              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-gray-700">
                {job.description || "등록된 상세 내용이 없습니다."}
              </p>
            </section>

            {/* 버튼 영역 */}
            <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-8 sm:flex-row">
              {/* 지원하기 */}
              {isClosed ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 cursor-not-allowed rounded-xl bg-gray-300 px-6 py-4 font-bold text-gray-600"
                >
                  모집 마감
                </button>
              ) : (
                <ApplyJobButton
                  jobId={job.id}
                  initialApplied={initialApplied}
                />
              )}
              <ShareButton
  title={job.title}
  text={`${job.company} 채용 공고`}
/>

              {/* 관심 공고 */}
              <FavoriteJobButton
                jobId={job.id}
                initialFavorite={initialFavorite}
              />

              {/* 전화 문의 */}
              {job.contact_phone ? (
                <a
                  href={`tel:${phoneLink}`}
                  className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 font-bold text-gray-800 transition hover:bg-gray-50"
                >
                  전화 문의
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-6 py-4 font-bold text-gray-400"
                >
                  연락처 미등록
                </button>
              )}
            </div>

            {/* 신고하기 */}
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
              <ReportJobButton jobId={job.id} />
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}