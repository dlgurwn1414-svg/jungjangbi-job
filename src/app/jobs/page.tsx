import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";

import {
  REGIONS,
  SUB_REGIONS,
  type Region,
} from "@/lib/regions";

import { createClient } from "@/lib/supabase/server";

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

export default async function JobsPage({
  searchParams,
}: JobsPageProps) {
  const params = await searchParams;

  const keyword = params.keyword || "";
  const location = params.location || "";
  const subLocation = params.sub_location || "";
  const equipment = params.equipment || "";
  const experience = params.experience || "";
  const status = params.status || "open";
  const sort = params.sort || "latest";

  const rawPage = Number(params.page || "1");

  const currentPage =
    Number.isFinite(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const pageSize = 9;

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*", {
      count: "exact",
    });

  // 키워드 검색
  if (keyword.trim()) {
    const safeKeyword = keyword
      .trim()
      .replace(/,/g, " ");

    query = query.or(
      `title.ilike.%${safeKeyword}%,company.ilike.%${safeKeyword}%`
    );
  }

  // 시·도 필터
  if (location) {
    query = query.eq(
      "location",
      location
    );
  }

  // 시·군·구 필터
  if (subLocation) {
    query = query.eq(
      "sub_location",
      subLocation
    );
  }

  // 장비 필터
  if (equipment) {
    query = query.eq(
      "equipment",
      equipment
    );
  }

  // 경력 필터
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

  // 급구 공고 우선
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

  // 페이지네이션
  query = query.range(
    from,
    to
  );

  const {
    data: jobs,
    count,
    error,
  } = await query;

  if (error) {
    console.error(
      "공고 불러오기 오류:",
      error
    );
  }

  const totalCount = count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount / pageSize
    )
  );

  const selectedSubRegions =
    location &&
    REGIONS.includes(
      location as Region
    )
      ? SUB_REGIONS[
          location as Region
        ]
      : [];

  // 페이지 이동 시 필터 유지
  const makePageUrl = (
    pageNumber: number
  ) => {
    const queryParams =
      new URLSearchParams();

    if (keyword) {
      queryParams.set(
        "keyword",
        keyword
      );
    }

    if (location) {
      queryParams.set(
        "location",
        location
      );
    }

    if (subLocation) {
      queryParams.set(
        "sub_location",
        subLocation
      );
    }

    if (equipment) {
      queryParams.set(
        "equipment",
        equipment
      );
    }

    if (experience) {
      queryParams.set(
        "experience",
        experience
      );
    }

    if (status) {
      queryParams.set(
        "status",
        status
      );
    }

    if (sort) {
      queryParams.set(
        "sort",
        sort
      );
    }

    queryParams.set(
      "page",
      String(pageNumber)
    );

    return `/jobs?${queryParams.toString()}`;
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* 상단 제목 */}
          <div>
            <p className="font-semibold text-orange-500">
              JOBS
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              중장비 일자리
            </h1>

            <p className="mt-2 text-gray-500">
              원하는 지역과 조건의 중장비 일자리를 찾아보세요.
            </p>
          </div>

          {/* 검색 필터 */}
          <form
            action="/jobs"
            method="get"
            className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {/* 키워드 */}
              <input
                type="text"
                name="keyword"
                defaultValue={keyword}
                placeholder="공고명 또는 업체명"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500"
              />

              {/* 시·도 */}
              <select
                name="location"
                defaultValue={location}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500"
              >
                <option value="">
                  전체 시·도
                </option>

                {REGIONS.map(
                  (region) => (
                    <option
                      key={region}
                      value={region}
                    >
                      {region}
                    </option>
                  )
                )}
              </select>

              {/* 시·군·구 */}
              <select
                name="sub_location"
                defaultValue={subLocation}
                disabled={!location}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">
                  {location
                    ? "전체 시·군·구"
                    : "먼저 시·도 선택"}
                </option>

                {selectedSubRegions.map(
                  (subRegion) => (
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

              {/* 장비 */}
              <select
                name="equipment"
                defaultValue={equipment}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500"
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

              {/* 경력 */}
              <select
                name="experience"
                defaultValue={experience}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500"
              >
                <option value="">
                  전체 경력
                </option>

                <option value="경력무관">
                  경력무관
                </option>

                <option value="신입">
                  신입
                </option>

                <option value="1년 이상">
                  1년 이상
                </option>

                <option value="3년 이상">
                  3년 이상
                </option>

                <option value="5년 이상">
                  5년 이상
                </option>

                <option value="10년 이상">
                  10년 이상
                </option>
              </select>

              {/* 모집 상태 */}
              <select
                name="status"
                defaultValue={status}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500"
              >
                <option value="open">
                  모집중만
                </option>

                <option value="all">
                  마감 포함
                </option>

                <option value="closed">
                  마감 공고만
                </option>
              </select>

              {/* 정렬 */}
              <select
                name="sort"
                defaultValue={sort}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500"
              >
                <option value="latest">
                  최신순
                </option>

                <option value="popular">
                  인기순
                </option>
              </select>

              {/* 검색 */}
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                검색
              </button>
            </div>

            {(keyword ||
              location ||
              subLocation ||
              equipment ||
              experience ||
              status !== "open" ||
              sort !== "latest") && (
              <div className="mt-4 flex justify-end">
                <Link
                  href="/jobs"
                  className="text-sm font-medium text-gray-500 transition hover:text-orange-500"
                >
                  필터 초기화
                </Link>
              </div>
            )}
          </form>

          {/* 결과 상단 */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                채용 공고
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                총 {totalCount}개의 공고가 있습니다.
              </p>
            </div>

            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
              {sort === "popular"
                ? "인기순"
                : "최신순"}
            </span>
          </div>

          {/* 공고 목록 */}
          {!jobs ||
          jobs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-14 text-center shadow-sm">
              <p className="text-lg font-bold text-gray-800">
                조건에 맞는 공고가 없습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                다른 지역이나 조건으로 다시 검색해보세요.
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
              >
                전체 공고 보기
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={
                    job.sub_location
                      ? `${job.location} ${job.sub_location}`
                      : job.location
                  }
                  equipment={job.equipment}
                  salary={job.salary}
                  experience={job.experience}
                  urgent={job.urgent}
                  status={job.status}
                  contactPhone={job.contact_phone}
                  createdAt={job.created_at}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={makePageUrl(
                    currentPage - 1
                  )}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:border-orange-400 hover:text-orange-500"
                >
                  이전
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-bold text-gray-400">
                  이전
                </span>
              )}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={makePageUrl(
                    pageNumber
                  )}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-bold transition ${
                    pageNumber ===
                    currentPage
                      ? "bg-orange-500 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}

              {currentPage <
              totalPages ? (
                <Link
                  href={makePageUrl(
                    currentPage + 1
                  )}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:border-orange-400 hover:text-orange-500"
                >
                  다음
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-bold text-gray-400">
                  다음
                </span>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}