"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // This is where you would typically initialize analytics
    // For example, with Google Analytics:
    // if (typeof window.gtag === 'function') {
    //   window.gtag('config', 'GA-MEASUREMENT-ID', {
    //     page_path: pathname,
    //   })
    // }

    // For now, we'll just log page views to console
    console.log(`Page view: ${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)
  }, [pathname, searchParams])

  return null
}

