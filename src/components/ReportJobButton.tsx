"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  jobId: number;
};

export default function ReportJobButton({ jobId }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!reason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    if (loading) return;

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인 후 신고할 수 있습니다.");
      setLoading(false);
      setOpen(false);
      router.push("/login");
      return;
    }

    // 중복 신고 확인
    const { data: existingReport } = await supabase
      .from("job_reports")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existingReport) {
      alert("이미 신고한 공고입니다.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("job_reports")
      .insert({
        user_id: user.id,
        job_id: jobId,
        reason,
        detail: detail.trim() || null,
      });

    if (error) {
      console.error("공고 신고 오류:", error);
      alert("신고 처리 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    alert("신고가 접수되었습니다.");

    setReason("");
    setDetail("");
    setOpen(false);
    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-gray-500 transition hover:text-red-500"
      >
        신고하기
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  공고 신고
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  문제가 있는 공고의 신고 사유를 선택해주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl font-bold text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                신고 사유
              </label>

              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900"
              >
                <option value="">신고 사유 선택</option>
                <option value="허위 공고">허위 공고</option>
                <option value="사기 의심">사기 의심</option>
                <option value="부적절한 내용">부적절한 내용</option>
                <option value="연락처 문제">연락처 문제</option>
                <option value="이미 마감된 공고">
                  이미 마감된 공고
                </option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                상세 내용
              </label>

              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={5}
                placeholder="신고 내용을 자세히 적어주세요."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "신고 중..." : "신고하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}