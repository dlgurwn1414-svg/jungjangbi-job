import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteWorkerButton from "@/components/FavoriteWorkerButton";
import ShareButton from "@/components/ShareButton";

import { createClient } from "@/lib/supabase/server";

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
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              기사 프로필을 찾을 수 없습니다.
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              삭제되었거나 존재하지 않는 기사
              프로필입니다.
            </p>

            <Link
              href="/workers"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 sm:w-auto"
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
    ? worker.phone.replace(
        /[^0-9+]/g,
        ""
      )
    : "";

  const regionText = [
    worker.region,
    worker.sub_region,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
          {/* 목록으로 */}
          <Link
            href="/workers"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            ← 기사 목록으로
          </Link>

          <article className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-8">
            {/* 프로필 상단 */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-orange-500 sm:text-base">
                  WORKER PROFILE
                </p>

                <h1 className="mt-2 break-words text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                  {worker.name}
                </h1>

                {regionText && (
                  <p className="mt-2 break-words text-sm text-gray-500">
                    {regionText}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-auto [&>*]:min-h-12 [&>*]:w-full sm:[&>*]:w-auto">
                <FavoriteWorkerButton
                  workerId={worker.id}
                  initialFavorite={
                    initialFavorite
                  }
                />
              </div>
            </div>

            {/* 공유 */}
            <div className="mt-3 w-full sm:w-auto [&>*]:min-h-11 [&>*]:w-full sm:[&>*]:w-auto">
              <ShareButton
                title={`${worker.name} 기사 프로필`}
                text={`${regionText || "지역 미등록"} · ${
                  worker.equipment ||
                  "장비 미등록"
                }`}
              />
            </div>

            {/* 빠른 정보 배지 */}
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              {worker.equipment && (
                <span className="max-w-full truncate rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                  {worker.equipment}
                </span>
              )}

              {worker.region && (
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                  {worker.region}
                </span>
              )}

              {worker.sub_region && (
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                  {worker.sub_region}
                </span>
              )}

              {worker.experience_years !==
                null &&
                worker.experience_years !==
                  undefined && (
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                    경력{" "}
                    {
                      worker.experience_years
                    }
                    년
                  </span>
                )}
            </div>

            {/* 기본 정보 */}
            <div className="mt-7 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:mt-8 sm:grid-cols-2">
              {/* 주 장비 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  주 장비
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {worker.equipment ||
                    "미등록"}
                </p>
              </div>

              {/* 활동 지역 */}
              <div className="border-b border-gray-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  활동 지역
                </p>

                <p className="mt-2 break-words font-bold text-gray-900">
                  {regionText ||
                    "미등록"}
                </p>
              </div>

              {/* 경력 */}
              <div className="border-b border-gray-200 p-4 sm:border-b-0 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  경력
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {worker.experience_years !==
                    null &&
                  worker.experience_years !==
                    undefined
                    ? `${worker.experience_years}년`
                    : "미등록"}
                </p>
              </div>

              {/* 희망 급여 */}
              <div className="border-b border-gray-200 p-4 sm:border-b-0 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  희망 급여
                </p>

                <p className="mt-2 break-words font-bold text-orange-600">
                  {worker.desired_salary ||
                    "협의"}
                </p>
              </div>

              {/* 자격증 */}
              <div className="p-4 sm:col-span-2 sm:border-t sm:border-gray-200 sm:p-5">
                <p className="text-sm font-semibold text-gray-500">
                  자격증
                </p>

                <p className="mt-2 break-words font-bold leading-7 text-gray-900">
                  {worker.licenses ||
                    "미등록"}
                </p>
              </div>
            </div>

            {/* 자기소개 */}
            <section className="mt-8 border-t border-gray-200 pt-7 sm:pt-8">
              <h2 className="text-xl font-bold text-gray-900">
                자기소개
              </h2>

              <p className="mt-4 break-words whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                {worker.introduction ||
                  "등록된 자기소개가 없습니다."}
              </p>
            </section>

            {/* 연락처 */}
            <section className="mt-8 border-t border-gray-200 pt-7 sm:pt-8">
              <h2 className="text-xl font-bold text-gray-900">
                연락처
              </h2>

              {!user ? (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <p className="font-semibold leading-6 text-gray-700">
                    로그인 후 연락처를 확인할 수
                    있습니다.
                  </p>

                  <Link
                    href="/login"
                    className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 sm:w-auto sm:inline-flex"
                  >
                    로그인
                  </Link>
                </div>
              ) : worker.phone ? (
                <div className="mt-4">
                  <a
                    href={`tel:${phoneLink}`}
                    className="block break-all text-xl font-bold text-gray-900 transition hover:text-orange-500"
                  >
                    {worker.phone}
                  </a>

                  <a
                    href={`tel:${phoneLink}`}
                    className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 sm:inline-flex sm:w-auto"
                  >
                    ☎ 전화하기
                  </a>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    등록된 연락처가 없습니다.
                  </p>
                </div>
              )}
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}