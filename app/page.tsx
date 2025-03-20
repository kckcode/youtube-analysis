"use client"

import type React from "react"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle, CheckCircle2, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartContainer } from "@/components/ui/chart"

export default function YouTubeAnalyzer() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [error, setError] = useState("")

  const [sentimentData, setSentimentData] = useState([
    { name: "Positive", value: 65, fill: "hsl(var(--chart-1))" },
    { name: "Neutral", value: 25, fill: "hsl(var(--chart-2))" },
    { name: "Negative", value: 10, fill: "hsl(var(--chart-3))" },
  ])

  const [topicData, setTopicData] = useState([
    { name: "Content Quality", value: 42, fill: "hsl(var(--chart-4))" },
    { name: "Audio/Visual", value: 28, fill: "hsl(var(--chart-5))" },
    { name: "Length", value: 15, fill: "hsl(var(--chart-6))" },
    { name: "Pacing", value: 10, fill: "hsl(var(--chart-7))" },
    { name: "Other", value: 5, fill: "hsl(var(--chart-8))" },
  ])

  const [suggestions, setSuggestions] = useState([
    "Improve audio quality as 28% of comments mention issues with sound",
    "Consider shortening video length as 15% of viewers find it too long",
    "Add more visual examples as viewers respond positively to visual demonstrations",
    "Respond to more comments to increase engagement - only 5% of comments have replies",
    "Add timestamps for different sections as requested by multiple viewers",
  ])

  const [commentCount, setCommentCount] = useState(1245)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate YouTube URL
    if (!url.includes("youtube.com/") && !url.includes("youtu.be/")) {
      setError("Please enter a valid YouTube URL")
      return
    }

    setLoading(true)
    setError("")

    try {
      // In a real implementation, this would call the YouTube API
      // For demo purposes, we'll generate different results based on the URL

      // Extract video ID from URL to use for generating different results
      let videoId = ""
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0]
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0]
      }

      // Use the video ID to generate pseudo-random but consistent results
      const hash = videoId.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)

      // Generate sentiment data based on video ID
      const positivePercent = 40 + (Math.abs(hash) % 50) // 40-90%
      const negativePercent = 5 + (Math.abs(hash >> 4) % 15) // 5-20%
      const neutralPercent = 100 - positivePercent - negativePercent

      // Update sentiment data
      const newSentimentData = [
        { name: "Positive", value: positivePercent, fill: "hsl(var(--chart-1))" },
        { name: "Neutral", value: neutralPercent, fill: "hsl(var(--chart-2))" },
        { name: "Negative", value: negativePercent, fill: "hsl(var(--chart-3))" },
      ]

      // Generate topic data based on video ID
      const contentQuality = 20 + (Math.abs(hash >> 8) % 40)
      const audioVisual = 15 + (Math.abs(hash >> 12) % 30)
      const length = 5 + (Math.abs(hash >> 16) % 20)
      const pacing = 5 + (Math.abs(hash >> 20) % 15)
      const other = 100 - contentQuality - audioVisual - length - pacing

      const newTopicData = [
        { name: "Content Quality", value: contentQuality, fill: "hsl(var(--chart-4))" },
        { name: "Audio/Visual", value: audioVisual, fill: "hsl(var(--chart-5))" },
        { name: "Length", value: length, fill: "hsl(var(--chart-6))" },
        { name: "Pacing", value: pacing, fill: "hsl(var(--chart-7))" },
        { name: "Other", value: other, fill: "hsl(var(--chart-8))" },
      ]

      // Generate suggestions based on the new data
      const newSuggestions = []

      if (audioVisual > 25) {
        newSuggestions.push(`Improve audio/visual quality as ${audioVisual}% of comments mention issues`)
      }

      if (length > 15) {
        newSuggestions.push(
          `Consider ${length > 25 ? "significantly shortening" : "adjusting"} video length as ${length}% of viewers commented on it`,
        )
      }

      if (pacing > 10) {
        newSuggestions.push(
          `Work on video pacing as ${pacing}% of comments mention it feels ${pacing > 15 ? "too slow" : "inconsistent"}`,
        )
      }

      if (positivePercent < 60) {
        newSuggestions.push(`Focus on improving overall content as positive sentiment is only at ${positivePercent}%`)
      }

      if (negativePercent > 15) {
        newSuggestions.push(`Address negative feedback urgently as ${negativePercent}% of comments are negative`)
      }

      // Add some generic suggestions if we don't have enough
      if (newSuggestions.length < 3) {
        newSuggestions.push("Respond to more comments to increase engagement")
        newSuggestions.push("Add timestamps for different sections as requested by multiple viewers")
        newSuggestions.push("Consider creating follow-up content on topics that received positive comments")
      }

      // Update state with new data
      setSentimentData(newSentimentData)
      setTopicData(newTopicData)
      setSuggestions(newSuggestions)
      setCommentCount(500 + (Math.abs(hash) % 2000))

      setLoading(false)
      setAnalyzed(true)
    } catch (error) {
      console.error("Error analyzing:", error)
      setError("Failed to analyze video comments")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTube Comment Analyzer</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Version</AlertTitle>
        <AlertDescription>
          This is a demonstration that simulates different analysis results based on the video URL. In a production
          environment, this would connect to the YouTube API to analyze real comments.
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analyze YouTube Comments</CardTitle>
          <CardDescription>
            Enter a YouTube video URL to analyze audience sentiment and get improvement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analyzed && (
        <>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>How viewers feel about your content</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    positive: {
                      label: "Positive",
                      color: "hsl(var(--chart-1))",
                    },
                    neutral: {
                      label: "Neutral",
                      color: "hsl(var(--chart-2))",
                    },
                    negative: {
                      label: "Negative",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  <span>{sentimentData[0].value}% Positive</span>
                </div>
                <div className="flex items-center">
                  <ThumbsDown className="mr-1 h-4 w-4" />
                  <span>{sentimentData[2].value}% Negative</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comment Topics</CardTitle>
                <CardDescription>What viewers are discussing</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    content: {
                      label: "Content Quality",
                      color: "hsl(var(--chart-4))",
                    },
                    audioVisual: {
                      label: "Audio/Visual",
                      color: "hsl(var(--chart-5))",
                    },
                    length: {
                      label: "Length",
                      color: "hsl(var(--chart-6))",
                    },
                    pacing: {
                      label: "Pacing",
                      color: "hsl(var(--chart-7))",
                    },
                    other: {
                      label: "Other",
                      color: "hsl(var(--chart-8))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
              <CardDescription>Based on comment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Analysis based on {commentCount.toLocaleString()} comments from the provided video
              </p>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

