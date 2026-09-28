import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-10 text-gray-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* 왼쪽 */}
          <div>
            <h2 className="text-xl font-bold text-white">
              중장비 일터
            </h2>

            <p className="mt-3 text-sm">
              중장비 구인구직을 더 쉽고 빠르게.
            </p>
          </div>

          {/* 오른쪽 링크 */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              href="/jobs"
              className="transition hover:text-white"
            >
              일자리 찾기
            </Link>

            <Link
              href="/workers"
              className="transition hover:text-white"
            >
              기사 찾기
            </Link>

            <Link
              href="/jobs/new"
              className="transition hover:text-white"
            >
              공고 등록
            </Link>

            <Link
              href="/workers/profile"
              className="transition hover:text-white"
            >
              기사 프로필 등록
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="text-xs">
            © 2026 중장비 일터. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}