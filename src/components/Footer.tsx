import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-8 text-gray-400 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-block text-xl font-black text-white"
            >
              중장비
              <span className="text-orange-500">
                JOB
              </span>
            </Link>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              중장비 구인구직을 더 쉽고 빠르게.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link
              href="/jobs"
              className="py-1 transition hover:text-white"
            >
              일자리 찾기
            </Link>

            <Link
              href="/workers"
              className="py-1 transition hover:text-white"
            >
              기사 찾기
            </Link>

            <Link
              href="/jobs/new"
              className="py-1 transition hover:text-white"
            >
              공고 등록
            </Link>
          </div>
        </div>

        <div className="mt-7 border-t border-slate-800 pt-5 sm:mt-8">
          <p className="text-xs text-gray-500">
            © 2026 중장비JOB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}