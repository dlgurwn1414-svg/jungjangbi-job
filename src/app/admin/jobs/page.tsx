import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDeleteJobButton from "@/components/AdminDeleteJobButton";

import { createClient } from "@/lib/supabase/server";

export default async function AdminJobsPage() {
  const supabase = await createClient();

  // 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/");
  }

  // 전체 공고 불러오기
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company,
      location,
      sub_location,
      equipment,
      salary,
      experience,
      urgent,
      status,
      contact_phone,
      view_count,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "관리자 공고 목록 조회 오류:",
      error
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 페이지 제목 */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-500 sm:text-base">
                ADMIN
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                전체 공고 관리
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                등록된 모든 채용 공고를 확인하고 관리할 수
                있습니다.
              </p>
            </div>

            <Link
              href="/admin/reports"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              신고 관리
            </Link>
          </div>

          {/* 공고 수 */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              등록 공고
            </h2>

            <p className="text-sm text-gray-500">
              총{" "}
              <span className="font-bold text-gray-900">
                {jobs?.length ?? 0}
              </span>
              개
            </p>
          </div>

          {/* 오류 */}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                공고 목록을 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          ) : !jobs || jobs.length === 0 ? (
            /* 공고 없음 */
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                등록된 공고가 없습니다.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                새로운 공고가 등록되면 이곳에 표시됩니다.
              </p>
            </div>
          ) : (
            /* 공고 목록 */
            <div className="mt-6 grid gap-4">
              {jobs.map((job) => {
                const isClosed =
                  job.status === "closed";

                const locationText =
                  job.sub_location
                    ? `${job.location ?? ""} ${job.sub_location}`.trim()
                    : job.location;

                const phoneLink =
                  job.contact_phone?.replace(
                    /[^0-9+]/g,
                    ""
                  ) ?? "";

                return (
                  <article
                    key={job.id}
                    className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      {/* 공고 정보 */}
                      <div className="min-w-0 flex-1">
                        {/* 배지 */}
                        <div className="flex flex-wrap items-center gap-2">
                          {job.urgent &&
                            !isClosed && (
                              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                                급구
                              </span>
                            )}

                          {isClosed ? (
                            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                              마감
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              모집중
                            </span>
                          )}

                          {job.equipment && (
                            <span className="max-w-full truncate rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {job.equipment}
                            </span>
                          )}

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            조회 {job.view_count ?? 0}
                          </span>
                        </div>

                        {/* 제목 */}
                        <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                          {job.title}
                        </h3>

                        {/* 업체 */}
                        <p className="mt-2 break-words text-sm text-gray-500">
                          {job.company}
                        </p>

                        {/* 지역 / 경력 */}
                        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
                          {locationText && (
                            <span className="break-words">
                              {locationText}
                            </span>
                          )}

                          {job.experience && (
                            <>
                              {locationText && (
                                <span className="text-gray-300">
                                  ·
                                </span>
                              )}

                              <span>
                                {job.experience}
                              </span>
                            </>
                          )}
                        </div>

                        {/* 급여 */}
                        <p
                          className={`mt-4 break-words font-bold ${
                            isClosed
                              ? "text-gray-500"
                              : "text-orange-600"
                          }`}
                        >
                          {job.salary}
                        </p>

                        {/* 연락처 */}
                        {job.contact_phone && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-gray-400">
                              연락처
                            </p>

                            <a
                              href={`tel:${phoneLink}`}
                              className="mt-1 inline-block break-all text-sm font-bold text-gray-700 transition hover:text-orange-600"
                            >
                              {job.contact_phone}
                            </a>
                          </div>
                        )}

                        {/* 등록일 / ID */}
                        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                          {job.created_at && (
                            <span>
                              등록일{" "}
                              {new Date(
                                job.created_at
                              ).toLocaleDateString(
                                "ko-KR"
                              )}
                            </span>
                          )}

                          <span>
                            공고 ID: {job.id}
                          </span>
                        </div>
                      </div>

                      {/* 관리 버튼 */}
                      <div className="grid w-full grid-cols-2 gap-2 border-t border-gray-100 pt-5 sm:flex sm:w-auto sm:flex-wrap sm:border-t-0 sm:pt-0 md:max-w-xs md:justify-end">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                        >
                          공고 보기
                        </Link>

                        <div className="[&>*]:min-h-12 [&>*]:w-full sm:[&>*]:w-auto">
                          <AdminDeleteJobButton
                            jobId={job.id}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}