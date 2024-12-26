const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Introduce a delay to avoid exceeding usage limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchNews(query) {
  // For development - force localhost:5173 or other local ports
  if (!window.location.hostname.includes('localhost')) {
    console.warn('News API only works on localhost in development mode');
    // Return mock data or error message for non-localhost environments
    return [{
      title: "API Limitation",
      description: "News API requires localhost or a paid plan. Please run the application locally.",
      url: "#",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: "The free News API plan only works on localhost."
    }];
  }

  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}`;

  try {
    await delay(500);
    const response = await fetch(newsApiUrl, {
      headers: {
        'User-Agent': 'news-aggregator/1.0',
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('News API response:', data);
    
    if (!data || !data.articles) {
      throw new Error('Invalid API response format');
    }
    
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function summarizeArticle(articleContent) {
  const prompt = `Summarize this news article in 3 concise sentences: ${articleContent}`;
  const geminiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
    geminiApiKey; // Already HTTPS

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;
    return summary;
  } catch (error) {
    console.error('Error summarizing with Gemini:', error);
    return 'Summary unavailable.';
  }
}