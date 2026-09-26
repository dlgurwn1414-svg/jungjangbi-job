"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <div className="text-5xl">
          ⚠️
        </div>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          문제가 발생했습니다.
        </h1>

        <p className="mt-3 text-gray-500">
          잠시 후 다시 시도해주세요.
        </p>

        <button
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}