import type { Metadata, Viewport } from "next";
import { MobileShell } from "./MobileShell";
import "./mobile.css";

export const metadata: Metadata = {
  title: { default: "MEDIS ilova", template: "%s · MEDIS ilova" },
  description: "MEDIS bemor ilovasi: retsept, dori eslatmasi, bilaguzuk, apteka, navbat va SOS",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function Layout({ children }: LayoutProps<"/mobile">) {
  return <MobileShell>{children}</MobileShell>;
}
