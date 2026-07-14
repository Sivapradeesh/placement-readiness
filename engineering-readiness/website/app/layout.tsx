import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER ?? 'psgmx'
const REPO  = process.env.NEXT_PUBLIC_GITHUB_REPO  ?? 'engineering-readiness'

export const metadata: Metadata = {
  title: {
    default: 'Engineering Readiness Portal — 25MX',
    template: '%s | Engineering Readiness',
  },
  description:
    'Public leaderboard and proof portal for the 25MX Engineering Readiness programme. Track submissions, scores, and attendance across all students and teams.',
  metadataBase: new URL('https://engineering-readiness.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Engineering Readiness Portal',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <Navbar githubOwner={OWNER} githubRepo={REPO} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-gray-800 py-8 text-center text-xs text-gray-600">
          <p>
            MCA Department, PSG College of Technology · 25MX Cohort
          </p>
          <p className="mt-1">
            Placement Rep: Tino Britty J ·{' '}
            <a
              href={`https://github.com/${OWNER}/${REPO}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-gray-400 underline underline-offset-2"
            >
              GitHub Repository
            </a>
          </p>
          <p className="mt-2 text-gray-700">Scores refresh every 60 seconds · No login required</p>
        </footer>
      </body>
    </html>
  )
}
