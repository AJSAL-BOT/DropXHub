"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

interface AppScreenshotsProps {
  screenshots: string[]
  videoUrl?: string
}

export default function AppScreenshots({ screenshots, videoUrl }: AppScreenshotsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-rotate screenshots with pause on hover
  useEffect(() => {
    if (screenshots.length <= 1) return

    const startAutoplay = () => {
      autoplayTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length)
      }, 5000)
    }

    if (!isFullscreen && !isPlaying) {
      startAutoplay()
    }

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
      }
    }
  }, [screenshots.length, currentIndex, isFullscreen, isPlaying])

  // Handle mouse enter/leave for autoplay pause
  const handleMouseEnter = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (screenshots.length > 1 && !isFullscreen && !isPlaying) {
      autoplayTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length)
      }, 5000)
    }
  }

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No screenshots available</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length)
  }

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextImage()
    }

    if (isRightSwipe) {
      prevImage()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative" ref={carouselRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <motion.div
          className="aspect-[9/16] md:aspect-[16/9] bg-muted rounded-md overflow-hidden shadow-inner"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={screenshots[currentIndex] || "/placeholder.svg"}
              alt={`Screenshot ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>

          <div className="absolute bottom-2 left-0 right-0">
            <div className="flex items-center justify-center gap-1">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/50"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 rounded-full opacity-70 hover:opacity-100 shadow-md transition-opacity"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {videoUrl && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 left-2 rounded-full opacity-70 hover:opacity-100 shadow-md transition-opacity bg-primary text-primary-foreground"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}

        {screenshots.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100 shadow-md transition-all hover:scale-110"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100 shadow-md transition-all hover:scale-110"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {screenshots.length > 1 && (
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 pb-2 min-w-max">
            {screenshots.map((screenshot, index) => (
              <motion.button
                key={index}
                className={`relative flex-shrink-0 h-16 w-16 rounded-md overflow-hidden ${
                  index === currentIndex ? "ring-2 ring-primary" : "opacity-70"
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={screenshot || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-screen-lg w-[90vw] h-[90vh] p-0">
          <div
            className="relative w-full h-full flex items-center justify-center bg-black"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={screenshots[currentIndex] || "/placeholder.svg"}
                alt={`Screenshot ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {screenshots.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-4 left-0 right-0">
                  <div className="flex items-center justify-center gap-1">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/50"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      {videoUrl && (
        <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
          <DialogContent className="max-w-screen-lg w-[90vw] p-0 bg-black">
            <div className="aspect-video w-full">
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

