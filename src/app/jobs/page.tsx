import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";

import { createClient } from "@/lib/supabase/server";
import {
  REGIONS,
  SUB_REGIONS,
  type Region,
} from "@/lib/regions";

type JobsPageProps = {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
    sub_location?: string;
    equipment?: string;
    experience?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
};

const EQUIPMENTS = [
  "굴삭기",
  "지게차",
  "덤프트럭",
  "크레인",
  "로더",
  "불도저",
];

const EXPERIENCES = [
  "경력무관",
  "신입",
  "1년 이상",
  "2년 이상",
  "3년 이상",
  "5년 이상",
];

export default async function JobsPage({
  searchParams,
}: JobsPageProps) {
  const params = await searchParams;

  const keyword =
    params.keyword?.trim() ?? "";

  const location =
    params.location ?? "";

  const subLocation =
    params.sub_location ?? "";

  const equipment =
    params.equipment ?? "";

  const experience =
    params.experience ?? "";

  const status =
    params.status ?? "open";

  const sort =
    params.sort === "popular"
      ? "popular"
      : "latest";

  const requestedPage =
    Number(params.page ?? "1");

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const pageSize = 9;

  const from =
    (page - 1) * pageSize;

  const to =
    from + pageSize - 1;

  const subRegions =
    location &&
    SUB_REGIONS[
      location as Region
    ]
      ? SUB_REGIONS[
          location as Region
        ]
      : [];

  const supabase =
    await createClient();

  let query = supabase
    .from("jobs")
    .select("*", {
      count: "exact",
    });

  // 키워드
  if (keyword) {
    query = query.or(
      `title.ilike.%${keyword}%,company.ilike.%${keyword}%`
    );
  }

  // 지역
  if (location) {
    query = query.eq(
      "location",
      location
    );
  }

  // 세부 지역
  if (subLocation) {
    query = query.eq(
      "sub_location",
      subLocation
    );
  }

  // 장비
  if (equipment) {
    query = query.eq(
      "equipment",
      equipment
    );
  }

  // 경력
  if (experience) {
    query = query.eq(
      "experience",
      experience
    );
  }

  // 모집 상태
  if (status === "open") {
    query = query.eq(
      "status",
      "open"
    );
  }

  if (status === "closed") {
    query = query.eq(
      "status",
      "closed"
    );
  }

  // 급구 우선
  query = query.order(
    "urgent",
    {
      ascending: false,
    }
  );

  // 정렬
  if (sort === "popular") {
    query = query
      .order(
        "view_count",
        {
          ascending: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );
  } else {
    query = query.order(
      "created_at",
      {
        ascending: false,
      }
    );
  }

  const {
    data: jobs,
    count,
    error,
  } = await query.range(
    from,
    to
  );

  if (error) {
    console.error(
      "공고 목록 조회 오류:",
      error
    );
  }

  const totalJobs =
    count ?? 0;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalJobs / pageSize
      )
    );

  function makePageUrl(
    targetPage: number
  ) {
    const urlParams =
      new URLSearchParams();

    if (keyword) {
      urlParams.set(
        "keyword",
        keyword
      );
    }

    if (location) {
      urlParams.set(
        "location",
        location
      );
    }

    if (subLocation) {
      urlParams.set(
        "sub_location",
        subLocation
      );
    }

    if (equipment) {
      urlParams.set(
        "equipment",
        equipment
      );
    }

    if (experience) {
      urlParams.set(
        "experience",
        experience
      );
    }

    if (status) {
      urlParams.set(
        "status",
        status
      );
    }

    if (sort) {
      urlParams.set(
        "sort",
        sort
      );
    }

    urlParams.set(
      "page",
      String(targetPage)
    );

    return `/jobs?${urlParams.toString()}`;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 페이지 제목 */}
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              JOBS
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              일자리 찾기
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              원하는 조건의 중장비
              일자리를 찾아보세요.
            </p>
          </div>

          {/* 검색 필터 */}
          <form
            action="/jobs"
            method="GET"
            className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6"
          >
            {/* 키워드 */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                검색
              </label>

              <input
                id="keyword"
                name="keyword"
                type="text"
                defaultValue={
                  keyword
                }
                placeholder="공고 제목 또는 업체명"
                className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* 필터 */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* 지역 */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  지역
                </label>

                <select
                  id="location"
                  name="location"
                  defaultValue={
                    location
                  }
                  className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900"
                >
                  <option value="">
                    전체 지역
                  </option>

                  {REGIONS.map(
                    (region) => (
                      <option
                        key={
                          region
                        }
                        value={
                          region
                        }
                      >
                        {region}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 세부 지역 */}
              <div>
                <label
                  htmlFor="sub_location"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  세부 지역
                </label>

                <select
                  id="sub_location"
                  name="sub_location"
                  defaultValue={
                    subLocation
                  }
                  disabled={
                    !location
                  }
                  className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {location
                      ? "전체 세부 지역"
                      : "먼저 지역 선택"}
                  </option>

                  {subRegions.map(
                    (
                      subRegion
                    ) => (
                      <option
                        key={
                          subRegion
                        }
                        value={
                          subRegion
                        }
                      >
                        {
                          subRegion
                        }
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
                  defaultValue={
                    equipment
                  }
                  className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900"
                >
                  <option value="">
                    전체 장비
                  </option>

                  {EQUIPMENTS.map(
                    (item) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 경력 */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  경력
                </label>

                <select
                  id="experience"
                  name="experience"
                  defaultValue={
                    experience
                  }
                  className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900"
                >
                  <option value="">
                    전체 경력
                  </option>

                  {EXPERIENCES.map(
                    (item) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* 모집 상태 */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  모집 상태
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={
                    status
                  }
                  className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900"
                >
                  <option value="open">
                    모집중
                  </option>

                  <option value="closed">
                    마감
                  </option>

                  <option value="all">
                    전체
                  </option>
                </select>
              </div>

              {/* 정렬 */}
              <div>
                <label
                  htmlFor="sort"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  정렬
                </label>

                <select
                  id="sort"
                  name="sort"
                  defaultValue={
                    sort
                  }
                  className="h-13 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900"
                >
                  <option value="latest">
                    최신순
                  </option>

                  <option value="popular">
                    인기순
                  </option>
                </select>
              </div>
            </div>

            {/* 검색 버튼 */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Link
                href="/jobs"
                className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                초기화
              </Link>

              <button
                type="submit"
                className="min-h-12 w-full rounded-xl bg-orange-500 px-7 py-3 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 sm:w-auto"
              >
                검색하기
              </button>
            </div>
          </form>

          {/* 결과 상단 */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                채용 공고
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                총{" "}
                <span className="font-bold text-orange-600">
                  {totalJobs}
                </span>
                개의 공고
              </p>
            </div>

            <Link
              href="/jobs/new"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 sm:w-auto"
            >
              공고 등록하기
            </Link>
          </div>

          {/* 에러 */}
          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                공고를 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          ) : !jobs ||
            jobs.length === 0 ? (
            /* 검색 결과 없음 */
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                조건에 맞는 공고가 없습니다.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                검색 조건을 변경해서 다시
                찾아보세요.
              </p>

              <Link
                href="/jobs"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
              >
                전체 공고 보기
              </Link>
            </div>
          ) : (
            /* 공고 목록 */
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map(
                (job) => (
                  <JobCard
                    key={
                      job.id
                    }
                    id={
                      job.id
                    }
                    title={
                      job.title ??
                      ""
                    }
                    company={
                      job.company ??
                      ""
                    }
                    location={
                      job.sub_location
                        ? `${job.location ?? ""} ${job.sub_location}`
                        : job.location ??
                          ""
                    }
                    equipment={
                      job.equipment ??
                      ""
                    }
                    salary={
                      job.salary ??
                      ""
                    }
                    experience={
                      job.experience ??
                      ""
                    }
                    urgent={
                      job.urgent ??
                      false
                    }
                    status={
                      job.status ??
                      "open"
                    }
                    contactPhone={
                      job.contact_phone
                    }
                    createdAt={
                      job.created_at
                    }
                  />
                )
              )}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav
              aria-label="페이지 이동"
              className="mt-10 flex items-center justify-center gap-2"
            >
              {page > 1 && (
                <Link
                  href={makePageUrl(
                    page - 1
                  )}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  이전
                </Link>
              )}

              <div className="flex max-w-full gap-1 overflow-x-auto px-1">
                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (
                    pageNumber
                  ) => (
                    <Link
                      key={
                        pageNumber
                      }
                      href={makePageUrl(
                        pageNumber
                      )}
                      className={`flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                        page ===
                        pageNumber
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {
                        pageNumber
                      }
                    </Link>
                  )
                )}
              </div>

              {page <
                totalPages && (
                <Link
                  href={makePageUrl(
                    page + 1
                  )}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  다음
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}