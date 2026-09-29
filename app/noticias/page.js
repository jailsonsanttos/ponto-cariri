import { redirect } from "next/navigation";

export default function NoticiasRedirect({ searchParams }) {
  const qs = new URLSearchParams(searchParams || {}).toString();
  redirect(`/informacoes${qs ? `?${qs}` : ""}`);
}
