"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Star,
  Share2,
  Bookmark,
  BookmarkCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield,
  Info,
  Smartphone,
  Award,
  Zap,
  Calendar,
  AlertTriangle,
  FileText,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApps } from "@/hooks/use-apps"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { useToast } from "@/hooks/use-toast"
import AppScreenshots from "@/components/app-screenshots"
import AppReviews from "@/components/app-reviews"
import { formatDate } from "@/lib/utils"
import RelatedApps from "@/components/related-apps"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { QRCode } from "react-qrcode-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AppDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getAppById, incrementAppViews, incrementAppDownloads, getRelatedApps } = useApps()
  const { addToRecentlyViewed, toggleFavorite, isFavorite } = useUserPreferences()

  const app = getAppById(params.id as string)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [relatedApps, setRelatedApps] = useState<any[]>([])
  const [showDownloadToast, setShowDownloadToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showQRCode, setShowQRCode] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Use a ref to track if the view has already been counted
  const viewCounted = useRef(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (app && !viewCounted.current) {
      // Record view only once per session
      incrementAppViews(app.id)
      viewCounted.current = true

      // Add to recently viewed
      addToRecentlyViewed(app.id)

      // Check if app is in favorites
      setIsBookmarked(isFavorite(app.id))

      // Get related apps
      const related = getRelatedApps(app.id, 4)
      setRelatedApps(related)
    }
  }, [app, incrementAppViews, addToRecentlyViewed, isFavorite, getRelatedApps])

  const handleToggleFavorite = () => {
    if (app) {
      toggleFavorite(app.id)
      setIsBookmarked(!isBookmarked)
      toast({
        title: isBookmarked ? "Removed from favorites" : "Added to favorites",
        description: isBookmarked
          ? `${app.name} has been removed from your favorites`
          : `${app.name} has been added to your favorites`,
      })
    }
  }

  const handleShare = async () => {
    setShowShareOptions(!showShareOptions)
  }

  const shareVia = async (method: "copy" | "qr" | "native") => {
    if (!app) return

    if (method === "qr") {
      setShowQRCode(true)
      return
    }

    if (method === "native" && navigator.share) {
      try {
        await navigator.share({
          title: app.name,
          text: `Check out ${app.name} on DropX Hub!`,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copy
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied to clipboard",
          description: "You can now share it with others",
        })
      }
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied to clipboard",
        description: "You can now share it with others",
      })
    }

    setShowShareOptions(false)
  }

  const handleDownload = () => {
    if (app) {
      incrementAppDownloads(app.id)

      // Open the exact link in a new tab
      window.open(app.downloadLink, "_blank", "noopener,noreferrer")

      // Show download toast
      if (!showDownloadToast) {
        setShowDownloadToast(true)
        toast({
          title: "Download started",
          description: `${app.name} is being downloaded`,
        })

        // Reset toast flag after a delay
        setTimeout(() => setShowDownloadToast(false), 3000)
      }
    }
  }

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!app?.reviews || app.reviews.length === 0) return [0, 0, 0, 0, 0]

    const distribution = [0, 0, 0, 0, 0]
    app.reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })

    return distribution
  }

  const ratingDistribution = app ? getRatingDistribution() : [0, 0, 0, 0, 0]
  const totalReviews = app?.reviews?.length || 0

  if (!app) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">App not found</h1>
          <p className="text-muted-foreground mb-6">The app you're looking for doesn't exist or has been removed</p>
          <Button onClick={() => router.push("/")} className="bg-gradient-to-r from-primary to-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading app details...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container max-w-4xl mx-auto px-4 py-6 pb-20"
    >
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-6 group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-32 w-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 shadow-lg relative group"
        >
          <img
            src={app.logo || "/placeholder.svg"}
            alt={app.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          {app.featured && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-bl-md">
              <Award className="h-3 w-3" />
            </div>
          )}
        </motion.div>

        <div className="flex-1">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-start justify-between gap-2 mb-2"
          >
            <h1 className="text-3xl font-bold">{app.name}</h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleShare} className="relative">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this app</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute z-50 bg-popover border shadow-lg rounded-md p-2 mt-2 right-4"
                    style={{ top: "6rem" }}
                  >
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" size="sm" className="justify-start" onClick={() => shareVia("copy")}>
                        <FileText className="h-4 w-4 mr-2" /> Copy link
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start" onClick={() => shareVia("qr")}>
                        <Code className="h-4 w-4 mr-2" /> QR Code
                      </Button>
                      {navigator.share && (
                        <Button variant="ghost" size="sm" className="justify-start" onClick={() => shareVia("native")}>
                          <Share2 className="h-4 w-4 mr-2" /> Share via...
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleToggleFavorite}
                      className={isBookmarked ? "border-primary/30 bg-primary/5" : ""}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      <span className="sr-only">{isBookmarked ? "Remove from favorites" : "Add to favorites"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isBookmarked ? "Remove from favorites" : "Add to favorites"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4"
          >
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Version {app.version}
            </p>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span>{app.rating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({app.reviews?.length || 0})</span>
            </div>
            <p className="text-muted-foreground flex items-center">
              <Download className="h-4 w-4 mr-1" />
              {app.downloads.toLocaleString()} downloads
            </p>
            <p className="text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated {formatDate(app.updatedAt)}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {app.categories?.map((category, index) => (
              <motion.div
                key={category}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Badge variant="secondary" className="bg-secondary/70 hover:bg-secondary transition-colors">
                  {category}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <Button
              className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md transition-all hover:shadow-lg"
              onClick={handleDownload}
            >
              {app.downloadLink.includes("http") ? (
                <>
                  Open App <ExternalLink className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Download <Download className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1 sm:flex-none border-primary/20 hover:bg-primary/5 transition-colors"
              onClick={handleToggleFavorite}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="mr-2 h-4 w-4 text-primary" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="w-full grid grid-cols-3 mb-2">
                <TabsTrigger value="description" className="data-[state=active]:bg-primary/10">
                  Description
                </TabsTrigger>
                <TabsTrigger value="screenshots" className="data-[state=active]:bg-primary/10">
                  Screenshots
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-primary/10">
                  Reviews
                  <span className="ml-1 text-xs">({app.reviews?.length || 0})</span>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="description" className="mt-4">
                    <Card className="p-4 shadow-sm border-primary/10">
                      <div className="prose max-w-none dark:prose-invert">
                        <div
                          className={`${!showFullDescription && app.description.length > 300 ? "line-clamp-5" : ""}`}
                        >
                          <p className="whitespace-pre-line">{app.description}</p>
                        </div>

                        {app.description.length > 300 && (
                          <Button
                            variant="ghost"
                            className="flex items-center mt-2 p-0 h-auto text-primary"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                          >
                            {showFullDescription ? (
                              <>
                                Show less <ChevronUp className="ml-1 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Read more <ChevronDown className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        )}

                        {/* App details section */}
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                          {app.size && (
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Size</div>
                                <div className="text-muted-foreground">{app.size}</div>
                              </div>
                            </div>
                          )}

                          {app.requirements && (
                            <div className="flex items-center">
                              <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Requirements</div>
                                <div className="text-muted-foreground">{app.requirements}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {app.permissions && app.permissions.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center mb-2">
                              <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div className="font-medium">Permissions</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {app.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.versionHistory && app.versionHistory.length > 0 && (
                          <div className="mt-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="version-history">
                                <AccordionTrigger className="text-lg font-semibold">What's New</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4">
                                    {app.versionHistory.map((version, index) => (
                                      <div key={index}>
                                        <div className="flex justify-between items-center">
                                          <h4 className="font-medium">Version {version.version}</h4>
                                          <span className="text-sm text-muted-foreground">
                                            {formatDate(version.date)}
                                          </span>
                                        </div>
                                        <p className="text-sm mt-1">{version.changes}</p>
                                        {index < app.versionHistory.length - 1 && <Separator className="my-2" />}
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        )}

                        {app.developer && (
                          <div className="mt-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="developer-info">
                                <AccordionTrigger className="text-lg font-semibold">
                                  Developer Information
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-12 w-12 border">
                                      <AvatarImage
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.developer.name)}&background=random`}
                                      />
                                      <AvatarFallback>{app.developer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">{app.developer.name}</h3>
                                      <p className="text-sm text-muted-foreground">Verified Developer</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    {app.developer.website && (
                                      <p>
                                        <strong>Website:</strong>{" "}
                                        <a
                                          href={app.developer.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline flex items-center"
                                        >
                                          {app.developer.website.replace(/^https?:\/\//, "")}
                                          <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                      </p>
                                    )}
                                    {app.developer.email && (
                                      <p>
                                        <strong>Email:</strong>{" "}
                                        <a
                                          href={`mailto:${app.developer.email}`}
                                          className="text-primary hover:underline"
                                        >
                                          {app.developer.email}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="screenshots" className="mt-4">
                    <Card className="p-4 shadow-sm border-primary/10">
                      <AppScreenshots screenshots={app.screenshots || []} />
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-4">
                    <Card className="p-4 shadow-sm border-primary/10">
                      {totalReviews > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-4xl font-bold">{app.rating.toFixed(1)}</div>
                              <div className="flex items-center justify-center mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= Math.round(app.rating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                              </div>
                            </div>

                            <div className="flex-1">
                              {[5, 4, 3, 2, 1].map((rating) => {
                                const count = ratingDistribution[rating - 1]
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                                return (
                                  <div key={rating} className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center w-10">
                                      <span>{rating}</span>
                                      <Star className="h-3 w-3 ml-1 text-muted-foreground" />
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                    <span className="text-xs text-muted-foreground w-8">{count}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <Separator />
                        </div>
                      )}

                      <AppReviews appId={app.id} reviews={app.reviews || []} />
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </motion.div>

          {relatedApps.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" /> Similar Apps
              </h2>
              <RelatedApps apps={relatedApps} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* QR Code Dialog */}
      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-background p-6 rounded-lg shadow-xl max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">Scan to download</h3>
              <div className="flex justify-center mb-4">
                <QRCode
                  value={window.location.href}
                  size={200}
                  logoImage={app.logo || "/placeholder.svg"}
                  logoWidth={50}
                  logoHeight={50}
                  qrStyle="dots"
                  eyeRadius={5}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Scan this QR code to download {app.name} on another device
              </p>
              <Button variant="outline" className="w-full" onClick={() => setShowQRCode(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

