import { cookies } from "next/headers";
import { garantirSchema } from "@/lib/db";
import { acessoPorCookie, COOKIE_CONCURSEIROS, listarQuestoes } from "@/lib/concurseiros";
import ConcurseirosCliente, { CartaoAcesso } from "./ConcurseirosCliente";
export const dynamic = "force-dynamic";
export const metadata = { title: "Concurseiros", description: "Questões comentadas e desempenho para quem estuda para concursos." };
export default async function ConcurseirosPage() {
  await garantirSchema();
  const autorizado = await acessoPorCookie(cookies().get(COOKIE_CONCURSEIROS)?.value);
  if (!autorizado) return <CartaoAcesso />;
  return <ConcurseirosCliente questoes={listarQuestoes()} />;
}
