import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Link from "next/link";
import { Navbar } from "@/components/custom-ui/Navbar";
import { Toaster } from "sonner";
import { UnregisterStaleServiceWorkers } from "@/components/UnregisterStaleServiceWorkers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "William's Website",
  description: "A collection of William's projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Known issue: ThemeProvider causes hydration warning for hmtl
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          inter.variable,
          "min-h-screen font-sans antialiased overflow-hidden overflow-y-auto",
        )}
      >
        <UnregisterStaleServiceWorkers />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex flex-col w-screen items-center justify-center">
            <Link href="/">
              <p className="md:text-4xl text-3xl pt-5">WilliamCWX</p>
            </Link>
            <Navbar />
            {children}
          </main>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
