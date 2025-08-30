import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import KVKKConsent from '@/components/layout/kvkk-consent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RAVENKART - Dijital Kartvizit Platformu',
  description: 'Dijital kartvizitinizi olu_turun ve payla_1n. QR kod, NFC teknolojisi ile modern i_ a1n1z1 geni_letin.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
        <KVKKConsent />
      </body>
    </html>
  )
}