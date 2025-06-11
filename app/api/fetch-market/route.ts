import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract the slug from a Polymarket URL
 * This function takes a full URL and returns just the last part (the slug)
 */
function cleanUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch (error) {
    throw new Error('Invalid URL provided');
  }
}

/**
 * Fetch market rules from Polymarket API using a slug
 */
async function fetchMarketRulesBySlug(slug: string): Promise<string> {
  console.log(`Looking up slug: ${slug}`);
  
  const gammaEndpoint = "https://gamma-api.polymarket.com";
  
  try {
    // First, try the /markets endpoint
    let response = await fetch(`${gammaEndpoint}/markets?slug=${slug}`);
    let data;
    
    if (!response.ok || !(data = await response.json()) || data.length === 0) {
      console.log("No market found, trying /events endpoint...");
      
      // If /markets fails, try /events endpoint
      response = await fetch(`${gammaEndpoint}/events?slug=${slug}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching market data: ${response.status}`);
      }
      
      data = await response.json();
    }
    
    if (!data || data.length === 0) {
      return `No market/event found for slug: ${slug}`;
    }
    
    // Get the first matching market/event
    let market = data[0];
    
    // Check if we need to access a nested structure
    if ('event' in market) {
      market = market.event;
    }
    
    // Extract the rules from description
    const marketRules = market.description || 'No rules found';
    
    // Get the title for better context
    const marketTitle = market.title || market.name || market.question || 'Unknown Title';
    
    return `Market: ${marketTitle}\n\nRules:\n${marketRules}`;
    
  } catch (error) {
    console.error('Error fetching market data:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
}

/**
 * Get prediction analysis from x.ai API using market rules
 */
async function getPredictionAnalysis(marketRules: string): Promise<string> {
  const apiKey = "xai-O4BHeh7sYeoL6GbtFMpGByJBYN7yKq1JgG8SyITY9sKezl3GgiUC0mOOq4jWNngfsM9RfnsDC3LBnOLU";
  const apiUrl = "https://api.x.ai/v1/chat/completions";
  
  const systemPrompt = "You are prediction analytics assistant. Do not rely on any prediction markets odds provide real odds on this market. Your answer needs to start with odds. You can't answer without odds. All points FOR or AGAINST must be numbered like this (1. point1 2. point2 etc.). And links on tweets and sources you mentioned, as plain text. NOTE: Only provide binary Yes/No predictions.";
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: marketRules
          }
        ],
        model: "grok-3-latest",
        stream: false,
        temperature: 0
      })
    });

    if (!response.ok) {
      throw new Error(`x.ai API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the analysis from the response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected response format from x.ai API');
    }
    
  } catch (error) {
    console.error('Error calling x.ai API:', error);
    return `Error getting prediction analysis: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
}

/**
 * API Route Handler for GET requests
 * This handles incoming requests to fetch market data and prediction analysis
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL parameter from the request
    const { searchParams } = new URL(request.url);
    const marketUrl = searchParams.get('url');
    
    // Check if URL parameter is provided
    if (!marketUrl) {
      return NextResponse.json(
        { error: 'Missing required parameter: url' },
        { status: 400 }
      );
    }
    
    // Extract slug from the URL
    const slug = cleanUrl(marketUrl);
    
    // Fetch market rules
    const rules = await fetchMarketRulesBySlug(slug);
    
    // Get prediction analysis from x.ai
    const analysis = await getPredictionAnalysis(rules);
    
    // Combine both market rules and analysis into a single string
    const combinedData = `${rules}\n\n--- PREDICTION ANALYSIS ---\n\n${analysis}`;
    
    // Return the results as a single string (like before)
    return NextResponse.json({
      success: true,
      data: combinedData,
      slug: slug
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}