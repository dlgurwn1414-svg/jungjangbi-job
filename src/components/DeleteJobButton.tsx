"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type DeleteJobButtonProps = {
  jobId: number;
};

export default function DeleteJobButton({
  jobId,
}: DeleteJobButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "정말 이 공고를 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      alert("공고 삭제 중 오류가 발생했습니다.");
      return;
    }

    alert("공고가 삭제되었습니다.");

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
    >
      삭제
    </button>
  );
}