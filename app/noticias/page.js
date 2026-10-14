import { permanentRedirect } from "next/navigation";

export default function NoticiasRedirect({ searchParams }) {
  const qs = new URLSearchParams(searchParams || {}).toString();
  permanentRedirect(`/informacoes${qs ? `?${qs}` : ""}`);
}
