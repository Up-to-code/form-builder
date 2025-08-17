import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import type React from "react";
import { ClerkProvider } from "@clerk/nextjs";
const cairo = Cairo({ subsets: ["latin" , "arabic"] });

export const metadata: Metadata = {
  title: "Crop Studio - Protect Your Privacy, Share What Matters",
  description: "Advanced screen sharing and workflow optimization tool",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${cairo.className} bg-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

import "./globals.css";
