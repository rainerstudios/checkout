import { NextResponse } from "next/server"
import { regions } from "@/lib/pricing"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const regionId = searchParams.get("region") || ""
  const region = regions.find((r) => r.id === regionId)

  if (!region) {
    return NextResponse.json({ error: "unknown region" }, { status: 400 })
  }

  // Simulate real-world latency by adding jitter to a regional baseline.
  const jitter = Math.floor(Math.random() * 25) // 0..24 ms
  const ms = Math.max(8, region.baselineMs + jitter)

  // Artificial processing delay to feel realistic
  await new Promise((r) => setTimeout(r, 180 + Math.random() * 150))

  return NextResponse.json({ region: regionId, ms })
}
