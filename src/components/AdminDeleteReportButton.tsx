"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  reportId: number;
};

export default function AdminDeleteReportButton({
  reportId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "이 신고 내역을 삭제하시겠습니까?"
    );

    if (!confirmed || loading) return;

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("job_reports")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error(error);
      alert("신고 삭제 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "삭제 중..." : "신고 삭제"}
    </button>
  );
}