"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AdminApprovePromotionButtonProps = {
  requestId: number;
  days: number;
};

export default function AdminApprovePromotionButton({
  requestId,
  days,
}: AdminApprovePromotionButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  const handleApprove = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      `${days}일 추천을 승인하시겠습니까?`
    );

    if (!confirmed) return;

    setLoading(true);

    const { error } =
      await supabase.rpc(
        "approve_promotion_request",
        {
          request_id: requestId,
        }
      );

    if (error) {
      console.error(
        "추천 승인 오류:",
        error
      );

      alert(
        "추천 승인에 실패했습니다."
      );

      setLoading(false);
      return;
    }

    alert(
      `${days}일 추천이 적용되었습니다.`
    );

    setLoading(false);

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={loading}
      className="flex min-h-11 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
    >
      {loading
        ? "처리 중..."
        : `${days}일 추천 승인`}
    </button>
  );
}