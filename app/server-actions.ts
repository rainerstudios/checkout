"use server"

export async function createOrder(input: { serverTypeId: string; planId: string; regionId: string; total: number }) {
  // Simulate server-side processing and order creation
  await new Promise((r) => setTimeout(r, 900))
  console.log("Order created", input)
  return { id: `ord_${Math.random().toString(36).slice(2, 9)}`, ...input }
}
