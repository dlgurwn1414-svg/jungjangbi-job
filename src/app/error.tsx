"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="text-5xl sm:text-6xl">
          ⚠️
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
          문제가 발생했습니다.
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          잠시 후 다시 시도해주세요.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 min-h-14 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 sm:text-lg"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}