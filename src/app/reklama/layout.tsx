import { PanelShell } from "@/components/PanelShell";

export default function Layout({ children }: LayoutProps<"/reklama">) {
  return <PanelShell panel="reklama">{children}</PanelShell>;
}
