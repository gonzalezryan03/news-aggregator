const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Introduce a delay to avoid exceeding usage limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchNews(query) {
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}`;

  try {
    await delay(500);
    const response = await fetch(newsApiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('News API response:', data); // Debug log
    
    if (!data || !data.articles) {
      throw new Error('Invalid API response format');
    }
    
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error; // Propagate the error to be handled by the component
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