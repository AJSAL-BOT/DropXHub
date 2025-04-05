"use client"

import { useEffect } from "react"

export function SpeedInsights() {
  useEffect(() => {
    // This is where you would initialize performance monitoring
    // For example, with Vercel Analytics:
    // if (typeof window.va === 'function') {
    //   window.va('event', 'page_view')
    // }

    // For now, we'll just log performance metrics to console
    if (typeof window !== "undefined" && "performance" in window) {
      // Log navigation timing
      const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      if (navigationTiming) {
        console.log("Page load time:", navigationTiming.loadEventEnd - navigationTiming.startTime, "ms")
      }

      // Log largest contentful paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log("Largest Contentful Paint:", lastEntry.startTime, "ms")
      })

      observer.observe({ type: "largest-contentful-paint", buffered: true })

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return null
}

