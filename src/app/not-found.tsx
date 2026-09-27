import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-5xl font-bold text-orange-500 sm:text-6xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          페이지를 찾을 수 없습니다.
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          주소가 잘못되었거나 삭제된 페이지입니다.
        </p>

        <Link
          href="/"
          className="mt-8 flex min-h-14 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 sm:text-lg"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}