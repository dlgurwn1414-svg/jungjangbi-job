"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userType, setUserType] = useState<"worker" | "company">("worker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setMessage("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setLoading(false);
      setMessage("회원가입 처리 중 오류가 발생했습니다.");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: data.user.id,
        user_type: userType,
        name,
      });

    setLoading(false);

    if (profileError) {
      console.error(profileError);
      setMessage(
        "계정은 생성됐지만 회원 유형 저장에 실패했습니다."
      );
      return;
    }

    alert("회원가입이 완료되었습니다.");

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500"
        >
          중장비JOB
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          회원가입
        </h1>

        <p className="mt-2 text-gray-500">
          회원 유형을 선택하고 가입해주세요.
        </p>

        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-6"
        >
          <div>
            <p className="text-sm font-semibold text-gray-700">
              어떤 목적으로 이용하시나요?
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("worker")}
                className={`rounded-xl border p-5 text-left transition ${
                  userType === "worker"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold text-gray-900">
                  기사 회원
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  일자리를 찾고 있습니다.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setUserType("company")}
                className={`rounded-xl border p-5 text-left transition ${
                  userType === "company"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="font-bold text-gray-900">
                  업체 회원
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  중장비 기사를 찾고 있습니다.
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              이름 / 업체명
            </label>

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                userType === "worker"
                  ? "예: 김기사"
                  : "예: 대한건설"
              }
              className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              이메일
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
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
              placeholder="6자 이상"
              className="mt-2 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              비밀번호 확인
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
            disabled={loading}
            className="h-12 w-full rounded-lg bg-orange-500 font-bold text-white hover:bg-orange-600 disabled:bg-gray-300"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </main>
  );
}