import { PanelShell } from "@/components/PanelShell";

export default function Layout({ children }: LayoutProps<"/klinika">) {
  return <PanelShell panel="klinika">{children}</PanelShell>;
}
