import Link from "next/link";
import { redirect } from "next/navigation";

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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export default async function MyInquiriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: inquiries,
    error,
  } = await supabase
    .from("inquiries")
    .select(`
      id,
      title,
      content,
      status,
      created_at,
      answered_at
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "문의 목록 조회 오류:",
      error
    );
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
                내 문의
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                내가 작성한 문의와 답변 상태를 확인할 수 있습니다.
              </p>
            </div>

            <Link
              href="/mypage/inquiries/new"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              문의하기
            </Link>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                문의 내역을 불러오지 못했습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                잠시 후 다시 시도해주세요.
              </p>
            </div>
          ) : !inquiries ||
            inquiries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
              <p className="font-bold text-gray-900">
                아직 작성한 문의가 없습니다.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                궁금한 점이 있다면 문의를 남겨주세요.
              </p>

              <Link
                href="/mypage/inquiries/new"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white"
              >
                첫 문의 작성하기
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {inquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/mypage/inquiries/${inquiry.id}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-300 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
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

                      <h2 className="mt-3 break-words text-lg font-bold text-gray-900">
                        {inquiry.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-gray-500">
                        {inquiry.content}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-orange-600">
                      보기
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}