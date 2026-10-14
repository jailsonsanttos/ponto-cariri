import { permanentRedirect } from "next/navigation";

export default function NoticiaRedirect({ params }) {
  permanentRedirect(`/informacoes/${params.slug}`);
}
