import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "{HOYR} - Kiyim Do'koni Boshqaruv Tizimi",
    description: "Kichik va o'rta kiyim do'konlari uchun professional SaaS boshqaruv dasturi",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uz" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} bg-[#09090b] text-white antialiased`} style={{ fontFamily: 'var(--font-inter), sans-serif' }} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
