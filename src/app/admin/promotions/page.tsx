import Link from "next/link";
import { redirect } from "next/navigation";
import AdminApprovePromotionButton from "@/components/AdminApprovePromotionButton";
import AdminRejectPromotionButton from "@/components/AdminRejectPromotionButton";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

type PromotionRequest = {
  id: number;
  user_id: string;
  target_type: "job" | "worker";
  target_id: number;
  days: number;
  status: string;
  created_at: string;
};

type JobInfo = {
  id: number;
  title: string | null;
  company: string | null;
};

type WorkerInfo = {
  id: number;
  name: string | null;
  equipment: string | null;
};

type ProfileInfo = {
  user_id: string;
  name: string | null;
};

function getStatusLabel(status: string) {
  if (status === "approved") {
    return "승인 완료";
  }

  if (status === "rejected") {
    return "거절";
  }

  return "승인 대기";
}

function getStatusClass(status: string) {
  if (status === "approved") {
    return "bg-green-100 text-green-700";
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function AdminPromotionsPage() {
  const supabase = await createClient();

  // 로그인 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 관리자 확인
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    redirect("/");
  }

  // 추천 신청 목록
  const {
    data: requestData,
    error: requestError,
  } = await supabase
    .from("promotion_requests")
    .select(`
      id,
      user_id,
      target_type,
      target_id,
      days,
      status,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (requestError) {
    console.error(
      "추천 신청 목록 조회 오류:",
      requestError
    );
  }

  const requests =
    (requestData ?? []) as PromotionRequest[];

  // 공고 ID
  const jobIds = requests
    .filter(
      (request) =>
        request.target_type === "job"
    )
    .map((request) => request.target_id);

  // 기사 ID
  const workerIds = requests
    .filter(
      (request) =>
        request.target_type === "worker"
    )
    .map((request) => request.target_id);

  // 신청자 ID
  const userIds = [
    ...new Set(
      requests.map(
        (request) => request.user_id
      )
    ),
  ];

  let jobs: JobInfo[] = [];

  let workers: WorkerInfo[] = [];

  let profiles: ProfileInfo[] = [];

  if (jobIds.length > 0) {
    const { data } = await supabase
      .from("jobs")
      .select(`
        id,
        title,
        company
      `)
      .in("id", jobIds);

    jobs = (data ?? []) as JobInfo[];
  }

  if (workerIds.length > 0) {
    const { data } = await supabase
      .from("worker_profiles")
      .select(`
        id,
        name,
        equipment
      `)
      .in("id", workerIds);

    workers =
      (data ?? []) as WorkerInfo[];
  }

  if (userIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select(`
        user_id,
        name
      `)
      .in("user_id", userIds);

    profiles =
      (data ?? []) as ProfileInfo[];
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 상단 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-500 sm:text-base">
                ADMIN
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                추천 신청 관리
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                공고와 기사 프로필의 추천
                신청 내역을 확인할 수
                있습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/jobs"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                공고 관리
              </Link>

              <Link
                href="/admin/workers"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                기사 관리
              </Link>

              <Link
                href="/admin/reports"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                신고 관리
              </Link>
            </div>
          </div>

          {/* 신청 수 */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              추천 신청
            </h2>

            <p className="text-sm text-gray-500">
              총{" "}
              <span className="font-bold text-gray-900">
                {requests.length}
              </span>
              건
            </p>
          </div>

          {/* 오류 */}
          {requestError ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                추천 신청을 불러오지
                못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시
                시도해주세요.
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
              <p className="font-bold text-gray-900">
                아직 추천 신청이
                없습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                사용자가 추천을 신청하면
                이곳에 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {requests.map(
                (request) => {
                  const applicant =
                    profiles.find(
                      (profile) =>
                        profile.user_id ===
                        request.user_id
                    );

                  const job =
                    request.target_type ===
                    "job"
                      ? jobs.find(
                          (item) =>
                            item.id ===
                            request.target_id
                        )
                      : null;

                  const worker =
                    request.target_type ===
                    "worker"
                      ? workers.find(
                          (item) =>
                            item.id ===
                            request.target_id
                        )
                      : null;

                  const price =
                    request.days === 30
                      ? "29,900원"
                      : "9,900원";

                  return (
                    <article
                      key={request.id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                request.status
                              )}`}
                            >
                              {getStatusLabel(
                                request.status
                              )}
                            </span>

                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              {request.target_type ===
                              "job"
                                ? "채용 공고"
                                : "기사 프로필"}
                            </span>
                          </div>

                          <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                            {request.target_type ===
                            "job"
                              ? job?.title ||
                                "공고 정보 없음"
                              : worker?.name ||
                                "기사 정보 없음"}
                          </h3>

                          {request.target_type ===
                            "job" &&
                            job?.company && (
                              <p className="mt-1 text-sm text-gray-500">
                                {job.company}
                              </p>
                            )}

                          {request.target_type ===
                            "worker" &&
                            worker?.equipment && (
                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  worker.equipment
                                }
                              </p>
                            )}

                          <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                            <p>
                              신청자:{" "}
                              <span className="font-semibold text-gray-900">
                                {applicant?.name ||
                                  "회원"}
                              </span>
                            </p>

                            <p>
                              신청 기간:{" "}
                              <span className="font-semibold text-gray-900">
                                {
                                  request.days
                                }
                                일
                              </span>
                            </p>

                            <p>
                              금액:{" "}
                              <span className="font-bold text-orange-600">
                                {price}
                              </span>
                            </p>

                            <p>
                              신청일:{" "}
                              <span className="font-medium text-gray-900">
                                {formatDate(
                                  request.created_at
                                )}
                              </span>
                            </p>
                          </div>
                        </div>

                       <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
  {request.target_type ===
  "job" ? (
    <Link
      href={`/jobs/${request.target_id}`}
      className="flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
    >
      공고 보기
    </Link>
  ) : (
    <Link
      href={`/workers/${request.target_id}`}
      className="flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
    >
      프로필 보기
    </Link>
  )}

  {request.status === "pending" && (
  <div className="flex w-full flex-col gap-2 sm:flex-row">
    <AdminApprovePromotionButton
      requestId={request.id}
      days={request.days}
    />

    <AdminRejectPromotionButton
      requestId={request.id}
    />
  </div>
)}
</div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}