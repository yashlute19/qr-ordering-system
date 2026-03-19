import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Cherry & Cream — Restaurant System",
  description: "A complete restaurant management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${lora.variable} font-display antialiased bg-background-light min-h-screen text-ink`}
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
