import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  REGIONS,
  SUB_REGIONS,
  type Region,
} from "@/lib/regions";

import { createClient } from "@/lib/supabase/server";

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

  if (error) {
    console.error(
      "기사 목록 불러오기 오류:",
      error
    );
  }

  const selectedSubRegions =
    region &&
    REGIONS.includes(
      region as Region
    )
      ? SUB_REGIONS[
          region as Region
        ]
      : [];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* 페이지 제목 */}
          <div>
            <p className="font-semibold text-orange-500">
              WORKERS
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              기사 찾기
            </h1>

            <p className="mt-2 text-gray-500">
              지역과 장비, 경력을 선택해서
              필요한 중장비 기사를 찾아보세요.
            </p>
          </div>

          {/* 검색 필터 */}
          <form
            action="/workers"
            method="get"
            className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* 시·도 */}
              <div>
                <label
                  htmlFor="region"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  시·도
                </label>

                <select
                  id="region"
                  name="region"
                  defaultValue={region}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500"
                >
                  <option value="">
                    전체 시·도
                  </option>

                  {REGIONS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 시·군·구 */}
              <div>
                <label
                  htmlFor="sub_region"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  시·군·구
                </label>

                <select
                  id="sub_region"
                  name="sub_region"
                  defaultValue={subRegion}
                  disabled={!region}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {region
                      ? "전체 시·군·구"
                      : "먼저 시·도 선택"}
                  </option>

                  {selectedSubRegions.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

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
                  defaultValue={equipment}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500"
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
                  defaultValue={experience}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500"
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
                  className="w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600"
                >
                  기사 검색
                </button>
              </div>
            </div>

            {(region ||
              subRegion ||
              equipment ||
              experience) && (
              <div className="mt-4 flex justify-end">
                <Link
                  href="/workers"
                  className="text-sm font-medium text-gray-500 transition hover:text-orange-500"
                >
                  검색 조건 초기화
                </Link>
              </div>
            )}
          </form>

          {/* 기사 목록 제목 */}
          <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-semibold text-orange-500">
                WORKER LIST
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                등록 기사
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                관심을 많이 받은 기사부터 표시됩니다.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              총 {workers?.length ?? 0}명
            </p>
          </div>

          {/* 오류 */}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-12 text-center">
              <p className="font-bold text-gray-900">
                기사 목록을 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          ) : !workers ||
            workers.length === 0 ? (
            /* 기사 없음 */
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                조건에 맞는 기사가 없습니다.
              </h3>

              <p className="mt-2 text-gray-500">
                검색 조건을 변경해서 다시 찾아보세요.
              </p>

              <Link
                href="/workers"
                className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
              >
                전체 기사 보기
              </Link>
            </div>
          ) : (
            /* 기사 카드 */
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {workers.map(
                (worker, index) => {
                  const favoriteCount =
                    worker.favorite_count ??
                    0;

                  return (
                    <Link
                      key={worker.id}
                      href={`/workers/${worker.id}`}
                      className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {favoriteCount > 0 && (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                            🔥 인기 기사
                          </span>
                        )}

                        {index < 3 &&
                          favoriteCount > 0 && (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                              TOP {index + 1}
                            </span>
                          )}

                        {worker.equipment && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {worker.equipment}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-gray-900 transition group-hover:text-orange-500">
                        {worker.name}
                      </h3>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        {worker.region && (
                          <span>
                            {worker.region}
                          </span>
                        )}

                        {worker.sub_region && (
                          <>
                            <span>·</span>
                            <span>
                              {worker.sub_region}
                            </span>
                          </>
                        )}

                        {worker.experience_years !==
                          null &&
                          worker.experience_years !==
                            undefined && (
                            <>
                              <span>·</span>

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

                      {worker.licenses && (
                        <p className="mt-3 line-clamp-1 text-sm text-gray-500">
                          자격증{" "}
                          {worker.licenses}
                        </p>
                      )}

                      {worker.introduction && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                          {worker.introduction}
                        </p>
                      )}

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            희망 급여
                          </p>

                          <p className="mt-1 font-bold text-orange-600">
                            {worker.desired_salary ||
                              "협의"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            관심
                          </p>

                          <p className="mt-1 font-bold text-yellow-600">
                            ★ {favoriteCount}
                          </p>
                        </div>
                      </div>
                    </Link>
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