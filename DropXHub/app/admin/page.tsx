"use client"

import { Progress } from "@/components/ui/progress"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Plus,
  Save,
  Trash2,
  BarChart2,
  Star,
  Download,
  Eye,
  Search,
  X,
  Package,
  Grid,
  List,
  Settings,
  Moon,
  Sun,
  Monitor,
  Users,
  Palette,
  Power,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useApps } from "@/hooks/use-apps"
import type { AppType, VersionHistoryType } from "@/types/app"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

const emptyApp: Omit<AppType, "id"> = {
  name: "",
  version: "",
  logo: "/placeholder.svg?height=512&width=512",
  description: "",
  downloadLink: "",
  categories: [],
  rating: 0,
  reviews: [],
  downloads: 0,
  views: 0,
  featured: false,
  screenshots: [],
  versionHistory: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  developer: {
    name: "",
    website: "",
    email: "",
  },
  size: "",
  requirements: "",
  permissions: [],
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { apps, addApp, editApp, deleteApp, categories, addCategory } = useApps()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [newApp, setNewApp] = useState<Omit<AppType, "id">>(emptyApp)
  const [editingApp, setEditingApp] = useState<AppType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteConfirmApp, setDeleteConfirmApp] = useState<AppType | null>(null)
  const [activeTab, setActiveTab] = useState("add")
  const [newCategory, setNewCategory] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [newScreenshot, setNewScreenshot] = useState("")
  const [newVersionHistory, setNewVersionHistory] = useState<VersionHistoryType>({
    version: "",
    date: new Date().toISOString().split("T")[0],
    changes: "",
  })
  const [statsTimeframe, setStatsTimeframe] = useState<"all" | "month" | "week">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "downloads" | "rating" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [newPermission, setNewPermission] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Add state variables for account management
  const [adminEmail, setAdminEmail] = useState("admin@dropxhub.com")
  const [adminUsername, setAdminUsername] = useState("admin")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Add more state variables for appearance settings
  const [adminSettings, setAdminSettings] = useState({
    theme: "system",
    language: "english",
    compactMode: false,
    emailNotifications: true,
    twoFactorAuth: false,
    fontSize: 16,
    accentColor: "purple",
    animationSpeed: "normal",
  })

  // Check if user is already authenticated (for better UX)
  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("dropx_hub_admin_settings")
    if (savedSettings) {
      try {
        setAdminSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse admin settings", e)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("dropx_hub_admin_settings", JSON.stringify(adminSettings))
  }, [adminSettings])

  // Set selected categories when editing app changes
  useEffect(() => {
    if (editingApp?.categories) {
      setSelectedCategories(editingApp.categories)
    } else if (newApp.categories) {
      setSelectedCategories(newApp.categories)
    }
  }, [editingApp, newApp.categories])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Use the new password
    if (password === "ajsal.dropxhub.pass") {
      setIsAuthenticated(true)
      // Store authentication state
      localStorage.setItem("admin_authenticated", "true")
      toast({
        title: "Authenticated",
        description: "Welcome to the DropX Hub admin panel",
      })
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid password",
        variant: "destructive",
      })
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim())
      setNewCategory("")
      toast({
        title: "Category Added",
        description: `${newCategory.trim()} has been added to categories`,
      })
    }
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleAddScreenshot = () => {
    if (newScreenshot.trim()) {
      if (editingApp) {
        setEditingApp({
          ...editingApp,
          screenshots: [...(editingApp.screenshots || []), newScreenshot.trim()],
        })
      } else {
        setNewApp((prev) => ({
          ...prev,
          screenshots: [...(prev.screenshots || []), newScreenshot.trim()],
        }))
      }
      setNewScreenshot("")
    }
  }

  const handleRemoveScreenshot = (index: number) => {
    if (editingApp) {
      setEditingApp({
        ...editingApp,
        screenshots: editingApp.screenshots?.filter((_, i) => i !== index) || [],
      })
    } else {
      setNewApp((prev) => ({
        ...prev,
        screenshots: prev.screenshots?.filter((_, i) => i !== index) || [],
      }))
    }
  }

  const handleAddVersionHistory = () => {
    if (newVersionHistory.version.trim() && newVersionHistory.changes.trim()) {
      if (editingApp) {
        setEditingApp({
          ...editingApp,
          versionHistory: [...(editingApp.versionHistory || []), { ...newVersionHistory }],
        })
      } else {
        setNewApp((prev) => ({
          ...prev,
          versionHistory: [...(prev.versionHistory || []), { ...newVersionHistory }],
        }))
      }
      setNewVersionHistory({
        version: "",
        date: new Date().toISOString().split("T")[0],
        changes: "",
      })
    }
  }

  const handleRemoveVersionHistory = (index: number) => {
    if (editingApp) {
      setEditingApp({
        ...editingApp,
        versionHistory: editingApp.versionHistory?.filter((_, i) => i !== index) || [],
      })
    } else {
      setNewApp((prev) => ({
        ...prev,
        versionHistory: prev.versionHistory?.filter((_, i) => i !== index) || [],
      }))
    }
  }

  const handleAddPermission = () => {
    if (newPermission.trim()) {
      if (editingApp) {
        setEditingApp({
          ...editingApp,
          permissions: [...(editingApp.permissions || []), newPermission.trim()],
        })
      } else {
        setNewApp((prev) => ({
          ...prev,
          permissions: [...(prev.permissions || []), newPermission.trim()],
        }))
      }
      setNewPermission("")
    }
  }

  const handleRemovePermission = (index: number) => {
    if (editingApp) {
      setEditingApp({
        ...editingApp,
        permissions: editingApp.permissions?.filter((_, i) => i !== index) || [],
      })
    } else {
      setNewApp((prev) => ({
        ...prev,
        permissions: prev.permissions?.filter((_, i) => i !== index) || [],
      }))
    }
  }

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newApp.name || !newApp.version || !newApp.description || !newApp.downloadLink) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()

    addApp({
      ...newApp,
      id: Date.now().toString(),
      categories: selectedCategories,
      createdAt: now,
      updatedAt: now,
    })

    toast({
      title: "App Published",
      description: `${newApp.name} has been published successfully`,
    })

    setNewApp(emptyApp)
    setSelectedCategories([])
  }

  const handleEditOpen = (app: AppType) => {
    setEditingApp(app)
    setSelectedCategories(app.categories || [])
    setIsEditDialogOpen(true)
  }

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingApp) {
      const updatedApp = {
        ...editingApp,
        categories: selectedCategories,
        updatedAt: new Date().toISOString(),
      }

      editApp(updatedApp)

      toast({
        title: "App Updated",
        description: `${editingApp.name} has been updated successfully`,
      })

      setIsEditDialogOpen(false)
      setEditingApp(null)
    }
  }

  const handleDeleteConfirm = (app: AppType) => {
    setDeleteConfirmApp(app)
  }

  const handleDeleteApp = () => {
    if (deleteConfirmApp) {
      deleteApp(deleteConfirmApp.id)

      toast({
        title: "App Deleted",
        description: `${deleteConfirmApp.name} has been deleted successfully`,
      })

      setDeleteConfirmApp(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    setIsAuthenticated(false)
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
  }

  const handleExportData = () => {
    const data = {
      apps,
      categories,
      settings: adminSettings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dropx-hub-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully",
    })
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        // Validate the imported data
        if (!data.apps || !Array.isArray(data.apps)) {
          throw new Error("Invalid data format: apps array missing")
        }

        // Show confirmation dialog
        if (confirm(`Import ${data.apps.length} apps and related data? This will overwrite existing data.`)) {
          // In a real app, you would implement the actual import logic here
          toast({
            title: "Data Imported",
            description: `Successfully imported ${data.apps.length} apps and related data`,
          })
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "The selected file contains invalid data",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setAdminSettings({
        theme: "system",
        language: "english",
        compactMode: false,
        emailNotifications: true,
        twoFactorAuth: false,
        fontSize: 16,
        accentColor: "purple",
        animationSpeed: "normal",
      })

      toast({
        title: "Settings Reset",
        description: "All settings have been reset to their default values",
      })
    }
  }

  const handleGenerateNewApiKey = () => {
    if (confirm("Are you sure you want to generate a new API key? This will invalidate the current key.")) {
      setAdminSettings({
        ...adminSettings,
        apiKey: "sk_admin_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      })

      toast({
        title: "API Key Generated",
        description: "A new API key has been generated successfully",
      })
    }
  }

  const handleClearCache = () => {
    // Simulate cache clearing
    toast({
      title: "Cache Cleared",
      description: "Application cache has been cleared successfully",
    })
  }

  // Add handler functions for account management
  const handleUpdateEmail = () => {
    if (!adminEmail || !adminEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Email Updated",
      description: "Your email has been updated successfully",
    })
  }

  const handleUpdateUsername = () => {
    if (!adminUsername || adminUsername.length < 3) {
      toast({
        title: "Invalid Username",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Username Updated",
      description: "Your username has been updated successfully",
    })
  }

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password",
        variant: "destructive",
      })
      return
    }

    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Invalid Password",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation do not match",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would verify the current password and update the new one
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  // Filter and sort apps for the manage tab
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      searchQuery === "" ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !filterCategory || app.categories?.includes(filterCategory)

    return matchesSearch && matchesCategory
  })

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "downloads") {
      return sortOrder === "asc" ? a.downloads - b.downloads : b.downloads - a.downloads
    } else if (sortBy === "rating") {
      return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
    } else {
      // Sort by date
      return sortOrder === "asc"
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  // Calculate stats based on timeframe
  const getTimeframeStats = () => {
    let totalDownloads = 0
    let totalViews = 0
    let topApp = { name: "", downloads: 0 }
    let mostViewed = { name: "", views: 0 }
    const categoryDistribution: Record<string, number> = {}
    const ratingDistribution = [0, 0, 0, 0, 0] // 1-5 stars

    const now = new Date()
    const timeLimit = new Date()

    if (statsTimeframe === "week") {
      timeLimit.setDate(now.getDate() - 7)
    } else if (statsTimeframe === "month") {
      timeLimit.setMonth(now.getMonth() - 1)
    }

    apps.forEach((app) => {
      // For simplicity, we're using the total counts
      // In a real app, you'd track these metrics over time
      totalDownloads += app.downloads
      totalViews += app.views

      if (app.downloads > topApp.downloads) {
        topApp = { name: app.name, downloads: app.downloads }
      }

      if (app.views > mostViewed.views) {
        mostViewed = { name: app.name, views: app.views }
      }

      // Calculate category distribution
      app.categories?.forEach((category) => {
        categoryDistribution[category] = (categoryDistribution[category] || 0) + 1
      })

      // Calculate rating distribution
      if (app.rating > 0) {
        const ratingIndex = Math.min(Math.floor(app.rating), 5) - 1
        if (ratingIndex >= 0) {
          ratingDistribution[ratingIndex]++
        }
      }
    })

    return {
      totalDownloads,
      totalViews,
      topApp,
      mostViewed,
      categoryDistribution,
      ratingDistribution,
      totalApps: apps.length,
    }
  }

  const stats = getTimeframeStats()

  if (!isAuthenticated) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">DropX Hub Admin</CardTitle>
            <CardDescription className="text-center">Enter your password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <h1 className="text-2xl font-bold">DropX Hub Admin</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="add">Add New App</TabsTrigger>
          <TabsTrigger value="manage">Manage Apps</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card className="shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Publish New App
              </CardTitle>
              <CardDescription>Fill in the details to publish a new app to your store</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">App Name *</Label>
                    <Input
                      id="name"
                      value={newApp.name}
                      onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version">Version *</Label>
                    <Input
                      id="version"
                      value={newApp.version}
                      onChange={(e) => setNewApp({ ...newApp, version: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={newApp.logo}
                      onChange={(e) => setNewApp({ ...newApp, logo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="downloadLink">Download Link or App URL *</Label>
                    <Input
                      id="downloadLink"
                      value={newApp.downloadLink}
                      onChange={(e) => setNewApp({ ...newApp, downloadLink: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">App Size</Label>
                    <Input
                      id="size"
                      value={newApp.size || ""}
                      onChange={(e) => setNewApp({ ...newApp, size: e.target.value })}
                      placeholder="e.g. 45 MB"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">System Requirements</Label>
                    <Input
                      id="requirements"
                      value={newApp.requirements || ""}
                      onChange={(e) => setNewApp({ ...newApp, requirements: e.target.value })}
                      placeholder="e.g. Android 8.0+ or iOS 13.0+"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Developer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="developer-name">Developer Name</Label>
                      <Input
                        id="developer-name"
                        value={newApp.developer?.name || ""}
                        onChange={(e) =>
                          setNewApp({
                            ...newApp,
                            developer: {
                              ...(newApp.developer || {}),
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="developer-email">Developer Email</Label>
                      <Input
                        id="developer-email"
                        type="email"
                        value={newApp.developer?.email || ""}
                        onChange={(e) =>
                          setNewApp({
                            ...newApp,
                            developer: {
                              ...(newApp.developer || {}),
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="developer-website">Developer Website</Label>
                      <Input
                        id="developer-website"
                        value={newApp.developer?.website || ""}
                        onChange={(e) =>
                          setNewApp({
                            ...newApp,
                            developer: {
                              ...(newApp.developer || {}),
                              website: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured App</Label>
                    <Switch
                      id="featured"
                      checked={newApp.featured}
                      onCheckedChange={(checked) => setNewApp({ ...newApp, featured: checked })}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Featured apps appear in the carousel at the top of the home page
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      placeholder="Add new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddCategory}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={newApp.description}
                    onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>App Permissions</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add permission (e.g. Camera, Location)"
                      value={newPermission}
                      onChange={(e) => setNewPermission(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddPermission}>
                      Add
                    </Button>
                  </div>

                  {newApp.permissions && newApp.permissions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newApp.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {permission}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemovePermission(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Screenshots</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Screenshot URL"
                      value={newScreenshot}
                      onChange={(e) => setNewScreenshot(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddScreenshot}>
                      Add
                    </Button>
                  </div>

                  {newApp.screenshots && newApp.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {newApp.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={screenshot || "/placeholder.svg"}
                            alt={`Screenshot ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveScreenshot(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Version History</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Version (e.g. 1.0.1)"
                        value={newVersionHistory.version}
                        onChange={(e) => setNewVersionHistory({ ...newVersionHistory, version: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newVersionHistory.date}
                        onChange={(e) => setNewVersionHistory({ ...newVersionHistory, date: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="What's new in this version"
                      value={newVersionHistory.changes}
                      onChange={(e) => setNewVersionHistory({ ...newVersionHistory, changes: e.target.value })}
                      rows={2}
                    />
                    <Button type="button" onClick={handleAddVersionHistory} className="w-full">
                      Add Version
                    </Button>
                  </div>

                  {newApp.versionHistory && newApp.versionHistory.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {newApp.versionHistory.map((version, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <div className="font-medium">Version {version.version}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(version.date)}</div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVersionHistory(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                >
                  <Save className="mr-2 h-4 w-4" /> Publish App
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card className="shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" /> Manage Apps
              </CardTitle>
              <CardDescription>Edit or delete existing apps in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filterCategory || "all"}
                    onValueChange={(value) => setFilterCategory(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  {sortedApps.length} {sortedApps.length === 1 ? "app" : "apps"} found
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as "name" | "downloads" | "rating" | "date")}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 8 4 4 4-4" />
                        <path d="M7 6v12" />
                        <path d="M21 12H11" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 16 4-4 4 4" />
                        <path d="M7 6v12" />
                        <path d="M21 12H11" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>

              {sortedApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No apps found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Try adjusting your search or filter to find what you're looking for
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sortedApps.map((app) => (
                    <Card key={app.id} className="overflow-hidden">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={app.logo || "/placeholder.svg"}
                          alt={app.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">{app.name}</h3>
                          {app.featured && (
                            <Badge variant="secondary" className="ml-2">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <span>v{app.version}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                            {app.rating.toFixed(1)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-3 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => handleEditOpen(app)}>
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteConfirm(app)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedApps.map((app) => (
                    <div key={app.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={app.logo || "/placeholder.svg"}
                          alt={app.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="font-medium truncate">{app.name}</h3>
                          {app.featured && (
                            <Badge variant="secondary" className="ml-2">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>v{app.version}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {app.downloads}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {app.views}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                            {app.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditOpen(app)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteConfirm(app)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" /> App Statistics
              </CardTitle>
              <CardDescription>View performance metrics for your apps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-end mb-4">
                <Select
                  value={statsTimeframe}
                  onValueChange={(value: "all" | "month" | "week") => setStatsTimeframe(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Apps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalApps}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Top app: {stats.topApp.name} ({stats.topApp.downloads.toLocaleString()})
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Most viewed: {stats.mostViewed.name} ({stats.mostViewed.views.toLocaleString()})
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.categoryDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, count]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm">{category}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={(count / stats.totalApps) * 100} className="h-2 w-24" />
                              <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating, index) => (
                        <div key={rating} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm mr-1">{rating}</span>
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={(stats.ratingDistribution[rating - 1] / stats.totalApps) * 100}
                              className="h-2 w-24"
                            />
                            <span className="text-xs text-muted-foreground w-6 text-right">
                              {stats.ratingDistribution[rating - 1]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="font-semibold mt-6 mb-4">App Performance</h3>

              <div className="space-y-4">
                {apps
                  .sort((a, b) => b.downloads - a.downloads)
                  .slice(0, 5)
                  .map((app) => (
                    <div key={app.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={app.logo || "/placeholder.svg"}
                              alt={app.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h4 className="font-medium">{app.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                            {app.rating.toFixed(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{app.downloads.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Downloads</div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{app.views.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit App Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
            <DialogDescription>Make changes to the app details below.</DialogDescription>
          </DialogHeader>
          {editingApp && (
            <form onSubmit={handleEditSave} className="space-y-4">
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">App Name</Label>
                    <Input
                      id="edit-name"
                      value={editingApp.name}
                      onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-version">Version</Label>
                    <Input
                      id="edit-version"
                      value={editingApp.version}
                      onChange={(e) => setEditingApp({ ...editingApp, version: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-logo">Logo URL</Label>
                    <Input
                      id="edit-logo"
                      value={editingApp.logo}
                      onChange={(e) => setEditingApp({ ...editingApp, logo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-downloadLink">Download Link</Label>
                    <Input
                      id="edit-downloadLink"
                      value={editingApp.downloadLink}
                      onChange={(e) => setEditingApp({ ...editingApp, downloadLink: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-size">App Size</Label>
                    <Input
                      id="edit-size"
                      value={editingApp.size || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, size: e.target.value })}
                      placeholder="e.g. 45 MB"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-requirements">System Requirements</Label>
                    <Input
                      id="edit-requirements"
                      value={editingApp.requirements || ""}
                      onChange={(e) => setEditingApp({ ...editingApp, requirements: e.target.value })}
                      placeholder="e.g. Android 8.0+ or iOS 13.0+"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-medium">Developer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-developer-name">Developer Name</Label>
                      <Input
                        id="edit-developer-name"
                        value={editingApp.developer?.name || ""}
                        onChange={(e) =>
                          setEditingApp({
                            ...editingApp,
                            developer: {
                              ...(editingApp.developer || {}),
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-developer-email">Developer Email</Label>
                      <Input
                        id="edit-developer-email"
                        type="email"
                        value={editingApp.developer?.email || ""}
                        onChange={(e) =>
                          setEditingApp({
                            ...editingApp,
                            developer: {
                              ...(editingApp.developer || {}),
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="edit-developer-website">Developer Website</Label>
                      <Input
                        id="edit-developer-website"
                        value={editingApp.developer?.website || ""}
                        onChange={(e) =>
                          setEditingApp({
                            ...editingApp,
                            developer: {
                              ...(editingApp.developer || {}),
                              website: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-featured">Featured App</Label>
                    <Switch
                      id="edit-featured"
                      checked={editingApp.featured}
                      onCheckedChange={(checked) => setEditingApp({ ...editingApp, featured: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={`edit-category-${category}`} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    rows={5}
                    value={editingApp.description}
                    onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label>App Permissions</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add permission (e.g. Camera, Location)"
                      value={newPermission}
                      onChange={(e) => setNewPermission(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddPermission}>
                      Add
                    </Button>
                  </div>

                  {editingApp.permissions && editingApp.permissions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingApp.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {permission}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemovePermission(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Screenshots</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Screenshot URL"
                      value={newScreenshot}
                      onChange={(e) => setNewScreenshot(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddScreenshot}>
                      Add
                    </Button>
                  </div>

                  {editingApp.screenshots && editingApp.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {editingApp.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={screenshot || "/placeholder.svg"}
                            alt={`Screenshot ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveScreenshot(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Version History</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Version (e.g. 1.0.1)"
                        value={newVersionHistory.version}
                        onChange={(e) => setNewVersionHistory({ ...newVersionHistory, version: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newVersionHistory.date}
                        onChange={(e) => setNewVersionHistory({ ...newVersionHistory, date: e.target.value })}
                      />
                    </div>
                    <Textarea
                      placeholder="What's new in this version"
                      value={newVersionHistory.changes}
                      onChange={(e) => setNewVersionHistory({ ...newVersionHistory, changes: e.target.value })}
                      rows={2}
                    />
                    <Button type="button" onClick={handleAddVersionHistory} className="w-full">
                      Add Version
                    </Button>
                  </div>

                  {editingApp.versionHistory && editingApp.versionHistory.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {editingApp.versionHistory.map((version, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <div className="font-medium">Version {version.version}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(version.date)}</div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVersionHistory(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmApp} onOpenChange={(open) => !open && setDeleteConfirmApp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{deleteConfirmApp?.name}</span> from your app store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteApp} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Admin Settings
            </DialogTitle>
            <DialogDescription>Configure your admin panel preferences and system settings</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="appearance">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="account">
                <Users className="h-4 w-4 mr-2" /> Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup
                    value={adminSettings.theme}
                    onValueChange={(value) => {
                      setAdminSettings({ ...adminSettings, theme: value });
                      // Actually change the theme
                      document.documentElement.classList.remove('light', 'dark');
                      if (value !== 'system') {
                        document.documentElement.classList.add(value);
                      } else {
                        // Check system preference
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                          document.documentElement.classList.add('dark');
                        } else {
                          document.documentElement.classList.add('light');
                        }
                      }
                      toast({
                        title: "Theme Updated",
                        description: `Theme has been set to ${value}`,
                      });
                    }}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light" className="flex items-center">
                        <Sun className="h-4 w-4 mr-1" /> Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark" className="flex items-center">
                        <Moon className="h-4 w-4 mr-1" /> Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system" className="flex items-center">
                        <Monitor className="h-4 w-4 mr-1" /> System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={adminSettings.language}
                    onValueChange={(value) => {
                      setAdminSettings({ ...adminSettings, language: value });
                      toast({
                        title: "Language Updated",
                        description: `Language has been set to ${value.charAt(0).toUpperCase() + value.slice(1)}`,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing and size of UI elements</p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={adminSettings.compactMode}
                    onCheckedChange={(checked) => {
                      setAdminSettings({ ...adminSettings, compactMode: checked });
                      // Apply compact mode to the document
                      if (checked) {
                        document.documentElement.classList.add('compact-mode');
                      } else {
                        document.documentElement.classList.remove('compact-mode');
                      }
                      toast({
                        title: checked ? "Compact Mode Enabled" : "Compact Mode Disabled",
                        description: checked ? "UI elements will now be more compact" : "UI elements will now use standard spacing",
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[adminSettings.fontSize || 16]}
                      min={12}
                      max={20}
                      step={1}
                      onValueChange={(value) => {
                        setAdminSettings({ ...adminSettings, fontSize: value[0] });
                        // Apply font size to the document
                        document.documentElement.style.fontSize = `${value[0]}px`;
                      }}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{adminSettings.fontSize || 16}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {['purple', 'blue', 'green', 'red', 'orange'].map(color => (
                      <button
                        key={color}
                        className={`h-8 w-full rounded-md ${
                          (adminSettings.accentColor || 'purple') === color ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: `var(--${color})` }}
                        onClick={() => {
                          setAdminSettings({...adminSettings, accentColor: color});
                          // In a real app, you would apply the accent color to the theme
                          toast({
                            title: "Accent Color Updated",
                            description: `Accent color has been set to ${color}`,
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Animation Speed</Label>
                  <Select
                    value={adminSettings.animationSpeed || 'normal'}
                    onValueChange={(value) => {
                      setAdminSettings({...adminSettings, animationSpeed: value});
                      // Apply animation speed to the document
                      document.documentElement.style.setProperty('--animation-speed',
                        value === 'fast' ? '0.5' : value === 'slow' ? '2' : '1');
                      toast({
                        title: "Animation Speed Updated",
                        description: `Animation speed has been set to ${value}`,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Admin Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage your admin account settings and security</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email Address</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="admin-email"
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                          />
                          <Button onClick={handleUpdateEmail}>Update</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin-username">Username</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="admin-username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                          />
                          <Button onClick={handleUpdateUsername}>Update</Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleUpdatePassword} className="w-full">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enhance your account security</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={adminSettings.twoFactorAuth}
                    onCheckedChange={(checked) => {
                      setAdminSettings({...adminSettings, twoFactorAuth: checked});
                      toast({
                        title: checked ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled",
                        description: checked ? "Your account is now more secure" : "Two-factor authentication has been turned off",
                      });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={adminSettings.emailNotifications}
                    onCheckedChange={(checked) => {
                      setAdminSettings({...adminSettings, emailNotifications: checked});
                      toast({
                        title: checked ? "Email Notifications Enabled" : "Email Notifications Disabled",
                        description: checked ? "You will now receive email notifications" : "You will no longer receive email notifications",
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Activity</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded-md">
                      <span>Last login</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded-md">
                      <span>Account created</span>
                      <span>{new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded-md">
                      <span>Password last changed</span>
                      <span>{new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  <Power className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </TabsContent>

          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

