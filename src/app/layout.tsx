import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { config } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: config.app.siteName,
    template: `%s | ${config.app.siteName}`,
  },
  description: "Master application for Cognitor CMS - Dynamic content management and publishing",
  metadataBase: new URL(config.app.siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.app.siteUrl,
    siteName: config.app.siteName,
    title: config.app.siteName,
    description: "Master application for Cognitor CMS - Dynamic content management and publishing",
  },
  twitter: {
    card: "summary_large_image",
    title: config.app.siteName,
    description: "Master application for Cognitor CMS - Dynamic content management and publishing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
