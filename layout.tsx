import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'EXTRASTAFF360 - The simplest way to manage your workforce',
  description: 'Streamline your workforce management with EXTRASTAFF360',
  icons: {
    icon: [
      {
        url: '/images/favicon.ico',
        sizes: 'any',
      }
    ]
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preload"
          href="/logo.svg"
          as="image"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          href="/google.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}