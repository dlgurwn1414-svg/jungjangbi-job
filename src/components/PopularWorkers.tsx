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
    <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
        {/* 제목 */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-orange-500">
              POPULAR WORKERS
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              인기 기사
            </h2>

            <p className="mt-2 text-gray-500">
              관심을 많이 받은 중장비 기사를 확인해보세요.
            </p>
          </div>

          <Link
            href="/workers"
            className="text-sm font-bold text-orange-500 transition hover:text-orange-600"
          >
            전체 기사 보기 →
          </Link>
        </div>

        {/* 기사 카드 */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workers.map(
            (worker, index) => {
              const favoriteCount =
                worker.favorite_count ?? 0;

              return (
                <Link
                  key={worker.id}
                  href={`/workers/${worker.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                >
                  {/* 배지 */}
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

                  {/* 이름 */}
                  <h3 className="mt-4 text-xl font-bold text-gray-900 transition group-hover:text-orange-500">
                    {worker.name}
                  </h3>

                  {/* 지역 / 경력 */}
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

                  {/* 급여 */}
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
      </div>
    </section>
  );
}