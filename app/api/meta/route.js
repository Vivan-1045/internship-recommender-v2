import { NextResponse } from "next/server"

const API_URL = process.env.API_URL;
export async function GET(request) {
  try {
    const response = await fetch(`${API_URL}/meta`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })


    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text()
      throw new Error(`Backend returned non-JSON response: ${textResponse}`)
    }

    const data = await response.json()

    if (!data || typeof data !== "object") {
      throw new Error("Invalid data structure received from backend")
    }

    const metadata = {
      sectors:
        data.sectors?.map((sector) => ({
          value: sector.toLowerCase().replace(/\s+/g, "-"),
          label: sector,
        })) || [],
      locations:
        data.locations?.map((location) => ({
          value: location.toLowerCase().replace(/\s+/g, "-"),
          label: location,
        })) || [],
      education:
        data.educations?.map((education) => ({
          value: education.toLowerCase().replace(/\s+/g, "-"),
          label: education,
        })) || [],
    }

    return NextResponse.json(metadata)
  } catch (error) {

    if (error instanceof Error) {
      console.error("[v0] Error details:", error.message)
    }

    const fallbackMetadata = {
      sectors: [
        { value: "software-development", label: "Software Development" },
        { value: "data-science", label: "Data Science" },
        { value: "marketing", label: "Marketing" },
        { value: "design", label: "Design" },
        { value: "finance", label: "Finance" },
      ],
      locations: [
        { value: "bangalore", label: "Bangalore" },
        { value: "delhi", label: "Delhi" },
        { value: "mumbai", label: "Mumbai" },
        { value: "hyderabad", label: "Hyderabad" },
        { value: "pune", label: "Pune" },
      ],
      education: [
        { value: "btech", label: "B.Tech" },
        { value: "bca", label: "BCA" },
        { value: "mca", label: "MCA" },
        { value: "mtech", label: "M.Tech" },
        { value: "bsc", label: "B.Sc" },
      ],
    }

    return NextResponse.json(fallbackMetadata)
  }
}
