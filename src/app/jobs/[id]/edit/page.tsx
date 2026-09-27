import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditJobForm from "@/components/EditJobForm";

import { createClient } from "@/lib/supabase/server";

export default async function EditJobPage({
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

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!job) {
    redirect("/mypage");
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 페이지 제목 */}
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              EDIT JOB
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              공고 수정
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              등록한 공고의 내용을 수정할 수 있습니다.
            </p>
          </div>

          {/* 수정 폼 */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6 md:p-8">
            <EditJobForm job={job} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}