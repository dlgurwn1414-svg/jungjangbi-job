"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type FavoriteWorkerButtonProps = {
  workerId: number;
  initialFavorite: boolean;
};

export default function FavoriteWorkerButton({
  workerId,
  initialFavorite,
}: FavoriteWorkerButtonProps) {
  const router = useRouter();

  const [favorite, setFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  async function handleFavorite() {
    if (loading) return;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 후 관심 기사로 저장할 수 있습니다.");
      router.push("/login");
      return;
    }

    setLoading(true);

    if (favorite) {
      const { error } = await supabase
        .from("favorite_workers")
        .delete()
        .eq("user_id", user.id)
        .eq("worker_id", workerId);

      if (error) {
        console.error("관심 기사 해제 오류:", error);
        alert("관심 기사 해제 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      setFavorite(false);
    } else {
      const { error } = await supabase
        .from("favorite_workers")
        .insert({
          user_id: user.id,
          worker_id: workerId,
        });

      if (error) {
        console.error("관심 기사 저장 오류:", error);

        if (error.code === "23505") {
          alert("이미 저장한 기사입니다.");
        } else {
          alert("관심 기사 저장 중 오류가 발생했습니다.");
        }

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
      className={`rounded-xl px-6 py-3 font-bold transition ${
        favorite
          ? "border border-orange-300 bg-orange-50 text-orange-600"
          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } disabled:opacity-50`}
    >
      {loading
        ? "처리 중..."
        : favorite
        ? "★ 관심 기사 저장됨"
        : "☆ 관심 기사 저장"}
    </button>
  );
}