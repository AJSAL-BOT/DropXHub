"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"

export function AppProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathRef = useRef(pathname)
  const prevSearchParamsRef = useRef(searchParams)

  // Configure NProgress only once
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      easing: "ease",
      speed: 400,
      minimum: 0.1,
      trickleSpeed: 200,
    })

    return () => {
      NProgress.done()
    }
  }, [])

  // Handle route changes
  useEffect(() => {
    // Only trigger progress bar when pathname or searchParams actually change
    const searchParamsString = searchParams.toString()
    const prevSearchParamsString = prevSearchParamsRef.current.toString()

    if (pathname !== prevPathRef.current || searchParamsString !== prevSearchParamsString) {
      // Start the progress bar
      NProgress.start()

      // Complete the progress bar after a delay
      const timer = setTimeout(() => {
        NProgress.done()
      }, 500)

      // Update refs to current values
      prevPathRef.current = pathname
      prevSearchParamsRef.current = searchParams

      return () => {
        clearTimeout(timer)
        NProgress.done()
      }
    }
  }, [pathname, searchParams])

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }
      
      #nprogress .bar {
        background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)));
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
      }
      
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  )
}

