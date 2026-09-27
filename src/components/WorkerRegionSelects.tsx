"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import {
  REGIONS,
  SUB_REGIONS,
  type Region,
} from "@/lib/regions";

type WorkerRegionSelectsProps = {
  initialRegion?: string;
  initialSubRegion?: string;
};

export default function WorkerRegionSelects({
  initialRegion = "",
  initialSubRegion = "",
}: WorkerRegionSelectsProps) {
  const [region, setRegion] =
    useState(initialRegion);

  const [subRegion, setSubRegion] =
    useState(initialSubRegion);

  const selectedSubRegions =
    useMemo(() => {
      if (!region) {
        return [];
      }

      if (
        !REGIONS.includes(
          region as Region
        )
      ) {
        return [];
      }

      return (
        SUB_REGIONS[
          region as Region
        ] ?? []
      );
    }, [region]);

  const handleRegionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const nextRegion =
      event.target.value;

    setRegion(nextRegion);

    // 시·도가 바뀌면
    // 기존 시·군·구 초기화
    setSubRegion("");
  };

  const handleSubRegionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSubRegion(
      event.target.value
    );
  };

  return (
    <>
      {/* 시·도 */}
      <div className="min-w-0">
        <label
          htmlFor="region"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          시·도
        </label>

        <select
          id="region"
          name="region"
          value={region}
          onChange={
            handleRegionChange
          }
          className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">
            전체 시·도
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
      </div>

      {/* 시·군·구 */}
      <div className="min-w-0">
        <label
          htmlFor="sub_region"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          시·군·구
        </label>

        <select
          id="sub_region"
          name="sub_region"
          value={subRegion}
          onChange={
            handleSubRegionChange
          }
          disabled={!region}
          className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">
            {region
              ? "전체 시·군·구"
              : "먼저 시·도 선택"}
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
      </div>
    </>
  );
}