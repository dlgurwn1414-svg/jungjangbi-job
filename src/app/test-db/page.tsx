import { createClient } from "@/lib/supabase/server";

export default async function TestDbPage() {
  const supabase = await createClient();

  const { error } = await supabase.auth.getSession();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Supabase 연결 테스트
      </h1>

      {error ? (
        <p className="mt-5 text-red-500">
          연결 오류: {error.message}
        </p>
      ) : (
        <p className="mt-5 text-green-600">
          Supabase 연결 성공!
        </p>
      )}
    </main>
  );
}