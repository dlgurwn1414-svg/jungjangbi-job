"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type ApplyJobButtonProps = {
  jobId: number;
  initialApplied: boolean;
};

export default function ApplyJobButton({
  jobId,
  initialApplied,
}: ApplyJobButtonProps) {
  const router = useRouter();
  const [applied, setApplied] = useState(initialApplied);
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (loading) return;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 후 지원할 수 있습니다.");
      router.push("/login");
      return;
    }

    setLoading(true);

    if (applied) {
      const confirmed = window.confirm("지원을 취소하시겠습니까?");

      if (!confirmed) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", jobId);

      if (error) {
        console.error(error);
        alert("지원 취소 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      setApplied(false);
      alert("지원이 취소되었습니다.");
    } else {
      const { error } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          job_id: jobId,
        });

      if (error) {
        console.error(error);

        if (error.code === "23505") {
          alert("이미 지원한 공고입니다.");
        } else {
          alert("지원 중 오류가 발생했습니다.");
        }

        setLoading(false);
        return;
      }

      setApplied(true);
      alert("지원이 완료되었습니다.");
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={loading}
      className={`flex-1 rounded-xl px-6 py-4 font-bold transition ${
        applied
          ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          : "bg-orange-500 text-white hover:bg-orange-600"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading
        ? "처리 중..."
        : applied
        ? "지원 완료 · 취소하기"
        : "지원하기"}
    </button>
  );
}