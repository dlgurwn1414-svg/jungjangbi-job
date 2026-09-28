import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDeleteWorkerButton from "@/components/AdminDeleteWorkerButton";
import AdminPromotionButton from "@/components/AdminPromotionButton";

import { createClient } from "@/lib/supabase/server";

export default async function AdminWorkersPage() {
  const supabase = await createClient();

  // 로그인 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 관리자 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/");
  }

  // 전체 기사 프로필 불러오기
  const {
    data: workers,
    error,
  } = await supabase
    .from("worker_profiles")
    .select(`
      id,
      user_id,
      name,
      phone,
      region,
      sub_region,
      equipment,
      experience_years,
      licenses,
      desired_salary,
      introduction,
      favorite_count,
      created_at,
      promotion_expires_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "관리자 기사 목록 조회 오류:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 페이지 제목 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-500 sm:text-base">
                ADMIN
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                기사 프로필 관리
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                등록된 기사 프로필을 확인하고 추천 노출 또는 삭제할 수 있습니다.
              </p>
            </div>

            {/* 관리자 메뉴 */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/jobs"
                className="flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                공고 관리
              </Link>

              <Link
                href="/admin/reports"
                className="flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                신고 관리
              </Link>
            </div>
          </div>

          {/* 기사 수 */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              등록 기사
            </h2>

            <p className="text-sm text-gray-500">
              총{" "}
              <span className="font-bold text-gray-900">
                {workers?.length ?? 0}
              </span>
              명
            </p>
          </div>

          {/* 오류 */}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-8 text-center">
              <p className="font-bold text-gray-900">
                기사 목록을 불러오지 못했습니다.
              </p>
            </div>
          ) : !workers || workers.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              등록된 기사 프로필이 없습니다.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {workers.map((worker) => {
                const isPromoted =
                  !!worker.promotion_expires_at &&
                  new Date(
                    worker.promotion_expires_at
                  ).getTime() > Date.now();

                const regionText =
                  worker.sub_region
                    ? `${worker.region ?? ""} ${worker.sub_region}`.trim()
                    : worker.region;

                const phoneLink =
                  worker.phone?.replace(
                    /[^0-9+]/g,
                    ""
                  ) ?? "";

                return (
                  <article
                    key={worker.id}
                    className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-6 ${
                      isPromoted
                        ? "border-orange-300 ring-1 ring-orange-100"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      {/* 기사 정보 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          {isPromoted && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              ★ 추천 노출중
                            </span>
                          )}

                          {worker.equipment && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {worker.equipment}
                            </span>
                          )}

                          {worker.experience_years !== null &&
                            worker.experience_years !== undefined && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                경력 {worker.experience_years}년
                              </span>
                            )}

                          {(worker.favorite_count ?? 0) > 0 && (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                              ★ 관심 {worker.favorite_count}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                          {worker.name || "이름 없음"}
                        </h3>

                        {regionText && (
                          <p className="mt-2 text-sm text-gray-600">
                            {regionText}
                          </p>
                        )}

                        {worker.desired_salary && (
                          <p className="mt-4 font-bold text-orange-600">
                            희망 급여 {worker.desired_salary}
                          </p>
                        )}

                        {worker.phone && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-gray-400">
                              연락처
                            </p>

                            <a
                              href={`tel:${phoneLink}`}
                              className="mt-1 inline-block break-all text-sm font-bold text-gray-700 transition hover:text-orange-600"
                            >
                              {worker.phone}
                            </a>
                          </div>
                        )}

                        {worker.licenses && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-gray-400">
                              자격증
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {worker.licenses}
                            </p>
                          </div>
                        )}

                        {worker.introduction && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-gray-400">
                              자기소개
                            </p>

                            <p className="mt-1 line-clamp-3 text-sm leading-6 text-gray-600">
                              {worker.introduction}
                            </p>
                          </div>
                        )}

                        {isPromoted &&
                          worker.promotion_expires_at && (
                            <div className="mt-4">
                              <p className="text-xs font-semibold text-orange-500">
                                추천 종료
                              </p>

                              <p className="mt-1 text-sm text-gray-600">
                                {new Date(
                                  worker.promotion_expires_at
                                ).toLocaleString("ko-KR")}
                              </p>
                            </div>
                          )}

                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
                          {worker.created_at && (
                            <span>
                              등록일{" "}
                              {new Date(
                                worker.created_at
                              ).toLocaleDateString("ko-KR")}
                            </span>
                          )}

                          <span>
                            기사 ID: {worker.id}
                          </span>
                        </div>
                      </div>

                      {/* 관리 버튼 */}
                      <div className="grid w-full grid-cols-1 gap-2 border-t border-gray-100 pt-5 sm:grid-cols-3 md:flex md:w-auto md:flex-wrap md:border-0 md:pt-0">
                        <Link
                          href={`/workers/${worker.id}`}
                          className="flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                        >
                          기사 보기
                        </Link>

                        <AdminPromotionButton
                          targetType="worker"
                          targetId={worker.id}
                          promotionExpiresAt={
                            worker.promotion_expires_at
                          }
                        />

                        <AdminDeleteWorkerButton
                          workerId={worker.id}
                          workerName={worker.name}
                        />
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