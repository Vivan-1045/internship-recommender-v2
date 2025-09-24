import { NextResponse } from "next/server"

const API_URL = process.env.API_URL;

export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error response:", errorText)
      return NextResponse.json({ error: errorText }, { status: response.status })
    }

    const data = await response.json()

    // Normalize results shape
    const internships = data.results || data.recommendations || []

    const transformedRecommendations = internships.map((internship) => ({
      ...internship,
      applyLink: internship.applyLink || internship.apply_link || "#",
      breakdown: internship.breakdown || {
        skillScore: internship.skillScore ?? 0,
        sectorScore: internship.sectorScore ?? 0,
        locationScore: internship.locationScore ?? 0,
        educationScore: internship.educationScore ?? 0,
      },
    }))

    return NextResponse.json({ recommendations: transformedRecommendations })
  } catch (error) {
    console.error("[v0] Error in API route:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
