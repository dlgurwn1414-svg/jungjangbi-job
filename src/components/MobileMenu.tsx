"use client";

import { useState } from "react";
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

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white"
        aria-label="메뉴"
      >
        <span className="text-2xl text-gray-700">
          ☰
        </span>
      </button>

      {open && (
        <>
          {/* 바깥 클릭 영역 */}
          <button
            type="button"
            onClick={closeMenu}
            className="fixed inset-0 z-40 cursor-default bg-black/20"
            aria-label="메뉴 닫기"
          />

          {/* 메뉴 */}
          <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <nav className="flex flex-col p-3">
              <Link
                href="/jobs"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                일자리 찾기
              </Link>

              <Link
                href="/workers"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                기사 찾기
              </Link>

              <Link
                href="/jobs/new"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                공고 등록
              </Link>

              <Link
                href="/workers/profile"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                기사 프로필 등록
              </Link>

              {/* 관리자만 표시 */}
              {isAdmin && (
                <Link
                  href="/admin/reports"
                  onClick={closeMenu}
                  className="rounded-lg bg-red-50 px-4 py-3 font-bold text-red-600 hover:bg-red-100"
                >
                  관리자
                </Link>
              )}

              <div className="my-2 border-t border-gray-200" />

              {loggedIn ? (
                <>
                  <Link
                    href="/mypage"
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span>
                      마이페이지
                    </span>

                    {newApplicantCount > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {newApplicantCount}
                      </span>
                    )}
                  </Link>

                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    로그인
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="mt-1 rounded-lg bg-orange-500 px-4 py-3 text-center font-bold text-white"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}