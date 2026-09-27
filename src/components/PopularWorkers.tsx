import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function PopularWorkers() {
  const supabase = await createClient();

  const { data: workers, error } = await supabase
    .from("worker_profiles")
    .select(`
      id,
      name,
      region,
      sub_region,
      equipment,
      experience_years,
      desired_salary,
      favorite_count
    `)
    .order("favorite_count", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  if (error) {
    console.error(
      "인기 기사 불러오기 오류:",
      error
    );

    return null;
  }

  if (!workers || workers.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 제목 */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              POPULAR WORKERS
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              인기 기사
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              관심을 많이 받은 중장비 기사를
              확인해보세요.
            </p>
          </div>

          <Link
            href="/workers"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-50 sm:min-h-0 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
          >
            전체 기사 보기 →
          </Link>
        </div>

        {/* 기사 카드 */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workers.map(
            (worker, index) => {
              const favoriteCount =
                worker.favorite_count ?? 0;

              return (
                <Link
                  key={worker.id}
                  href={`/workers/${worker.id}`}
                  className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-6 sm:hover:-translate-y-1"
                >
                  {/* 배지 */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {favoriteCount > 0 && (
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600 sm:px-3">
                        🔥 인기 기사
                      </span>
                    )}

                    {index < 3 &&
                      favoriteCount > 0 && (
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700 sm:px-3">
                          TOP {index + 1}
                        </span>
                      )}

                    {worker.equipment && (
                      <span className="max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 sm:px-3">
                        {worker.equipment}
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
                        {worker.region}
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
                          {worker.sub_region}
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
                        ★ {favoriteCount}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}