import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-orange-500">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          페이지를 찾을 수 없습니다.
        </h1>

        <p className="mt-3 text-gray-500">
          주소가 잘못되었거나 삭제된 페이지입니다.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}