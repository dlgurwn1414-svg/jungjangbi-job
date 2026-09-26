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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-orange-500">
              장비별 채용정보
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              장비별 일자리
            </h2>

            <p className="mt-2 text-gray-500">
              운전 가능한 장비를 선택해 채용공고를 확인해보세요.
            </p>
          </div>

          <Link
            href="/jobs"
            className="text-sm font-bold text-orange-500 hover:text-orange-600"
          >
            전체 공고 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {equipments.map((equipment) => (
            <Link
              key={equipment.name}
              href={`/jobs?equipment=${encodeURIComponent(
                equipment.name
              )}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg font-bold text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                {equipment.name.slice(0, 1)}
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {equipment.name}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {equipment.description}
              </p>

              <p className="mt-5 text-sm font-bold text-orange-500">
                공고 보기 →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}