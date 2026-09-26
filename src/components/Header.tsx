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

if (user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  isAdmin = profile?.is_admin === true;
}


  let newApplicantCount = 0;

  if (user) {
    // 관리자 여부 확인
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle();

    isAdmin = profile?.is_admin === true;

    // 새 지원자 알림 개수
    const { data: myJobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", user.id);

    const myJobIds = myJobs?.map((job) => job.id) ?? [];

    if (myJobIds.length > 0) {
      const { count } = await supabase
        .from("applications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("job_id", myJobIds)
        .eq("owner_seen", false);

      newApplicantCount = count ?? 0;
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="text-2xl font-black text-gray-900"
        >
          중장비
          <span className="text-orange-500">
            JOB
          </span>
        </Link>

        {/* PC 메뉴 */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/jobs"
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            일자리 찾기
          </Link>

          <Link
            href="/workers"
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            기사 찾기
          </Link>

          <Link
            href="/jobs/new"
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            공고 등록
          </Link>
          {isAdmin && (
  <>
    <Link
      href="/admin/jobs"
      className="font-bold text-red-600 transition hover:text-red-700"
    >
      공고 관리
    </Link>

    <Link
      href="/admin/reports"
      className="font-bold text-red-600 transition hover:text-red-700"
    >
      신고 관리
    </Link>
  </>
)}

          <Link
            href="/workers/profile"
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            기사 프로필 등록
          </Link>

          {/* 관리자만 표시 */}
          {isAdmin && (
            <Link
              href="/admin/reports"
              className="rounded-lg bg-red-50 px-3 py-2 font-bold text-red-600 transition hover:bg-red-100"
            >
              관리자
            </Link>
          )}
        </nav>

        {/* PC 로그인 영역 */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/mypage"
                className="relative font-medium text-gray-700 transition hover:text-orange-500"
              >
                마이페이지

                {newApplicantCount > 0 && (
                  <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                    {newApplicantCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
  <>
    <Link
      href="/admin/jobs"
      className="block px-4 py-3 font-bold text-red-600"
    >
      공고 관리
    </Link>

    <Link
      href="/admin/reports"
      className="block px-4 py-3 font-bold text-red-600"
    >
      신고 관리
    </Link>
  </>
)}

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-gray-700 transition hover:text-orange-500"
              >
                로그인
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white transition hover:bg-orange-600"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 */}
        <MobileMenu
          loggedIn={!!user}
          isAdmin={isAdmin}
          newApplicantCount={newApplicantCount}
        />
      </div>
    </header>
  );
}