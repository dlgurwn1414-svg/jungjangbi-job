export default function HeroSection() {
  return (
    <section className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="mb-4 font-semibold text-orange-400">
          중장비 전문 구인구직
        </p>

        <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
          중장비 일자리,
          <br />
          이제 한 곳에서 찾으세요
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          굴삭기, 지게차, 덤프, 크레인까지
          <br />
          원하는 조건의 일자리를 빠르게 찾아보세요.
        </p>

        <form
          action="/jobs"
          method="GET"
          className="mx-auto mt-10 grid max-w-4xl gap-3 rounded-2xl bg-white p-4 shadow-xl md:grid-cols-[1fr_1fr_auto]"
        >
          <select
            name="location"
            className="h-14 rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
          >
            <option value="">지역 선택</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="전북">전북</option>
            <option value="전남">전남</option>
            <option value="충북">충북</option>
            <option value="충남">충남</option>
            <option value="경북">경북</option>
            <option value="경남">경남</option>
          </select>

          <select
            name="equipment"
            className="h-14 rounded-lg border border-gray-300 bg-white px-4 text-gray-900"
          >
            <option value="">장비 선택</option>
            <option value="굴삭기">굴삭기</option>
            <option value="지게차">지게차</option>
            <option value="덤프트럭">덤프트럭</option>
            <option value="크레인">크레인</option>
            <option value="로더">로더</option>
            <option value="불도저">불도저</option>
          </select>

          <button
            type="submit"
            className="h-14 rounded-lg bg-orange-500 px-8 font-bold text-white hover:bg-orange-600"
          >
            일자리 검색
          </button>
        </form>
      </div>
    </section>
  );
}