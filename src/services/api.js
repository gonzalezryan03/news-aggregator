const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Introduce a delay to avoid exceeding usage limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchNews(query) {
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}`; // Use HTTPS

  try {
    await delay(500); // Wait for 500 milliseconds
    const response = await fetch(newsApiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
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