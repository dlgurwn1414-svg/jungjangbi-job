"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Props = {
  workerId: number;
  workerName?: string | null;
};

export default function AdminDeleteWorkerButton({
  workerId,
  workerName,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async () => {
    if (loading) return;

    const confirmed =
      window.confirm(
        `${
          workerName || "이 기사"
        } 프로필을 삭제하시겠습니까?\n\n삭제 후 복구할 수 없습니다.`
      );

    if (!confirmed) return;

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    // 관리자 재확인
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
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

    const { error } =
      await supabase
        .from("worker_profiles")
        .delete()
        .eq("id", workerId);

    if (error) {
      console.error(
        "기사 프로필 삭제 오류:",
        error
      );

      alert(
        "기사 프로필을 삭제하지 못했습니다."
      );

      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300 sm:w-auto"
    >
      {loading
        ? "삭제 중..."
        : "기사 삭제"}
    </button>
  );
}