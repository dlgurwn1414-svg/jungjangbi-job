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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/");
  }

  const {
    data: inquiries,
    error,
  } = await supabase
    .from("inquiries")
    .select(`
      id,
      user_id,
      title,
      content,
      status,
      created_at,
      answered_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "관리자 문의 목록 조회 오류:",
      error
    );
  }

  const userIds = [
    ...new Set(
      (inquiries ?? []).map(
        (inquiry) => inquiry.user_id
      )
    ),
  ];

  let users: {
    user_id: string;
    name: string | null;
  }[] = [];

  if (userIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select(`
        user_id,
        name
      `)
      .in("user_id", userIds);

    users = data ?? [];
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-500 sm:text-base">
                ADMIN
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                문의 관리
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                사용자가 작성한 문의를 확인하고 답변할 수 있습니다.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              총 {inquiries?.length ?? 0}건
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-10">
              <p className="font-bold text-gray-900">
                문의 목록을 불러오지 못했습니다.
              </p>
            </div>
          ) : !inquiries ||
            inquiries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
              <p className="font-bold text-gray-900">
                아직 등록된 문의가 없습니다.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {inquiries.map((inquiry) => {
                const inquiryUser =
                  users.find(
                    (item) =>
                      item.user_id ===
                      inquiry.user_id
                  );

                return (
                  <Link
                    key={inquiry.id}
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-300 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

                        <p className="mt-2 text-sm text-gray-500">
                          문의자:{" "}
                          <span className="font-semibold text-gray-700">
                            {inquiryUser?.name ||
                              "회원"}
                          </span>
                        </p>

                        <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-gray-500">
                          {inquiry.content}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-orange-600">
                        답변하기
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}