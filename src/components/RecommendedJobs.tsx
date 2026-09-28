import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function RecommendedJobs() {
  const supabase = await createClient();

  const now = new Date().toISOString();

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
      status,
      view_count,
      promotion_expires_at,
      created_at
    `)
    .eq("status", "open")
    .gt("promotion_expires_at", now)
    .order("view_count", {
      ascending: false,
    })
    .order("promotion_expires_at", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  if (error) {
    console.error("추천 공고 불러오기 오류");
    console.error("message:", error.message);
    console.error("details:", error.details);
    console.error("hint:", error.hint);
    console.error("code:", error.code);

    return null;
  }

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 제목 */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              RECOMMENDED JOBS
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              추천 공고
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              현재 추천 중인 중장비 일자리를 확인해보세요.
            </p>
          </div>

          <Link
            href="/jobs"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-50 sm:min-h-0 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
          >
            전체 공고 보기 →
          </Link>
        </div>

        {/* 공고 카드 */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const locationText = job.sub_location
              ? `${job.location ?? ""} ${job.sub_location}`
              : job.location ?? "";

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group relative min-w-0 rounded-2xl border border-orange-300 bg-white p-4 shadow-sm ring-2 ring-orange-400 transition hover:shadow-md sm:p-6 sm:hover:-translate-y-1"
              >
                {/* 추천 배지 */}
                <span className="absolute -top-2 left-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  추천
                </span>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 sm:gap-2">
                  {job.equipment && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 sm:px-3">
                      {job.equipment}
                    </span>
                  )}

                  {job.experience && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:px-3">
                      {job.experience}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 break-words text-lg font-bold leading-snug text-gray-900 transition group-hover:text-orange-500 sm:text-xl">
                  {job.title}
                </h3>

                <p className="mt-2 break-words text-sm text-gray-500">
                  {job.company}
                </p>

                {locationText && (
                  <p className="mt-4 break-words text-sm text-gray-600">
                    {locationText}
                  </p>
                )}

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-gray-100 pt-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">
                      급여
                    </p>

                    <p className="mt-1 break-words font-bold text-orange-600">
                      {job.salary || "협의"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400">
                      조회
                    </p>

                    <p className="mt-1 font-bold text-gray-700">
                      {job.view_count ?? 0}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}