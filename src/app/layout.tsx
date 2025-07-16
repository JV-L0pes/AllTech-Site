import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AllTech Digital - Inovação que respeita e conecta',
  description: 'Oferecemos soluções completas e personalizadas em implementação de software, treinamentos Microsoft, cloud service e IA.',
  keywords: 'tecnologia, software, microsoft, cloud, inteligência artificial, treinamentos, implementação, AllTech Digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}