"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  date: string
  link?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "date">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Welcome to DropX Hub!",
    message: "Discover amazing apps and games. Start exploring now!",
    type: "info",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    title: "New App Available",
    message: "Weather Forecast app has been updated to version 2.1.0",
    type: "success",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    link: "/app/1",
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load notifications from localStorage or use sample data
    const storedNotifications = localStorage.getItem("dropx_hub_notifications")

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    } else {
      setNotifications(SAMPLE_NOTIFICATIONS)
      localStorage.setItem("dropx_hub_notifications", JSON.stringify(SAMPLE_NOTIFICATIONS))
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "read" | "date">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      date: new Date().toISOString(),
    }

    setNotifications((prev) => {
      const updated = [newNotification, ...prev]
      localStorage.setItem("dropx_hub_notifications", JSON.stringify(updated))
      return updated
    })

    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      localStorage.setItem("dropx_hub_notifications", JSON.stringify(updated))
      return updated
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }))
      localStorage.setItem("dropx_hub_notifications", JSON.stringify(updated))
      return updated
    })
  }

  const clearNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      localStorage.setItem("dropx_hub_notifications", JSON.stringify(updated))
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.setItem("dropx_hub_notifications", JSON.stringify([]))
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

