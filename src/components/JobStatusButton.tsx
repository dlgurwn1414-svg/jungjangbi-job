"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Props = {
  jobId: number;
  initialStatus: "open" | "closed";
};

export default function JobStatusButton({
  jobId,
  initialStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;

    const nextStatus =
      status === "open" ? "closed" : "open";

    const message =
      nextStatus === "closed"
        ? "이 공고를 마감하시겠습니까?"
        : "이 공고를 다시 모집중으로 변경하시겠습니까?";

    if (!window.confirm(message)) {
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("jobs")
      .update({
        status: nextStatus,
      })
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      alert("공고 상태 변경 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    setStatus(nextStatus);
    setLoading(false);

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
        status === "open"
          ? "border border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
          : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
      } disabled:opacity-50`}
    >
      {loading
        ? "처리 중..."
        : status === "open"
        ? "공고 마감"
        : "다시 모집"}
    </button>
  );
}