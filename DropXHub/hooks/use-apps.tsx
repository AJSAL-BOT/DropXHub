"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { AppType, ReviewType } from "@/types/app"

// Sample data
const sampleApps: AppType[] = [
  {
    id: "1",
    name: "Weather Forecast",
    version: "2.1.0",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Get accurate weather forecasts for any location. Features include hourly and daily forecasts, severe weather alerts, and interactive radar maps. Stay prepared with real-time updates and beautiful visualizations of weather conditions.\n\nKey Features:\n• Real-time weather updates\n• 14-day forecast\n• Severe weather alerts\n• Interactive radar maps\n• Hourly forecasts\n• Weather widgets for your home screen\n• Multiple location tracking",
    downloadLink: "https://example.com/weather-app",
    categories: ["Utilities", "Weather"],
    rating: 4.7,
    reviews: [
      {
        id: "101",
        username: "WeatherFan",
        rating: 5,
        comment: "Best weather app I've used! The radar feature is incredibly accurate.",
        date: "2023-10-15T14:48:00.000Z",
        likes: 12,
        dislikes: 1,
      },
      {
        id: "102",
        username: "TravellerJoe",
        rating: 4,
        comment: "Great for planning trips. Would love to see more international coverage.",
        date: "2023-11-02T09:23:00.000Z",
        likes: 8,
        dislikes: 0,
      },
    ],
    downloads: 25000,
    views: 42000,
    featured: true,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Weather+Forecast",
      "/placeholder.svg?height=1920&width=1080&text=Radar+View",
      "/placeholder.svg?height=1920&width=1080&text=Weekly+Forecast",
    ],
    versionHistory: [
      {
        version: "2.1.0",
        date: "2023-12-01T00:00:00.000Z",
        changes: "Added severe weather alerts and improved radar accuracy.",
      },
      {
        version: "2.0.0",
        date: "2023-09-15T00:00:00.000Z",
        changes: "Major UI overhaul and added 14-day forecast feature.",
      },
    ],
    createdAt: "2023-05-10T00:00:00.000Z",
    updatedAt: "2023-12-01T00:00:00.000Z",
    developer: {
      name: "Weather Tech Inc.",
      website: "https://weathertech.example.com",
      email: "support@weathertech.example.com",
    },
    size: "45 MB",
    requirements: "Android 8.0+ or iOS 13.0+",
    permissions: ["Location", "Storage", "Notifications"],
  },
  {
    id: "2",
    name: "Fitness Tracker",
    version: "3.0.2",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Track your workouts, set fitness goals, and monitor your progress. Includes support for various activities like running, cycling, and weight training. Connect with friends and compete in challenges to stay motivated.\n\nKey Features:\n• Activity tracking for running, cycling, swimming, and more\n• Heart rate monitoring\n• Sleep tracking\n• Calorie counter\n• Workout plans\n• Social challenges\n• Progress reports and analytics",
    downloadLink: "https://example.com/fitness-app",
    categories: ["Health & Fitness", "Lifestyle"],
    rating: 4.5,
    reviews: [
      {
        id: "201",
        username: "FitnessFanatic",
        rating: 5,
        comment: "This app has transformed my workout routine. The social features keep me motivated!",
        date: "2023-11-20T16:30:00.000Z",
        likes: 15,
        dislikes: 2,
      },
      {
        id: "202",
        username: "RunnerGirl",
        rating: 4,
        comment: "Great for tracking runs, but could use more detailed analytics for serious athletes.",
        date: "2023-10-05T08:15:00.000Z",
        likes: 7,
        dislikes: 1,
      },
    ],
    downloads: 18500,
    views: 31000,
    featured: false,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Fitness+Dashboard",
      "/placeholder.svg?height=1920&width=1080&text=Activity+Tracking",
      "/placeholder.svg?height=1920&width=1080&text=Social+Challenges",
    ],
    versionHistory: [
      {
        version: "3.0.2",
        date: "2023-11-10T00:00:00.000Z",
        changes: "Fixed sync issues with certain fitness devices.",
      },
      {
        version: "3.0.0",
        date: "2023-10-01T00:00:00.000Z",
        changes: "Added social challenges and improved activity tracking algorithms.",
      },
    ],
    createdAt: "2023-03-22T00:00:00.000Z",
    updatedAt: "2023-11-10T00:00:00.000Z",
    developer: {
      name: "FitTech Solutions",
      website: "https://fittech.example.com",
      email: "help@fittech.example.com",
    },
    size: "78 MB",
    requirements: "Android 9.0+ or iOS 14.0+",
    permissions: ["Location", "Storage", "Notifications", "Health Data", "Camera"],
  },
  {
    id: "3",
    name: "Recipe Book",
    version: "1.5.3",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Discover and save your favorite recipes. Create shopping lists, plan meals, and follow step-by-step cooking instructions. Perfect for home cooks of all skill levels.\n\nKey Features:\n• Thousands of recipes across all cuisines\n• Step-by-step cooking instructions\n• Meal planning calendar\n• Automatic shopping lists\n• Dietary filters (vegetarian, vegan, gluten-free, etc.)\n• Save and organize favorite recipes\n• Share recipes with friends",
    downloadLink: "https://example.com/recipe-app",
    categories: ["Food & Drink", "Lifestyle"],
    rating: 4.2,
    reviews: [
      {
        id: "301",
        username: "ChefMaster",
        rating: 4,
        comment: "Great collection of recipes. The shopping list feature is super helpful.",
        date: "2023-10-05T11:15:00.000Z",
        likes: 9,
        dislikes: 1,
      },
      {
        id: "302",
        username: "HomeCook",
        rating: 5,
        comment: "I use this app every day! The meal planning feature has saved me so much time.",
        date: "2023-09-18T19:42:00.000Z",
        likes: 11,
        dislikes: 0,
      },
      {
        id: "303",
        username: "FoodLover",
        rating: 3,
        comment: "Good app but needs more international recipes.",
        date: "2023-08-22T14:30:00.000Z",
        likes: 4,
        dislikes: 2,
      },
    ],
    downloads: 12000,
    views: 19500,
    featured: true,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Recipe+Collection",
      "/placeholder.svg?height=1920&width=1080&text=Cooking+Instructions",
      "/placeholder.svg?height=1920&width=1080&text=Meal+Planning",
    ],
    versionHistory: [
      {
        version: "1.5.3",
        date: "2023-09-05T00:00:00.000Z",
        changes: "Added dietary filters and improved search functionality.",
      },
      {
        version: "1.5.0",
        date: "2023-07-20T00:00:00.000Z",
        changes: "Introduced meal planning calendar and nutritional information.",
      },
    ],
    createdAt: "2023-02-15T00:00:00.000Z",
    updatedAt: "2023-09-05T00:00:00.000Z",
    developer: {
      name: "Culinary Apps Inc.",
      website: "https://culinaryapps.example.com",
      email: "support@culinaryapps.example.com",
    },
    size: "62 MB",
    requirements: "Android 7.0+ or iOS 12.0+",
    permissions: ["Storage", "Camera"],
  },
  {
    id: "4",
    name: "Task Manager",
    version: "4.2.1",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Stay organized with this powerful task management app. Create to-do lists, set reminders, and track your productivity. Perfect for personal and team projects.\n\nKey Features:\n• Intuitive task management\n• Project organization\n• Due dates and reminders\n• Team collaboration tools\n• File attachments\n• Progress tracking\n• Calendar integration\n• Dark mode",
    downloadLink: "https://example.com/task-app",
    categories: ["Productivity", "Business"],
    rating: 4.8,
    reviews: [
      {
        id: "401",
        username: "ProductivityGuru",
        rating: 5,
        comment: "This app has completely changed how I manage my work. The interface is intuitive and powerful.",
        date: "2023-11-25T08:30:00.000Z",
        likes: 18,
        dislikes: 0,
      },
      {
        id: "402",
        username: "BusinessOwner",
        rating: 5,
        comment: "Perfect for managing my small business tasks. The team collaboration features are excellent.",
        date: "2023-10-12T15:45:00.000Z",
        likes: 14,
        dislikes: 1,
      },
    ],
    downloads: 30000,
    views: 45000,
    featured: false,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Task+Lists",
      "/placeholder.svg?height=1920&width=1080&text=Calendar+View",
      "/placeholder.svg?height=1920&width=1080&text=Progress+Reports",
    ],
    versionHistory: [
      {
        version: "4.2.1",
        date: "2023-11-15T00:00:00.000Z",
        changes: "Added dark mode and improved notification system.",
      },
      {
        version: "4.2.0",
        date: "2023-10-10T00:00:00.000Z",
        changes: "Introduced team collaboration features and task dependencies.",
      },
    ],
    createdAt: "2022-12-05T00:00:00.000Z",
    updatedAt: "2023-11-15T00:00:00.000Z",
    developer: {
      name: "Productive Software Ltd.",
      website: "https://productive-software.example.com",
      email: "help@productive-software.example.com",
    },
    size: "35 MB",
    requirements: "Android 8.0+ or iOS 13.0+",
    permissions: ["Storage", "Calendar", "Notifications"],
  },
  {
    id: "5",
    name: "Photo Editor",
    version: "2.8.0",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Edit your photos with professional tools. Apply filters, adjust colors, crop images, and add text or stickers. Share your creations directly to social media.\n\nKey Features:\n• Professional editing tools\n• 50+ artistic filters\n• Text and sticker overlays\n• Collage maker\n• Background remover\n• Beauty tools and retouching\n• Direct sharing to social media\n• High-resolution export",
    downloadLink: "https://example.com/photo-app",
    categories: ["Photography", "Social"],
    rating: 4.3,
    reviews: [
      {
        id: "501",
        username: "PhotoEnthusiast",
        rating: 4,
        comment: "Great selection of filters and editing tools. Would love to see more text options.",
        date: "2023-10-12T14:22:00.000Z",
        likes: 6,
        dislikes: 1,
      },
      {
        id: "502",
        username: "CreativeArtist",
        rating: 5,
        comment: "The best photo editor I've used on mobile. Love the collage features!",
        date: "2023-09-30T17:15:00.000Z",
        likes: 10,
        dislikes: 0,
      },
    ],
    downloads: 22000,
    views: 38000,
    featured: true,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Photo+Filters",
      "/placeholder.svg?height=1920&width=1080&text=Text+Editor",
      "/placeholder.svg?height=1920&width=1080&text=Collage+Maker",
    ],
    versionHistory: [
      {
        version: "2.8.0",
        date: "2023-10-05T00:00:00.000Z",
        changes: "Added new filter pack and improved export quality options.",
      },
      {
        version: "2.7.0",
        date: "2023-08-15T00:00:00.000Z",
        changes: "Introduced collage maker and enhanced cropping tools.",
      },
    ],
    createdAt: "2023-01-20T00:00:00.000Z",
    updatedAt: "2023-10-05T00:00:00.000Z",
    developer: {
      name: "Creative Pixels Studio",
      website: "https://creativepixels.example.com",
      email: "support@creativepixels.example.com",
    },
    size: "85 MB",
    requirements: "Android 9.0+ or iOS 13.0+",
    permissions: ["Storage", "Camera", "Photos"],
  },
  {
    id: "6",
    name: "Meditation Guide",
    version: "1.2.4",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Improve your mental wellbeing with guided meditation sessions. Features include sleep stories, breathing exercises, and relaxing sounds. Perfect for beginners and experienced meditators alike.\n\nKey Features:\n• Guided meditation sessions for all levels\n• Sleep stories to help you fall asleep\n• Breathing exercises for stress relief\n• Relaxing sounds and music\n• Daily meditation reminders\n• Progress tracking\n• Offline access to downloaded sessions",
    downloadLink: "https://example.com/meditation-app",
    categories: ["Health & Fitness", "Lifestyle"],
    rating: 4.6,
    reviews: [
      {
        id: "601",
        username: "MindfulMeditator",
        rating: 5,
        comment: "This app has helped me establish a daily meditation practice. The sleep stories are amazing!",
        date: "2023-11-08T21:45:00.000Z",
        likes: 13,
        dislikes: 0,
      },
      {
        id: "602",
        username: "StressFreeLiving",
        rating: 4,
        comment: "Great selection of guided meditations. The breathing exercises have helped reduce my anxiety.",
        date: "2023-10-20T18:30:00.000Z",
        likes: 8,
        dislikes: 1,
      },
    ],
    downloads: 15000,
    views: 27000,
    featured: false,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Meditation+Sessions",
      "/placeholder.svg?height=1920&width=1080&text=Sleep+Stories",
      "/placeholder.svg?height=1920&width=1080&text=Breathing+Exercises",
    ],
    versionHistory: [
      {
        version: "1.2.4",
        date: "2023-11-01T00:00:00.000Z",
        changes: "Added new meditation sessions and improved audio quality.",
      },
      {
        version: "1.2.0",
        date: "2023-09-10T00:00:00.000Z",
        changes: "Introduced sleep stories and daily meditation reminders.",
      },
    ],
    createdAt: "2023-04-05T00:00:00.000Z",
    updatedAt: "2023-11-01T00:00:00.000Z",
    developer: {
      name: "Mindful Apps Co.",
      website: "https://mindfulapps.example.com",
      email: "hello@mindfulapps.example.com",
    },
    size: "120 MB",
    requirements: "Android 8.0+ or iOS 12.0+",
    permissions: ["Storage", "Notifications"],
  },
  {
    id: "7",
    name: "Pixel Dungeon",
    version: "2.3.1",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "Embark on an epic adventure in this retro-style roguelike dungeon crawler. Battle monsters, collect treasures, and discover powerful artifacts as you delve deeper into the mysterious dungeon.\n\nKey Features:\n• Procedurally generated levels for endless replayability\n• Multiple character classes with unique abilities\n• Hundreds of items, weapons, and spells\n• Challenging boss battles\n• Pixel art graphics with modern lighting effects\n• Offline play supported",
    downloadLink: "https://example.com/pixel-dungeon",
    categories: ["Games", "Adventure"],
    rating: 4.8,
    reviews: [
      {
        id: "701",
        username: "GameMaster42",
        rating: 5,
        comment: "One of the best roguelikes I've played on mobile. So much depth and replayability!",
        date: "2023-12-05T14:22:00.000Z",
        likes: 24,
        dislikes: 1,
      },
      {
        id: "702",
        username: "PixelArtFan",
        rating: 5,
        comment: "The pixel art is gorgeous and the gameplay is addictive. Can't stop playing!",
        date: "2023-11-18T09:45:00.000Z",
        likes: 16,
        dislikes: 0,
      },
    ],
    downloads: 45000,
    views: 68000,
    featured: true,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Pixel+Dungeon+Gameplay",
      "/placeholder.svg?height=1920&width=1080&text=Character+Selection",
      "/placeholder.svg?height=1920&width=1080&text=Boss+Battle",
    ],
    versionHistory: [
      {
        version: "2.3.1",
        date: "2023-12-01T00:00:00.000Z",
        changes: "Added new secret boss and fixed rare crash on level 10.",
      },
      {
        version: "2.3.0",
        date: "2023-10-15T00:00:00.000Z",
        changes: "Introduced new Necromancer class and revamped the magic system.",
      },
    ],
    createdAt: "2022-08-10T00:00:00.000Z",
    updatedAt: "2023-12-01T00:00:00.000Z",
    developer: {
      name: "Retro Pixel Studios",
      website: "https://retropixel.example.com",
      email: "support@retropixel.example.com",
    },
    size: "95 MB",
    requirements: "Android 7.0+ or iOS 12.0+",
    permissions: ["Storage"],
  },
  {
    id: "8",
    name: "Code Editor Pro",
    version: "3.5.2",
    logo: "/placeholder.svg?height=512&width=512",
    description:
      "A powerful code editor for developers on the go. Write, edit, and run code in multiple programming languages directly from your mobile device.\n\nKey Features:\n• Support for 40+ programming languages\n• Syntax highlighting and auto-completion\n• Git integration\n• Built-in terminal\n• Code snippets library\n• Split-screen editing\n• Dark and light themes\n• FTP and SFTP support",
    downloadLink: "https://example.com/code-editor-pro",
    categories: ["Productivity", "Developer Tools"],
    rating: 4.7,
    reviews: [
      {
        id: "801",
        username: "DevNinja",
        rating: 5,
        comment: "Finally a mobile code editor that actually works well! The Git integration is seamless.",
        date: "2023-11-30T16:42:00.000Z",
        likes: 31,
        dislikes: 2,
      },
      {
        id: "802",
        username: "MobileCoder",
        rating: 4,
        comment: "Great for quick edits on the go. Would love to see better cloud sync options.",
        date: "2023-10-25T11:18:00.000Z",
        likes: 15,
        dislikes: 1,
      },
    ],
    downloads: 28000,
    views: 42000,
    featured: false,
    screenshots: [
      "/placeholder.svg?height=1920&width=1080&text=Code+Editor+Interface",
      "/placeholder.svg?height=1920&width=1080&text=Terminal+View",
      "/placeholder.svg?height=1920&width=1080&text=Git+Integration",
    ],
    versionHistory: [
      {
        version: "3.5.2",
        date: "2023-11-20T00:00:00.000Z",
        changes: "Added TypeScript 5.0 support and improved auto-completion.",
      },
      {
        version: "3.5.0",
        date: "2023-09-05T00:00:00.000Z",
        changes: "Introduced split-screen editing and enhanced Git workflow.",
      },
    ],
    createdAt: "2022-05-15T00:00:00.000Z",
    updatedAt: "2023-11-20T00:00:00.000Z",
    developer: {
      name: "DevTools Inc.",
      website: "https://devtools.example.com",
      email: "support@devtools.example.com",
    },
    size: "48 MB",
    requirements: "Android 9.0+ or iOS 14.0+",
    permissions: ["Storage", "Internet"],
  },
]

// Initial categories
const initialCategories = [
  "Business",
  "Education",
  "Entertainment",
  "Food & Drink",
  "Games",
  "Health & Fitness",
  "Lifestyle",
  "Music",
  "Photography",
  "Productivity",
  "Social",
  "Utilities",
  "Weather",
  "Developer Tools",
  "Adventure",
]

interface AppsContextType {
  apps: AppType[]
  categories: string[]
  addApp: (app: AppType) => void
  editApp: (app: AppType) => void
  deleteApp: (id: string) => void
  getAppById: (id: string) => AppType | undefined
  addCategory: (category: string) => void
  addReview: (appId: string, review: ReviewType) => void
  updateReview: (appId: string, reviewId: string, updates: Partial<ReviewType>) => void
  incrementAppViews: (appId: string) => void
  incrementAppDownloads: (appId: string) => void
  getRelatedApps: (appId: string, limit?: number) => AppType[]
  getTopApps: (category?: string | null, limit?: number) => AppType[]
  getTrendingApps: (limit?: number) => AppType[]
  searchApps: (query: string) => AppType[]
  getAppsByCategory: (category: string) => AppType[]
}

const AppsContext = createContext<AppsContextType | undefined>(undefined)

export function AppsProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<AppType[]>([])
  const [categories, setCategories] = useState<string[]>(initialCategories)

  useEffect(() => {
    // In a real app, you would fetch from an API or database
    // For now, we'll use the sample data
    const storedApps = localStorage.getItem("dropx_hub_apps")
    const storedCategories = localStorage.getItem("dropx_hub_categories")

    if (storedApps) {
      setApps(JSON.parse(storedApps))
    } else {
      setApps(sampleApps)
      // Save sample apps to localStorage immediately to ensure consistency
      localStorage.setItem("dropx_hub_apps", JSON.stringify(sampleApps))
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      setCategories(initialCategories)
      localStorage.setItem("dropx_hub_categories", JSON.stringify(initialCategories))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever apps change
    if (apps.length > 0) {
      localStorage.setItem("dropx_hub_apps", JSON.stringify(apps))
    }
  }, [apps])

  useEffect(() => {
    // Save to localStorage whenever categories change
    if (categories.length > 0) {
      localStorage.setItem("dropx_hub_categories", JSON.stringify(categories))
    }
  }, [categories])

  const addApp = (app: AppType) => {
    setApps((prevApps) => {
      const newApps = [app, ...prevApps]
      // Force update localStorage immediately for better cross-tab consistency
      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const editApp = (app: AppType) => {
    setApps((prevApps) => {
      const newApps = prevApps.map((a) => (a.id === app.id ? app : a))
      // Force update localStorage immediately
      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const deleteApp = (id: string) => {
    setApps((prevApps) => {
      const newApps = prevApps.filter((a) => a.id !== id)
      // Force update localStorage immediately
      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const getAppById = (id: string) => {
    return apps.find((app) => app.id === id)
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => {
        const newCategories = [...prev, category].sort()
        localStorage.setItem("dropx_hub_categories", JSON.stringify(newCategories))
        return newCategories
      })
    }
  }

  const addReview = (appId: string, review: ReviewType) => {
    setApps((prevApps) => {
      const newApps = prevApps.map((app) => {
        if (app.id === appId) {
          // Add the review
          const newReviews = [...(app.reviews || []), review]

          // Recalculate the average rating
          const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0)
          const newRating = totalRating / newReviews.length

          return {
            ...app,
            reviews: newReviews,
            rating: newRating,
            updatedAt: new Date().toISOString(),
          }
        }
        return app
      })

      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const updateReview = (appId: string, reviewId: string, updates: Partial<ReviewType>) => {
    setApps((prevApps) => {
      const newApps = prevApps.map((app) => {
        if (app.id === appId && app.reviews) {
          const updatedReviews = app.reviews.map((review) =>
            review.id === reviewId ? { ...review, ...updates } : review,
          )

          return {
            ...app,
            reviews: updatedReviews,
          }
        }
        return app
      })

      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const incrementAppViews = (appId: string) => {
    setApps((prevApps) => {
      const newApps = prevApps.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            views: (app.views || 0) + 1,
          }
        }
        return app
      })

      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const incrementAppDownloads = (appId: string) => {
    setApps((prevApps) => {
      const newApps = prevApps.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            downloads: (app.downloads || 0) + 1,
          }
        }
        return app
      })

      localStorage.setItem("dropx_hub_apps", JSON.stringify(newApps))
      return newApps
    })
  }

  const getRelatedApps = (appId: string, limit = 3) => {
    const currentApp = apps.find((app) => app.id === appId)
    if (!currentApp || !currentApp.categories || currentApp.categories.length === 0) {
      return []
    }

    // Find apps with similar categories, excluding the current app
    const relatedApps = apps
      .filter((app) => app.id !== appId)
      .map((app) => {
        // Calculate a relevance score based on category overlap
        const categoryOverlap =
          app.categories?.filter((category) => currentApp.categories?.includes(category)).length || 0

        return {
          ...app,
          relevanceScore: categoryOverlap,
        }
      })
      .filter((app) => app.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore || b.rating - a.rating)
      .slice(0, limit)

    return relatedApps
  }

  const getTopApps = (category?: string | null, limit = 5) => {
    let filteredApps = apps

    if (category) {
      filteredApps = apps.filter((app) => app.categories?.includes(category))
    }

    return filteredApps.sort((a, b) => b.rating - a.rating).slice(0, limit)
  }

  const getTrendingApps = (limit = 5) => {
    // In a real app, this would use more sophisticated metrics
    // For now, we'll use a combination of recent downloads and views
    return apps.sort((a, b) => b.downloads * 0.7 + b.views * 0.3 - (a.downloads * 0.7 + a.views * 0.3)).slice(0, limit)
  }

  const searchApps = (query: string) => {
    if (!query.trim()) return []

    const lowercaseQuery = query.toLowerCase().trim()

    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(lowercaseQuery) ||
        app.description.toLowerCase().includes(lowercaseQuery) ||
        app.categories?.some((category) => category.toLowerCase().includes(lowercaseQuery)),
    )
  }

  const getAppsByCategory = (category: string) => {
    return apps.filter((app) => app.categories?.includes(category))
  }

  return (
    <AppsContext.Provider
      value={{
        apps,
        categories,
        addApp,
        editApp,
        deleteApp,
        getAppById,
        addCategory,
        addReview,
        updateReview,
        incrementAppViews,
        incrementAppDownloads,
        getRelatedApps,
        getTopApps,
        getTrendingApps,
        searchApps,
        getAppsByCategory,
      }}
    >
      {children}
    </AppsContext.Provider>
  )
}

export function useApps() {
  const context = useContext(AppsContext)
  if (context === undefined) {
    throw new Error("useApps must be used within an AppsProvider")
  }
  return context
}

