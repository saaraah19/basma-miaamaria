"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button className="notfound-btn-back" onClick={() => router.back()}>
      ← Retour
    </button>
  );
}
