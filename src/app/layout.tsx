import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '../components/nav'
import Footer from '../components/footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Jeff Wilcox',
    template: '%s | Jeff Wilcox',
  },
  description: 'Jeff Wilcox is a Principal Manager at Microsoft serving as the director of the Microsoft Open Source Programs Office. Jeff lives in Seattle.',
  openGraph: {
    title: 'Jeff Wilcox',
    description: 'Jeff Wilcox is a Principal Manager at Microsoft serving as the director of the Microsoft Open Source Programs Office. Jeff lives in Seattle.',
    url: baseUrl,
    siteName: 'Jeff Wilcox',
    locale: 'en_US',
    type: 'website',
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
}

const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-3xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          {/*
          <Analytics />
          <SpeedInsights />
          */}
        </main>
      </body>
    </html>
  )
}
