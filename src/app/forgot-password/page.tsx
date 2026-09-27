"use client";

import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    const supabase = createClient();

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

    setLoading(false);

    if (error) {
      console.error(error);

      setMessage(
        "메일 전송 중 오류가 발생했습니다."
      );

      return;
    }

    setIsSuccess(true);

    setMessage(
      "비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        {/* 로고 */}
        <Link
          href="/"
          className="inline-block text-2xl font-bold text-orange-500"
        >
          중장비JOB
        </Link>

        {/* 제목 */}
        <div className="mt-7 sm:mt-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            비밀번호 찾기
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            가입한 이메일을 입력하면 비밀번호 재설정
            링크를 보내드립니다.
          </p>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5 sm:mt-8"
        >
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              이메일
            </span>

            <input
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="example@email.com"
              className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          {/* 안내 / 오류 */}
          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium leading-6 ${
                isSuccess
                  ? "border-green-100 bg-green-50 text-green-700"
                  : "border-red-100 bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="min-h-14 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-lg"
          >
            {loading
              ? "메일 보내는 중..."
              : "재설정 메일 받기"}
          </button>
        </form>

        {/* 로그인 이동 */}
        <Link
          href="/login"
          className="mt-6 flex min-h-10 items-center justify-center text-center text-sm font-semibold text-gray-500 transition hover:text-orange-500"
        >
          ← 로그인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}