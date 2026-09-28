import type {
  Metadata,
  Viewport,
} from "next";

import type { ReactNode } from "react";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "중장비 일터 | 중장비 일자리·기사 찾기",
    template: "%s | 중장비 일터",
  },
  description:
    "굴삭기, 지게차, 덤프트럭, 크레인 등 중장비 일자리와 기사를 빠르게 찾는 중장비 구인구직 서비스입니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}

        <Analytics />
      </body>
    </html>
  );
}