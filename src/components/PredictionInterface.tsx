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
  apiResponse?: string
  parsedResponse?: ParsedResponse
  isMultiOutcome?: boolean
  multiOutcomeReason?: string
}

interface ParsedResponse {
  marketInfo: {
    title: string
    rules: string
  }
  predictionOdds: {
    yesOdds: string
    noOdds: string
    explanation: string
  }
  pointsFor: Array<{
    title: string
    content: string
  }>
  pointsAgainst: Array<{
    title: string
    content: string
  }>
  sources: string[]
}

type PredictionCategory = 'Sports' | 'Crypto' | 'Politics' | 'Entertainment'

const PREDICTION_CATEGORIES: PredictionCategory[] = ['Sports', 'Crypto', 'Politics', 'Entertainment']

// Helper function to get combinations of outcomes
function getCombinations<T>(arr: T[], size: number): T[][] {
  if (size === 1) return arr.map(item => [item])
  const combinations: T[][] = []
  
  for (let i = 0; i < arr.length - size + 1; i++) {
    const head = arr[i]
    const tailCombinations = getCombinations(arr.slice(i + 1), size - 1)
    for (const tail of tailCombinations) {
      combinations.push([head, ...tail])
    }
  }
  
  return combinations
}

// Parser function to break down AI response into sections
function parseAIResponse(response: string): ParsedResponse {
  console.log('=== PARSING AI RESPONSE ===')
  console.log('Raw response length:', response.length)
  console.log('Raw response preview:', response.substring(0, 500) + '...')
  
  // Log sections found
  console.log('Looking for FOR/AGAINST sections...')
  
  // Clean up ** symbols throughout the response
  const cleanResponse = response.replace(/\*\*/g, '')
  const sections = cleanResponse.split('--- PREDICTION ANALYSIS ---')
  
  // Parse market info (first section)
  const marketSection = sections[0] || ''
  const marketLines = marketSection.split('\n')
  const marketTitle = marketLines.find(line => line.startsWith('Market:'))?.replace('Market:', '').trim() || 'Unknown Market'
  const rulesIndex = marketLines.findIndex(line => line.startsWith('Rules:'))
  const rules = rulesIndex >= 0 ? marketLines.slice(rulesIndex + 1).join('\n').trim() : 'No rules found'
  
  // Parse prediction section (second section)
  let predictionSection = sections[1] || ''
  
  // If no second section found, use the entire response as prediction section
  if (!predictionSection.trim() && sections.length === 1) {
    predictionSection = cleanResponse
  }
  
  const predictionLines = predictionSection.split('\n').filter(line => line.trim())
  
  // Extract Yes/No odds
  let yesOdds = 'N/A'
  let noOdds = 'N/A'
  
  // Look for odds line with improved patterns
  const oddsLine = predictionLines.find(line => 
    line.toLowerCase().includes('odds:') || 
    line.includes('%') ||
    line.toLowerCase().includes('yes:') ||
    line.toLowerCase().includes('no:')
  )
  
  if (oddsLine) {
    // Try multiple patterns for Yes percentage
    const yesPatterns = [
      /(\d+)%?\s*chance\s*of\s*[""'"]*Yes[""'"]*/i,
      /Yes[""'"]*:?\s*(\d+)%/i,
      /(\d+)%\s*[""'"]*Yes[""'"]/i,
      /(\d+)%\s*for\s*Yes/i,
      /(\d+)%\s*YES/i
    ]
    
    for (const pattern of yesPatterns) {
      const match = oddsLine.match(pattern)
      if (match) {
        yesOdds = `${match[1]}%`
        break
      }
    }
    
    // Try multiple patterns for No percentage
    const noPatterns = [
      /(\d+)%?\s*chance\s*of\s*[""'"]*No[""'"]*(?!\w)/i,
      /No[""'"]*:?\s*(\d+)%/i,
      /(\d+)%\s*[""'"]*No[""'"]*(?!\w)/i,
      /(\d+)%\s*for\s*No(?!\w)/i,
      /(\d+)%\s*NO(?!\w)/i
    ]
    
    for (const pattern of noPatterns) {
      const match = oddsLine.match(pattern)
      if (match) {
        noOdds = `${match[1]}%`
        break
      }
    }
    
    // If still N/A, try to extract any percentages and infer
    if (yesOdds === 'N/A' || noOdds === 'N/A') {
      const allPercentages = oddsLine.match(/\b(\d+)%/g)
      if (allPercentages && allPercentages.length >= 2) {
        if (yesOdds === 'N/A') yesOdds = allPercentages[0]
        if (noOdds === 'N/A') noOdds = allPercentages[1]
      } else if (allPercentages && allPercentages.length === 1) {
        const percentage = parseInt(allPercentages[0])
        if (oddsLine.toLowerCase().includes('yes') && yesOdds === 'N/A') {
          yesOdds = allPercentages[0]
          noOdds = `${100 - percentage}%`
        } else if (oddsLine.toLowerCase().includes('no') && noOdds === 'N/A') {
          noOdds = allPercentages[0]
          yesOdds = `${100 - percentage}%`
        }
      }
    }
  }
  
  // If still N/A, search the entire prediction section for percentages
  if (yesOdds === 'N/A' || noOdds === 'N/A') {
    const allPercentagesInResponse = predictionSection.match(/\b(\d+)%/g)
    if (allPercentagesInResponse && allPercentagesInResponse.length >= 2) {
      if (yesOdds === 'N/A') yesOdds = allPercentagesInResponse[0]
      if (noOdds === 'N/A') noOdds = allPercentagesInResponse[1]
    } else if (allPercentagesInResponse && allPercentagesInResponse.length === 1) {
      const firstPercentage = parseInt(allPercentagesInResponse[0])
      yesOdds = `${firstPercentage}%`
      noOdds = `${100 - firstPercentage}%`
    } else {
      // Default fallback
      yesOdds = '50%'
      noOdds = '50%'
    }
  }
  
  // Validate that percentages add up to 100%
  if (yesOdds !== 'N/A' && noOdds !== 'N/A') {
    const yesNum = parseInt(yesOdds)
    const noNum = parseInt(noOdds)
    
    if (yesNum + noNum !== 100) {
      // If they don't add up, use the first one and calculate the complement
      const reliablePercentage = yesNum
      yesOdds = `${reliablePercentage}%`
      noOdds = `${100 - reliablePercentage}%`
    }
  }
  
  console.log('Final parsed odds - Yes:', yesOdds, 'No:', noOdds)
  
  // Find explanation
  const oddsIndex = predictionLines.findIndex(line => 
    line.toLowerCase().includes('odds:') || line.includes('%'))
  const explanation = oddsIndex >= 0 && predictionLines[oddsIndex + 1] 
    ? predictionLines.slice(oddsIndex + 1, oddsIndex + 3).join(' ').trim() 
    : 'No explanation provided'
  
  // Parse points FOR with multiple pattern attempts
  const pointsFor: Array<{title: string, content: string}> = []
  
  // Try multiple patterns for FOR section
  const forPatterns = [
    /\*\*ARGUMENTS\s+FOR:\*\*([\s\S]*?)(?=\*\*ARGUMENTS\s+AGAINST:|\*\*Sources|$)/i,
    /(?:Points|Arguments|Factors|Reasons)\s+FOR[^:]*:([\s\S]*?)(?=(?:Points|Arguments|Factors|Reasons)\s+(?:AGAINST|Against)|$)/i,
    /(?:Arguments|Points)\s+(?:supporting|favoring|for)\s+(?:yes|YES)[^:]*:([\s\S]*?)(?=(?:Arguments|Points)\s+(?:against|opposing)|$)/i,
    /(?:Pro|Pros|Positive|Supporting)\s*[:\-]?([\s\S]*?)(?=(?:Con|Cons|Negative|Against|Opposition)|$)/i,
    /FOR[:\-\s]+([\s\S]*?)(?=AGAINST|$)/i
  ]
  
  let forContent = ''
  for (const pattern of forPatterns) {
    const match = predictionSection.match(pattern)
    if (match && match[1] && match[1].trim()) {
      forContent = match[1].trim()
      console.log('Found FOR section with pattern:', pattern)
      break
    }
  }
  
  if (forContent) {
    // Try different numbered list patterns with better multi-line capture
    const listPatterns = [
      /(\d+\.\s*[^\n]*(?:\n(?!\s*\d+\.)[^\n]*)*)/g,  // Improved: captures until next numbered item
      /(\*\s*[^\n]*(?:\n(?!\s*\*)[^\n]*)*)/g,        // Improved: captures until next bullet
      /-\s*([^\n]*(?:\n(?!\s*-)[^\n]*)*)/g,          // Improved: captures until next dash
      /(\w[^\n]*(?:\n(?!\s*\d+\.|[*-]|\w+:)[^\n]*)*)/g  // General pattern
    ]
    
    let forMatches: RegExpMatchArray | null = null
    for (const pattern of listPatterns) {
      forMatches = forContent.match(pattern)
      if (forMatches && forMatches.length > 0) {
        console.log('Found FOR items with pattern:', pattern)
        break
      }
    }
    
    if (forMatches) {
      console.log('FOR matches found:', forMatches.length)
      forMatches.forEach((match, index) => {
        console.log(`FOR match ${index + 1}:`, match.substring(0, 100) + '...')
        const cleanMatch = match.trim().replace(/^[\d\*\-\s]+/, '').trim()
        if (cleanMatch) {
          const lines = cleanMatch.split('\n').map(line => line.trim()).filter(line => line)
          const firstLine = lines[0] || ''
          
          let title = ''
          let content = ''
          
          if (firstLine.includes(':')) {
            const colonIndex = firstLine.indexOf(':')
            title = firstLine.substring(0, colonIndex).trim()
            content = firstLine.substring(colonIndex + 1).trim()
            if (lines.length > 1) {
              content += ' ' + lines.slice(1).join(' ')
            }
          } else {
            const words = firstLine.split(' ')
            if (words.length > 4) {
              title = words.slice(0, 4).join(' ')
              content = words.slice(4).join(' ')
              if (lines.length > 1) {
                content += ' ' + lines.slice(1).join(' ')
              }
            } else {
              title = `Point ${index + 1}`
              content = lines.join(' ')
            }
          }
          
          if (title && content && content.length > 5) {
            pointsFor.push({ title: title.trim(), content: content.trim() })
          }
        }
      })
    } else {
      // Fallback: split by sentences or paragraphs
      const sentences = forContent.split(/[.!?]\s+/).filter(s => s.trim().length > 10)
      sentences.slice(0, 5).forEach((sentence, index) => {
        const words = sentence.trim().split(' ')
        if (words.length > 5) {
          pointsFor.push({
            title: `Supporting Factor ${index + 1}`,
            content: sentence.trim()
          })
        }
      })
    }
  }
  
  // Parse points AGAINST with multiple pattern attempts
  const pointsAgainst: Array<{title: string, content: string}> = []
  
  // Try multiple patterns for AGAINST section
  const againstPatterns = [
    /\*\*ARGUMENTS\s+AGAINST:\*\*([\s\S]*?)(?=\*\*Sources|\*\*References|$)/i,
    /(?:Points|Arguments|Factors|Reasons)\s+(?:AGAINST|Against)[^:]*:([\s\S]*?)(?=$)/i,
    /(?:Arguments|Points)\s+(?:against|opposing)\s+(?:yes|YES)[^:]*:([\s\S]*?)(?=$)/i,
    /(?:Con|Cons|Negative|Against|Opposition)\s*[:\-]?([\s\S]*?)(?=$)/i,
    /AGAINST[:\-\s]+([\s\S]*?)(?=$)/i,
    /(?:Points|Arguments|Factors|Reasons)\s+(?:AGAINST|Against)[^:]*:([\s\S]*?)(?=Sources|References|$)/i
  ]
  
  let againstContent = ''
  for (const pattern of againstPatterns) {
    const match = predictionSection.match(pattern)
    if (match && match[1] && match[1].trim()) {
      againstContent = match[1].trim()
      console.log('Found AGAINST section with pattern:', pattern)
      break
    }
  }
  
  if (againstContent) {
    // Try different numbered list patterns with better multi-line capture
    const listPatterns = [
      /(\d+\.\s*[^\n]*(?:\n(?!\s*\d+\.)[^\n]*)*)/g,  // Improved: captures until next numbered item
      /(\*\s*[^\n]*(?:\n(?!\s*\*)[^\n]*)*)/g,        // Improved: captures until next bullet
      /-\s*([^\n]*(?:\n(?!\s*-)[^\n]*)*)/g,          // Improved: captures until next dash
      /(\w[^\n]*(?:\n(?!\s*\d+\.|[*-]|\w+:)[^\n]*)*)/g  // General pattern
    ]
    
    let againstMatches: RegExpMatchArray | null = null
    for (const pattern of listPatterns) {
      againstMatches = againstContent.match(pattern)
      if (againstMatches && againstMatches.length > 0) {
        console.log('Found AGAINST items with pattern:', pattern)
        break
      }
    }
    
    if (againstMatches) {
      console.log('AGAINST matches found:', againstMatches.length)
      againstMatches.forEach((match, index) => {
        console.log(`AGAINST match ${index + 1}:`, match.substring(0, 100) + '...')
        const cleanMatch = match.trim().replace(/^[\d\*\-\s]+/, '').trim()
        if (cleanMatch) {
          const lines = cleanMatch.split('\n').map(line => line.trim()).filter(line => line)
          const firstLine = lines[0] || ''
          
          let title = ''
          let content = ''
          
          if (firstLine.includes(':')) {
            const colonIndex = firstLine.indexOf(':')
            title = firstLine.substring(0, colonIndex).trim()
            content = firstLine.substring(colonIndex + 1).trim()
            if (lines.length > 1) {
              content += ' ' + lines.slice(1).join(' ')
            }
          } else {
            const words = firstLine.split(' ')
            if (words.length > 4) {
              title = words.slice(0, 4).join(' ')
              content = words.slice(4).join(' ')
              if (lines.length > 1) {
                content += ' ' + lines.slice(1).join(' ')
              }
            } else {
              title = `Point ${index + 1}`
              content = lines.join(' ')
            }
          }
          
          if (title && content && content.length > 5) {
            pointsAgainst.push({ title: title.trim(), content: content.trim() })
          }
        }
      })
    } else {
      // Fallback: split by sentences or paragraphs
      const sentences = againstContent.split(/[.!?]\s+/).filter(s => s.trim().length > 10)
      sentences.slice(0, 5).forEach((sentence, index) => {
        const words = sentence.trim().split(' ')
        if (words.length > 5) {
          pointsAgainst.push({
            title: `Opposing Factor ${index + 1}`,
            content: sentence.trim()
          })
        }
      })
    }
  }
  
  // Extract sources
  const sources: string[] = []
  const urlRegex = /https?:\/\/[^\s\)]+/g
  const urls = cleanResponse.match(urlRegex)
  if (urls) {
    const cleanUrls = urls.map(url => 
      url.replace(/[\)\.,;:!?]+$/, '')
    )
    sources.push(...cleanUrls)
  }
  
  // Final debug logging
  console.log('=== PARSING RESULTS ===')
  console.log('Points FOR found:', pointsFor.length)
  console.log('Points AGAINST found:', pointsAgainst.length)
  console.log('Sources found:', sources.length)
  
  return {
    marketInfo: { title: marketTitle, rules },
    predictionOdds: { 
      yesOdds, 
      noOdds, 
      explanation
    },
    pointsFor,
    pointsAgainst,
    sources
  }
}

// Function to detect if this is a multi-outcome market
function detectMultiOutcomeMarket(marketRules: string): { isMultiOutcome: boolean, reason: string } {
  const lowerRules = marketRules.toLowerCase()
  const marketTitle = marketRules.split('\n')[0] || ''
  const lowerTitle = marketTitle.toLowerCase()
  
  console.log('=== MULTI-OUTCOME DETECTION ===')
  console.log('Market title:', marketTitle)
  console.log('Checking for multi-outcome patterns...')
  
  // FIRST: Check for VERY STRONG multi-outcome indicators (these always override)
  const veryStrongMultiOutcomeKeywords = [
    'who will win the election', 'who will be president', 'who will be elected',
    'which candidate will win', 'which team will win the championship',
    'who will be the next president', 'who will be the next governor',
    'which party will control', 'who will win the presidency',
    'who will win the oscar', 'who will win the emmy', 'who will win the grammy',
    'winner of the election', 'winner of the championship', 'winner of the',
    'first place will be', 'champion will be',
    'multiple choice', 'several options', 'various candidates',
    'choose from the following', 'select from:', 'options include:'
  ]
  
  for (const keyword of veryStrongMultiOutcomeKeywords) {
    if (lowerTitle.includes(keyword) || lowerRules.includes(keyword)) {
      console.log('Found VERY STRONG multi-outcome indicator:', keyword)
      return {
        isMultiOutcome: true,
        reason: `Market contains "${keyword}" which clearly indicates multiple specific outcomes`
      }
    }
  }
  
  // SECOND: Check for question-based multi-outcome patterns
  const multiOutcomeQuestionPatterns = [
    /who will (win|be|become|get|receive|take)/i,
    /which (candidate|team|player|person|country|party) will/i,
    /what will be the (winner|result|outcome|champion)/i,
    /who is most likely to (win|be|become)/i,
    /which will (win|be selected|be chosen|come first)/i
  ]
  
  for (const pattern of multiOutcomeQuestionPatterns) {
    if (pattern.test(lowerTitle)) {
      // Check if it's NOT a simple binary question
      const binaryOverrides = [
        'will win against', 'will be above', 'will be below', 'will be over',
        'will be under', 'will reach', 'will exceed', 'will happen',
        'will be true', 'will be false', 'will succeed', 'will fail'
      ]
      
      let isBinaryOverride = false
      for (const override of binaryOverrides) {
        if (lowerTitle.includes(override)) {
          isBinaryOverride = true
          break
        }
      }
      
      if (!isBinaryOverride) {
        console.log('Found multi-outcome question pattern:', pattern)
        return {
          isMultiOutcome: true,
          reason: `Market asks "${lowerTitle.match(pattern)?.[0]}" which typically has multiple possible outcomes`
        }
      }
    }
  }
  
  // THIRD: Check for candidate/competitor lists in title
  const candidatePatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:vs?\.?|versus|or)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:vs?\.?|versus|or)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /\b([A-Z][a-z]+)\s*,\s*([A-Z][a-z]+)\s*,\s*([A-Z][a-z]+)/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\/\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\/\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  ]
  
  for (const pattern of candidatePatterns) {
    const match = marketTitle.match(pattern)
    if (match) {
      console.log('Found candidate list pattern:', match[0])
      return {
        isMultiOutcome: true,
        reason: `Market lists multiple candidates/options (${match.slice(1, 4).join(', ')}) indicating multiple outcomes`
      }
    }
  }
  
  // FOURTH: Check for election/competition-specific keywords
  const competitionKeywords = [
    'election', 'primary', 'nomination', 'tournament', 'championship',
    'competition', 'contest', 'race', 'award', 'prize', 'trophy',
    'mvp', 'best actor', 'best film', 'best player', 'rookie of the year'
  ]
  
  let hasCompetitionKeyword = false
  for (const keyword of competitionKeywords) {
    if (lowerTitle.includes(keyword) || lowerRules.includes(keyword)) {
      hasCompetitionKeyword = true
      break
    }
  }
  
  // If it has competition keywords AND asks "who/which", it's likely multi-outcome
  if (hasCompetitionKeyword) {
    const whoWhichPatterns = ['who will', 'which will', 'who is', 'which is', 'winner of']
    for (const pattern of whoWhichPatterns) {
      if (lowerTitle.includes(pattern)) {
        console.log('Found competition + who/which pattern')
        return {
          isMultiOutcome: true,
          reason: `Market combines competition context with "${pattern}" indicating multiple possible winners`
        }
      }
    }
  }
  
  // FIFTH: Check for multiple named entities in specific contexts
  const properNouns = marketRules.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
  const uniqueNames = [...new Set(properNouns)]
  
  if (uniqueNames.length >= 3) {
    // Check if names appear in title and seem like options
    const namesInTitle = uniqueNames.filter(name => marketTitle.includes(name))
    if (namesInTitle.length >= 3) {
      console.log('Found multiple names in title:', namesInTitle.slice(0, 3))
      return {
        isMultiOutcome: true,
        reason: `Market title mentions multiple people/entities (${namesInTitle.slice(0, 3).join(', ')}) suggesting multiple outcomes`
      }
    }
  }
  
  // SIXTH: Check for option lists and multiple percentages
  const optionPatterns = [
    /[A-C]\)\s*[A-Z]/g,
    /\d+\)\s*[A-Z][a-z]+/g,
    /Option\s+[ABC]:/gi,
    /Choice\s+\d+:/gi
  ]
  
  for (const pattern of optionPatterns) {
    const matches = marketRules.match(pattern) || []
    if (matches.length >= 3) {
      console.log('Found option list format:', matches.slice(0, 2))
      return {
        isMultiOutcome: true,
        reason: `Market contains option list format (${matches.slice(0, 2).join(', ')}) indicating multiple choices`
      }
    }
  }
  
  // SEVENTH: Check for multiple percentages with names
  const namedPercentagePattern = /\d+%\s*[-:]?\s*[A-Z][a-z]+/g
  const percentageMatches = marketRules.match(namedPercentagePattern) || []
  if (percentageMatches.length >= 3) {
    console.log('Found multiple named percentages:', percentageMatches.slice(0, 3))
    return {
      isMultiOutcome: true,
      reason: `Market contains multiple named percentages (${percentageMatches.slice(0, 3).join(', ')}) suggesting multiple outcomes`
    }
  }
  
  console.log('No multi-outcome patterns found - defaulting to binary')
  return { isMultiOutcome: false, reason: '' }
}

export default function PredictionInterface() {
  const [eventLink, setEventLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [isForExpanded, setIsForExpanded] = useState(false)
  const [isAgainstExpanded, setIsAgainstExpanded] = useState(false)
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
    
    try {
      // Make API call to our endpoint
      const response = await fetch(`/api/fetch-market?url=${encodeURIComponent(eventLink)}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch market data')
      }
      
      // Check if this is a multi-outcome market before processing
      const multiOutcomeCheck = detectMultiOutcomeMarket(result.data)
      
      if (multiOutcomeCheck.isMultiOutcome) {
        // Handle multi-outcome market
        const prediction: PredictionData = {
          title: "Multi-Outcome Market Detected",
          probability: 0,
          confidence: 0,
          payout: 0,
          category: 'Entertainment',
          apiResponse: result.data,
          isMultiOutcome: true,
          multiOutcomeReason: multiOutcomeCheck.reason
        }
        
        setPrediction(prediction)
        
        toast({
          title: "⚠️ Multi-Outcome Market",
          description: "This market has multiple possible outcomes. Binary analysis is available only.",
          variant: "destructive"
        })
        
        return
      }
      
      // Parse the AI response into sections for binary markets
      const parsedResponse = parseAIResponse(result.data)
      
      // Create prediction with API response data
      const prediction: PredictionData = {
        title: parsedResponse.marketInfo.title,
        probability: 0,
        confidence: 0,
        payout: 0,
        category: 'Entertainment',
        apiResponse: result.data,
        parsedResponse
      }
      
      setPrediction(prediction)
      
      toast({
        title: "📈 Analysis Complete!",
        description: "Market data analyzed successfully",
      })
      
    } catch (error) {
      console.error('API error:', error)
      
      toast({
        title: "❌ API Error",
        description: error instanceof Error ? error.message : "Failed to fetch data",
        variant: "destructive"
      })
      
    } finally {
      setIsLoading(false)
    }
  }

  const resetPrediction = () => {
    setPrediction(null)
    setEventLink('')
    setIsForExpanded(false)
    setIsAgainstExpanded(false)
  }

  return (
    <div className="min-h-screen p-6 bg-black">
      {/* Sphere background - absolute center */}
      <div className="fixed left-1/4 top-0/3 -translate-x-1/4 -translate-y-1/4 pointer-events-none">
        <InlineSphere />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mt-4">
              <p className="text-blue-300 text-sm text-center">
                ℹ️ This tool only works for <strong>binary Yes/No predictions</strong>. Multi-outcome markets will be supported soon.
              </p>
            </div>
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
            ) : prediction.isMultiOutcome ? (
              /* Multi-Outcome Market Warning */
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border-orange-500/50">
                  <CardHeader>
                    <CardTitle className="text-2xl text-orange-400 text-center flex items-center justify-center gap-2">
                      ⚠️ Multi-Outcome Market Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-600/30">
                      <h4 className="text-orange-300 font-semibold mb-2">Why can't this be analyzed?</h4>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {prediction.multiOutcomeReason}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        This tool is designed for <strong>binary Yes/No predictions</strong> only. 
                        Markets with multiple possible outcomes (like elections, competitions, or "who will win" questions) 
                        require different analysis methods.
                      </p>
                    </div>
                    
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600/30">
                      <h4 className="text-blue-300 font-semibold mb-2">What markets work with this tool?</h4>
                      <div className="text-gray-300 text-sm space-y-1">
                        <p>✅ "Will X happen by Y date?"</p>
                        <p>✅ "Will X reach Y price?"</p>
                        <p>✅ "Will X be approved/rejected?"</p>
                        <p>✅ Any market with only <strong>YES</strong> or <strong>NO</strong> outcomes</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-600/30">
                      <h4 className="text-purple-300 font-semibold mb-2">Coming Soon</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Multi-outcome market analysis is planned for a future update. 
                        We're working on advanced algorithms to handle complex prediction scenarios.
                      </p>
                    </div>
                    
                    <div className="text-center pt-4">
                      <Button
                        onClick={resetPrediction}
                        className="bg-gradient-to-r from-[#00ffff] to-[#0099ff] hover:from-[#00ffff]/90 hover:to-[#0099ff]/90 text-black font-semibold px-8 py-3"
                      >
                        ← Try Another Market
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Market Information Section */}
                {prediction.parsedResponse && (
                  <div className="space-y-6">
                    {/* Market Header */}
                    <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50">
                      <CardHeader>
                        <CardTitle className="text-2xl text-[#00ffff] text-center">
                          📊 {prediction.parsedResponse.marketInfo.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <h4 className="text-white font-semibold mb-2">Market Rules:</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {prediction.parsedResponse.marketInfo.rules}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Odds Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* YES Odds */}
                      <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-green-400 text-center">
                            ✅ YES
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="text-4xl font-bold text-green-300 mb-2">
                            {prediction.parsedResponse.predictionOdds.yesOdds}
                          </div>
                          <p className="text-green-200 text-sm font-medium">
                            Chance of happening
                          </p>
                        </CardContent>
                      </Card>

                      {/* NO Odds */}
                      <Card className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border-red-500/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-red-400 text-center">
                            ❌ NO
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="text-4xl font-bold text-red-300 mb-2">
                            {prediction.parsedResponse.predictionOdds.noOdds}
                          </div>
                          <p className="text-red-200 text-sm font-medium">
                            Chance of NOT happening
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Points FOR */}
                    {prediction.parsedResponse.pointsFor.length > 0 && (
                      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30">
                        <CardHeader>
                          <CardTitle className="text-xl text-green-400">
                            ✅ Arguments FOR
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {(isForExpanded ? prediction.parsedResponse.pointsFor : prediction.parsedResponse.pointsFor.slice(0, 5)).map((point, index) => (
                            <div key={index} className="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                              <h5 className="text-green-300 font-semibold mb-2">
                                {index + 1}. {point.title}
                              </h5>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {point.content}
                              </p>
                            </div>
                          ))}
                          
                          {prediction.parsedResponse.pointsFor.length > 5 && (
                            <div className="text-center pt-2">
                              <button
                                onClick={() => setIsForExpanded(!isForExpanded)}
                                className="flex items-center justify-center mx-auto px-4 py-2 bg-green-800/30 hover:bg-green-800/50 border border-green-600/50 rounded-lg text-green-300 text-sm font-medium transition-all duration-200"
                              >
                                {isForExpanded ? (
                                  <>
                                    <span>Show Less</span>
                                    <svg className="w-4 h-4 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <span>Show {prediction.parsedResponse.pointsFor.length - 5} More</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Points AGAINST */}
                    {prediction.parsedResponse.pointsAgainst.length > 0 && (
                      <Card className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/30">
                        <CardHeader>
                          <CardTitle className="text-xl text-red-400">
                            ❌ Arguments AGAINST
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {(isAgainstExpanded ? prediction.parsedResponse.pointsAgainst : prediction.parsedResponse.pointsAgainst.slice(0, 5)).map((point, index) => (
                            <div key={index} className="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                              <h5 className="text-red-300 font-semibold mb-2">
                                {index + 1}. {point.title}
                              </h5>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {point.content}
                              </p>
                            </div>
                          ))}
                          
                          {prediction.parsedResponse.pointsAgainst.length > 5 && (
                            <div className="text-center pt-2">
                              <button
                                onClick={() => setIsAgainstExpanded(!isAgainstExpanded)}
                                className="flex items-center justify-center mx-auto px-4 py-2 bg-red-800/30 hover:bg-red-800/50 border border-red-600/50 rounded-lg text-red-300 text-sm font-medium transition-all duration-200"
                              >
                                {isAgainstExpanded ? (
                                  <>
                                    <span>Show Less</span>
                                    <svg className="w-4 h-4 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <span>Show {prediction.parsedResponse.pointsAgainst.length - 5} More</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Sources */}
                    {prediction.parsedResponse.sources.length > 0 && (
                      <Card className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 border-gray-500/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-gray-400">
                            🔗 Sources & References
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {prediction.parsedResponse.sources.map((source, index) => (
                              <a
                                key={index}
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-400 hover:text-blue-300 text-sm break-all hover:underline"
                              >
                                {source}
                              </a>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={resetPrediction}
                    variant="outline"
                    className="flex-1 py-4 text-lg border-primary text-primary hover:bg-primary/10"
                  >
                    🔄 New Request
                  </Button>
                  <Button 
                    className="flex-1 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
                    onClick={() => navigator.clipboard.writeText(prediction.apiResponse || '')}
                  >
                    📋 Copy Response
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