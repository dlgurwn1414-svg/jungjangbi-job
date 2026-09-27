import Link from "next/link";

export default function WorkerCTA() {
  return (
    <section className="bg-slate-900 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl bg-slate-800 px-5 py-9 text-center sm:rounded-3xl sm:px-8 sm:py-12 md:px-14">
          <p className="text-sm font-semibold text-orange-400 sm:text-base">
            중장비 기사이신가요?
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl">
            내 경력과 장비를 등록하고
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            업체의 연락을 받아보세요
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
            운전 가능한 장비, 경력, 활동 지역,
            자격증 정보를 등록하면 업체가 기사님의
            프로필을 확인할 수 있습니다.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="/workers/profile"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 sm:w-auto sm:px-7"
            >
              기사 프로필 등록하기
            </Link>

            <Link
              href="/workers"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-slate-700 active:bg-slate-700 sm:w-auto sm:px-7"
            >
              등록된 기사 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}