"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setIsSuccess(false);

    if (password.length < 6) {
      setMessage("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (error) {
      console.error("비밀번호 변경 오류:", error);
      setMessage(
        "비밀번호 변경에 실패했습니다. 재설정 링크를 다시 확인해주세요."
      );
      return;
    }

    setIsSuccess(true);
    setMessage("비밀번호가 변경되었습니다.");

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <Link
          href="/"
          className="inline-block text-2xl font-bold text-orange-500"
        >
          중장비JOB
        </Link>

        <div className="mt-7 sm:mt-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            새 비밀번호 설정
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            새로 사용할 비밀번호를 입력해주세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5 sm:mt-8"
        >
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              새 비밀번호
            </span>

            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="6자 이상 입력해주세요"
              className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              새 비밀번호 확인
            </span>

            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) =>
                setPasswordConfirm(e.target.value)
              }
              placeholder="비밀번호를 다시 입력해주세요"
              className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

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

          <button
            type="submit"
            disabled={loading}
            className="min-h-14 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-lg"
          >
            {loading
              ? "변경 중..."
              : "비밀번호 변경하기"}
          </button>
        </form>

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