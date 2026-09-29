"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type JobPromotionRequestButtonProps = {
  userId: string;
  jobId: number;
  promotionExpiresAt:
    | string
    | null
    | undefined;
  hasPendingRequest: boolean;
};

function isPromotionActive(
  promotionExpiresAt:
    | string
    | null
    | undefined
) {
  if (!promotionExpiresAt) {
    return false;
  }

  return (
    new Date(
      promotionExpiresAt
    ).getTime() > Date.now()
  );
}

export default function JobPromotionRequestButton({
  userId,
  jobId,
  promotionExpiresAt,
  hasPendingRequest,
}: JobPromotionRequestButtonProps) {
  const supabase = createClient();

  const [open, setOpen] =
    useState(false);

  const [
    selectedDays,
    setSelectedDays,
  ] = useState<7 | 30 | null>(null);

  const [
    depositorName,
    setDepositorName,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const promoted =
    isPromotionActive(
      promotionExpiresAt
    );

  const handleRequest = async () => {
    if (loading) return;

    if (selectedDays === null) {
      setMessage(
        "추천 기간을 선택해주세요."
      );
      return;
    }

    if (!depositorName.trim()) {
      setMessage(
        "입금자명을 입력해주세요."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const {
      data: existingRequests,
      error: checkError,
    } = await supabase
      .from("promotion_requests")
      .select("id")
      .eq("user_id", userId)
      .eq(
        "target_type",
        "job"
      )
      .eq(
        "target_id",
        jobId
      )
      .eq(
        "status",
        "pending"
      )
      .limit(1);

    if (checkError) {
      console.error(
        "추천 신청 확인 오류:",
        checkError
      );

      setMessage(
        "추천 신청 확인 중 오류가 발생했습니다."
      );

      setLoading(false);
      return;
    }

    if (
      existingRequests &&
      existingRequests.length > 0
    ) {
      setMessage(
        "이미 승인 대기 중인 추천 신청이 있습니다."
      );

      setLoading(false);
      return;
    }

    const { error } =
      await supabase
        .from(
          "promotion_requests"
        )
        .insert({
          user_id: userId,
          target_type: "job",
          target_id: jobId,
          days: selectedDays,
          depositor_name:
            depositorName.trim(),
        });

    if (error) {
      console.error(
        "추천 신청 오류:",
        error
      );

      setMessage(
        "추천 신청 중 오류가 발생했습니다."
      );

      setLoading(false);
      return;
    }

    setMessage(
      `${selectedDays}일 추천 신청이 접수되었습니다.`
    );

    setSelectedDays(null);
    setDepositorName("");
    setLoading(false);
  };

  return (
    <div className="w-full sm:w-auto">
      {hasPendingRequest ? (
        <button
          type="button"
          disabled
          className="min-h-10 w-full cursor-not-allowed rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-500 sm:w-auto"
        >
          승인 대기중
        </button>
      ) : !open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMessage("");
          }}
          className="min-h-10 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600 sm:w-auto"
        >
          {promoted
            ? "추천 연장"
            : "추천 신청"}
        </button>
      ) : (
        <div className="w-full rounded-xl border border-orange-200 bg-orange-50 p-4 sm:min-w-72">
          <p className="font-bold text-gray-900">
            {promoted
              ? "추천 기간 연장"
              : "추천 신청"}
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            원하는 추천 기간을 선택해주세요.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedDays(7)
              }
              className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                selectedDays === 7
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              7일
              <span className="mt-1 block text-xs">
                9,900원
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedDays(30)
              }
              className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                selectedDays === 30
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              30일
              <span className="mt-1 block text-xs">
                29,900원
              </span>
            </button>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-gray-800">
              입금자명
            </span>

            <input
              type="text"
              value={depositorName}
              onChange={(e) =>
                setDepositorName(
                  e.target.value
                )
              }
              placeholder="실제 입금자명을 입력해주세요"
              maxLength={30}
              className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <p className="mt-2 text-xs leading-5 text-gray-500">
              계좌에 표시되는 실제
              입금자명을 입력해주세요.
            </p>
          </label>

          {message && (
            <p className="mt-3 text-sm font-medium text-orange-700">
              {message}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleRequest}
              disabled={loading}
              className="min-h-11 flex-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:bg-gray-300"
            >
              {loading
                ? "신청 중..."
                : "추천 신청하기"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSelectedDays(null);
                setDepositorName("");
                setMessage("");
              }}
              disabled={loading}
              className="min-h-11 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}