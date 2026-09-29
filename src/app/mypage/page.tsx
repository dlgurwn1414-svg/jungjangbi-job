import Link from "next/link";
import { redirect } from "next/navigation";
import WorkerPromotionRequestButton from "@/components/WorkerPromotionRequestButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeleteJobButton from "@/components/DeleteJobButton";
import JobStatusButton from "@/components/JobStatusButton";
import { createClient } from "@/lib/supabase/server";
import JobPromotionRequestButton from "@/components/JobPromotionRequestButton";

type JobSummary = {
  id: number;
  title: string | null;
  company: string | null;
  location: string | null;
  equipment: string | null;
  salary: string | null;
  experience: string | null;
  
  status: string | null;
};

type WorkerSummary = {
  id: number;
  name: string | null;
  region: string | null;
  equipment: string | null;
  experience_years: number | null;
  desired_salary: string | null;
};

function getSingleRelation<T>(
  value: T | T[] | null | undefined
): T | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}
function isPromotionActive(
  promotionExpiresAt:
    | string
    | null
    | undefined
) {
  if (!promotionExpiresAt) {
    return false;
  }

  return (
    new Date(
      promotionExpiresAt
    ).getTime() > Date.now()
  );
}

function formatPromotionDate(
  promotionExpiresAt: string
) {
  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(
    new Date(promotionExpiresAt)
  );
}
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
    .order("created_at", {
      ascending: false,
    });

  // 내 기사 프로필
  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
    const { data: promotionRequests } =
  await supabase
    .from("promotion_requests")
    .select(`
      id,
      target_type,
      target_id,
      days,
      amount,
      depositor_name,
      payment_status,
      status,
      created_at
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

const pendingPromotionRequests =
  (promotionRequests ?? []).filter(
    (request) =>
      request.status === "pending"
  );
const hasPendingWorkerPromotion =
  workerProfile
    ? pendingPromotionRequests?.some(
        (request) =>
          request.target_type === "worker" &&
          request.target_id === workerProfile.id
      ) ?? false
    : false;
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
        status
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

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
    .order("created_at", {
      ascending: false,
    });

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
    .order("created_at", {
      ascending: false,
    });

  // 최근 본 공고
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
    .order("viewed_at", {
      ascending: false,
    })
    .limit(6);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
         {/* 페이지 제목 */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-sm font-semibold text-orange-500 sm:text-base">
      MY PAGE
    </p>

    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
      마이페이지
    </h1>

    <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
      내 정보와 활동 내역을 확인할 수 있습니다.
    </p>
  </div>

  <div className="flex w-full gap-2 sm:w-auto">
    <Link
      href="/mypage/inquiries"
      className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:flex-none"
    >
      내 문의
    </Link>

    <Link
      href="/mypage/inquiries/new"
      className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600 sm:flex-none"
    >
      문의하기
    </Link>
  </div>
</div>

          {/* 계정 정보 */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-500">
                  내 계정
                </p>

                <h2 className="mt-2 break-words text-xl font-bold text-gray-900">
                  {profile?.name || "회원"}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-600">
                  {user.email}
                </p>
              </div>

             <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
  {profile?.user_type && (
    <span className="self-start rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600 sm:self-auto">
      {profile.user_type === "worker"
        ? "기사 회원"
        : "업체 회원"}
    </span>
  )}

  <Link
    href="/mypage/inquiries"
    className="flex min-h-11 w-full items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-100 sm:w-auto"
  >
    내 문의
  </Link>
</div>
            </div>
          </section>

          {/* 기사 프로필 */}
          <section className="mt-8">
            <div>
              <p className="text-sm font-semibold text-orange-500 sm:text-base">
                기사 프로필
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                내 기사 정보
              </h2>
            </div>

            {workerProfile ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                      {workerProfile.name}
                    </h3>
{isPromotionActive(
  workerProfile.promotion_expires_at
) && (
  <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">
    <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
      추천
    </span>

    <span className="text-sm font-semibold text-orange-700">
      추천 노출 중
    </span>

    <span className="text-sm text-orange-700">
      {formatPromotionDate(
        workerProfile.promotion_expires_at
      )}
      까지
    </span>
  </div>
)}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {workerProfile.equipment && (
                        <span className="max-w-full truncate rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
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
                      <p className="mt-4 break-words font-bold text-orange-600">
                        희망 급여 {workerProfile.desired_salary}
                      </p>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
  <Link
    href={`/workers/${workerProfile.id}`}
    className="flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
  >
    프로필 보기
  </Link>

  <Link
    href="/workers/profile"
    className="flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
  >
    수정하기
  </Link>

 <WorkerPromotionRequestButton
  userId={user.id}
  workerId={workerProfile.id}
  promotionExpiresAt={
    workerProfile.promotion_expires_at
  }
  hasPendingRequest={
    hasPendingWorkerPromotion
  }
/>
</div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
                <p className="text-sm text-gray-500 sm:text-base">
                  아직 등록한 기사 프로필이 없습니다.
                </p>

                <Link
                  href="/workers/profile"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white sm:w-auto"
                >
                  기사 프로필 등록
                </Link>
              </div>
            )}
          </section>
                   

          {/* 추천 신청 / 결제 내역 */}
          <section className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  추천 신청
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  추천 신청 / 결제 내역
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  추천 신청 상태와 입금 확인 여부를 확인할 수 있습니다.
                </p>
              </div>

              <p className="text-sm text-gray-500">
                총 {promotionRequests?.length ?? 0}건
              </p>
            </div>

            {!promotionRequests ||
            promotionRequests.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
                <p className="text-sm text-gray-500 sm:text-base">
                  아직 추천 신청 내역이 없습니다.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {promotionRequests.map((request) => {
                  const targetJob =
                    request.target_type === "job"
                      ? myJobs?.find(
                          (job) =>
                            job.id ===
                            request.target_id
                        )
                      : null;

                  const targetName =
                    request.target_type === "job"
                      ? targetJob?.title ||
                        "채용 공고"
                      : workerProfile?.id ===
                        request.target_id
                      ? workerProfile.name
                      : "기사 프로필";

                  const displayAmount =
                    request.amount ??
                    (request.days === 30
                      ? 29900
                      : 9900);

                  return (
                    <article
                      key={request.id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              {request.target_type ===
                              "job"
                                ? "채용 공고"
                                : "기사 프로필"}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                request.payment_status ===
                                "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {request.payment_status ===
                              "paid"
                                ? "입금 확인"
                                : "미입금"}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                request.status ===
                                "approved"
                                  ? "bg-blue-100 text-blue-700"
                                  : request.status ===
                                    "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {request.status ===
                              "approved"
                                ? "추천 적용 완료"
                                : request.status ===
                                  "rejected"
                                ? "신청 거절"
                                : "승인 대기"}
                            </span>
                          </div>

                          <h3 className="mt-4 break-words text-lg font-bold text-gray-900">
                            {targetName}
                          </h3>

                          <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                            <p>
                              신청 상품:{" "}
                              <span className="font-bold text-gray-900">
                                {request.days}일 추천
                              </span>
                            </p>

                            <p>
                              결제 금액:{" "}
                              <span className="font-bold text-orange-600">
                                {displayAmount.toLocaleString()}
                                원
                              </span>
                            </p>

                            <p>
                              입금자명:{" "}
                              <span className="font-semibold text-gray-900">
                                {request.depositor_name ||
                                  "미입력"}
                              </span>
                            </p>

                            <p>
                              신청일:{" "}
                              <span className="font-medium text-gray-900">
                                {new Intl.DateTimeFormat(
                                  "ko-KR",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                ).format(
                                  new Date(
                                    request.created_at
                                  )
                                )}
                              </span>
                            </p>
                          </div>

                        {request.payment_status !== "paid" &&
  request.status === "pending" && (
    <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-orange-700">
          아직 입금 확인 전입니다.
        </p>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-700">
          {displayAmount.toLocaleString()}원
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-orange-100 bg-white p-4">
        <p className="text-xs font-semibold text-gray-500">
          입금 계좌
        </p>

        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <p>
            은행:{" "}
            <span className="font-bold text-gray-900">
              테스트은행
            </span>
          </p>

          <p>
            계좌번호:{" "}
            <span className="break-all font-bold text-gray-900">
              000-0000-0000
            </span>
          </p>

          <p>
            예금주:{" "}
            <span className="font-bold text-gray-900">
              중장비 일터
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-white p-4">
        <p className="text-xs text-gray-500">
          입력한 입금자명
        </p>

        <p className="mt-1 break-words font-bold text-gray-900">
          {request.depositor_name || "미입력"}
        </p>
      </div>

      <p className="mt-3 text-xs leading-5 text-orange-700">
        위 입금자명으로 입금하면 관리자가 확인 후 추천 노출을 적용합니다.
      </p>
    </div>
  )}
    <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-3">
      <p className="text-sm font-bold text-orange-700">
        아직 입금 확인 전입니다.
      </p>

      <p className="mt-1 text-xs leading-5 text-orange-700">
        신청할 때 입력한 입금자명으로
        입금하면 관리자가 확인 후 추천
        노출을 적용합니다.
      </p>
    </div>
  
                        </div>

                        <div className="w-full shrink-0 sm:w-auto">
                          {request.target_type ===
                          "job" ? (
                            <Link
                              href={`/jobs/${request.target_id}`}
                              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                            >
                              공고 보기
                            </Link>
                          ) : (
                            <Link
                              href={`/workers/${request.target_id}`}
                              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                            >
                              프로필 보기
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* 내가 등록한 공고 */}
<section className="mt-10"></section>

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
            (application: {
              owner_seen: boolean | null;
            }) =>
              application.owner_seen === false
          ).length ?? 0;

        const isClosed =
          job.status === "closed";

        const isPromoted =
          isPromotionActive(
            job.promotion_expires_at
          );
          const hasPendingJobPromotion =
  pendingPromotionRequests?.some(
    (request) =>
      request.target_type === "job" &&
      request.target_id === job.id
  ) ?? false;

        return (
          <div
            key={job.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {isPromoted && (
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      추천
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

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                    지원자 {applicantCount}명
                  </span>

                  {newApplicantCount > 0 && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                      🔔 새 지원자 {newApplicantCount}명
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {job.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {job.company}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                  {job.location && (
                    <span>
                      {job.location}
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

                <p
                  className={`mt-4 font-bold ${
                    isClosed
                      ? "text-gray-500"
                      : "text-orange-600"
                  }`}
                >
                  {job.salary}
                </p>

                {isPromoted &&
                  job.promotion_expires_at && (
                    <p className="mt-3 text-sm font-semibold text-orange-600">
                      추천 노출{" "}
                      {formatPromotionDate(
                        job.promotion_expires_at
                      )}
                      까지
                    </p>
                  )}
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

               <JobPromotionRequestButton
  userId={user.id}
  jobId={job.id}
  promotionExpiresAt={
    job.promotion_expires_at
  }
  hasPendingRequest={
    hasPendingJobPromotion
  }
/>

                <JobStatusButton
                  jobId={job.id}
                  initialStatus={
                    isClosed
                      ? "closed"
                      : "open"
                  }
                />

                <DeleteJobButton
                  jobId={job.id}
                />
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  관심 공고
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  저장한 공고
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총 {favorites?.length ?? 0}개
              </p>
            </div>

            {!favorites ||
            favorites.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
                <p className="text-sm text-gray-500 sm:text-base">
                  아직 저장한 관심 공고가 없습니다.
                </p>

                <Link
                  href="/jobs"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white sm:w-auto"
                >
                  일자리 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {favorites.map((favorite) => {
                  const job =
                    getSingleRelation<JobSummary>(
                      favorite.jobs
                    );

                  if (!job) {
                    return null;
                  }

                  const isClosed =
                    job.status === "closed";

                  return (
                    <Link
                      key={favorite.id}
                      href={`/jobs/${job.id}`}
                      className={`min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition sm:p-6 ${
                        isClosed
                          ? "opacity-60"
                          : "hover:-translate-y-1 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        

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

                      <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                        {job.title}
                      </h3>

                      <p className="mt-2 break-words text-sm text-gray-500">
                        {job.company}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
                        {job.location && (
                          <span>
                            {job.location}
                          </span>
                        )}

                        {job.equipment && (
                          <>
                            {job.location && (
                              <span className="text-gray-300">
                                ·
                              </span>
                            )}

                            <span>
                              {job.equipment}
                            </span>
                          </>
                        )}

                        {job.experience && (
                          <>
                            {(job.location ||
                              job.equipment) && (
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

                      <p
                        className={`mt-5 break-words font-bold ${
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  관심 기사
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  저장한 기사
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총 {favoriteWorkers?.length ?? 0}명
              </p>
            </div>

            {!favoriteWorkers ||
            favoriteWorkers.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
                <p className="text-sm text-gray-500 sm:text-base">
                  아직 저장한 관심 기사가 없습니다.
                </p>

                <Link
                  href="/workers"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white sm:w-auto"
                >
                  기사 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteWorkers.map(
                  (favorite) => {
                    const worker =
                      getSingleRelation<WorkerSummary>(
                        favorite.worker_profiles
                      );

                    if (!worker) {
                      return null;
                    }

                    return (
                      <Link
                        key={favorite.id}
                        href={`/workers/${worker.id}`}
                        className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6 lg:hover:-translate-y-1"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                            ★ 관심 기사
                          </span>

                          {worker.equipment && (
                            <span className="max-w-full truncate rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {
                                worker.equipment
                              }
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                          {worker.name}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
                          {worker.region && (
                            <span>
                              {worker.region}
                            </span>
                          )}

                          {worker.experience_years !==
                            null &&
                            worker.experience_years !==
                              undefined && (
                              <>
                                {worker.region && (
                                  <span className="text-gray-300">
                                    ·
                                  </span>
                                )}

                                <span>
                                  경력{" "}
                                  {
                                    worker.experience_years
                                  }
                                  년
                                </span>
                              </>
                            )}
                        </div>

                        <p className="mt-5 break-words font-bold text-orange-600">
                          {worker.desired_salary ||
                            "급여 협의"}
                        </p>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* 최근 본 공고 */}
          <section className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  최근 본 공고
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  최근 확인한 일자리
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                최근 {recentJobs?.length ?? 0}개
              </p>
            </div>

            {!recentJobs ||
            recentJobs.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
                <p className="text-sm text-gray-500 sm:text-base">
                  아직 확인한 공고가 없습니다.
                </p>

                <Link
                  href="/jobs"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white sm:w-auto"
                >
                  일자리 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentJobs.map(
                  (recent) => {
                    const job =
                      getSingleRelation<JobSummary>(
                        recent.jobs
                      );

                    if (!job) {
                      return null;
                    }

                    const isClosed =
                      job.status ===
                      "closed";

                    return (
                      <Link
                        key={recent.id}
                        href={`/jobs/${job.id}`}
                        className={`min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition sm:p-6 ${
                          isClosed
                            ? "opacity-60"
                            : "hover:shadow-md lg:hover:-translate-y-1"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                         

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

                        <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                          {job.title}
                        </h3>

                        <p className="mt-2 break-words text-sm text-gray-500">
                          {job.company}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
                          {job.location && (
                            <span>
                              {job.location}
                            </span>
                          )}

                          {job.equipment && (
                            <>
                              {job.location && (
                                <span className="text-gray-300">
                                  ·
                                </span>
                              )}

                              <span>
                                {
                                  job.equipment
                                }
                              </span>
                            </>
                          )}
                        </div>

                        <p
                          className={`mt-5 break-words font-bold ${
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
                            ).toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        )}
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* 내가 지원한 공고 */}
          <section className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  지원 내역
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  내가 지원한 공고
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총 {applications?.length ?? 0}개
              </p>
            </div>

            {!applications ||
            applications.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
                <p className="text-sm text-gray-500 sm:text-base">
                  아직 지원한 공고가 없습니다.
                </p>

                <Link
                  href="/jobs"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white sm:w-auto"
                >
                  일자리 찾아보기
                </Link>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {applications.map(
                  (application) => {
                    const job =
                      getSingleRelation<JobSummary>(
                        application.jobs
                      );

                    if (!job) {
                      return null;
                    }

                    const isClosed =
                      job.status ===
                      "closed";

                    return (
                      <Link
                        key={application.id}
                        href={`/jobs/${job.id}`}
                        className={`min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition sm:p-6 ${
                          isClosed
                            ? "opacity-60"
                            : "hover:-translate-y-1 hover:shadow-md"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                         

                          {isClosed && (
                            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                              공고 마감
                            </span>
                          )}

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              application.status ===
                              "accepted"
                                ? "bg-green-100 text-green-700"
                                : application.status ===
                                  "rejected"
                                ? "bg-red-100 text-red-700"
                                : application.status ===
                                  "reviewing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {application.status ===
                            "accepted"
                              ? "채용"
                              : application.status ===
                                "rejected"
                              ? "불합격"
                              : application.status ===
                                "reviewing"
                              ? "검토중"
                              : "지원됨"}
                          </span>
                        </div>

                        <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                          {job.title}
                        </h3>

                        <p className="mt-2 break-words text-sm text-gray-500">
                          {job.company}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
                          {job.location && (
                            <span>
                              {job.location}
                            </span>
                          )}

                          {job.equipment && (
                            <>
                              {job.location && (
                                <span className="text-gray-300">
                                  ·
                                </span>
                              )}

                              <span>
                                {
                                  job.equipment
                                }
                              </span>
                            </>
                          )}

                          {job.experience && (
                            <>
                              {(job.location ||
                                job.equipment) && (
                                <span className="text-gray-300">
                                  ·
                                </span>
                              )}

                              <span>
                                {
                                  job.experience
                                }
                              </span>
                            </>
                          )}
                        </div>

                        <p
                          className={`mt-5 break-words font-bold ${
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
                            ).toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        )}
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}