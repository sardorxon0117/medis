import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-poppins" });
const nunito = Nunito_Sans({ subsets: ["latin", "cyrillic"], variable: "--font-nunito" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "MEDIS — davolanishdan keyingi nazorat", template: "%s · MEDIS" },
  description: "Bemor, shifokor, klinika, apteka va kuryerni bitta platformada birlashtiruvchi tibbiy ilova.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F7F8" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1626" },
  ],
};

// Saqlangan mavzu va shrift oʻlchamini sahifa chizilishidan oldin qoʻllaymiz (miltillamasligi uchun)
const prefsScript = `try{var t=localStorage.getItem("medis-theme");if(t)document.documentElement.dataset.theme=t;if(localStorage.getItem("medis-size")==="lg")document.documentElement.dataset.size="lg"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={`${poppins.variable} ${nunito.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
