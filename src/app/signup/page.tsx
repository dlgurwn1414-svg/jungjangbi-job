"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userType, setUserType] =
    useState<"worker" | "company">("worker");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [
    passwordConfirm,
    setPasswordConfirm,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setMessage("");

    if (
      password !== passwordConfirm
    ) {
      setMessage(
        "비밀번호가 일치하지 않습니다."
      );

      return;
    }

    if (password.length < 6) {
      setMessage(
        "비밀번호는 6자 이상 입력해주세요."
      );

      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase.auth.signUp({
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

      setMessage(
        "회원가입 처리 중 오류가 발생했습니다."
      );

      return;
    }

    const {
      error: profileError,
    } = await supabase
      .from("profiles")
      .insert({
        user_id: data.user.id,
        user_type: userType,
        name: name.trim(),
      });

    setLoading(false);

    if (profileError) {
      console.error(
        profileError
      );

      setMessage(
        "계정은 생성됐지만 회원 유형 저장에 실패했습니다."
      );

      return;
    }

    alert(
      "회원가입이 완료되었습니다."
    );

    router.push("/login");
  }

  const inputClass =
    "mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
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
            회원가입
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            회원 유형을 선택하고
            가입해주세요.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="mt-7 space-y-5 sm:mt-8 sm:space-y-6"
        >
          {/* 회원 유형 */}
          <div>
            <p className="text-sm font-semibold text-gray-700">
              어떤 목적으로 이용하시나요?
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setUserType(
                    "worker"
                  )
                }
                aria-pressed={
                  userType === "worker"
                }
                className={`min-h-24 rounded-xl border p-4 text-left transition sm:p-5 ${
                  userType === "worker"
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <p className="font-bold text-gray-900">
                  기사 회원
                </p>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  일자리를 찾고 있습니다.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setUserType(
                    "company"
                  )
                }
                aria-pressed={
                  userType ===
                  "company"
                }
                className={`min-h-24 rounded-xl border p-4 text-left transition sm:p-5 ${
                  userType ===
                  "company"
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <p className="font-bold text-gray-900">
                  업체 회원
                </p>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  중장비 기사를 찾고
                  있습니다.
                </p>
              </button>
            </div>
          </div>

          {/* 이름 / 업체명 */}
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              이름 / 업체명
            </span>

            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder={
                userType === "worker"
                  ? "예: 김기사"
                  : "예: 대한건설"
              }
              className={inputClass}
            />
          </label>

          {/* 이메일 */}
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
                setEmail(
                  e.target.value
                )
              }
              placeholder="이메일을 입력해주세요"
              className={inputClass}
            />
          </label>

          {/* 비밀번호 */}
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              비밀번호
            </span>

            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="6자 이상 입력해주세요"
              className={inputClass}
            />
          </label>

          {/* 비밀번호 확인 */}
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              비밀번호 확인
            </span>

            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) =>
                setPasswordConfirm(
                  e.target.value
                )
              }
              placeholder="비밀번호를 다시 입력해주세요"
              className={inputClass}
            />
          </label>

          {/* 오류 메시지 */}
          {message && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-600">
              {message}
            </div>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="min-h-14 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-lg"
          >
            {loading
              ? "가입 중..."
              : "회원가입"}
          </button>
        </form>

        {/* 로그인 이동 */}
        <p className="mt-6 text-center text-sm leading-6 text-gray-500">
          이미 회원이신가요?{" "}
          <Link
            href="/login"
            className="font-bold text-orange-500 transition hover:text-orange-600"
          >
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}