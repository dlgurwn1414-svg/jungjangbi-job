"use client";

type PromotionGuideProps = {
  targetLabel: string;
  selectedDays: 7 | 30 | null;
  onSelect: (days: 7 | 30) => void;
};

export default function PromotionGuide({
  targetLabel,
  selectedDays,
  onSelect,
}: PromotionGuideProps) {
  const selectedPrice =
    selectedDays === 7
      ? "9,900원"
      : selectedDays === 30
      ? "29,900원"
      : null;

  return (
    <section className="rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:p-6">
      <div>
        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
          오픈 기념가
        </span>

        <h3 className="mt-3 text-lg font-bold text-gray-900 sm:text-xl">
          추천 기간을 선택해주세요
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          추천 {targetLabel}은 일반 목록보다 상단에 우선 노출됩니다.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect(7)}
          className={`rounded-2xl border-2 p-4 text-left transition sm:p-5 ${
            selectedDays === 7
              ? "border-orange-500 bg-white ring-2 ring-orange-100"
              : "border-gray-200 bg-white hover:border-orange-300"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-gray-900">
              7일 추천
            </p>

            {selectedDays === 7 && (
              <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
                선택됨
              </span>
            )}
          </div>

          <p className="mt-3 text-2xl font-black text-gray-900">
            9,900원
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelect(30)}
          className={`rounded-2xl border-2 p-4 text-left transition sm:p-5 ${
            selectedDays === 30
              ? "border-orange-500 bg-white ring-2 ring-orange-100"
              : "border-gray-200 bg-white hover:border-orange-300"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-gray-900">
              30일 추천
            </p>

            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
              약 25% 할인
            </span>
          </div>

          <p className="mt-3 text-2xl font-black text-gray-900">
            29,900원
          </p>

          <p className="mt-2 text-xs font-semibold text-orange-600">
            7일 상품 4회보다 9,700원 저렴
          </p>

          {selectedDays === 30 && (
            <p className="mt-2 text-xs font-bold text-orange-600">
              ✓ 선택됨
            </p>
          )}
        </button>
      </div>

      {selectedDays !== null && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-bold text-gray-900">
              계좌이체 안내
            </h4>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              {selectedPrice}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>
              은행:{" "}
              <span className="font-bold text-gray-900">
                테스트은행
              </span>
            </p>

            <p>
              계좌번호:{" "}
              <span className="font-bold text-gray-900">
                000-0000-0000
              </span>
            </p>

            <p>
              예금주:{" "}
              <span className="font-bold text-gray-900">
                중장비 일터
              </span>
            </p>
          </div>

          {/* 입금자명 */}
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-gray-900">
              입금자명
            </span>

            <input
              type="text"
              name="depositor_name"
              placeholder="실제 입금하실 분의 이름을 입력해주세요"
              maxLength={30}
              required
              className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <p className="mt-2 text-xs leading-5 text-gray-500">
              회원 이름과 입금자명이 다를 경우에도 실제 계좌에 표시되는
              입금자명을 적어주세요.
            </p>
          </label>

          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-700">
              선택한 추천 상품
            </p>

            <p className="mt-1 text-lg font-black text-orange-600">
              {selectedDays}일 · {selectedPrice}
            </p>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            입금 확인 후 관리자가 추천 노출을 적용합니다.
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-gray-500">
        추천 신청 후 확인이 완료되면 추천 노출이 적용됩니다.
      </p>
    </section>
  );
}