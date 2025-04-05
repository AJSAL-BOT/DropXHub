import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { AppType } from "@/types/app"
import { Badge } from "@/components/ui/badge"

interface AppListProps {
  apps: AppType[]
  viewMode?: "grid" | "list"
}

export default function AppList({ apps, viewMode = "grid" }: AppListProps) {
  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground text-center">No apps found</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {apps.map((app) => (
          <Link href={`/app/${app.id}`} key={app.id}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex p-3">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img src={app.logo || "/placeholder.svg"} alt={app.name} className="h-full w-full object-cover" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{app.name}</h2>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm">{app.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">v{app.version}</p>
                  <p className="text-sm line-clamp-2 mt-1">{app.description}</p>
                  {app.categories && app.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs py-0">
                          {category}
                        </Badge>
                      ))}
                      {app.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs py-0">
                          +{app.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {apps.map((app) => (
        <Link href={`/app/${app.id}`} key={app.id}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square overflow-hidden bg-muted">
              <img src={app.logo || "/placeholder.svg"} alt={app.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold line-clamp-1">{app.name}</h2>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm">{app.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{app.description}</p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-muted-foreground">v{app.version}</p>
                {app.featured && (
                  <Badge variant="secondary" className="text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

