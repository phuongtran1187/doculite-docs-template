"use client";

import { useEffect, useState } from "react";

/**
 * Scrollspy hook — tracks which heading is currently in view.
 * Uses IntersectionObserver with rootMargin to account for sticky header.
 */
export function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headingIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headingIds]);

  return activeId;
}
