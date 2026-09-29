"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function InquiryForm() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    if (!title.trim()) {
      setMessage("문의 제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setMessage("문의 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("inquiries")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        status: "pending",
      });

    if (error) {
      console.error(
        "문의 등록 오류:",
        error
      );

      setMessage(
        "문의 등록 중 오류가 발생했습니다."
      );

      setLoading(false);
      return;
    }

    alert(
      "문의가 정상적으로 등록되었습니다."
    );

    router.push("/mypage/inquiries");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6"
    >
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-gray-700 sm:text-base">
          문의 제목
        </span>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="예: 추천 결제 관련 문의"
          maxLength={100}
          required
          className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-gray-700 sm:text-base">
          문의 내용
        </span>

        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="문의 내용을 자세히 입력해주세요."
          rows={10}
          required
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </label>

      {message && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 flex-1 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading
            ? "등록 중..."
            : "문의 등록"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="min-h-12 rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}