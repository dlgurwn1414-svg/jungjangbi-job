"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/update-password`,
      }
    );

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("메일 전송 중 오류가 발생했습니다.");
      return;
    }

    setMessage(
      "비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500"
        >
          중장비JOB
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          비밀번호 찾기
        </h1>

        <p className="mt-2 text-gray-500">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="text-sm font-semibold text-gray-700">
              이메일
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="example@email.com"
              className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="h-12 w-full rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            {loading
              ? "메일 보내는 중..."
              : "재설정 메일 받기"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm font-semibold text-gray-500 hover:text-orange-500"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}