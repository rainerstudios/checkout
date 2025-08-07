export type ServerType = {
  id: string
  name: string
  description: string
  surcharge: number
}

export const serverTypes: ServerType[] = [
  {
    id: "bungeecord",
    name: "Bungeecord",
    description: "Proxy server for connecting multiple Minecraft servers",
    surcharge: 0,
  },
  {
    id: "forge-minecraft",
    name: "Forge Minecraft",
    description: "Modded Minecraft server with Forge mod support",
    surcharge: 0,
  },
  {
    id: "sponge",
    name: "Sponge (SpongeVanilla)",
    description: "Plugin-based server with extensive API support",
    surcharge: 0,
  },
  {
    id: "trinity",
    name: "Trinity",
    description: "High-performance server software for large communities",
    surcharge: 2,
  },
  {
    id: "paper",
    name: "Paper",
    description: "Optimized Minecraft server with performance improvements",
    surcharge: 0,
  },
  {
    id: "mohist",
    name: "Mohist",
    description: "Hybrid server supporting both mods and plugins",
    surcharge: 1,
  },
  {
    id: "curseforge-generic",
    name: "Curseforge Generic",
    description: "Generic modpack support for CurseForge modpacks",
    surcharge: 0,
  },
  {
    id: "purpur",
    name: "Purpur",
    description: "Fork of Paper with additional features and optimizations",
    surcharge: 0,
  },
  {
    id: "forge-enhanced",
    name: "Forge Enhanced",
    description: "Enhanced Forge server with additional performance tweaks",
    surcharge: 1,
  },
]

export type Plan = {
  id: string
  name: string
  description: string
  priceMonthly: number
  slots: number
  cpu: number
  ram: number
  storage: number
  badge?: string
}
export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small friend groups",
    priceMonthly: 8,
    slots: 10,
    cpu: 1,
    ram: 2,
    storage: 20,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Great performance for growing communities",
    priceMonthly: 16,
    slots: 20,
    cpu: 2,
    ram: 4,
    storage: 40,
    badge: "Popular",
  },
  {
    id: "pro",
    name: "Pro",
    description: "High performance for large servers",
    priceMonthly: 28,
    slots: 40,
    cpu: 3,
    ram: 8,
    storage: 80,
    badge: "Best Value",
  },
]

export type Region = {
  id: string
  name: string
  city: string
  country: string
  flag: string
  flagImage: string
  provider: string
  baselineMs: number
  surcharge: number
}

export const regions: Region[] = [
  { 
    id: "us-east", 
    name: "US East", 
    city: "Ashburn", 
    country: "USA", 
    flag: "🇺🇸", 
    flagImage: "/placeholder.svg?height=24&width=32",
    provider: "GMA Cloud", 
    baselineMs: 25, 
    surcharge: 0, 
  },
  { 
    id: "us-west", 
    name: "US West", 
    city: "Los Angeles", 
    country: "USA", 
    flag: "🇺🇸", 
    flagImage: "/placeholder.svg?height=24&width=32",
    provider: "GMA Cloud", 
    baselineMs: 38, 
    surcharge: 1, 
  },
  { 
    id: "eu-west", 
    name: "EU West", 
    city: "Frankfurt", 
    country: "DE", 
    flag: "🇩🇪", 
    flagImage: "/placeholder.svg?height=24&width=32",
    provider: "GMA Cloud", 
    baselineMs: 45, 
    surcharge: 1, 
  },
  { 
    id: "uk", 
    name: "UK", 
    city: "London", 
    country: "GB", 
    flag: "🇬🇧", 
    flagImage: "/placeholder.svg?height=24&width=32",
    provider: "GMA Cloud", 
    baselineMs: 52, 
    surcharge: 1, 
  },
  { 
    id: "ap-sg", 
    name: "Asia Pacific", 
    city: "Singapore", 
    country: "SG", 
    flag: "🇸🇬", 
    flagImage: "/placeholder.svg?height=24&width=32",
    provider: "GMA Cloud", 
    baselineMs: 95, 
    surcharge: 2, 
  },
  { 
    id: "ap-au", 
    name: "Australia", 
    city: "Sydney", 
    country: "AU", 
    flag: "🇦🇺", 
    flagImage: "/placeholder.svg?height=24&width=32",
    provider: "GMA Cloud", 
    baselineMs: 120, 
    surcharge: 2, 
  },
]
