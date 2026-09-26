import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkerProfileForm from "@/components/WorkerProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function WorkerProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 기존 기사 프로필 불러오기
  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          {/* 페이지 제목 */}
          <div>
            <p className="font-semibold text-orange-500">
              WORKER PROFILE
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              기사 프로필
            </h1>

            <p className="mt-2 text-gray-500">
              업체가 확인할 수 있는 기사 정보를 등록해주세요.
            </p>
          </div>

          {/* 프로필 폼 */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <WorkerProfileForm
              userId={user.id}
              initialProfile={workerProfile}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}