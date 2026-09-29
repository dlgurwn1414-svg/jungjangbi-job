import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";

import { createClient } from "@/lib/supabase/server";

export default async function NewInquiryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              문의
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              문의하기
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              이용 중 궁금한 점이나 문제가 있다면 문의를 남겨주세요.
            </p>
          </div>

          <InquiryForm />
        </div>
      </main>

      <Footer />
    </>
  );
}