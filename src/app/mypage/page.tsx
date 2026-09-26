import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeleteJobButton from "@/components/DeleteJobButton";
import JobStatusButton from "@/components/JobStatusButton";
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 회원 정보
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // 내가 등록한 공고 + 지원자 수/새 지원자 수
  const { data: myJobs } = await supabase
    .from("jobs")
    .select(`
      *,
      applications (
        id,
        owner_seen
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 내 기사 프로필
  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // 관심 공고
  const { data: favorites } = await supabase
    .from("favorite_jobs")
    .select(`
      id,
      created_at,
      jobs (
        id,
        title,
        company,
        location,
        equipment,
        salary,
        experience,
        urgent,
        status
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 관심 기사
  const { data: favoriteWorkers } = await supabase
    .from("favorite_workers")
    .select(`
      id,
      created_at,
      worker_profiles (
        id,
        name,
        region,
        equipment,
        experience_years,
        desired_salary
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 내가 지원한 공고
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      status,
      jobs (
        id,
        title,
        company,
        location,
        equipment,
        salary,
        experience,
        urgent,
        status
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
    const { data: recentJobs } = await supabase
  .from("recent_jobs")
  .select(`
    id,
    viewed_at,
    jobs (
      id,
      title,
      company,
      location,
      equipment,
      salary,
      experience,
      urgent,
      status
    )
  `)
  .eq("user_id", user.id)
  .order("viewed_at", { ascending: false })
  .limit(6);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-10">

          {/* 페이지 제목 */}
          <div>
            <p className="font-semibold text-orange-500">
              MY PAGE
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              마이페이지
            </h1>

            <p className="mt-2 text-gray-500">
              내 정보와 활동 내역을 확인할 수 있습니다.
            </p>
          </div>

          {/* 계정 정보 */}
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  내 계정
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {profile?.name || "회원"}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {user.email}
                </p>
              </div>

              {profile?.user_type && (
                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                  {profile.user_type === "worker"
                    ? "기사 회원"
                    : "업체 회원"}
                </span>
              )}
            </div>
          </section>

          {/* 기사 프로필 */}
          <section className="mt-8">
            <div>
              <p className="font-semibold text-orange-500">
                기사 프로필
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                내 기사 정보
              </h2>
            </div>

            {workerProfile ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {workerProfile.name}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {workerProfile.equipment && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                          {workerProfile.equipment}
                        </span>
                      )}

                      {workerProfile.region && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                          {workerProfile.region}
                        </span>
                      )}

                      {workerProfile.experience_years !== null &&
                        workerProfile.experience_years !== undefined && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            경력 {workerProfile.experience_years}년
                          </span>
                        )}
                    </div>

                    {workerProfile.desired_salary && (
                      <p className="mt-4 font-bold text-orange-600">
                        희망 급여 {workerProfile.desired_salary}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/workers/${workerProfile.id}`}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                      프로필 보기
                    </Link>

                    <Link
                      href="/workers/profile"
                      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                      수정하기
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-500">
                  아직 등록한 기사 프로필이 없습니다.
                </p>

                <Link
                  href="/workers/profile"
                  className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
                >
                  기사 프로필 등록
                </Link>
              </div>
            )}
          </section>

          {/* 내가 등록한 공고 */}
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-semibold text-orange-500">
                  내 공고
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  내가 등록한 공고
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <p className="hidden text-sm text-gray-500 sm:block">
                  총 {myJobs?.length ?? 0}개
                </p>

                <Link
                  href="/jobs/new"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  공고 등록
                </Link>
              </div>
            </div>

            {!myJobs || myJobs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-500">
                  아직 등록한 공고가 없습니다.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {myJobs.map((job) => {
                  const applicantCount =
                    job.applications?.length ?? 0;

                  const newApplicantCount =
                    job.applications?.filter(
                      (application) =>
                        application.owner_seen === false
                    ).length ?? 0;

                  const isClosed =
                    job.status === "closed";

                  return (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {job.urgent && !isClosed && (
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
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                {job.equipment}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-xl font-bold text-gray-900">
                            {job.title}
                          </h3>

                          <p className="mt-2 text-sm text-gray-500">
                            {job.company}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                              지원자 {applicantCount}명
                            </span>

                            {newApplicantCount > 0 && (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                                🔔 새 지원자 {newApplicantCount}명
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                            {job.location && (
                              <span>{job.location}</span>
                            )}

                            {job.experience && (
                              <>
                                <span>·</span>
                                <span>{job.experience}</span>
                              </>
                            )}
                          </div>

                          <p
                            className={`mt-4 font-bold ${
                              isClosed
                                ? "text-gray-500"
                                : "text-orange-600"
                            }`}
                          >
                            {job.salary}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                          >
                            보기
                          </Link>

                          <Link
                            href={`/jobs/${job.id}/applicants`}
                            className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-bold text-green-700 transition hover:bg-green-100"
                          >
                            지원자 보기 ({applicantCount})
                            {newApplicantCount > 0 && (
                              <span className="ml-1 text-red-600">
                                +{newApplicantCount}
                              </span>
                            )}
                          </Link>

                          <Link
                            href={`/jobs/${job.id}/edit`}
                            className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                          >
                            수정하기
                          </Link>

                          <JobStatusButton
                            jobId={job.id}
                            initialStatus={
                              isClosed ? "closed" : "open"
                            }
                          />

                          <DeleteJobButton jobId={job.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 관심 공고 */}
          <section className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-semibold text-orange-500">
                  관심 공고
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  저장한 공고
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총 {favorites?.length ?? 0}개
              </p>
            </div>

            {!favorites || favorites.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-500">
                  아직 저장한 관심 공고가 없습니다.
                </p>

                <Link
                  href="/jobs"
                  className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
                >
                  일자리 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {favorites.map((favorite) => {
                  const job = favorite.jobs;

                  if (!job) {
                    return null;
                  }

                  const isClosed =
                    job.status === "closed";

                  return (
                    <Link
                      key={favorite.id}
                      href={`/jobs/${job.id}`}
                      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition ${
                        isClosed
                          ? "opacity-60"
                          : "hover:-translate-y-1 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {job.urgent && !isClosed && (
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

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                          ★ 관심 공고
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {job.company}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                        {job.location && (
                          <span>{job.location}</span>
                        )}

                        {job.equipment && (
                          <>
                            <span>·</span>
                            <span>{job.equipment}</span>
                          </>
                        )}

                        {job.experience && (
                          <>
                            <span>·</span>
                            <span>{job.experience}</span>
                          </>
                        )}
                      </div>

                      <p
                        className={`mt-5 font-bold ${
                          isClosed
                            ? "text-gray-500"
                            : "text-orange-600"
                        }`}
                      >
                        {job.salary}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* 관심 기사 */}
          <section className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-semibold text-orange-500">
                  관심 기사
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  저장한 기사
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총 {favoriteWorkers?.length ?? 0}명
              </p>
            </div>

            {!favoriteWorkers ||
            favoriteWorkers.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-500">
                  아직 저장한 관심 기사가 없습니다.
                </p>

                <Link
                  href="/workers"
                  className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
                >
                  기사 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteWorkers.map((favorite) => {
                  const worker =
                    favorite.worker_profiles;

                  if (!worker) {
                    return null;
                  }

                  return (
                    <Link
                      key={favorite.id}
                      href={`/workers/${worker.id}`}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                          ★ 관심 기사
                        </span>

                        {worker.equipment && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {worker.equipment}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-900">
                        {worker.name}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                        {worker.region && (
                          <span>{worker.region}</span>
                        )}

                        {worker.experience_years !== null &&
                          worker.experience_years !== undefined && (
                            <>
                              <span>·</span>
                              <span>
                                경력 {worker.experience_years}년
                              </span>
                            </>
                          )}
                      </div>

                      <p className="mt-5 font-bold text-orange-600">
                        {worker.desired_salary || "급여 협의"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* 최근 본 공고 */}
<section className="mt-10">
  <div className="flex items-end justify-between">
    <div>
      <p className="font-semibold text-orange-500">
        최근 본 공고
      </p>

      <h2 className="mt-1 text-2xl font-bold text-gray-900">
        최근 확인한 일자리
      </h2>
    </div>

    <p className="text-sm text-gray-500">
      최근 {recentJobs?.length ?? 0}개
    </p>
  </div>

  {!recentJobs || recentJobs.length === 0 ? (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
      <p className="text-gray-500">
        아직 확인한 공고가 없습니다.
      </p>

      <Link
        href="/jobs"
        className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
      >
        일자리 찾아보기
      </Link>
    </div>
  ) : (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recentJobs.map((recent) => {
        const job = recent.jobs;

        if (!job) {
          return null;
        }

        const isClosed = job.status === "closed";

        return (
          <Link
            key={recent.id}
            href={`/jobs/${job.id}`}
            className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition ${
              isClosed
                ? "opacity-60"
                : "hover:-translate-y-1 hover:shadow-md"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {job.urgent && !isClosed && (
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

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                최근 봄
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              {job.title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {job.company}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
              {job.location && (
                <span>{job.location}</span>
              )}

              {job.equipment && (
                <>
                  <span>·</span>
                  <span>{job.equipment}</span>
                </>
              )}
            </div>

            <p
              className={`mt-5 font-bold ${
                isClosed
                  ? "text-gray-500"
                  : "text-orange-600"
              }`}
            >
              {job.salary}
            </p>

            {recent.viewed_at && (
              <p className="mt-3 text-xs text-gray-400">
                최근 확인{" "}
                {new Date(
                  recent.viewed_at
                ).toLocaleDateString("ko-KR")}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  )}
</section>

          {/* 내가 지원한 공고 */}
          <section className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-semibold text-orange-500">
                  지원 내역
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  내가 지원한 공고
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총 {applications?.length ?? 0}개
              </p>
            </div>

            {!applications ||
            applications.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-gray-500">
                  아직 지원한 공고가 없습니다.
                </p>

                <Link
                  href="/jobs"
                  className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
                >
                  일자리 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {applications.map((application) => {
                  const job = application.jobs;

                  if (!job) {
                    return null;
                  }

                  const isClosed =
                    job.status === "closed";

                  return (
                    <Link
                      key={application.id}
                      href={`/jobs/${job.id}`}
                      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition ${
                        isClosed
                          ? "opacity-60"
                          : "hover:-translate-y-1 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {job.urgent && !isClosed && (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                            급구
                          </span>
                        )}

                        {isClosed && (
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                            공고 마감
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            application.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : application.status === "reviewing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {application.status === "accepted"
                            ? "채용"
                            : application.status === "rejected"
                            ? "불합격"
                            : application.status === "reviewing"
                            ? "검토중"
                            : "지원됨"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {job.company}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                        {job.location && (
                          <span>{job.location}</span>
                        )}

                        {job.equipment && (
                          <>
                            <span>·</span>
                            <span>{job.equipment}</span>
                          </>
                        )}

                        {job.experience && (
                          <>
                            <span>·</span>
                            <span>{job.experience}</span>
                          </>
                        )}
                      </div>

                      <p
                        className={`mt-5 font-bold ${
                          isClosed
                            ? "text-gray-500"
                            : "text-orange-600"
                        }`}
                      >
                        {job.salary}
                      </p>

                      {application.created_at && (
                        <p className="mt-3 text-xs text-gray-400">
                          지원일{" "}
                          {new Date(
                            application.created_at
                          ).toLocaleDateString("ko-KR")}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}