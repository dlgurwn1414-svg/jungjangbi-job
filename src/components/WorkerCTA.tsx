import Link from "next/link";

export default function WorkerCTA() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-slate-800 px-8 py-12 text-center md:px-14">
          <p className="font-semibold text-orange-400">
            중장비 기사이신가요?
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            내 경력과 장비를 등록하고
            <br />
            업체의 연락을 받아보세요
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-300">
            운전 가능한 장비, 경력, 활동 지역, 자격증 정보를 등록하면
            업체가 기사님의 프로필을 확인할 수 있습니다.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/workers/profile"
              className="rounded-xl bg-orange-500 px-7 py-4 font-bold text-white hover:bg-orange-600"
            >
              기사 프로필 등록하기
            </Link>

            <Link
              href="/workers"
              className="rounded-xl border border-gray-500 px-7 py-4 font-bold text-white hover:bg-slate-700"
            >
              등록된 기사 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}