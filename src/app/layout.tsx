import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AllTech Digital - Inovação que respeita e conecta',
  description: 'Cansado de investir em tecnologia sem ver resultados? Oferecemos soluções completas e personalizadas em implementação de software, treinamentos Microsoft, cloud service e IA.',
  keywords: 'tecnologia, software, microsoft, cloud, inteligência artificial, treinamentos, implementação, AllTech Digital',
  authors: [{ name: 'AllTech Digital' }],
  creator: 'AllTech Digital',
  publisher: 'AllTech Digital',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://alltechdigital.com',
    title: 'AllTech Digital - Inovação que respeita e conecta',
    description: 'Soluções completas e personalizadas em tecnologia para empresas que desejam investir de forma inteligente.',
    siteName: 'AllTech Digital',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AllTech Digital - Inovação que respeita e conecta',
    description: 'Soluções completas e personalizadas em tecnologia para empresas que desejam investir de forma inteligente.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}