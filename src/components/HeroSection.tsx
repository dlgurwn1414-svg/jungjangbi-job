export default function HeroSection() {
  return (
    <section className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24">
        <p className="mb-3 text-sm font-semibold text-orange-400 sm:mb-4 sm:text-base">
          중장비 전문 구인구직
        </p>

        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
          중장비 일자리,
          <br />
          이제 한 곳에서 찾으세요
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-300 sm:mt-6 sm:text-lg">
          굴삭기, 지게차, 덤프, 크레인까지
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          원하는 조건의 일자리를 빠르게 찾아보세요.
        </p>

        <form
          action="/jobs"
          method="GET"
          className="mx-auto mt-8 grid w-full max-w-4xl gap-3 rounded-2xl bg-white p-3 shadow-xl sm:mt-10 sm:p-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <div className="w-full">
            <label
              htmlFor="hero-location"
              className="sr-only"
            >
              지역 선택
            </label>

            <select
              id="hero-location"
              name="location"
              className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">
                지역 선택
              </option>

              <option value="서울">
                서울
              </option>

              <option value="경기">
                경기
              </option>

              <option value="인천">
                인천
              </option>

              <option value="전북">
                전북
              </option>

              <option value="전남">
                전남
              </option>

              <option value="충북">
                충북
              </option>

              <option value="충남">
                충남
              </option>

              <option value="경북">
                경북
              </option>

              <option value="경남">
                경남
              </option>
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="hero-equipment"
              className="sr-only"
            >
              장비 선택
            </label>

            <select
              id="hero-equipment"
              name="equipment"
              className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">
                장비 선택
              </option>

              <option value="굴삭기">
                굴삭기
              </option>

              <option value="지게차">
                지게차
              </option>

              <option value="덤프트럭">
                덤프트럭
              </option>

              <option value="크레인">
                크레인
              </option>

              <option value="로더">
                로더
              </option>

              <option value="불도저">
                불도저
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-orange-500 px-8 text-base font-bold text-white transition hover:bg-orange-600 active:bg-orange-700 md:w-auto"
          >
            일자리 검색
          </button>
        </form>
      </div>
    </section>
  );
}