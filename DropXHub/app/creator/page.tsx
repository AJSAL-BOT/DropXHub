import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import TabBar from "@/components/tab-bar"

const creators = [
  {
    name: "Code Drop X",
    description: "Programming tutorials, AI tools , cyber techs.",
    link: "http://www.youtube.com/@Code-DropX",
    image: "https://yt3.googleusercontent.com/N5ltZiE3NATjEH3sf2Lm2POdWzCgJJkIENq9JuvG33Th61fVGB0RrQtIYsEl_xVQNOeXxc6B=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Cyber AI",
    description: "Cyber techs , ethical hacking tools.",
    link: "http://www.youtube.com/@Cyber-AI-X",
    image: "https://yt3.googleusercontent.com/GzXq5BlmLaRaevVi4IQo9ArthmhgFlYx4s8He-ZvhhYXGnYMbBj37vtlNNpF3u-GMTRCITnK=s160-c-k-c0x00ffffff-no-rj",
  },
]

export default function CreatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-bold mt-6 mb-4">Creator Channels</h1>
        <p className="text-muted-foreground mb-6">Check out our Creator YouTube channels</p>

        <div className="grid gap-6">
          {creators.map((creator) => (
            <Card key={creator.name}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                  <img
                    src={creator.image || "/placeholder.svg"}
                    alt={creator.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <CardTitle>{creator.name}</CardTitle>
                  <CardDescription>YouTube Channel</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{creator.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a
                    href={creator.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Visit Channel <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <TabBar activeTab="creator" />
    </div>
  )
}

