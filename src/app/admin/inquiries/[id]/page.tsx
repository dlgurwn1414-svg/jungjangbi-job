import { notFound, redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminInquiryAnswerForm from "@/components/AdminInquiryAnswerForm";

import { createClient } from "@/lib/supabase/server";

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

export default async function AdminInquiryDetailPage({
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

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    redirect("/");
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
    .maybeSingle();

  if (error) {
    console.error(
      "관리자 문의 상세 조회 오류:",
      error
    );
  }

  if (!inquiry) {
    notFound();
  }

  const { data: inquiryUser } =
    await supabase
      .from("profiles")
      .select(`
        name,
        phone
      `)
      .eq(
        "user_id",
        inquiry.user_id
      )
      .maybeSingle();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div>
            <p className="text-sm font-semibold text-red-500 sm:text-base">
              ADMIN
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              문의 상세
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              사용자 문의 내용을 확인하고 답변할 수 있습니다.
            </p>
          </div>

          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  inquiry.status ===
                  "answered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {inquiry.status ===
                "answered"
                  ? "답변 완료"
                  : "답변 대기"}
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

            <div className="mt-5 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 sm:grid-cols-2">
              <p>
                문의자:{" "}
                <span className="font-bold text-gray-900">
                  {inquiryUser?.name ||
                    "회원"}
                </span>
              </p>

              <p>
                연락처:{" "}
                <span className="font-bold text-gray-900">
                  {inquiryUser?.phone ||
                    "등록된 연락처 없음"}
                </span>
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 p-4 sm:p-5">
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

              {inquiry.answered_at && (
                <span className="text-xs text-gray-400">
                  마지막 답변{" "}
                  {formatDate(
                    inquiry.answered_at
                  )}
                </span>
              )}
            </div>

            <AdminInquiryAnswerForm
              inquiryId={inquiry.id}
              initialAnswer={
                inquiry.answer ?? ""
              }
              status={inquiry.status}
            />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}