"use client";

import {
  FormEvent,
  useState,
} from "react";
import PromotionGuide from "@/components/PromotionGuide";
import { useRouter } from "next/navigation";

import {
  REGIONS,
  SUB_REGIONS,
  type Region,
} from "@/lib/regions";

import { createClient } from "@/lib/supabase/client";

type WorkerProfile = {
  id?: number;
  user_id?: string;
  name?: string | null;
  phone?: string | null;
  region?: string | null;
  sub_region?: string | null;
  equipment?: string | null;
  experience_years?: number | null;
  licenses?: string | null;
  desired_salary?: string | null;
  introduction?: string | null;
};

type WorkerProfileFormProps = {
  userId: string;

  initialProfile:
    | WorkerProfile
    | null;
};

export default function WorkerProfileForm({
  userId,
  initialProfile,
}: WorkerProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] =
    useState(
      initialProfile?.name || ""
    );

  const [phone, setPhone] =
    useState(
      initialProfile?.phone || ""
    );

  const [region, setRegion] =
    useState(
      initialProfile?.region || ""
    );

  const [
    subRegion,
    setSubRegion,
  ] = useState(
    initialProfile?.sub_region || ""
  );

  const [
    equipment,
    setEquipment,
  ] = useState(
    initialProfile?.equipment || ""
  );

  const [
    experienceYears,
    setExperienceYears,
  ] = useState(
    initialProfile?.experience_years?.toString() ||
      ""
  );

  const [
    licenses,
    setLicenses,
  ] = useState(
    initialProfile?.licenses || ""
  );

  const [
    desiredSalary,
    setDesiredSalary,
  ] = useState(
    initialProfile?.desired_salary ||
      ""
  );

  const [
    introduction,
    setIntroduction,
  ] = useState(
    initialProfile?.introduction ||
      ""
  );
  const [
  usePromotion,
  setUsePromotion,
] = useState(false);

const [
  promotionDays,
  setPromotionDays,
] = useState<7 | 30 | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // 선택된 시·도의 시·군·구
  const selectedSubRegions =
    region &&
    REGIONS.includes(
      region as Region
    )
      ? SUB_REGIONS[
          region as Region
        ]
      : [];

  const handleRegionChange = (
    value: string
  ) => {
    setRegion(value);

    // 시·도 변경 시
    // 기존 세부지역 초기화
    setSubRegion("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }
    if (
  usePromotion &&
  promotionDays === null
) {
  setErrorMessage(
    "추천 기간을 7일 또는 30일 중에서 선택해주세요."
  );
  return;
}

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const experienceNumber =
      experienceYears.trim()
        ? Number(experienceYears)
        : 0;

    if (
      !Number.isFinite(
        experienceNumber
      ) ||
      experienceNumber < 0
    ) {
      setErrorMessage(
        "경력 연수를 올바르게 입력해주세요."
      );

      setLoading(false);
      return;
    }

    const profileData = {
      user_id: userId,

      name: name.trim(),

      phone: phone.trim(),

      region,

      sub_region: subRegion,

      equipment,

      experience_years:
        experienceNumber,

      licenses:
        licenses.trim(),

      desired_salary:
        desiredSalary.trim(),

      introduction:
        introduction.trim(),
    };

    const {
  data: savedProfile,
  error,
} = await supabase
  .from("worker_profiles")
  .upsert(
    profileData,
    {
      onConflict: "user_id",
    }
  )
  .select("id")
  .single();

  if (!savedProfile) {
  setErrorMessage(
    "기사 프로필 저장 결과를 확인할 수 없습니다."
  );
  setLoading(false);
  return;
}
    if (
  usePromotion &&
  promotionDays !== null
) {
  const {
    error: promotionError,
  } = await supabase
    .from("promotion_requests")
    .insert({
      user_id: userId,
      target_type: "worker",
      target_id: savedProfile.id,
      days: promotionDays,
    });

  if (promotionError) {
    console.error(
      "추천 신청 저장 오류:",
      promotionError
    );

    setErrorMessage(
      "기사 프로필은 저장되었지만 추천 신청 저장에 실패했습니다."
    );

    setLoading(false);
    return;
  }
}

    setSuccessMessage(
      initialProfile
        ? "기사 프로필이 수정되었습니다."
        : "기사 프로필이 등록되었습니다."
    );

    setLoading(false);

    router.refresh();
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const selectClass =
    "h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 sm:space-y-6"
    >
      {/* 이름 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          이름
        </span>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="기사 이름을 입력해주세요"
          required
          autoComplete="name"
          className={inputClass}
        />
      </label>

      {/* 연락처 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          연락처
        </span>

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="예: 010-1234-5678"
          required
          className={inputClass}
        />

        <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
          로그인한 사용자가 기사
          상세페이지에서 확인할 수 있는
          연락처입니다.
        </p>
      </label>

      {/* 활동 지역 */}
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700 sm:text-base">
          활동 지역
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 시·도 */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
              시·도
            </span>

            <select
              value={region}
              onChange={(e) =>
                handleRegionChange(
                  e.target.value
                )
              }
              required
              className={
                selectClass
              }
            >
              <option value="">
                시·도를 선택해주세요
              </option>

              {REGIONS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </label>

          {/* 시·군·구 */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
              시·군·구
            </span>

            <select
              value={subRegion}
              onChange={(e) =>
                setSubRegion(
                  e.target.value
                )
              }
              required
              disabled={!region}
              className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
            >
              <option value="">
                {region
                  ? "시·군·구를 선택해주세요"
                  : "먼저 시·도를 선택해주세요"}
              </option>

              {selectedSubRegions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      </div>

      {/* 장비 / 경력 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {/* 장비 */}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
            주 장비
          </span>

          <select
            value={equipment}
            onChange={(e) =>
              setEquipment(
                e.target.value
              )
            }
            required
            className={
              selectClass
            }
          >
            <option value="">
              장비를 선택해주세요
            </option>

            <option value="굴삭기">
              굴삭기
            </option>

            <option value="지게차">
              지게차
            </option>

            <option value="크레인">
              크레인
            </option>

            <option value="덤프트럭">
              덤프트럭
            </option>

            <option value="로더">
              로더
            </option>

            <option value="불도저">
              불도저
            </option>

            <option value="고소작업차">
              고소작업차
            </option>

            <option value="기타">
              기타
            </option>
          </select>
        </label>

        {/* 경력 */}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
            경력
          </span>

          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={
                experienceYears
              }
              onChange={(e) =>
                setExperienceYears(
                  e.target.value
                )
              }
              placeholder="예: 10"
              required
              className={`${inputClass} pr-12`}
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
              년
            </span>
          </div>
        </label>
      </div>

      {/* 자격증 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          보유 자격증
        </span>

        <input
          type="text"
          value={licenses}
          onChange={(e) =>
            setLicenses(
              e.target.value
            )
          }
          placeholder="예: 굴착기운전기능사, 건설기계조종사면허"
          className={inputClass}
        />

        <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
          여러 개라면 쉼표로 구분해서
          작성하면 보기 편합니다.
        </p>
      </label>

      {/* 희망 급여 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          희망 급여
        </span>

        <input
          type="text"
          value={desiredSalary}
          onChange={(e) =>
            setDesiredSalary(
              e.target.value
            )
          }
          placeholder="예: 월 450만원 / 일급 25만원 / 협의"
          className={inputClass}
        />
      </label>

      {/* 자기소개 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          자기소개
        </span>

        <textarea
          value={introduction}
          onChange={(e) =>
            setIntroduction(
              e.target.value
            )
          }
          rows={7}
          placeholder="경력, 작업 경험, 가능한 업무 등을 간단히 작성해주세요."
          className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-base leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </label>
      {/* 추천 노출 선택 */}
<div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
  <label className="flex cursor-pointer items-start gap-3">
    <input
      type="checkbox"
      checked={usePromotion}
      onChange={(e) =>
        setUsePromotion(
          e.target.checked
        )
      }
      className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500"
    />

    <div>
      <p className="font-bold text-gray-900">
        추천으로 등록하기
      </p>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        추천 프로필은 상단에 등록됩니다.
      </p>
    </div>
  </label>
</div>

{usePromotion && (
  <PromotionGuide
    targetLabel="기사 프로필"
    selectedDays={promotionDays}
    onSelect={setPromotionDays}
  />
)}

      {/* 오류 */}
      {errorMessage && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-600">
          {errorMessage}
        </div>
      )}

      {/* 성공 */}
      {successMessage && (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium leading-6 text-green-700">
          {successMessage}
        </div>
      )}

      {/* 저장 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="min-h-14 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-lg"
      >
        {loading
          ? "저장 중..."
          : initialProfile
          ? "기사 프로필 수정하기"
          : "기사 프로필 등록하기"}
      </button>
    </form>
  );
}