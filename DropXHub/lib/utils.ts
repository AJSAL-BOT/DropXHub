import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown date"

  const date = new Date(dateString)

  // Check if the date is valid
  if (isNaN(date.getTime())) return "Invalid date"

  // Get today's date
  const today = new Date()

  // Check if the date is today
  if (date.toDateString() === today.toDateString()) {
    return "Today"
  }

  // Check if the date is yesterday
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  }

  // Check if the date is within the last week
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  if (date > lastWeek) {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" }
    return date.toLocaleDateString(undefined, options)
  }

  // For dates older than a week but in the current year
  if (date.getFullYear() === today.getFullYear()) {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }

  // For dates in previous years
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  return date.toLocaleDateString(undefined, options)
}

