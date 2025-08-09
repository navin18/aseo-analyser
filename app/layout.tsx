import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://assets.vercel.com/raw/upload/v1587845599/fonts/geist-sans/geist-sans.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.vercel.com/raw/upload/v1587845599/fonts/geist-mono/geist-mono.css"
        />
        <style>{`
:root {
  --font-sans: 'Geist Sans', sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
        `}</style>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
