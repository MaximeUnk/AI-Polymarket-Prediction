'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import InlineSphere from './InlineSphere'

// Types
interface PredictionData {
  title: string
  probability: number
  confidence: number
  payout: number
  category: PredictionCategory
}

type PredictionCategory = 'Sports' | 'Crypto' | 'Politics' | 'Entertainment'

const PREDICTION_CATEGORIES: PredictionCategory[] = ['Sports', 'Crypto', 'Politics', 'Entertainment']

export default function PredictionInterface() {
  const [eventLink, setEventLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const { toast } = useToast()

  // Common styles
  const badgeStyles = "bg-[#00ffff]/10 text-[#00ffff] border-[#00ffff] text-lg px-4 py-2 rounded-xl hover:bg-[#00ffff]/20 transition-colors"
  const statCardStyles = "p-6 text-center"
  const statValueStyles = "font-bold text-white mb-2"
  const statLabelStyles = "text-white/90"

  // Reusable stat card component
  interface StatCardProps {
    value: string | number
    label: string
    gradientClass: string
    borderClass: string
    showProgress?: boolean
    valueSize?: string
  }

  const StatCard = ({ 
    value, 
    label, 
    gradientClass, 
    borderClass, 
    showProgress = false,
    valueSize = "text-4xl" 
  }: StatCardProps) => (
    <Card className={`${gradientClass} ${borderClass} card-hover`}>
      <CardContent className={statCardStyles}>
        <div className={`${valueSize} ${statValueStyles}`}>
          {value}
        </div>
        <div className={statLabelStyles}>{label}</div>
        {showProgress && <Progress value={Number(value)} className="mt-2" />}
      </CardContent>
    </Card>
  )

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
  )

  // Mock data generation with proper types
  const generateMockPrediction = (): PredictionData => ({
    title: "Will Bitcoin reach $100k by end of 2024?",
    probability: Math.floor(Math.random() * 100) + 1,
    confidence: Math.floor(Math.random() * 30) + 70,
    payout: Number((Math.random() * 5 + 1).toFixed(2)),
    category: PREDICTION_CATEGORIES[Math.floor(Math.random() * PREDICTION_CATEGORIES.length)]
  })

  const handlePredict = async () => {
    if (!eventLink.trim()) {
      toast({
        title: "Hold up!",
        description: "Please enter an event link to make a prediction",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      const mockPrediction = generateMockPrediction()
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
    <div className="min-h-screen p-6 bg-black">
      {/* Sphere background - absolute center */}
      <div className="fixed left-1/4 top-0/3 -translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <InlineSphere />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-[#00ffff] mb-4">
            POLYMARKET PREDICTIONS
          </h1>
          <p className="text-xl text-[#00ffff] font-semibold">
            Predict the future with data-driven insights
          </p>
          <div className="flex justify-center space-x-5 mt-4">
            <Badge variant="secondary" className={badgeStyles}>
              High Returns
            </Badge>
            <Badge variant="secondary" className={badgeStyles}>
              Trending Markets
            </Badge>
            <Badge variant="secondary" className={badgeStyles}>
              Hot Streaks
            </Badge>
          </div>
        </div>

        {/* Main prediction interface */}
        <Card className="relative border-primary/20 bg-black/40 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[#00ffff] flex items-center justify-center gap-2">
              Prediction Oracle
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Drop your event link and let the analysis begin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!prediction ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="event-link" className="text-[#00ffff] font-semibold text-lg">
                    Event Link
                  </Label>
                  <Input
                    id="event-link"
                    placeholder="https://polymarket.com/event-to-predict"
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                    className="bg-input border-border text-foreground placeholder-muted-foreground text-lg py-6"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#0099ff] hover:from-[#00ffff]/90 hover:to-[#0099ff]/90 text-black transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <LoadingSpinner />
                      ANALYZING DATA...
                    </div>
                  ) : (
                    "ANALYZE & PREDICT"
                  )}
                </Button>

                {isLoading && (
                  <div className="text-center space-y-4">
                    <div className="text-[#00ffff] animate-pulse text-lg">
                      Processing market data...
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Prediction Results */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#00ffff] mb-2">ANALYSIS COMPLETE</h2>
                  <p className="text-foreground text-lg">{prediction.title}</p>
                </div>

                {/* Prediction Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard
                    value={`${prediction.probability}%`}
                    label="Probability"
                    gradientClass="gradient-card-dice"
                    borderClass="border-green-500"
                    showProgress={true}
                  />
                  <StatCard
                    value={`${prediction.confidence}%`}
                    label="Confidence"
                    gradientClass="gradient-card-roulette"
                    borderClass="border-blue-500"
                    showProgress={true}
                  />
                  <StatCard
                    value={`${prediction.payout}x`}
                    label="Potential Return"
                    gradientClass="gradient-card-crash"
                    borderClass="border-orange-500"
                  />
                  <StatCard
                    value={prediction.category}
                    label="Category"
                    gradientClass="gradient-card-keno"
                    borderClass="border-purple-500"
                    valueSize="text-2xl"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={resetPrediction}
                    variant="outline"
                    className="flex-1 py-4 text-lg border-primary text-primary hover:bg-primary/10"
                  >
                    🔄 New Prediction
                  </Button>
                  <Button className="flex-1 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold">
                    📈 Make Prediction
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 