import { PanelShell } from "@/components/PanelShell";

export default function Layout({ children }: LayoutProps<"/shifokor">) {
  return <PanelShell panel="shifokor">{children}</PanelShell>;
}
