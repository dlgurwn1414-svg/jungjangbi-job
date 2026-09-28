"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AdminPromotionButtonProps = {
  targetType: "job" | "worker";
  targetId: number;
  promotionExpiresAt?: string | null;
};

export default function AdminPromotionButton({
  targetType,
  targetId,
  promotionExpiresAt,
}: AdminPromotionButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  const isPromoted =
    !!promotionExpiresAt &&
    new Date(
      promotionExpiresAt
    ).getTime() > Date.now();

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      alert(
        "로그인이 필요합니다."
      );

      setLoading(false);
      return;
    }

    // 관리자 권한 확인
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

    if (
      profileError ||
      !profile?.is_admin
    ) {
      alert(
        "관리자 권한이 없습니다."
      );

      setLoading(false);
      return;
    }

    // 이미 추천 중이면 해제
    // 아니면 지금부터 7일 추천
    const nextPromotion =
      isPromoted
        ? null
        : new Date(
            Date.now() +
              7 *
                24 *
                60 *
                60 *
                1000
          ).toISOString();

    let error = null;

    if (
      targetType === "job"
    ) {
      const result =
        await supabase
          .from("jobs")
          .update({
            promotion_expires_at:
              nextPromotion,
          })
          .eq(
            "id",
            targetId
          );

      error = result.error;
    } else {
      const result =
        await supabase
          .from(
            "worker_profiles"
          )
          .update({
            promotion_expires_at:
              nextPromotion,
          })
          .eq(
            "id",
            targetId
          );

      error = result.error;
    }

    if (error) {
      console.error(
        "추천 노출 변경 오류:",
        {
          message:
            error.message,
          details:
            error.details,
          hint: error.hint,
          code: error.code,
        }
      );

      alert(
        "추천 노출 변경에 실패했습니다."
      );

      setLoading(false);
      return;
    }

    setLoading(false);

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
        isPromoted
          ? "border border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {loading
        ? "처리 중..."
        : isPromoted
          ? "추천 해제"
          : "7일 추천"}
    </button>
  );
}