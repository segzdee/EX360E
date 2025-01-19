import '@/styles/globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js Application',
  description: 'A modern Next.js application with best practices',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico'
  },
  openGraph: {
    type: 'website',
    title: 'Next.js Application',
    description: 'A modern Next.js application with best practices',
    siteName: 'Next.js Application'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}