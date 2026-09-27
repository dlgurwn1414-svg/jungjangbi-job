import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDeleteReportButton from "@/components/AdminDeleteReportButton";
import AdminDeleteJobButton from "@/components/AdminDeleteJobButton";

import { createClient } from "@/lib/supabase/server";

type JobSummary = {
  id: number;
  title: string | null;
  company: string | null;
  status: string | null;
};

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 관리자 여부 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/");
  }

  // 신고 목록 조회
  const { data: reports, error } = await supabase
    .from("job_reports")
    .select(`
      id,
      user_id,
      reason,
      detail,
      created_at,
      jobs (
        id,
        title,
        company,
        status
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "신고 목록 조회 오류:",
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
            <div>
              <p className="text-sm font-semibold text-red-500 sm:text-base">
                ADMIN
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                신고 관리
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                사용자들이 신고한 공고를 확인할 수
                있습니다.
              </p>
            </div>

            <Link
              href="/admin/jobs"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              전체 공고 관리
            </Link>
          </div>

          {/* 신고 수 */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              접수된 신고
            </h2>

            <p className="text-sm text-gray-500">
              총{" "}
              <span className="font-bold text-gray-900">
                {reports?.length ?? 0}
              </span>
              건
            </p>
          </div>

          <div className="mt-6">
            {error ? (
              <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-10">
                <p className="font-bold text-gray-900">
                  신고 목록을 불러오지 못했습니다.
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  잠시 후 다시 시도해주세요.
                </p>
              </div>
            ) : !reports ||
              reports.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
                <p className="font-semibold text-gray-900">
                  접수된 신고가 없습니다.
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  새로운 신고가 들어오면 이곳에
                  표시됩니다.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-5">
                {reports.map((report) => {
                  /*
                   * Supabase가 관계형 데이터를
                   * 배열로 추론하는 경우를 대비
                   */
                  const rawJob =
                    report.jobs as
                      | JobSummary
                      | JobSummary[]
                      | null;

                  const job =
                    Array.isArray(rawJob)
                      ? rawJob[0] ?? null
                      : rawJob;

                  const isDeleted =
                    !job;

                  const isClosed =
                    job?.status ===
                    "closed";

                  return (
                    <article
                      key={report.id}
                      className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        {/* 신고 정보 */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              신고
                            </span>

                            {report.reason && (
                              <span className="max-w-full break-words rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                {report.reason}
                              </span>
                            )}

                            {isDeleted && (
                              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                                삭제된 공고
                              </span>
                            )}

                            {job &&
                              isClosed && (
                                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                                  공고 마감
                                </span>
                              )}

                            {report.created_at && (
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  report.created_at
                                ).toLocaleDateString(
                                  "ko-KR"
                                )}
                              </span>
                            )}
                          </div>

                          {/* 공고 정보 */}
                          <h2 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                            {job?.title ||
                              "삭제된 공고"}
                          </h2>

                          <p className="mt-2 break-words text-sm text-gray-500">
                            {job?.company ||
                              "업체 정보 없음"}
                          </p>

                          {/* 신고 상세 */}
                          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-500">
                              신고 상세 내용
                            </p>

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700 sm:text-base">
                              {report.detail ||
                                "상세 내용 없음"}
                            </p>
                          </div>

                          {/* 기타 정보 */}
                          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                            <span>
                              신고 ID:{" "}
                              {report.id}
                            </span>

                            {job && (
                              <span>
                                공고 ID:{" "}
                                {job.id}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 관리 버튼 */}
                        <div className="w-full shrink-0 border-t border-gray-100 pt-5 md:w-52 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                          <p className="mb-3 text-xs font-semibold text-gray-500">
                            관리
                          </p>

                          <div className="grid grid-cols-1 gap-2">
                            {job && (
                              <>
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                                >
                                  공고 보기
                                </Link>

                                <div className="[&>*]:min-h-12 [&>*]:w-full">
                                  <AdminDeleteJobButton
                                    jobId={
                                      job.id
                                    }
                                  />
                                </div>
                              </>
                            )}

                            <div className="[&>*]:min-h-12 [&>*]:w-full">
                              <AdminDeleteReportButton
                                reportId={
                                  report.id
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}