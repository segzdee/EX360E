import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

