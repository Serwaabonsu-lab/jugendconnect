import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JugendConnect – Die Software für Jugendarbeit",
  description:
    "Dein digitaler Assistent für Programmplanung und Aufgabenverteilung in der Jugendarbeit.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
