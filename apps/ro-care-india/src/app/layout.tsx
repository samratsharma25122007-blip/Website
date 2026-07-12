import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/providers/Providers";
import { ExperienceLayer } from "@/components/ExperienceLayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RO Care India — Pure Water. Protected Family.",
  description:
    "India's most premium RO service experience. Certified technicians, genuine spare parts, same-day service across 19,000+ PIN codes.",
  openGraph: {
    title: "RO Care India — Pure Water. Protected Family.",
    description:
      "India's most premium RO service experience. Certified technicians, genuine spare parts, same-day service.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8FCFF",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <Providers>
          {/* 3D world sits behind everything, as an enhancement. */}
          <ExperienceLayer />
          {/* DOM baseline — authoritative content, sits above the canvas. */}
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
