"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  jobId: number;
};

export default function AdminDeleteJobButton({
  jobId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "정말 이 공고를 삭제하시겠습니까?\n삭제한 공고는 복구할 수 없습니다."
    );

    if (!confirmed || loading) return;

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (error) {
      console.error(error);
      alert("공고 삭제 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    alert("공고가 삭제되었습니다.");

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "삭제 중..." : "공고 삭제"}
    </button>
  );
}