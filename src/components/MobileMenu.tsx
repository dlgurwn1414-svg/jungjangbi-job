"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";

type MobileMenuProps = {
  loggedIn: boolean;
  isAdmin: boolean;
  newApplicantCount: number;
};

export default function MobileMenu({
  loggedIn,
  isAdmin,
  newApplicantCount,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  // 메뉴가 열렸을 때 뒤쪽 화면 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    if (open) {
      window.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* 햄버거 버튼 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white transition active:bg-gray-100"
        aria-label="메뉴 열기"
        aria-expanded={open}
      >
        <span className="text-2xl leading-none text-gray-700">
          ☰
        </span>
      </button>

      {open && (
        <>
          {/* 어두운 배경 */}
          <button
            type="button"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="메뉴 닫기"
          />

          {/* 오른쪽 메뉴 패널 */}
          <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            {/* 메뉴 상단 */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
              <Link
                href="/"
                onClick={closeMenu}
                className="text-xl font-black text-gray-900"
              >
                중장비
                <span className="text-orange-500">
                  JOB
                </span>
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-2xl text-gray-700 transition active:bg-gray-200"
                aria-label="메뉴 닫기"
              >
                ×
              </button>
            </div>

            {/* 스크롤 가능한 메뉴 내용 */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <nav className="flex flex-col gap-1">
                {/* 기본 메뉴 */}
                <p className="mb-2 px-3 text-xs font-bold text-gray-400">
                  메뉴
                </p>

                <Link
                  href="/jobs"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition active:bg-gray-100"
                >
                  일자리 찾기
                </Link>

                <Link
                  href="/workers"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition active:bg-gray-100"
                >
                  기사 찾기
                </Link>

                <Link
                  href="/jobs/new"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition active:bg-gray-100"
                >
                  공고 등록
                </Link>

                <Link
                  href="/workers/profile"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition active:bg-gray-100"
                >
                  기사 프로필 등록
                </Link>

                {/* 관리자 전용 */}
                {isAdmin && (
                  <>
                    <div className="my-4 border-t border-gray-200" />

                    <p className="mb-2 px-3 text-xs font-bold text-red-400">
                      관리자
                    </p>

                    <Link
                      href="/admin/jobs"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center rounded-xl bg-red-50 px-4 py-3 text-base font-bold text-red-600 transition active:bg-red-100"
                    >
                      관리자 페이지
                    </Link>

                    <Link
                      href="/admin/reports"
                      onClick={closeMenu}
                      className="mt-1 flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-red-600 transition active:bg-red-50"
                    >
                      신고 관리
                    </Link>
                  </>
                )}

                <div className="my-4 border-t border-gray-200" />

                {/* 계정 메뉴 */}
                <p className="mb-2 px-3 text-xs font-bold text-gray-400">
                  계정
                </p>

                {loggedIn ? (
                  <>
                    <Link
                      href="/mypage"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition active:bg-gray-100"
                    >
                      <span>
                        마이페이지
                      </span>

                      {newApplicantCount >
                        0 && (
                        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                          {
                            newApplicantCount
                          }
                        </span>
                      )}
                    </Link>

                    <div className="mt-3 rounded-xl bg-gray-50 p-3">
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition active:bg-gray-100"
                    >
                      로그인
                    </Link>

                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-base font-bold text-white transition active:bg-orange-600"
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* 하단 */}
            <div className="shrink-0 border-t border-gray-200 px-5 py-4">
              <p className="text-center text-xs text-gray-400">
                중장비JOB
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}