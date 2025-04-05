"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface UserPreferencesContextType {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  recentlyViewed: string[]
  addToRecentlyViewed: (appId: string) => void
  clearRecentlyViewed: () => void
  favorites: string[]
  toggleFavorite: (appId: string) => void
  isFavorite: (appId: string) => boolean
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Load preferences from localStorage
    const storedTheme = localStorage.getItem("dropx_hub_theme")
    const storedRecentlyViewed = localStorage.getItem("dropx_hub_recently_viewed")
    const storedFavorites = localStorage.getItem("dropx_hub_favorites")

    if (storedTheme) {
      setTheme(storedTheme as "light" | "dark" | "system")
    }

    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed))
    }

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("dropx_hub_theme", newTheme)
  }

  const addToRecentlyViewed = (appId: string) => {
    setRecentlyViewed((prev) => {
      // Remove the app if it's already in the list
      const filtered = prev.filter((id) => id !== appId)
      // Add the app to the beginning of the list
      const updated = [appId, ...filtered].slice(0, 10) // Keep only the 10 most recent
      localStorage.setItem("dropx_hub_recently_viewed", JSON.stringify(updated))
      return updated
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem("dropx_hub_recently_viewed")
  }

  const toggleFavorite = (appId: string) => {
    setFavorites((prev) => {
      let updated
      if (prev.includes(appId)) {
        // Remove from favorites
        updated = prev.filter((id) => id !== appId)
      } else {
        // Add to favorites
        updated = [...prev, appId]
      }
      localStorage.setItem("dropx_hub_favorites", JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (appId: string) => {
    return favorites.includes(appId)
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        theme,
        setTheme: updateTheme,
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
  }
  return context
}

