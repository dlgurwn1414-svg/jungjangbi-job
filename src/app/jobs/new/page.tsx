import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewJobForm from "@/components/NewJobForm";

export default function NewJobPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div>
            <p className="font-semibold text-orange-500">
              JOB POST
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              공고 등록
            </h1>

            <p className="mt-2 text-gray-500">
              필요한 기사와 근무 조건을 입력해주세요.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <NewJobForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}