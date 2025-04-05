"use client"

import Link from "next/link"
import { Home, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabBarProps {
  activeTab: "home" | "creator"
}

export default function TabBar({ activeTab }: TabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="container max-w-4xl mx-auto flex items-center justify-around">
        <Link
          href="/"
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-3",
            activeTab === "home" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/creator"
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-3",
            activeTab === "creator" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Creator</span>
        </Link>
      </div>
    </div>
  )
}

