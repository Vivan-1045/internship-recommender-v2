"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, XCircle, Bookmark, ExternalLink, Sparkles, Target, MapPin, GraduationCap } from "lucide-react"

export default function InternshipRecommender() {
  const [formData, setFormData] = useState({
    skills: "",
    sector: "",
    location: "",
    education: "",
  })
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [metadata, setMetadata] = useState({
    sectors: [],
    locations: [],
    education: [],
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/meta")
        if (response.ok) {
          const data = await response.json()
          setMetadata(data)
        } else {
          setMetadata({
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
          })
        }
      } catch (error) {
        setMetadata({
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
        })
      }
    }

    fetchMetadata()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })


      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } else {
        console.log("[v0] Recommend API response not ok:", response.statusText)
        const errorText = await response.text()
        setRecommendations([])
      }
    } catch (error) {
      console.error("[v0] Error fetching recommendations:", error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (internshipId, feedback) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ internshipId, feedback }),
      })
      toast({
        title: "Thanks for your feedback!",
        description: "Your feedback helps us improve our recommendations.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error sending feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Recommendations
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-balance mb-8 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Find Internships That{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Match You
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-16 max-w-3xl mx-auto leading-relaxed">
              Get personalized internship recommendations powered by AI. Match your skills, interests, and location with
              the perfect opportunities.
            </p>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-3">
                  <Label htmlFor="skills" className="text-left block text-base font-medium flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Skills
                  </Label>
                  <Input
                    id="skills"
                    placeholder="React, Python, Design, Marketing..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="bg-card/50 backdrop-blur-sm border-border/50 h-12 text-base focus:bg-card transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="sector" className="text-left block text-base font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Sector
                  </Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData({ ...formData, sector: value })}
                  >
                    <SelectTrigger className="bg-card/50 backdrop-blur-sm border-border/50 h-12 text-base focus:bg-card transition-colors">
                      <SelectValue placeholder="Select your preferred sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {metadata.sectors.map((sector) => (
                        <SelectItem key={sector.value} value={sector.label}>
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="location" className="text-left block text-base font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger className="bg-card/50 backdrop-blur-sm border-border/50 h-12 text-base focus:bg-card transition-colors">
                      <SelectValue placeholder="Select your preferred location" />
                    </SelectTrigger>
                    <SelectContent>
                      {metadata.locations.map((location) => (
                        <SelectItem key={location.value} value={location.label}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="education" className="text-left block text-base font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    Education
                  </Label>
                  <Select
                    value={formData.education}
                    onValueChange={(value) => setFormData({ ...formData, education: value })}
                  >
                    <SelectTrigger className="bg-card/50 backdrop-blur-sm border-border/50 h-12 text-base focus:bg-card transition-colors">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {metadata.education.map((education) => (
                        <SelectItem key={education.value} value={education.label}>
                          {education.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3" />
                    Finding Perfect Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Get My Recommendations
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {hasSearched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Personalized Recommendations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {recommendations.length > 0
                ? `We found ${recommendations.length} internships that perfectly match your profile`
                : "No recommendations found. Try adjusting your criteria for better results."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((internship) => (
              <Card
                key={internship.id}
                className="group bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {internship.title}
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{internship.matchScore}%</div>
                      <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                  </div>
                  <CardDescription className="text-primary font-semibold text-lg">{internship.company}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {internship.breakdown && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Why we recommend this internship:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Skills:
                          </span>
                          <span className="font-mono font-semibold">
                            {Math.round(internship.breakdown.skillScore)}/50
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Sector:
                          </span>
                          <span className="font-mono font-semibold">
                            {Math.round(internship.breakdown.sectorScore)}/20
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Location:
                          </span>
                          <span className="font-mono font-semibold">
                            {Math.round(internship.breakdown.locationScore)}/20
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            Education:
                          </span>
                          <span className="font-mono font-semibold">
                            {Math.round(internship.breakdown.educationScore)}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Sector
                      </span>
                      <span className="font-medium">{internship.sector}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </span>
                      <span className="font-medium">{internship.location}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Education
                      </span>
                      <span className="font-medium">{internship.education}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {internship.applyLink && (
                      <Button
                        asChild
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-md hover:shadow-lg transition-all duration-200"
                        size="lg"
                      >
                        <a
                          href={internship.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 font-semibold"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Apply Now
                        </a>
                      </Button>
                    )}

                    <div className="text-center text-sm text-muted-foreground">Was this recommendation useful?</div>

                    <div className="flex justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(internship.id, "useful")}
                        className="flex-1 text-green-600 hover:text-green-500 hover:bg-green-500/10 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Useful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(internship.id, "not_useful")}
                        className="flex-1 text-red-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Not Useful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(internship.id, "applied")}
                        className="flex-1 text-blue-600 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Applied
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t border-border/50 mt-32 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              <span className="font-semibold text-foreground">Internship Recommender</span> – AI-powered, Lightweight,
              and Open Source
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Helping students find their perfect internship opportunities
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
