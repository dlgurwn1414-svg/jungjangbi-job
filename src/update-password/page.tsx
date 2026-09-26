"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setReady(true);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (password.length < 6) {
      setMessage("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage(
        "비밀번호 변경에 실패했습니다. 재설정 메일을 다시 요청해주세요."
      );
      return;
    }

    alert("비밀번호가 변경되었습니다.");

    await supabase.auth.signOut();

    router.push("/login");
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
          새 비밀번호 설정
        </h1>

        <p className="mt-2 text-gray-500">
          앞으로 사용할 새로운 비밀번호를 입력해주세요.
        </p>

        {!ready ? (
          <div className="mt-8 rounded-xl bg-gray-50 p-5 text-center">
            <p className="font-semibold text-gray-700">
              재설정 링크를 확인하고 있습니다.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              잠시만 기다려주세요.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-sm font-semibold text-gray-700">
                새 비밀번호
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="6자 이상 입력"
                className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                새 비밀번호 확인
              </label>

              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) =>
                  setPasswordConfirm(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
              />
            </div>

            {message && (
              <p className="text-sm text-red-500">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600 disabled:bg-gray-300"
            >
              {loading
                ? "변경 중..."
                : "비밀번호 변경"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}