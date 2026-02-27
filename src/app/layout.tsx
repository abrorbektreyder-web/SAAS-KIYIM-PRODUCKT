import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
        <html lang="uz">
            <body className={`${inter.className} bg-[#09090b] text-white antialiased`}>
                {children}
            </body>
        </html>
    );
}
