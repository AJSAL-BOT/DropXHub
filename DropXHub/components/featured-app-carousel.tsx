"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { AppType } from "@/types/app"
import Link from "next/link"

interface FeaturedAppCarouselProps {
  apps: AppType[]
}

export default function FeaturedAppCarousel({ apps }: FeaturedAppCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    if (apps.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % apps.length)
  }

  const prevSlide = () => {
    if (apps.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + apps.length) % apps.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    // Pause autoplay briefly when manually changing slides
    setIsAutoPlaying(false)
  }

  // Setup autoplay
  useEffect(() => {
    // Clear any existing interval
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }

    // Only set up autoplay if there are multiple apps and autoplay is enabled
    if (isAutoPlaying && apps.length > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    // Restart autoplay after 5 seconds of manual interaction
    if (!isAutoPlaying) {
      const timer = setTimeout(() => {
        setIsAutoPlaying(true)
      }, 5000)

      return () => clearTimeout(timer)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, apps.length])

  if (apps.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {apps.map((app) => (
            <Link href={`/app/${app.id}`} key={app.id} className="w-full flex-shrink-0">
              <Card className="relative overflow-hidden">
                <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted">
                  {app.screenshots && app.screenshots.length > 0 ? (
                    <img
                      src={app.screenshots[0] || "/placeholder.svg"}
                      alt={app.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
                      <img src={app.logo || "/placeholder.svg"} alt={app.name} className="w-1/3 h-1/3 object-contain" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-background/20 backdrop-blur-sm">
                        <img
                          src={app.logo || "/placeholder.svg"}
                          alt={app.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{app.name}</h3>
                        <p className="text-sm text-white/80">{app.categories?.[0] || "Featured App"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation arrows - only show if there are multiple apps */}
      {apps.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
            onClick={() => {
              prevSlide()
              setIsAutoPlaying(false)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
            onClick={() => {
              nextSlide()
              setIsAutoPlaying(false)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-2 left-0 right-0">
            <div className="flex items-center justify-center gap-1">
              {apps.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/50"
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

