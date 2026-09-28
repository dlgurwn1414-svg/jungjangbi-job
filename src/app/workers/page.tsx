import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkerRegionSelects from "@/components/WorkerRegionSelects";

import { createClient } from "@/lib/supabase/server";

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

type WorkersPageProps = {
  searchParams: Promise<{
    region?: string;
    sub_region?: string;
    equipment?: string;
    experience?: string;
  }>;
};

export default async function WorkersPage({
  searchParams,
}: WorkersPageProps) {
  const params = await searchParams;

  const region = params.region || "";
  const subRegion = params.sub_region || "";
  const equipment = params.equipment || "";
  const experience = params.experience || "";

  const supabase = await createClient();

  let query = supabase
    .from("worker_profiles")
    .select("*")
    .order("favorite_count", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  // 시·도 필터
  if (region) {
    query = query.eq(
      "region",
      region
    );
  }

  // 시·군·구 필터
  if (subRegion) {
    query = query.eq(
      "sub_region",
      subRegion
    );
  }

  // 장비 필터
  if (equipment) {
    query = query.eq(
      "equipment",
      equipment
    );
  }

  // 최소 경력
  if (experience) {
    const minimumExperience =
      Number(experience);

    if (
      Number.isFinite(
        minimumExperience
      )
    ) {
      query = query.gte(
        "experience_years",
        minimumExperience
      );
    }
  }

  const {
    data: workers,
    error,
  } = await query;

  const sortedWorkers = [
  ...(workers ?? []),
].sort((a, b) => {
  const aPromoted =
    isPromotionActive(
      a.promotion_expires_at
    );

  const bPromoted =
    isPromotionActive(
      b.promotion_expires_at
    );

  if (aPromoted !== bPromoted) {
    return aPromoted ? -1 : 1;
  }

  if (aPromoted && bPromoted) {
    const aTime = new Date(
      a.promotion_expires_at ?? 0
    ).getTime();

    const bTime = new Date(
      b.promotion_expires_at ?? 0
    ).getTime();

    if (aTime !== bTime) {
      return bTime - aTime;
    }
  }

  const aFavorite =
    a.favorite_count ?? 0;

  const bFavorite =
    b.favorite_count ?? 0;

  if (aFavorite !== bFavorite) {
    return bFavorite - aFavorite;
  }

  return (
    new Date(
      b.created_at
    ).getTime() -
    new Date(
      a.created_at
    ).getTime()
  );
});

  if (error) {
    console.error(
      "기사 목록 불러오기 오류:",
      error
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 페이지 제목 */}
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              WORKERS
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              기사 찾기
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              지역과 장비, 경력을 선택해서
              필요한 중장비 기사를 찾아보세요.
            </p>
          </div>

          {/* 검색 필터 */}
          <form
            action="/workers"
            method="get"
            className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* 시·도 / 시·군·구 */}
              <WorkerRegionSelects
                initialRegion={region}
                initialSubRegion={
                  subRegion
                }
              />

              {/* 장비 */}
              <div>
                <label
                  htmlFor="equipment"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  장비
                </label>

                <select
                  id="equipment"
                  name="equipment"
                  defaultValue={
                    equipment
                  }
                  className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">
                    전체 장비
                  </option>

                  <option value="굴삭기">
                    굴삭기
                  </option>

                  <option value="지게차">
                    지게차
                  </option>

                  <option value="크레인">
                    크레인
                  </option>

                  <option value="덤프트럭">
                    덤프트럭
                  </option>

                  <option value="로더">
                    로더
                  </option>

                  <option value="불도저">
                    불도저
                  </option>

                  <option value="고소작업차">
                    고소작업차
                  </option>

                  <option value="기타">
                    기타
                  </option>
                </select>
              </div>

              {/* 최소 경력 */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  최소 경력
                </label>

                <select
                  id="experience"
                  name="experience"
                  defaultValue={
                    experience
                  }
                  className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">
                    전체 경력
                  </option>

                  <option value="1">
                    1년 이상
                  </option>

                  <option value="3">
                    3년 이상
                  </option>

                  <option value="5">
                    5년 이상
                  </option>

                  <option value="10">
                    10년 이상
                  </option>

                  <option value="20">
                    20년 이상
                  </option>
                </select>
              </div>

              {/* 검색 버튼 */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="min-h-12 w-full rounded-xl bg-orange-500 px-5 py-3 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700"
                >
                  기사 검색
                </button>
              </div>
            </div>

            {/* 검색 조건 초기화 */}
            {(region ||
              subRegion ||
              equipment ||
              experience) && (
              <div className="mt-4">
                <Link
                  href="/workers"
                  className="flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-50 hover:text-orange-500 sm:ml-auto sm:w-auto sm:border-0 sm:px-0"
                >
                  검색 조건 초기화
                </Link>
              </div>
            )}
          </form>

          {/* 기사 목록 제목 */}
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-500 sm:text-base">
                WORKER LIST
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                등록 기사
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                관심을 많이 받은 기사부터 표시됩니다.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <p className="text-sm text-gray-500">
                총{" "}
                <span className="font-bold text-gray-900">
                  {workers?.length ??
                    0}
                </span>
                명
              </p>

              <Link
                href="/workers/profile"
                className="flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                기사 프로필 등록
              </Link>
            </div>
          </div>

          {/* 오류 */}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-12">
              <p className="font-bold text-gray-900">
                기사 목록을 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          ) : !workers ||
            workers.length ===
              0 ? (
            /* 기사 없음 */
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                조건에 맞는 기사가 없습니다.
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                검색 조건을 변경해서 다시
                찾아보세요.
              </p>

              <Link
                href="/workers"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-bold text-white sm:w-auto"
              >
                전체 기사 보기
              </Link>
            </div>
          ) : (
            /* 기사 카드 */
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {sortedWorkers.map(
  (worker, index) => {
                  const favoriteCount =
                    worker.favorite_count ??
                    0;
                    const isPromoted =
  isPromotionActive(
    worker.promotion_expires_at
  );

                 return (
  <div
    key={worker.id}
    className={`relative rounded-2xl ${
      isPromoted
        ? "ring-2 ring-orange-400"
        : ""
    }`}
  >
    {isPromoted && (
      <span className="absolute -top-2 left-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
        추천
      </span>
    )}

    <Link
      href={`/workers/${worker.id}`}
      className="group relative block min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-6 lg:hover:-translate-y-1"
    >
                      {/* 배지 */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        
                        {favoriteCount >
                          0 && (
                          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600 sm:px-3">
                            🔥 인기 기사
                          </span>
                        )}

                        {index < 3 &&
                          favoriteCount >
                            0 && (
                            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700 sm:px-3">
                              TOP{" "}
                              {index +
                                1}
                            </span>
                          )}

                        {worker.equipment && (
                          <span className="max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 sm:px-3">
                            {
                              worker.equipment
                            }
                          </span>
                        )}
                      </div>

                      {/* 이름 */}
                      <h3 className="mt-4 break-words text-lg font-bold leading-snug text-gray-900 transition group-hover:text-orange-500 sm:text-xl">
                        {worker.name}
                      </h3>

                      {/* 지역 / 경력 */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-gray-600">
                        {worker.region && (
                          <span className="break-words">
                            {
                              worker.region
                            }
                          </span>
                        )}

                        {worker.sub_region && (
                          <>
                            {worker.region && (
                              <span
                                aria-hidden="true"
                                className="text-gray-300"
                              >
                                ·
                              </span>
                            )}

                            <span className="break-words">
                              {
                                worker.sub_region
                              }
                            </span>
                          </>
                        )}

                        {worker.experience_years !==
                          null &&
                          worker.experience_years !==
                            undefined && (
                            <>
                              {(worker.region ||
                                worker.sub_region) && (
                                <span
                                  aria-hidden="true"
                                  className="text-gray-300"
                                >
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

                      {/* 자격증 */}
                      {worker.licenses && (
                        <p className="mt-3 line-clamp-1 break-words text-sm text-gray-500">
                          자격증{" "}
                          {
                            worker.licenses
                          }
                        </p>
                      )}

                      {/* 소개 */}
                      {worker.introduction && (
                        <p className="mt-4 line-clamp-2 break-words text-sm leading-6 text-gray-500">
                          {
                            worker.introduction
                          }
                        </p>
                      )}

                      {/* 급여 / 관심 */}
                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-gray-100 pt-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-400">
                            희망 급여
                          </p>

                          <p className="mt-1 break-words font-bold text-orange-600">
                            {worker.desired_salary ||
                              "협의"}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-xs text-gray-400">
                            관심
                          </p>

                          <p className="mt-1 font-bold text-yellow-600">
                            ★{" "}
                            {
                              favoriteCount
                            }
                          </p>
                        </div>
                      </div>
                  </Link>
</div>
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