"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AdminRejectPromotionButtonProps = {
  requestId: number;
};

export default function AdminRejectPromotionButton({
  requestId,
}: AdminRejectPromotionButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  const handleReject = async () => {
    if (loading) return;

    const confirmed =
      window.confirm(
        "이 추천 신청을 거절하시겠습니까?"
      );

    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase
      .from("promotion_requests")
      .update({
        status: "rejected",
      })
      .eq("id", requestId)
      .eq("status", "pending");

    if (error) {
      console.error(
        "추천 신청 거절 오류:",
        error
      );

      alert(
        "추천 신청 거절에 실패했습니다."
      );

      setLoading(false);
      return;
    }

    alert(
      "추천 신청을 거절했습니다."
    );

    setLoading(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleReject}
      disabled={loading}
      className="flex min-h-11 w-full items-center justify-center rounded-xl border border-red-300 bg-red-50 px-5 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {loading
        ? "처리 중..."
        : "거절"}
    </button>
  );
}