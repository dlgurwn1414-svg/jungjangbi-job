import Link from "next/link";

type JobCardProps = {
  id: number;
  title: string;
  company: string;
  location: string;
  equipment: string;
  salary: string;
  experience: string;
  urgent: boolean;
  status?: string;
  contactPhone?: string | null;
  createdAt?: string | null;
};

function getRelativeDate(createdAt?: string | null) {
  if (!createdAt) {
    return "";
  }

  const createdDate = new Date(createdAt);
  const now = new Date();

  const diffMs =
    now.getTime() - createdDate.getTime();

  const diffDays = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) {
    return "오늘 등록";
  }

  if (diffDays === 1) {
    return "1일 전";
  }

  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  return createdDate.toLocaleDateString(
    "ko-KR"
  );
}

export default function JobCard({
  id,
  title,
  company,
  location,
  equipment,
  salary,
  experience,
  urgent,
  status = "open",
  contactPhone,
  createdAt,
}: JobCardProps) {
  const isClosed =
    status === "closed";

  const phoneLink =
    contactPhone
      ? `tel:${contactPhone.replace(
          /[^0-9+]/g,
          ""
        )}`
      : "";

  const createdDate =
    createdAt
      ? new Date(createdAt)
      : null;

  const now = new Date();

  const isNew =
    createdDate !== null &&
    now.getTime() -
      createdDate.getTime() <
      1000 * 60 * 60 * 24;

  const relativeDate =
    getRelativeDate(createdAt);

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition ${
        isClosed
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-md"
      }`}
    >
      {/* 배지 */}
      <div className="flex flex-wrap items-center gap-2">
        {isNew && !isClosed && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
            NEW
          </span>
        )}

        {urgent && !isClosed && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
            급구
          </span>
        )}

        {isClosed ? (
          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
            마감
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            모집중
          </span>
        )}

        {equipment && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {equipment}
          </span>
        )}
      </div>

      <Link
        href={`/jobs/${id}`}
        className="block"
      >
        <h3 className="mt-4 text-xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {company}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          {location && (
            <span>{location}</span>
          )}

          {experience && (
            <>
              <span>·</span>
              <span>
                {experience}
              </span>
            </>
          )}
        </div>

        <p
          className={`mt-5 font-bold ${
            isClosed
              ? "text-gray-500"
              : "text-orange-600"
          }`}
        >
          {salary}
        </p>

        {/* 등록일 */}
        {relativeDate && (
          <p className="mt-3 text-xs text-gray-400">
            {relativeDate}
          </p>
        )}
      </Link>

      {/* 버튼 */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          href={`/jobs/${id}`}
          className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
        >
          공고 보기
        </Link>

        {isClosed ? (
          <span className="flex cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-4 py-3 text-sm font-bold text-gray-500">
            모집 마감
          </span>
        ) : contactPhone ? (
          <a
            href={phoneLink}
            className="flex items-center justify-center rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            ☎ 전화 문의
          </a>
        ) : (
          <span className="flex cursor-not-allowed items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-bold text-gray-400">
            연락처 미등록
          </span>
        )}
      </div>
    </div>
  );
}