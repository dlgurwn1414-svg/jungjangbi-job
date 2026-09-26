import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteWorkerButton from "@/components/FavoriteWorkerButton";
import { createClient } from "@/lib/supabase/server";
import ShareButton from "@/components/ShareButton";

export default async function WorkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: worker, error } = await supabase
    .from("worker_profiles")
    .select(`
      id,
      user_id,
      name,
      phone,
      region,
      sub_region,
      equipment,
      experience_years,
      licenses,
      desired_salary,
      introduction
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !worker) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              기사 프로필을 찾을 수 없습니다.
            </h1>

            <Link
              href="/workers"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
            >
              기사 목록으로
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  let initialFavorite = false;

  if (user) {
    const { data: favorite } = await supabase
      .from("favorite_workers")
      .select("id")
      .eq("user_id", user.id)
      .eq("worker_id", worker.id)
      .maybeSingle();

    initialFavorite = !!favorite;
  }

  const phoneLink = worker.phone
    ? worker.phone.replace(/[^0-9+]/g, "")
    : "";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Link
            href="/workers"
            className="text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            ← 기사 목록으로
          </Link>

          <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-orange-500">
                  WORKER PROFILE
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                  {worker.name}
                </h1>
              </div>

              <FavoriteWorkerButton
                workerId={worker.id}
                initialFavorite={initialFavorite}
              />
            </div>
            <ShareButton
  title={`${worker.name} 기사 프로필`}
  text={`${worker.region}${
    worker.sub_region
      ? ` ${worker.sub_region}`
      : ""
  } · ${worker.equipment}`}
/>
            <div className="mt-6 flex flex-wrap gap-2">
              {worker.equipment && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {worker.equipment}
                </span>
              )}

              {worker.region && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  {worker.region}
                </span>
              )}

              {worker.experience_years !== null && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  경력 {worker.experience_years}년
                </span>
              )}
            </div>

            <div className="mt-8 grid gap-6 rounded-2xl bg-gray-50 p-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  주 장비
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {worker.equipment || "미등록"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  활동 지역
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {worker.region || "미등록"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  경력
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {worker.experience_years !== null
                    ? `${worker.experience_years}년`
                    : "미등록"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  희망 급여
                </p>

                <p className="mt-2 font-bold text-orange-600">
                  {worker.desired_salary || "협의"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm font-semibold text-gray-500">
                  자격증
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {worker.licenses || "미등록"}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                자기소개
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-8 text-gray-700">
                {worker.introduction || "등록된 자기소개가 없습니다."}
              </p>
            </section>

            <section className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900">
                연락처
              </h2>

              {!user ? (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="font-semibold text-gray-700">
                    로그인 후 연락처를 확인할 수 있습니다.
                  </p>

                  <Link
                    href="/login"
                    className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white"
                  >
                    로그인
                  </Link>
                </div>
              ) : worker.phone ? (
                <div className="mt-4">
                  <p className="text-lg font-bold text-gray-900">
                    {worker.phone}
                  </p>

                  <a
                    href={`tel:${phoneLink}`}
                    className="mt-4 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                  >
                    전화하기
                  </a>
                </div>
              ) : (
                <p className="mt-4 text-gray-500">
                  등록된 연락처가 없습니다.
                </p>
              )}
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}