import Link from "next/link";

import JobCard from "@/components/JobCard";
import { createClient } from "@/lib/supabase/server";

export default async function UrgentJobs() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company,
      location,
      equipment,
      salary,
      experience,
      urgent,
      status,
      contact_phone,
      created_at
    `)
    .eq("urgent", true)
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  if (error) {
    console.error(
      "급구 공고 불러오기 오류:",
      error
    );
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 제목 */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              URGENT JOBS
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              급구 일자리
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              지금 바로 사람을 구하고 있는
              공고입니다.
            </p>
          </div>

          <Link
            href="/jobs"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-50 sm:min-h-0 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
          >
            전체 공고 보기 →
          </Link>
        </div>

        {/* 에러 */}
        {error ? (
          <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:mt-8 sm:p-10">
            <p className="font-semibold text-gray-900">
              공고를 불러오지 못했습니다.
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        ) : !jobs ||
          jobs.length === 0 ? (
          /* 공고 없음 */
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center sm:mt-8 sm:p-10">
            <p className="font-semibold text-gray-900">
              현재 등록된 급구 공고가
              없습니다.
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              새로운 공고가 등록되면 이곳에
              표시됩니다.
            </p>
          </div>
        ) : (
          /* 공고 목록 */
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                equipment={job.equipment}
                salary={job.salary}
                experience={job.experience}
                urgent={job.urgent}
                status={job.status}
                contactPhone={
                  job.contact_phone
                }
                createdAt={
                  job.created_at
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}