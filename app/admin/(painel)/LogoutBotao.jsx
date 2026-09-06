"use client";

import { useRouter } from "next/navigation";

export default function LogoutBotao() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="text-sm text-white/70 hover:text-white underline"
    >
      Sair
    </button>
  );
}
