import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

function getStatusLabel(status: string) {
  if (status === "answered") {
    return "답변 완료";
  }

  return "답변 대기";
}

function getStatusClass(status: string) {
  if (status === "answered") {
    return "bg-green-100 text-green-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: inquiry,
    error,
  } = await supabase
    .from("inquiries")
    .select(`
      id,
      user_id,
      title,
      content,
      status,
      answer,
      created_at,
      answered_at
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "문의 상세 조회 오류:",
      error
    );
  }

  if (!inquiry) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-500 sm:text-base">
                INQUIRY
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                문의 상세
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                문의 내용과 관리자 답변을 확인할 수 있습니다.
              </p>
            </div>

            <Link
              href="/mypage/inquiries"
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              문의 목록
            </Link>
          </div>

          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                  inquiry.status
                )}`}
              >
                {getStatusLabel(
                  inquiry.status
                )}
              </span>

              <span className="text-xs text-gray-400">
                {formatDate(
                  inquiry.created_at
                )}
              </span>
            </div>

            <h2 className="mt-4 break-words text-xl font-bold text-gray-900 sm:text-2xl">
              {inquiry.title}
            </h2>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 sm:p-5">
              <p className="text-sm font-bold text-gray-700">
                문의 내용
              </p>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 sm:text-base">
                {inquiry.content}
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                관리자 답변
              </h2>

              {inquiry.status ===
                "answered" && (
                <span className="text-xs text-gray-400">
                  {formatDate(
                    inquiry.answered_at
                  )}
                </span>
              )}
            </div>

            {inquiry.status ===
              "answered" &&
            inquiry.answer ? (
              <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 sm:p-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 sm:text-base">
                  {inquiry.answer}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-4 sm:p-5">
                <p className="text-sm font-bold text-yellow-700">
                  아직 답변을 기다리고 있습니다.
                </p>

                <p className="mt-2 text-sm leading-6 text-yellow-700">
                  관리자가 문의를 확인한 후 답변하면 이곳에 표시됩니다.
                </p>
              </div>
            )}
          </section>

          <div className="mt-6">
            <Link
              href="/mypage/inquiries/new"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 sm:w-auto sm:inline-flex"
            >
              새 문의 작성
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}