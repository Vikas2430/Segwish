import type React from "react"
import "@/app/globals.css"
import { FiltersProvider } from "@/hooks/use-filters"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FiltersProvider>{children}</FiltersProvider>
      </body>
    </html>
  )
}

