import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicationStatusSelect from "@/components/ApplicationStatusSelect";
import { createClient } from "@/lib/supabase/server";

function getStatusLabel(status: string) {
  switch (status) {
    case "reviewing":
      return "검토중";

    case "accepted":
      return "채용";

    case "rejected":
      return "불합격";

    default:
      return "지원됨";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "reviewing":
      return "bg-blue-100 text-blue-700";

    case "accepted":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  // 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 현재 공고가 내가 작성한 공고인지 확인
  const {
    data: job,
    error: jobError,
  } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      company,
      location,
      equipment,
      salary,
      user_id
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (jobError || !job) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              지원자 목록을 볼 수 없습니다.
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              존재하지 않는 공고이거나 내가 등록한
              공고가 아닙니다.
            </p>

            <Link
              href="/mypage"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              마이페이지로 돌아가기
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // 이 공고에 지원한 사람 불러오기
  const {
    data: applications,
    error: applicationsError,
  } = await supabase
    .from("applications")
    .select(`
      id,
      user_id,
      created_at,
      status
    `)
    .eq("job_id", job.id)
    .order("created_at", {
      ascending: false,
    });

  // 새 지원자 읽음 처리
  if (
    applications &&
    applications.length > 0
  ) {
    const { error: seenError } =
      await supabase
        .from("applications")
        .update({
          owner_seen: true,
        })
        .eq("job_id", job.id)
        .eq("owner_seen", false);

    if (seenError) {
      console.error(
        "지원자 읽음 처리 오류:",
        seenError
      );
    }
  }

  if (applicationsError) {
    console.error(
      "지원자 불러오기 오류:",
      applicationsError
    );
  }

  // 지원자 user_id 모으기
  const applicantUserIds =
    applications?.map(
      (application) =>
        application.user_id
    ) ?? [];

  // 지원자 기사 프로필
  let workerProfiles: {
    id: number;
    user_id: string;
    name: string;
    phone: string | null;
    region: string | null;
    equipment: string | null;
    experience_years:
      | number
      | null;
    licenses: string | null;
    desired_salary:
      | string
      | null;
    introduction:
      | string
      | null;
  }[] = [];

  if (applicantUserIds.length > 0) {
    const {
      data,
      error,
    } = await supabase
      .from("worker_profiles")
      .select(`
        id,
        user_id,
        name,
        phone,
        region,
        equipment,
        experience_years,
        licenses,
        desired_salary,
        introduction
      `)
      .in(
        "user_id",
        applicantUserIds
      );

    if (error) {
      console.error(
        "기사 프로필 불러오기 오류:",
        error
      );
    }

    workerProfiles = data ?? [];
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 뒤로가기 */}
          <Link
            href="/mypage"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            ← 마이페이지로 돌아가기
          </Link>

          {/* 공고 정보 */}
          <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6 md:p-8">
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              지원자 관리
            </p>

            <h1 className="mt-2 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              {job.title}
            </h1>

            <p className="mt-2 break-words text-sm text-gray-500 sm:text-base">
              {job.company}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {job.location && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {job.location}
                </span>
              )}

              {job.equipment && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {job.equipment}
                </span>
              )}

              {job.salary && (
                <span className="max-w-full break-words rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600">
                  {job.salary}
                </span>
              )}
            </div>
          </section>

          {/* 지원자 목록 */}
          <section className="mt-8 sm:mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  APPLICANTS
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  지원자 목록
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                총{" "}
                <span className="font-bold text-gray-900">
                  {applications?.length ??
                    0}
                </span>
                명
              </p>
            </div>

            {!applications ||
            applications.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-12">
                <div className="text-4xl">
                  👷
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                  아직 지원자가 없습니다.
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                  지원자가 생기면 이곳에서 확인할 수
                  있습니다.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:gap-5">
                {applications.map(
                  (
                    application,
                    index
                  ) => {
                    const worker =
                      workerProfiles.find(
                        (profile) =>
                          profile.user_id ===
                          application.user_id
                      );

                    const status =
                      application.status ||
                      "applied";

                    const phoneLink =
                      worker?.phone
                        ? worker.phone.replace(
                            /[^0-9+]/g,
                            ""
                          )
                        : "";

                    return (
                      <article
                        key={
                          application.id
                        }
                        className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                      >
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                          {/* 지원자 정보 */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                  status
                                )}`}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>

                              <span className="text-xs text-gray-400">
                                지원자{" "}
                                {index + 1}
                              </span>

                              {application.created_at && (
                                <span className="text-xs text-gray-400">
                                  ·{" "}
                                  {new Date(
                                    application.created_at
                                  ).toLocaleDateString(
                                    "ko-KR"
                                  )}
                                </span>
                              )}
                            </div>

                            {worker ? (
                              <>
                                <h3 className="mt-4 break-words text-xl font-bold text-gray-900 sm:text-2xl">
                                  {
                                    worker.name
                                  }
                                </h3>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {worker.equipment && (
                                    <span className="max-w-full truncate rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                      {
                                        worker.equipment
                                      }
                                    </span>
                                  )}

                                  {worker.region && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                      {
                                        worker.region
                                      }
                                    </span>
                                  )}

                                  {worker.experience_years !==
                                    null &&
                                    worker.experience_years !==
                                      undefined && (
                                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                        경력{" "}
                                        {
                                          worker.experience_years
                                        }
                                        년
                                      </span>
                                    )}
                                </div>

                                {/* 상세 정보 */}
                                <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 sm:gap-5">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-500">
                                      연락처
                                    </p>

                                    {worker.phone ? (
                                      <a
                                        href={`tel:${phoneLink}`}
                                        className="mt-1 block break-all font-bold text-gray-900 transition hover:text-orange-600"
                                      >
                                        {
                                          worker.phone
                                        }
                                      </a>
                                    ) : (
                                      <p className="mt-1 font-bold text-gray-900">
                                        미등록
                                      </p>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-500">
                                      희망 급여
                                    </p>

                                    <p className="mt-1 break-words font-bold text-orange-600">
                                      {worker.desired_salary ||
                                        "협의"}
                                    </p>
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-500">
                                      자격증
                                    </p>

                                    <p className="mt-1 break-words font-medium text-gray-900">
                                      {worker.licenses ||
                                        "미등록"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-gray-500">
                                      지원 날짜
                                    </p>

                                    <p className="mt-1 font-medium text-gray-900">
                                      {application.created_at
                                        ? new Date(
                                            application.created_at
                                          ).toLocaleDateString(
                                            "ko-KR"
                                          )
                                        : "-"}
                                    </p>
                                  </div>
                                </div>

                                {worker.introduction && (
                                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:mt-6">
                                    <p className="text-sm font-semibold text-gray-500">
                                      자기소개
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700 sm:text-base">
                                      {
                                        worker.introduction
                                      }
                                    </p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                                  기사 프로필 미등록 회원
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                                  지원자가 아직 기사
                                  프로필을 등록하지
                                  않았습니다.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* 상태 / 연락 관리 */}
                          <div className="w-full shrink-0 border-t border-gray-100 pt-5 md:w-48 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                            <div>
                              <p className="mb-2 text-xs font-semibold text-gray-500">
                                지원 상태 변경
                              </p>

                              <div className="[&>*]:min-h-12 [&>*]:w-full">
                                <ApplicationStatusSelect
                                  applicationId={
                                    application.id
                                  }
                                  initialStatus={
                                    status as
                                      | "applied"
                                      | "reviewing"
                                      | "accepted"
                                      | "rejected"
                                  }
                                />
                              </div>
                            </div>

                            {worker && (
                              <div className="mt-3 grid grid-cols-1 gap-2">
                                <Link
                                  href={`/workers/${worker.id}`}
                                  className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                                >
                                  프로필 보기
                                </Link>

                                {worker.phone && (
                                  <a
                                    href={`tel:${phoneLink}`}
                                    className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600 active:bg-orange-700"
                                  >
                                    ☎ 전화하기
                                  </a>
                                )}
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
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}