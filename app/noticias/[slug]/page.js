import { redirect } from "next/navigation";

export default function NoticiaRedirect({ params }) {
  redirect(`/informacoes/${params.slug}`);
}
