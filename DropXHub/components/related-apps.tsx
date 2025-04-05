import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AppType } from "@/types/app"

interface RelatedAppsProps {
  apps: AppType[]
}

export default function RelatedApps({ apps }: RelatedAppsProps) {
  if (apps.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {apps.map((app) => (
        <Link href={`/app/${app.id}`} key={app.id}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square overflow-hidden bg-muted">
              <img src={app.logo || "/placeholder.svg"} alt={app.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold line-clamp-1">{app.name}</h3>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm">{app.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">v{app.version}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

