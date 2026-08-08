import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoTraveller - Premium AI Travel Concierge",
  description: "Your expert AI companion for customized dream journeys, live navigation, and real-time travel insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050814] text-slate-50 font-sans">
        <div className="min-h-screen bg-[#050814] text-slate-100 flex relative overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 md:ml-64 ml-0 min-h-screen overflow-y-auto px-4 md:px-10 py-16 md:py-10 scrollbar-thin">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
