import type { Metadata } from "next";
import { Pitch } from "./Pitch";
import "./taqdimot.css";

export const metadata: Metadata = {
  title: "Startup taqdimoti",
  description: "MEDIS — davolanishdan keyingi nazorat platformasi taqdimoti",
};

export default function Page() {
  return <Pitch />;
}
