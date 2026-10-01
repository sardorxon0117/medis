import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import type { PanelKey } from "@/lib/nav";

export const metadata: Metadata = { title: "Kirish" };

const ROLES: PanelKey[] = ["shifokor", "klinika", "apteka", "reklama", "admin"];

export default async function Page(props: PageProps<"/kirish">) {
  const { rol } = await props.searchParams;
  const initial = ROLES.includes(rol as PanelKey) ? (rol as PanelKey) : "shifokor";
  return <LoginForm initialRole={initial} />;
}
