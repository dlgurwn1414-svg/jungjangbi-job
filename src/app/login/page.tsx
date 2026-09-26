"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
  console.error("로그인 오류:", error);
  setMessage(`${error.code ?? "unknown"} : ${error.message}`);
  return;
}

    router.push("/");
    router.refresh();
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
          로그인
        </h1>

        <p className="mt-2 text-gray-500">
          중장비JOB에 로그인하세요.
        </p>

        <form
          onSubmit={handleLogin}
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
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              비밀번호
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end">
  <Link
    href="/forgot-password"
    className="text-sm font-semibold text-orange-500 hover:text-orange-600"
  >
    비밀번호를 잊으셨나요?
  </Link>
</div>

          {message && (
            <p className="text-sm text-red-500">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="h-12 w-full rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-orange-500"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}