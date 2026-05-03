import type { Metadata } from "next";
import { Asap } from "next/font/google";
import StoreProvider from "../store/StoreProvider";
import PageTransition from "../navigation/PageTransition";
import "./globals.css";

const asap = Asap({
  variable: "--font-asap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patient Registration Suite",
  description: "Full Stack challenge for Light-it company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${asap.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-linear-to-bl from-sky-100 to-indigo-100">
        <StoreProvider>
          <PageTransition>{children}</PageTransition>
        </StoreProvider>
      </body>
    </html>
  );
}
