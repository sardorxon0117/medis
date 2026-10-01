import { PanelShell } from "@/components/PanelShell";

export default function Layout({ children }: LayoutProps<"/apteka">) {
  return <PanelShell panel="apteka">{children}</PanelShell>;
}
