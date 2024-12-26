import React, { useState, useEffect } from 'react';
import { NewsList } from './components/NewsList';
import { fetchNews, summarizeArticle } from './services/api';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('technology');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Separate effect for fetching articles
  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const articles = await fetchNews(searchQuery);
        
        if (!articles || !Array.isArray(articles)) {
          throw new Error('Invalid response from news API');
        }

        // Initialize articles with placeholder summaries
        const articlesWithPlaceholders = articles.slice(0, 10).map(article => ({
          ...article,
          summary: 'Loading summary...',
          isSummarizing: true
        }));
        
        setNews(articlesWithPlaceholders);
        setIsLoading(false);

        // Start summarization process after articles are displayed
        for (let i = 0; i < articlesWithPlaceholders.length; i++) {
          const article = articlesWithPlaceholders[i];
          try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const content = article.content || article.description || '';
            const summary = await summarizeArticle(content);
            
            setNews(currentNews => currentNews.map((item, index) => 
              index === i ? { ...item, summary, isSummarizing: false } : item
            ));
          } catch (error) {
            setNews(currentNews => currentNews.map((item, index) => 
              index === i ? { 
                ...item, 
                summary: 'Summary unavailable. Click to try again.', 
                isSummarizing: false 
              } : item
            ));
          }
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setNews([]);
      }
    };

    if (searchQuery) {
      getNews();
    }
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  // Add retry functionality for failed summaries
  const handleRetrySummary = async (index) => {
    const article = news[index];
    if (!article.isSummarizing) {
      setNews(currentNews => currentNews.map((item, i) => 
        i === index ? { ...item, isSummarizing: true, summary: 'Retrying summary...' } : item
      ));

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const content = article.content || article.description || '';
        const summary = await summarizeArticle(content);
        
        setNews(currentNews => currentNews.map((item, i) => 
          i === index ? { ...item, summary, isSummarizing: false } : item
        ));
      } catch (error) {
        setNews(currentNews => currentNews.map((item, i) => 
          i === index ? { 
            ...item, 
            summary: 'Summary unavailable. Click to try again.', 
            isSummarizing: false 
          } : item
        ));
      }
    }
  };

  return (
    <div className="app">
      <h1>My News Feed</h1>
      <input
        type="text"
        placeholder="Search news..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleSearchSubmit}
      />
      {isLoading && <p>Loading articles...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && (
        <NewsList 
          news={news} 
          onRetrySummary={handleRetrySummary}
        />
      )}
    </div>
  );
}

export default App;