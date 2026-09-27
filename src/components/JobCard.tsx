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

function getRelativeDate(
  createdAt?: string | null
) {
  if (!createdAt) {
    return "";
  }

  const createdDate =
    new Date(createdAt);

  const now = new Date();

  const diffMs =
    now.getTime() -
    createdDate.getTime();

  const diffDays = Math.floor(
    diffMs /
      (1000 * 60 * 60 * 24)
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
    <article
      className={`flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition sm:p-6 ${
        isClosed
          ? "opacity-60"
          : "hover:border-orange-200 hover:shadow-md"
      }`}
    >
      {/* 배지 */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {isNew && !isClosed && (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-600 sm:px-3">
            NEW
          </span>
        )}

        {urgent && !isClosed && (
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600 sm:px-3">
            급구
          </span>
        )}

        {isClosed ? (
          <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-bold text-gray-600 sm:px-3">
            마감
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 sm:px-3">
            모집중
          </span>
        )}

        {equipment && (
          <span className="max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:px-3">
            {equipment}
          </span>
        )}
      </div>

      {/* 공고 내용 */}
      <Link
        href={`/jobs/${id}`}
        className="block min-w-0 flex-1"
      >
        <h3 className="mt-4 break-words text-lg font-bold leading-snug text-gray-900 sm:text-xl">
          {title}
        </h3>

        <p className="mt-2 break-words text-sm text-gray-500">
          {company}
        </p>

        {/* 지역 / 경력 */}
        {(location || experience) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-gray-600">
            {location && (
              <span className="break-words">
                {location}
              </span>
            )}

            {location &&
              experience && (
                <span
                  aria-hidden="true"
                  className="text-gray-300"
                >
                  ·
                </span>
              )}

            {experience && (
              <span>
                {experience}
              </span>
            )}
          </div>
        )}

        {/* 급여 */}
        <p
          className={`mt-5 break-words text-lg font-bold ${
            isClosed
              ? "text-gray-500"
              : "text-orange-600"
          }`}
        >
          {salary}
        </p>

        {/* 등록일 */}
        {relativeDate && (
          <p className="mt-2 text-xs text-gray-400 sm:mt-3">
            {relativeDate}
          </p>
        )}
      </Link>

      {/* 버튼 */}
      <div className="mt-5 grid grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-2">
        <Link
          href={`/jobs/${id}`}
          className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
        >
          공고 보기
        </Link>

        {isClosed ? (
          <span className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-200 px-4 py-3 text-sm font-bold text-gray-500">
            모집 마감
          </span>
        ) : contactPhone ? (
          <a
            href={phoneLink}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 active:bg-orange-700"
          >
            ☎ 전화 문의
          </a>
        ) : (
          <span className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-400">
            연락처 미등록
          </span>
        )}
      </div>
    </article>
  );
}