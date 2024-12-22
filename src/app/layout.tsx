import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PostHogProvider from "@/components/PostHogProvider";
import { UserProvider } from '../providers/UserProvider';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "QuizMe",
  description: "Test your knowledge of any material with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PostHogProvider />
          <Navbar />
          {children}
          <Footer />
        </body>
        </html>
      </UserProvider>
    </ClerkProvider>
  );
}
  