"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Props = {
  inquiryId: number;
  initialAnswer: string;
  status: string;
};

export default function AdminInquiryAnswerForm({
  inquiryId,
  initialAnswer,
  status,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [answer, setAnswer] =
    useState(initialAnswer);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleSave = async () => {
    if (loading) return;

    if (!answer.trim()) {
      setMessage(
        "답변 내용을 입력해주세요."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("inquiries")
      .update({
        answer: answer.trim(),
        status: "answered",
        answered_at:
          new Date().toISOString(),
      })
      .eq("id", inquiryId);

    if (error) {
      console.error(
        "문의 답변 저장 오류:",
        error
      );

      setMessage(
        "답변 저장 중 오류가 발생했습니다."
      );

      setLoading(false);
      return;
    }

    setMessage(
      status === "answered"
        ? "답변이 수정되었습니다."
        : "답변이 등록되었습니다."
    );

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="mt-4">
      <textarea
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        rows={10}
        placeholder="사용자에게 전달할 답변을 입력해주세요."
        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {message && (
        <p className="mt-3 text-sm font-medium text-orange-700">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="mt-4 min-h-12 w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
      >
        {loading
          ? "저장 중..."
          : status === "answered"
          ? "답변 수정"
          : "답변 등록"}
      </button>
    </div>
  );
}