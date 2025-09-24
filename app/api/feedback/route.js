import { NextResponse } from "next/server"

const API_URL = process.env.API_URL;
export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending feedback:", error)
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 })
  }
}
