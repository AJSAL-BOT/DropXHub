"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, Flag, MessageSquare, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useApps } from "@/hooks/use-apps"
import { useToast } from "@/hooks/use-toast"
import type { ReviewType } from "@/types/app"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface AppReviewsProps {
  appId: string
  reviews: ReviewType[]
}

type SortOption = "recent" | "helpful" | "highest" | "lowest"

export default function AppReviews({ appId, reviews }: AppReviewsProps) {
  const { addReview, updateReview } = useApps()
  const { toast } = useToast()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportReviewId, setReportReviewId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmitReview = () => {
    if (!comment.trim() || !username.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name and a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const newReview: ReviewType = {
      id: Date.now().toString(),
      username: username.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
    }

    addReview(appId, newReview)

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })

    setComment("")
    setRating(5)
    setUsername("")
    setIsSubmitting(false)
    setShowReviewForm(false)
  }

  const handleLikeReview = (reviewId: string) => {
    updateReview(appId, reviewId, { likes: (reviews.find((r) => r.id === reviewId)?.likes || 0) + 1 })

    toast({
      title: "Thanks for your feedback",
      description: "You liked this review",
    })
  }

  const handleDislikeReview = (reviewId: string) => {
    updateReview(appId, reviewId, { dislikes: (reviews.find((r) => r.id === reviewId)?.dislikes || 0) + 1 })

    toast({
      title: "Thanks for your feedback",
      description: "You disliked this review",
    })
  }

  const handleReportReview = () => {
    if (reportReviewId && reportReason.trim()) {
      // In a real app, this would send the report to a backend
      toast({
        title: "Review reported",
        description: "Thank you for helping keep our community safe",
      })

      setReportReviewId(null)
      setReportReason("")
    }
  }

  const getSortedAndFilteredReviews = () => {
    let filteredReviews = [...reviews]

    // Apply rating filter
    if (filterRating !== null) {
      filteredReviews = filteredReviews.filter((review) => Math.floor(review.rating) === filterRating)
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        return filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case "helpful":
        return filteredReviews.sort((a, b) => {
          const aHelpfulness = (a.likes || 0) - (a.dislikes || 0)
          const bHelpfulness = (b.likes || 0) - (b.dislikes || 0)
          return bHelpfulness - aHelpfulness
        })
      case "highest":
        return filteredReviews.sort((a, b) => b.rating - a.rating)
      case "lowest":
        return filteredReviews.sort((a, b) => a.rating - b.rating)
      default:
        return filteredReviews
    }
  }

  const sortedReviews = getSortedAndFilteredReviews()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant={showReviewForm ? "secondary" : "default"}
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterRating !== null ? filterRating.toString() : "all"}
            onValueChange={(value) => setFilterRating(value === "all" ? null : Number.parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold">Write a Review</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <Textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="focus-visible:ring-primary"
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-primary/90"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>

            <Separator />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center justify-between">
          <span>{reviews.length === 0 ? "No Reviews Yet" : `Reviews (${reviews.length})`}</span>
          {filterRating !== null && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filterRating} Star{filterRating !== 1 ? "s" : ""}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setFilterRating(null)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Be the first to review this app!</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No reviews match your filter</p>
            <Button variant="outline" className="mt-4" onClick={() => setFilterRating(null)}>
              Clear Filter
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {sortedReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className="border rounded-lg p-4 hover:border-primary/20 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.username)}&background=random`}
                        />
                        <AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.username}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-3">{review.comment}</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 h-8 hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleLikeReview(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.likes || 0}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 h-8 hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleDislikeReview(review.id)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>{review.dislikes || 0}</span>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setReportReviewId(review.id)}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AlertDialog open={!!reportReviewId} onOpenChange={(open) => !open && setReportReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Review</AlertDialogTitle>
            <AlertDialogDescription>
              Please tell us why you're reporting this review. This helps us maintain a respectful community.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Textarea
            placeholder="Reason for reporting..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={3}
            className="mt-2"
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReportReview}>Submit Report</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

