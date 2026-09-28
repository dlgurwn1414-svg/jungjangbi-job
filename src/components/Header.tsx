import Image from "next/image";
import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import MobileMenu from "@/components/MobileMenu";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let newApplicantCount = 0;

  if (user) {
    // 관리자 확인
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    isAdmin =
      profile?.is_admin === true;

    // 내가 등록한 공고
    const { data: myJobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", user.id);

    const myJobIds =
      myJobs?.map(
        (job) => job.id
      ) ?? [];

    // 새 지원자 알림
    if (myJobIds.length > 0) {
      const { count } = await supabase
        .from("applications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in(
          "job_id",
          myJobIds
        )
        .eq(
          "owner_seen",
          false
        );

      newApplicantCount =
        count ?? 0;
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white sm:h-12 sm:w-12">
            <Image
              src="/logo.png"
              alt="중장비 일터 로고"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex min-w-0 items-baseline whitespace-nowrap">
            <span className="text-lg font-black tracking-tight text-slate-900 sm:text-2xl">
              중장비
            </span>

            <span className="ml-1 text-lg font-black tracking-tight text-orange-500 sm:text-2xl">
              일터
            </span>
          </div>
        </Link>

        {/* PC 메뉴 */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/jobs"
            className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
          >
            일자리 찾기
          </Link>

          <Link
            href="/workers"
            className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
          >
            기사 찾기
          </Link>

          <Link
            href="/jobs/new"
            className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
          >
            공고 등록
          </Link>

          <Link
            href="/workers/profile"
            className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
          >
            기사 프로필 등록
          </Link>

          {isAdmin && (
  <a
    href="/admin/jobs"
    className="whitespace-nowrap rounded-lg bg-red-50 px-4 py-2 font-bold text-red-600 transition hover:bg-red-100"
  >
    관리자
  </a>
)}
        </nav>

        {/* PC 로그인 영역 */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/mypage"
                className="relative whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
              >
                마이페이지

                {newApplicantCount >
                  0 && (
                  <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                    {
                      newApplicantCount
                    }
                  </span>
                )}
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
              >
                로그인
              </Link>

              <Link
                href="/signup"
                className="whitespace-nowrap rounded-lg bg-orange-500 px-4 py-2 font-bold text-white transition hover:bg-orange-600"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 */}
        <div className="shrink-0 lg:hidden">
          <MobileMenu
            loggedIn={!!user}
            isAdmin={isAdmin}
            newApplicantCount={
              newApplicantCount
            }
          />
        </div>
      </div>
    </header>
  );
}