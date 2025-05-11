import type { Metadata } from "next";
import { Montserrat, Limelight } from "next/font/google";
import "./globals.css";

// NOTE: Fonts: -----------------------------------------------------------------
const montserratFont = Montserrat({
  variable: "--montserrat",
  weight: ["400", "500", "700", "900"],
});

const limelightFont = Limelight({
  variable: "--limelight",
  weight: "400",
});

// NOTE: Layout: -----------------------------------------------------------------
export const metadata: Metadata = {
  title: "HamzaVim",
  description:
    "I design and develop fast, responsive, and beautiful websites using Next.js, React, and Tailwind CSS. Let’s turn your vision into reality—together!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserratFont.variable} ${limelightFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
