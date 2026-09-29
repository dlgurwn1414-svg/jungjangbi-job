"use client";
import PromotionGuide from "@/components/PromotionGuide";
import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  REGIONS,
  SUB_REGIONS,
  type Region,
} from "@/lib/regions";

import { createClient } from "@/lib/supabase/client";

export default function NewJobForm() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [
    contactPhone,
    setContactPhone,
  ] = useState("");

  const [location, setLocation] =
    useState("");

  const [
    subLocation,
    setSubLocation,
  ] = useState("");

  const [
    equipment,
    setEquipment,
  ] = useState("");

  const [salary, setSalary] =
    useState("");

  const [
    experience,
    setExperience,
  ] = useState("");

  const [workType, setWorkType] =
    useState("");

  const [workDays, setWorkDays] =
    useState("");

  const [
    accommodation,
    setAccommodation,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

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

  const selectedSubRegions =
    location &&
    REGIONS.includes(
      location as Region
    )
      ? SUB_REGIONS[
          location as Region
        ]
      : [];

  const handleLocationChange = (
    value: string
  ) => {
    setLocation(value);

    // 시·도가 바뀌면
    // 기존 시·군·구 선택 초기화
    setSubLocation("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(
  event.currentTarget
);

const depositorName = String(
  formData.get("depositor_name") ?? ""
).trim();

   if (loading) return;

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

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const {
      data: insertedJob,
      error,
    } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,

        title: title.trim(),
        company: company.trim(),
        contact_phone:
          contactPhone.trim(),

        location,
        sub_location: subLocation,

        equipment,
        salary: salary.trim(),
        experience,

        work_type: workType.trim(),
        work_days: workDays.trim(),
        accommodation:
          accommodation.trim(),

        description:
          description.trim(),

        urgent: false,
        status: "open",
      })
      .select("id")
      .single();

    if (error) {
      console.error(
        "공고 등록 오류:",
        error
      );

      setErrorMessage(
        "공고 등록 중 오류가 발생했습니다. 다시 시도해주세요."
      );

      setLoading(false);
      return;
    }

    router.push(
      `/jobs/${insertedJob.id}`
    );

    if (
  usePromotion &&
  promotionDays !== null
) {
  const {
    error: promotionError,
  } = await supabase
    .from("promotion_requests")
   .insert({
  user_id: user.id,
  target_type: "job",
  target_id: insertedJob.id,
  days: promotionDays,
  depositor_name: depositorName,
  status: "pending",
})

  if (promotionError) {
    console.error(
      "추천 신청 저장 오류:",
      promotionError
    );

    alert(
      "공고는 등록되었지만 추천 신청 저장에 실패했습니다."
    );
  }
}

    router.refresh();
  };

  const inputClass =
    "min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const selectClass =
    "min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 sm:space-y-6"
    >
      {/* 공고 제목 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          공고 제목
        </span>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="예: 굴삭기 기사 모집합니다"
          required
          className={inputClass}
        />
      </label>

      {/* 업체명 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          업체명
        </span>

        <input
          type="text"
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
          placeholder="업체명을 입력해주세요"
          required
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
          value={contactPhone}
          onChange={(e) =>
            setContactPhone(
              e.target.value
            )
          }
          placeholder="예: 010-1234-5678"
          required
          className={inputClass}
        />

        <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
          구직자가 공고에서 바로 전화
          문의할 수 있는 번호입니다.
        </p>
      </label>

      {/* 근무 지역 */}
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700 sm:text-base">
          근무 지역
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 시·도 */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-600">
              시·도
            </span>

            <select
              value={location}
              onChange={(e) =>
                handleLocationChange(
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
                (region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
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
              value={subLocation}
              onChange={(e) =>
                setSubLocation(
                  e.target.value
                )
              }
              required
              disabled={!location}
              className={`${selectClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
            >
              <option value="">
                {location
                  ? "시·군·구를 선택해주세요"
                  : "먼저 시·도를 선택해주세요"}
              </option>

              {selectedSubRegions.map(
                (subRegion) => (
                  <option
                    key={
                      subRegion
                    }
                    value={
                      subRegion
                    }
                  >
                    {subRegion}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      </div>

      {/* 장비 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          장비
        </span>

        <select
          value={equipment}
          onChange={(e) =>
            setEquipment(
              e.target.value
            )
          }
          required
          className={selectClass}
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

      {/* 급여 / 경력 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {/* 급여 */}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
            급여
          </span>

          <input
            type="text"
            value={salary}
            onChange={(e) =>
              setSalary(
                e.target.value
              )
            }
            placeholder="예: 월 400만원 / 일급 20만원"
            required
            className={inputClass}
          />
        </label>

        {/* 경력 */}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
            경력
          </span>

          <select
            value={experience}
            onChange={(e) =>
              setExperience(
                e.target.value
              )
            }
            required
            className={
              selectClass
            }
          >
            <option value="">
              경력을 선택해주세요
            </option>

            <option value="경력무관">
              경력무관
            </option>

            <option value="신입">
              신입
            </option>

            <option value="1년 이상">
              1년 이상
            </option>

            <option value="3년 이상">
              3년 이상
            </option>

            <option value="5년 이상">
              5년 이상
            </option>

            <option value="10년 이상">
              10년 이상
            </option>
          </select>
        </label>
      </div>

      {/* 근무 형태 / 근무일 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {/* 근무 형태 */}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
            근무 형태
          </span>

          <input
            type="text"
            value={workType}
            onChange={(e) =>
              setWorkType(
                e.target.value
              )
            }
            placeholder="예: 정규직 / 일용직 / 계약직"
            className={inputClass}
          />
        </label>

        {/* 근무일 */}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
            근무일
          </span>

          <input
            type="text"
            value={workDays}
            onChange={(e) =>
              setWorkDays(
                e.target.value
              )
            }
            placeholder="예: 월~토 / 주 5일"
            className={inputClass}
          />
        </label>
      </div>

      {/* 숙식 */}
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700 sm:text-base">
          숙식 제공
        </span>

        <input
          type="text"
          value={accommodation}
          onChange={(e) =>
            setAccommodation(
              e.target.value
            )
          }
          placeholder="예: 숙식 제공 / 숙소 제공 / 제공 안 함"
          className={inputClass}
        />
      </label>

      {/* 상세 내용 */}
<label className="block">
  <span className="mb-2 block font-semibold text-gray-700">
    상세 내용
  </span>

  <textarea
    value={description}
    onChange={(e) =>
      setDescription(e.target.value)
    }
    placeholder="근무 조건, 업무 내용, 현장 정보 등을 입력해주세요."
    rows={7}
    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500"
  />
</label>

{/* 추천 노출 선택 */}
<div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
  <label className="flex cursor-pointer items-start gap-3">
    <input
      type="checkbox"
      checked={usePromotion}
      onChange={(e) => {
        const checked = e.target.checked;

        setUsePromotion(checked);

        if (!checked) {
          setPromotionDays(null);
        }
      }}
      className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500"
    />

    <div>
      <p className="font-bold text-gray-900">
        추천으로 등록하기
      </p>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        추천 게시물은 상단에 등록됩니다.
      </p>
    </div>
  </label>
</div>

{usePromotion && (
  <PromotionGuide
    targetLabel="채용 공고"
    selectedDays={promotionDays}
    onSelect={setPromotionDays}
  />
)}

{/* 오류 메시지 */}
{errorMessage && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-600">
          {errorMessage}
        </div>
      )}

      {/* 등록 */}
      <button
        type="submit"
        disabled={loading}
        className="min-h-14 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-lg"
      >
        {loading
          ? "등록 중..."
          : "공고 등록하기"}
      </button>
    </form>
  );
}