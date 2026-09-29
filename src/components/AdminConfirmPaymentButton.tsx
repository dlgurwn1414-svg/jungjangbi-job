"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Props = {
  requestId: number;
  paymentStatus: string;
};

export default function AdminConfirmPaymentButton({
  requestId,
  paymentStatus,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  if (paymentStatus === "paid") {
    return (
      <button
        type="button"
        disabled
        className="rounded-lg bg-green-100 px-4 py-2 text-sm font-bold text-green-700"
      >
        입금 완료
      </button>
    );
  }

  const handleConfirm = async () => {
    const ok = window.confirm(
      "입금이 확인되었나요?"
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("promotion_requests")
      .update({
        payment_status: "paid",
      })
      .eq("id", requestId);

    setLoading(false);

    if (error) {
      console.error(
        "입금 확인 처리 오류:",
        error
      );

      alert(
        "입금 확인 처리 중 오류가 발생했습니다."
      );

      return;
    }

    alert("입금 완료 처리되었습니다.");

    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleConfirm}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {loading
        ? "처리 중..."
        : "입금 확인"}
    </button>
  );
}
