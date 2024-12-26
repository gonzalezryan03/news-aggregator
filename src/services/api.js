const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function fetchNews(query) {
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}`;

  try {
      const response = await fetch(newsApiUrl);
      if (!response.ok) {
          // Handle non-2xx status codes (e.g., 404, 500)
          console.error('Error fetching news:', response.status, response.statusText);
          return []; // or throw an error
      }
      const data = await response.json();
      return data.articles || [];  // Safeguard against missing articles property
  } catch (error) {
      console.error('Error fetching news:', error);
      return [];
  }
}


export async function summarizeArticle(articleContent) {
  const prompt = `Summarize this news article in 3 concise sentences: ${articleContent}`;
  const geminiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
    geminiApiKey;
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