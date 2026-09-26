"use client";

import { useState } from "react";

type ShareButtonProps = {
  title: string;
  text?: string;
  className?: string;
};

export default function ShareButton({
  title,
  text,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] =
    useState(false);

  const handleShare = async () => {
    const url =
      window.location.href;

    try {
      // 모바일 등 Web Share API 지원 브라우저
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });

        return;
      }

      // PC 등 공유창 미지원 시 링크 복사
      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // 사용자가 모바일 공유창을 그냥 닫은 경우도
      // 여기로 들어올 수 있어서 별도 에러 표시는 안 함
      console.error(
        "공유하기 오류:",
        error
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 ${className}`}
    >
      {copied
        ? "링크 복사 완료"
        : "공유하기"}
    </button>
  );
}