"use client"

import { useMemo, useState, useTransition } from "react"
import { Check, CreditCard, Gamepad2, Globe2, Lock, MapPin, Server } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { plans, regions, serverTypes, type Plan, type Region, type ServerType } from "@/lib/pricing"
import { createOrder } from "./server-actions"

type PingMap = Record<string, number | undefined>

export default function Page() {
  const [selectedServerTypeId, setSelectedServerTypeId] = useState<string>(serverTypes[0]?.id ?? "")
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[1]?.id ?? plans[0]?.id ?? "")
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id ?? "")
  const [pings, setPings] = useState<PingMap>({})
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const serverType = useMemo(() => serverTypes.find((s) => s.id === selectedServerTypeId) as ServerType, [selectedServerTypeId])
  const plan = useMemo(() => plans.find((p) => p.id === selectedPlanId) as Plan, [selectedPlanId])
  const region = useMemo(() => regions.find((r) => r.id === selectedRegionId) as Region, [selectedRegionId])

  const currency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v)

  const subtotal = plan.priceMonthly + region.surcharge + serverType.surcharge
  const discountAmount = Math.round((subtotal * appliedDiscount) * 100) / 100
  const taxedBase = Math.max(0, subtotal - discountAmount)
  const taxRate = 0.07
  const tax = Math.round((taxedBase * taxRate) * 100) / 100
  const total = Math.round((taxedBase + tax) * 100) / 100

  function applyDiscount() {
    if (!discountCode.trim()) return
    const code = discountCode.trim().toUpperCase()
    let pct = 0
    if (code === "GAMER10") pct = 0.1
    if (code === "PRO20" && plan.id === "pro") pct = 0.2
    setAppliedDiscount(pct)
    toast({
      title: pct > 0 ? "Discount applied" : "Invalid code",
      description: pct > 0 ? `${Math.round(pct * 100)}% off has been applied.` : "Try GAMER10 or PRO20.",
    })
  }

  async function ping(regionId: string) {
    try {
      const res = await fetch(`/api/ping?region=${encodeURIComponent(regionId)}`, { cache: "no-store" })
      const data = await res.json()
      setPings((prev) => ({ ...prev, [regionId]: data.ms as number }))
    } catch {
      setPings((prev) => ({ ...prev, [regionId]: undefined }))
    }
  }

  async function pingAll() {
    for (const r of regions) {
      setTimeout(() => ping(r.id), 80)
    }
  }

  const quality = (ms?: number) => {
    if (ms == null) return { label: "Unknown", color: "text-slate-400", dot: "bg-slate-500" }
    if (ms <= 40) return { label: "Excellent", color: "text-green-400", dot: "bg-green-500" }
    if (ms <= 80) return { label: "Good", color: "text-lime-400", dot: "bg-lime-500" }
    if (ms <= 120) return { label: "Fair", color: "text-amber-400", dot: "bg-amber-500" }
    return { label: "Poor", color: "text-red-400", dot: "bg-red-500" }
  }

  return (
    <main className="min-h-screen w-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/25 grid place-items-center">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">GMA Game Server Hosting</h1>
              <p className="text-sm text-slate-400">High-performance gaming servers with global reach</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            Beta Access
          </Badge>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <section className="space-y-8">
            {/* Package Selection - First */}
            <Card className="bg-slate-900 border-slate-700 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white">Choose your package</CardTitle>
                <CardDescription className="text-slate-300">Select a plan with the features you need for your gaming community.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {plans.map((p) => (
                    <PlanCard
                      key={p.id}
                      plan={p}
                      selected={selectedPlanId === p.id}
                      onSelect={() => setSelectedPlanId(p.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Server Type Selection */}
            <Card className="bg-slate-900 border-slate-700 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-400" />
                  Choose Server Type
                </CardTitle>
                <CardDescription className="text-slate-300">Select the server software that best fits your needs.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serverTypes.map((serverType) => (
                    <ServerTypeCard
                      key={serverType.id}
                      serverType={serverType}
                      selected={selectedServerTypeId === serverType.id}
                      onSelect={() => setSelectedServerTypeId(serverType.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Selection */}
            <Card className="bg-slate-900 border-slate-700 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  Pick a server location
                </CardTitle>
                <CardDescription className="text-slate-300">Test latency and select the region closest to your players.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-300 flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-green-400" /> Run ping tests to find your optimal server location
                  </div>
                  <Button variant="secondary" size="sm" onClick={pingAll} className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                    Test all regions
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regions.map((r) => {
                    const ms = pings[r.id]
                    const q = quality(ms)
                    const isActive = selectedRegionId === r.id
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRegionId(r.id)}
                        className={cn(
                          "group text-left rounded-xl border p-5 transition-all duration-200",
                          "hover:border-green-400/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-green-500/10",
                          isActive ? "border-green-400 bg-slate-800 shadow-lg shadow-green-500/20 ring-1 ring-green-400/30" : "border-slate-700 bg-slate-800",
                        )}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={r.flagImage || "/placeholder.svg"}
                              alt={`${r.country} flag`}
                              className="w-8 h-6 rounded object-cover"
                            />
                            <div>
                              <div className="font-semibold text-white">{r.name}</div>
                              <div className="text-xs text-slate-400">{r.provider}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-300">
                            {r.city}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2.5 w-2.5 rounded-full", q.dot)} aria-hidden />
                            <span className={cn("font-medium", q.color)}>{q.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn("tabular-nums font-mono text-sm", ms != null ? "text-white" : "text-slate-500")}>
                              {ms != null ? `${ms} ms` : "—"}
                            </span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="hover:bg-slate-700 text-slate-300 hover:text-white h-7 px-2" 
                              onClick={(e) => {
                                e.preventDefault()
                                ping(r.id)
                              }}
                            >
                              Ping
                            </Button>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="bg-slate-900 border-slate-700 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-white">Complete your purchase</CardTitle>
                <CardDescription className="text-slate-300">Secure payment processing with 256-bit SSL encryption.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                    <TabsTrigger value="card" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Pay by Card</TabsTrigger>
                    <TabsTrigger value="paypal" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Pay with PayPal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="mt-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">Email address</Label>
                        <Input id="email" placeholder="you@example.com" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="card" className="text-white">Card number</Label>
                        <Input id="card" placeholder="1234 1234 1234 1234" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="exp" className="text-white">Expiration</Label>
                          <Input id="exp" placeholder="MM / YY" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc" className="text-white">CVC</Label>
                          <Input id="cvc" placeholder="123" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="name" className="text-white">Cardholder name</Label>
                          <Input id="name" placeholder="Player One" className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="mt-6">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-base text-white">PayPal Checkout</CardTitle>
                        <CardDescription className="text-slate-400">You'll be redirected to PayPal to complete your payment securely.</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="bg-[#0070ba] hover:bg-[#005ea6] text-white">Continue to PayPal</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-6 border-t border-slate-700">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await createOrder({
                        serverTypeId: serverType.id,
                        planId: plan.id,
                        regionId: region.id,
                        total,
                      })
                      toast({
                        title: "Order created successfully!",
                        description: "Your server will be ready in 2-3 minutes.",
                      })
                    })
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Pay {currency(total)}
                </Button>
              </CardFooter>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="bg-slate-900 border-slate-700 shadow-2xl sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white">Order Summary</CardTitle>
                <CardDescription className="text-slate-300">Review your selections and pricing details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div>
                    <div className="font-semibold text-white">{plan.name}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {plan.slots} slots · {plan.cpu} vCPU · {plan.ram}GB RAM · {plan.storage}GB NVMe
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white">{currency(plan.priceMonthly)}/mo</div>
                </div>

                <div className="flex items-start justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div>
                    <div className="font-semibold text-white">{serverType.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{serverType.description}</div>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {serverType.surcharge > 0 ? `+${currency(serverType.surcharge)}/mo` : 'Free'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <img
                      src={region.flagImage || "/placeholder.svg"}
                      alt={`${region.country} flag`}
                      className="w-5 h-4 rounded object-cover"
                    />
                    <div className="text-sm text-white">{region.name}</div>
                  </div>
                  <div className="text-sm font-semibold text-white">+{currency(region.surcharge)}/mo</div>
                </div>

                <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-white">Discount code</div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                      Save up to 20%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="GAMER10 or PRO20"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <Button onClick={applyDiscount} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      Apply
                    </Button>
                  </div>
                </div>

                <Separator className="bg-slate-700" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium">{currency(subtotal)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex items-center justify-between text-green-400">
                      <span>Discount ({Math.round(appliedDiscount * 100)}%)</span>
                      <span className="tabular-nums font-medium">-{currency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Tax (7%)</span>
                    <span className="tabular-nums font-medium">{currency(tax)}</span>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-white">Total due monthly</span>
                  <span className="text-xl font-bold text-white">{currency(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  onClick={() => document.querySelector('[data-payment-section]')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to payment
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

function ServerTypeCard({
  serverType,
  selected,
  onSelect,
}: {
  serverType: ServerType
  selected?: boolean
  onSelect?: () => void
}) {
  const currency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v)
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "text-left rounded-xl border p-4 transition-all duration-200",
        selected 
          ? "border-green-400 bg-slate-800 shadow-lg shadow-green-500/20 ring-1 ring-green-400/30" 
          : "border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
          selected ? "border-green-400 bg-green-400" : "border-slate-500"
        )}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="font-semibold text-white">{serverType.name}</div>
      </div>
      <div className="text-sm text-slate-400 mb-2">{serverType.description}</div>
      <div className="text-sm font-medium text-slate-300">
        {serverType.surcharge > 0 ? `+${currency(serverType.surcharge)} USD` : '$0.00 USD'}
      </div>
    </button>
  )
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan
  selected?: boolean
  onSelect?: () => void
}) {
  const currency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v)
  
  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-all duration-200 cursor-pointer group",
        selected 
          ? "border-green-400 bg-slate-800 shadow-xl shadow-green-500/20 ring-1 ring-green-400/30" 
          : "border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-white text-lg">{plan.name}</h3>
            {plan.badge ? (
              <Badge className={cn(
                "text-xs font-medium",
                plan.badge === "Popular" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : "",
                plan.badge === "Best Value" ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white" : "",
              )}>
                {plan.badge}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-slate-400">{plan.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{currency(plan.priceMonthly)}</div>
          <div className="text-xs text-slate-400">per month</div>
        </div>
      </div>
      
      <div className="grid gap-3 text-sm mb-6">
        <Feature>{plan.slots} player slots</Feature>
        <Feature>{plan.cpu} vCPU cores</Feature>
        <Feature>{plan.ram} GB RAM</Feature>
        <Feature>{plan.storage} GB NVMe SSD</Feature>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-slate-400">Cancel anytime</div>
        <Button 
          size="sm" 
          className={cn(
            "transition-all",
            selected 
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
              : "bg-slate-700 hover:bg-slate-600 text-white"
          )}
        >
          {selected ? "Selected" : "Choose plan"}
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <img
          src={"/placeholder.svg?height=100&width=300&query=abstract gaming server visualization dark theme"}
          alt="Gaming server visualization"
          className="h-20 w-full object-cover opacity-60"
        />
      </div>
    </div>
  )
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-slate-200">{children}</span>
    </div>
  )
}
