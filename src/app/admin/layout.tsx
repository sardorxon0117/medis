import { PanelShell } from "@/components/PanelShell";

export default function Layout({ children }: LayoutProps<"/admin">) {
  return <PanelShell panel="admin">{children}</PanelShell>;
}
