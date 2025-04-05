export interface AppType {
  id: string
  name: string
  version: string
  logo: string
  description: string
  downloadLink: string
  categories?: string[]
  rating: number
  reviews?: ReviewType[]
  downloads: number
  views: number
  featured: boolean
  screenshots?: string[]
  versionHistory?: VersionHistoryType[]
  createdAt: string
  updatedAt: string
  developer?: DeveloperType
  size?: string
  requirements?: string
  permissions?: string[]
  relevanceScore?: number
}

export interface ReviewType {
  id: string
  username: string
  rating: number
  comment: string
  date: string
  likes?: number
  dislikes?: number
}

export interface VersionHistoryType {
  version: string
  date: string
  changes: string
}

export interface DeveloperType {
  name: string
  website?: string
  email?: string
}

