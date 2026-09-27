import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewJobForm from "@/components/NewJobForm";

export default function NewJobPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          {/* 페이지 제목 */}
          <div>
            <p className="text-sm font-semibold text-orange-500 sm:text-base">
              JOB POST
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              공고 등록
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              필요한 기사와 근무 조건을 입력해주세요.
            </p>
          </div>

          {/* 공고 등록 폼 */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6 md:p-8">
            <NewJobForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}