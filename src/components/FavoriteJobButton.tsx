"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type FavoriteJobButtonProps = {
  jobId: number;
  initialFavorite: boolean;
};

export default function FavoriteJobButton({
  jobId,
  initialFavorite,
}: FavoriteJobButtonProps) {
  const router = useRouter();

  const [favorite, setFavorite] =
    useState(initialFavorite);

  const [loading, setLoading] = useState(false);

  async function handleFavorite() {
    if (loading) return;

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);

      alert("로그인 후 이용할 수 있습니다.");

      router.push("/login");

      return;
    }

    if (favorite) {
      const { error } = await supabase
        .from("favorite_jobs")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", jobId);

      if (error) {
        console.error(error);
        alert("관심 공고 해제 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      setFavorite(false);
    } else {
      const { error } = await supabase
        .from("favorite_jobs")
        .insert({
          user_id: user.id,
          job_id: jobId,
        });

      if (error) {
        console.error(error);
        alert("관심 공고 저장 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      setFavorite(true);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={loading}
      className={`flex-1 rounded-xl border px-6 py-4 font-bold transition ${
        favorite
          ? "border-orange-300 bg-orange-50 text-orange-600"
          : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
      }`}
    >
      {loading
        ? "처리 중..."
        : favorite
        ? "★ 관심 공고 저장됨"
        : "☆ 관심 공고 저장"}
    </button>
  );
}