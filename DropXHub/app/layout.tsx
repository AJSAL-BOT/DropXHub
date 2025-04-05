import type React from "react"
import { AppsProvider } from "@/hooks/use-apps"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui-toast"
import { UserPreferencesProvider } from "@/hooks/use-user-preferences"
import { NotificationsProvider } from "@/hooks/use-notifications"
import { Analytics } from "@/components/analytics"
import { SpeedInsights } from "@/components/speed-insights"
import { AppProgressBar } from "@/components/app-progress-bar"
import { Suspense } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "DropX Hub",
  description: "Your ultimate destination for discovering amazing apps",
  keywords: "app store, applications, mobile apps, software, downloads, games",
  authors: [{ name: "DropX Hub Team" }],
  creator: "DropX Hub",
  publisher: "DropX Hub",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://dropxhub.vercel.app"),
  openGraph: {
    title: "DropX Hub - Your Ultimate App Store",
    description: "Discover amazing apps for all your needs",
    url: "https://dropxhub.vercel.app",
    siteName: "DropX Hub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DropX Hub - Your Ultimate App Store",
    description: "Discover amazing apps for all your needs",
    creator: "@dropxhub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserPreferencesProvider>
            <NotificationsProvider>
              <AppsProvider>
                <AppProgressBar />
                <Suspense fallback={null}>
                  {children}
                  <Toaster />
                </Suspense>
                <Analytics />
                <SpeedInsights />
              </AppsProvider>
            </NotificationsProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'