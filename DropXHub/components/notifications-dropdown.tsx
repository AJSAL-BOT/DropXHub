"use client"

import { useState } from "react"
import { Bell, Check, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAllNotifications } =
    useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && unreadCount > 0) {
      // Mark all as read when opening the dropdown
      setTimeout(() => {
        markAllAsRead()
      }, 2000)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <div className="h-2 w-2 rounded-full bg-success" />
      case "warning":
        return <div className="h-2 w-2 rounded-full bg-warning" />
      case "error":
        return <div className="h-2 w-2 rounded-full bg-destructive" />
      default:
        return <div className="h-2 w-2 rounded-full bg-primary" />
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="text-base">Notifications</DropdownMenuLabel>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => markAllAsRead()}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark all as read</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => clearAllNotifications()}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear all</span>
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {notifications.length > 0 ? (
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownMenuItem
                      className={`p-4 flex flex-col items-start gap-1 cursor-default ${
                        !notification.read ? "bg-secondary/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(notification.type)}
                          <span className="font-medium">{notification.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-xs text-primary hover:underline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            View details
                          </Link>
                        )}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </motion.div>
                ))}
              </DropdownMenuGroup>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

