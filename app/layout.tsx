import type { Metadata } from "next";
import { Montserrat, Fira_Code } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";
import LoadingScreen from "@/components/LoadingScreen";

// NOTE: Fonts: -----------------------------------------------------------------
const montserratFont = Montserrat({
  variable: "--montserrat",
  weight: ["400", "500", "700", "900"],
});

const firaCodeFont = Fira_Code({
  variable: "--fira-code",
  weight: ["600", "700"],
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
        className={`${montserratFont.variable} ${firaCodeFont.variable} antialiased`}
      >
        <GlobalProvider>
          {/* Loading screen */}
          <LoadingScreen />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
