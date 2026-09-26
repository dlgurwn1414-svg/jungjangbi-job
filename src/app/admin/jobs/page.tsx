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
        <div className="mx-auto max-w-6xl px-6 py-10">
          {/* 페이지 제목 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold text-red-500">
                ADMIN
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                전체 공고 관리
              </h1>

              <p className="mt-2 text-gray-500">
                등록된 모든 채용 공고를 확인하고 관리할 수 있습니다.
              </p>
            </div>

            <Link
              href="/admin/reports"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              신고 관리
            </Link>
          </div>

          {/* 공고 수 */}
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              등록 공고
            </h2>

            <p className="text-sm text-gray-500">
              총 {jobs?.length ?? 0}개
            </p>
          </div>

          {/* 오류 */}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-10 text-center">
              <p className="font-bold text-gray-900">
                공고 목록을 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          ) : !jobs ||
            jobs.length === 0 ? (
            /* 공고 없음 */
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="font-bold text-gray-900">
                등록된 공고가 없습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
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
                    ? `${job.location} ${job.sub_location}`
                    : job.location;

                return (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
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
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {job.equipment}
                            </span>
                          )}

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            조회{" "}
                            {job.view_count ?? 0}
                          </span>
                        </div>

                        {/* 제목 */}
                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                          {job.title}
                        </h3>

                        {/* 업체 */}
                        <p className="mt-2 text-sm text-gray-500">
                          {job.company}
                        </p>

                        {/* 지역 / 경력 */}
                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                          {locationText && (
                            <span>
                              {locationText}
                            </span>
                          )}

                          {job.experience && (
                            <>
                              <span>·</span>

                              <span>
                                {job.experience}
                              </span>
                            </>
                          )}
                        </div>

                        {/* 급여 */}
                        <p
                          className={`mt-4 font-bold ${
                            isClosed
                              ? "text-gray-500"
                              : "text-orange-600"
                          }`}
                        >
                          {job.salary}
                        </p>

                        {/* 연락처 */}
                        {job.contact_phone && (
                          <p className="mt-3 text-sm text-gray-500">
                            연락처{" "}
                            {job.contact_phone}
                          </p>
                        )}

                        {/* 등록일 */}
                        {job.created_at && (
                          <p className="mt-3 text-xs text-gray-400">
                            등록일{" "}
                            {new Date(
                              job.created_at
                            ).toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-400">
                          공고 ID: {job.id}
                        </p>
                      </div>

                      {/* 관리 버튼 */}
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                        >
                          공고 보기
                        </Link>

                        <AdminDeleteJobButton
                          jobId={job.id}
                        />
                      </div>
                    </div>
                  </div>
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