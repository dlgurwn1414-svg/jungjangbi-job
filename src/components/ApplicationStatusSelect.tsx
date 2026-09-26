"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "accepted"
  | "rejected";

type ApplicationStatusSelectProps = {
  applicationId: number;
  initialStatus: ApplicationStatus;
};

export default function ApplicationStatusSelect({
  applicationId,
  initialStatus,
}: ApplicationStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: ApplicationStatus) {
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("applications")
      .update({
        status: newStatus,
      })
      .eq("id", applicationId);

    if (error) {
      console.error(error);
      alert("지원 상태 변경 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    setStatus(newStatus);
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) =>
        handleChange(e.target.value as ApplicationStatus)
      }
      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-800"
    >
      <option value="applied">지원됨</option>
      <option value="reviewing">검토중</option>
      <option value="accepted">채용</option>
      <option value="rejected">불합격</option>
    </select>
  );
}