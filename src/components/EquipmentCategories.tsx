import Link from "next/link";

const equipments = [
  {
    name: "굴삭기",
    description: "포크레인 / 굴착기",
  },
  {
    name: "지게차",
    description: "물류 / 현장",
  },
  {
    name: "덤프트럭",
    description: "토사 / 골재 운송",
  },
  {
    name: "크레인",
    description: "기중기 / 하이드로",
  },
  {
    name: "로더",
    description: "페이로더",
  },
  {
    name: "불도저",
    description: "토공 / 정지 작업",
  },
];

export default function EquipmentCategories() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* 제목 영역 */}
        <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              장비별 채용정보
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              장비별 일자리
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              운전 가능한 장비를 선택해 채용공고를
              확인해보세요.
            </p>
          </div>

          <Link
            href="/jobs"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-50 sm:min-h-0 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
          >
            전체 공고 보기 →
          </Link>
        </div>

        {/* 장비 카드 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {equipments.map((equipment) => (
            <Link
              key={equipment.name}
              href={`/jobs?equipment=${encodeURIComponent(
                equipment.name
              )}`}
              className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-orange-400 hover:shadow-lg sm:p-5 lg:p-6 lg:hover:-translate-y-1"
            >
              {/* 장비 첫 글자 */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-base font-bold text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white sm:h-12 sm:w-12 sm:text-lg">
                {equipment.name.slice(0, 1)}
              </div>

              {/* 장비명 */}
              <h3 className="mt-4 break-words text-base font-bold leading-snug text-gray-900 sm:mt-5 sm:text-lg">
                {equipment.name}
              </h3>

              {/* 설명 */}
              <p className="mt-2 break-words text-xs leading-5 text-gray-500 sm:text-sm">
                {equipment.description}
              </p>

              {/* 이동 */}
              <p className="mt-4 text-sm font-bold text-orange-500 sm:mt-5">
                공고 보기 →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}