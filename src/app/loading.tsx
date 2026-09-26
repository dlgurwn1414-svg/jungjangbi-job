export default function WorkersLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

              <div className="mt-3 h-7 w-28 animate-pulse rounded bg-gray-200" />

              <div className="mt-6 h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-100" />

              <div className="mt-6 h-10 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}