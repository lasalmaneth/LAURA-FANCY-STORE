"use client";

import { useEffect, useState } from "react";

interface Notice {
  notice_text: string;
  badge_text: string;
  is_active: boolean;
}

export default function NoticeBar() {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/notice")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.is_active) {
          setNotice(data);
        } else {
          setNotice(null);
        }
      })
      .catch((err) => console.error("Failed to fetch notice:", err));
  }, []);

  if (!notice) return null;

  return (
    <div className="w-full bg-ink text-paper py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center z-[100] relative font-mono uppercase text-xs sm:text-sm font-bold tracking-wider border-b border-paper">
      {notice.badge_text && (
        <span className="bg-paper text-ink px-2 py-0.5 whitespace-nowrap">
          {notice.badge_text}
        </span>
      )}
      <span>{notice.notice_text}</span>
    </div>
  );
}
