'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'

export default function PredictionInterface() {
  const [eventLink, setEventLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<{
    title: string
    probability: number
    confidence: number
    payout: number
    category: string
  } | null>(null)
  const { toast } = useToast()

  const handlePredict = async () => {
    if (!eventLink.trim()) {
      toast({
        title: "📊 Hold up!",
        description: "Please enter an event link to make a prediction",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      // Mock prediction data for demo
      const mockPrediction = {
        title: "Will Bitcoin reach $100k by end of 2024?",
        probability: Math.floor(Math.random() * 100) + 1,
        confidence: Math.floor(Math.random() * 30) + 70,
        payout: Number((Math.random() * 5 + 1).toFixed(2)),
        category: ["Sports", "Crypto", "Politics", "Entertainment"][Math.floor(Math.random() * 4)]
      }
      
      setPrediction(mockPrediction)
      setIsLoading(false)
      
      toast({
        title: "📈 Prediction Ready!",
        description: "Analysis complete!",
      })
    }, 2000)
  }

  const resetPrediction = () => {
    setPrediction(null)
    setEventLink('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4 animate-pulse">
            POLYMARKET PREDICTIONS
          </h1>
          <p className="text-xl text-yellow-300 font-semibold">
            Predict the future with data-driven insights! 🚀
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500">
              🔥 Trending Markets
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500">
              💰 High Returns
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500">
              📈 Hot Streaks
            </Badge>
          </div>
        </div>

        {/* Main prediction interface */}
        <Card className="bg-gray-900/80 border-yellow-500/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-yellow-400 flex items-center justify-center gap-2">
              🔮 Prediction Oracle 🔮
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Drop your event link and let the analysis begin!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!prediction ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="event-link" className="text-yellow-400 font-semibold text-lg">
                    Event Link 🔗
                  </Label>
                  <Input
                    id="event-link"
                    placeholder="https://example.com/event-to-predict"
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                    className="bg-gray-800 border-yellow-500/30 text-white placeholder-gray-400 text-lg py-6"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                      📊 Analyzing data...
                    </div>
                  ) : (
                    "🚀 ANALYZE & PREDICT! 🚀"
                  )}
                </Button>

                {isLoading && (
                  <div className="text-center space-y-4">
                    <div className="text-yellow-400 animate-pulse text-lg">
                      🔮 Processing market data...
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Prediction Results */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">🎉 ANALYSIS COMPLETE! 🎉</h2>
                  <p className="text-gray-300 text-lg">{prediction.title}</p>
                </div>

                {/* Prediction Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        {prediction.probability}%
                      </div>
                      <div className="text-green-300">Probability</div>
                      <Progress value={prediction.probability} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        {prediction.confidence}%
                      </div>
                      <div className="text-blue-300">Confidence</div>
                      <Progress value={prediction.confidence} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-500">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {prediction.payout}x
                      </div>
                      <div className="text-yellow-300">Potential Return</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {prediction.category}
                      </div>
                      <div className="text-purple-300">Category</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={resetPrediction}
                    variant="outline"
                    className="flex-1 py-4 text-lg border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    🔄 New Prediction
                  </Button>
                  <Button className="flex-1 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-bold">
                    📈 Make Prediction
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center items-center gap-4">
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-yellow-500 text-black">📊</AvatarFallback>
            </Avatar>
            <div className="text-yellow-400">
              <div className="font-bold">Prediction AI</div>
              <div className="text-sm text-gray-400">Your market analysis oracle</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            📊 Remember: Predictions are for informational purposes. Trade responsibly! 📊
          </p>
        </div>
      </div>
    </div>
  )
} 