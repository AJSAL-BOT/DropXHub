"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Zap,
  Award,
  Clock,
  Grid,
  List,
  X,
  Heart,
  Sparkles,
  Gamepad,
  Laptop,
  Flame,
  ArrowRight,
  ArrowUp,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import AppList from "@/components/app-list"
import TabBar from "@/components/tab-bar"
import { useApps } from "@/hooks/use-apps"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AppType } from "@/types/app"
import FeaturedAppCarousel from "@/components/featured-app-carousel"
import CategoryFilter from "@/components/category-filter"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const { apps, categories, getTopApps, getTrendingApps, searchApps, getAppsByCategory } = useApps()
  const { recentlyViewed, favorites, theme, setTheme } = useUserPreferences()
  const { addNotification } = useNotifications()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "rating">("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [collections, setCollections] = useState<
    { id: string; name: string; icon: React.ReactNode; apps: AppType[] }[]
  >([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Initialize app collections
  useEffect(() => {
    // Create curated collections
    const gameCollection = {
      id: "games",
      name: "Top Games",
      icon: <Gamepad className="h-5 w-5 text-purple-500" />,
      apps: getAppsByCategory("Games").slice(0, 6),
    }

    const productivityCollection = {
      id: "productivity",
      name: "Productivity Tools",
      icon: <Laptop className="h-5 w-5 text-blue-500" />,
      apps: getAppsByCategory("Productivity").slice(0, 6),
    }

    const trendingCollection = {
      id: "trending",
      name: "Trending Now",
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      apps: getTrendingApps(6),
    }

    const newReleasesCollection = {
      id: "new",
      name: "New Releases",
      icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
      apps: [...apps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6),
    }

    setCollections([gameCollection, productivityCollection, trendingCollection, newReleasesCollection])
  }, [apps, getAppsByCategory, getTrendingApps])

  // Get featured apps (those with featured flag or highest rated)
  const featuredApps = apps
    .filter((app) => app.featured || app.rating >= 4.5)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 5)

  // Get top rated apps
  const topRatedApps = getTopApps(activeCategory, 6)

  // Get trending apps
  const trendingApps = getTrendingApps(6)

  // Filter apps based on search query, active category, and other filters
  const getFilteredApps = () => {
    let filtered = searchQuery ? searchApps(searchQuery) : [...apps]

    // Apply category filter
    if (activeCategory) {
      filtered = filtered.filter((app) => app.categories?.includes(activeCategory))
    }

    // Apply featured filter
    if (featuredOnly) {
      filtered = filtered.filter((app) => app.featured)
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    return filtered
  }

  const filteredApps = getFilteredApps()

  // Get recently viewed apps
  const recentApps = recentlyViewed
    .map((id) => apps.find((app) => app.id === id))
    .filter((app) => app !== undefined) as AppType[]

  // Get favorite apps
  const favoriteApps = favorites
    .map((id) => apps.find((app) => app.id === id))
    .filter((app) => app !== undefined) as AppType[]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleCategorySelect = (category: string | null) => {
    setActiveCategory(category)

    // Show notification when selecting a category
    if (category) {
      addNotification({
        title: `${category} Category`,
        message: `Browsing ${category} apps and games`,
        type: "info",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md pt-4 pb-2 z-10 border-b shadow-sm">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              DropX Hub
            </motion.h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                <span className="sr-only">Toggle view</span>
                {viewMode === "grid" ? <Grid className="h-5 w-5" /> : <List className="h-5 w-5" />}
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                className="relative mb-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search apps..."
                  className="pl-10 pr-10 border-primary/20 focus-visible:ring-primary/30"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="space-y-6 py-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-[250px]" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
              </div>
            </div>
          </div>
        ) : !searchQuery ? (
          <>
            <motion.section
              className="my-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" /> Featured Apps
              </h2>
              <FeaturedAppCarousel apps={featuredApps} />
            </motion.section>

            <motion.div
              className="my-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="top" className="data-[state=active]:bg-primary/10">
                    <Award className="mr-2 h-4 w-4" />
                    Top Rated
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="data-[state=active]:bg-primary/10">
                    <Zap className="mr-2 h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-primary/10">
                    <Heart className="mr-2 h-4 w-4" />
                    Saved
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
                    <TabsContent value="all" className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">All Apps</h2>
                      <AppList apps={filteredApps} viewMode={viewMode} />
                    </TabsContent>

                    <TabsContent value="top" className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">Top Rated Apps</h2>
                      <AppList apps={topRatedApps} viewMode={viewMode} />
                    </TabsContent>

                    <TabsContent value="trending" className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">Trending Apps</h2>
                      <AppList apps={trendingApps} viewMode={viewMode} />
                    </TabsContent>

                    <TabsContent value="favorites" className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">Saved Apps</h2>
                      {favoriteApps.length > 0 ? (
                        <AppList apps={favoriteApps} viewMode={viewMode} />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No saved apps yet</h3>
                          <p className="text-muted-foreground max-w-sm">
                            Save your favorite apps by clicking the bookmark icon on any app detail page
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>

            {/* App Collections */}
            <motion.section
              className="my-8 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {collections.map((collection, index) => (
                <div key={collection.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center">
                      {collection.icon}
                      <span className="ml-2">{collection.name}</span>
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => {
                        setActiveTab("all")
                        setFilterCategory(
                          collection.id === "games"
                            ? "Games"
                            : collection.id === "productivity"
                              ? "Productivity"
                              : collection.id === "trending"
                                ? null
                                : null,
                        )
                        setSortBy(
                          collection.id === "trending" ? "downloads" : collection.id === "new" ? "date" : "rating",
                        )
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    >
                      View all <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <ScrollArea className="w-full whitespace-nowrap pb-4">
                    <div className="flex space-x-4">
                      {collection.apps.map((app) => (
                        <motion.div
                          key={app.id}
                          className="w-[180px] flex-shrink-0"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Card className="overflow-hidden hover:shadow-md transition-shadow card-hover">
                            <div className="aspect-square overflow-hidden bg-muted">
                              <img
                                src={app.logo || "/placeholder.svg"}
                                alt={app.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold line-clamp-1">{app.name}</h3>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                                  <span className="text-sm">{app.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{app.description}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ))}
            </motion.section>

            {recentApps.length > 0 && (
              <motion.section
                className="my-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" /> Recently Viewed
                </h2>
                <AppList apps={recentApps.slice(0, 6)} viewMode={viewMode} />
              </motion.section>
            )}
          </>
        ) : (
          <motion.div className="my-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <Badge variant="outline">{filteredApps.length} apps found</Badge>
            </div>
            {filteredApps.length > 0 ? (
              <AppList apps={filteredApps} viewMode={viewMode} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground max-w-sm">
                  We couldn't find any apps matching "{searchQuery}". Try a different search term or browse our
                  categories.
                </p>
                <Button variant="outline" className="mt-4" onClick={clearSearch}>
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <TabBar activeTab="home" />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.div
            className="fixed bottom-20 right-4 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Button size="icon" className="rounded-full shadow-lg bg-primary hover:bg-primary/90" onClick={scrollToTop}>
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

