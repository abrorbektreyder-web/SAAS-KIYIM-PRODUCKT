import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
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
        <html lang="uz">
            <body className={`${inter.className} ${playfair.variable} bg-[#09090b] text-white antialiased`}>
                {children}
            </body>
        </html>
    );
}
