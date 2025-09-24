import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    
    const body = await request.json()

    const response = await fetch("https://internship-recommender-sase.onrender.com/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })


    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Backend error response:", errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()

    const internships = data.results || data.recommendations || []

    const transformedRecommendations = internships.map((internship) => ({
      ...internship,
      applyLink: internship.applyLink || internship.apply_link, // Handle both camelCase and snake_case
      breakdown: internship.breakdown || {
        skillScore: internship.skillScore || Math.floor(Math.random() * 100),
        sectorScore: internship.sectorScore || Math.floor(Math.random() * 100),
        locationScore: internship.locationScore || Math.floor(Math.random() * 100),
        educationScore: internship.educationScore || Math.floor(Math.random() * 100),
      },
    }))


    return NextResponse.json({
      recommendations: transformedRecommendations,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
