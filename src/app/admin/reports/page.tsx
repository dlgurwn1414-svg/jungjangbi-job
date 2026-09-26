import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

import AdminDeleteReportButton from "@/components/AdminDeleteReportButton";
import AdminDeleteJobButton from "@/components/AdminDeleteJobButton";

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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("신고 목록 조회 오류:", error);
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div>
            <p className="font-semibold text-red-500">
              ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              신고 관리
            </h1>

            <p className="mt-2 text-gray-500">
              사용자들이 신고한 공고를 확인할 수 있습니다.
            </p>
          </div>

          <div className="mt-8">
            {!reports || reports.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="font-semibold text-gray-900">
                  접수된 신고가 없습니다.
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  새로운 신고가 들어오면 이곳에 표시됩니다.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {reports.map((report) => {
                  const job = report.jobs;

                  return (
                    <div
                      key={report.id}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              신고
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {report.reason}
                            </span>

                            {report.created_at && (
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  report.created_at
                                ).toLocaleDateString("ko-KR")}
                              </span>
                            )}
                          </div>

                          <h2 className="mt-4 text-xl font-bold text-gray-900">
                            {job?.title || "삭제된 공고"}
                          </h2>

                          <p className="mt-2 text-sm text-gray-500">
                            {job?.company || "업체 정보 없음"}
                          </p>

                          <div className="mt-5 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-500">
                              신고 상세 내용
                            </p>

                            <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                              {report.detail || "상세 내용 없음"}
                            </p>
                          </div>

                          <p className="mt-4 text-xs text-gray-400">
                            신고 ID: {report.id}
                          </p>
                        </div>

                       <div className="flex shrink-0 flex-wrap gap-2">
  {job && (
    <>
      <Link
        href={`/jobs/${job.id}`}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
      >
        공고 보기
      </Link>

      <AdminDeleteJobButton jobId={job.id} />
    </>
  )}

  <AdminDeleteReportButton reportId={report.id} />
</div>
                      </div>
                    </div>
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