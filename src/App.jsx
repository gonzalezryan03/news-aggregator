import React, { useState, useEffect } from 'react';
import NewsList from './components/NewsList'; // Correct import path
import { fetchNews, summarizeArticle } from './services/api'; // Correct import path
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('technology'); // Default query
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const articles = await fetchNews(searchQuery);
        
        if (!articles || !Array.isArray(articles)) {
          throw new Error('Invalid response from news API');
        }

        const summarizedArticles = await Promise.all(
          articles.map(async (article) => {
            try {
              return {
                ...article,
                summary: await summarizeArticle(article.content || article.description),
              };
            } catch (summaryError) {
              console.error('Error summarizing article:', summaryError);
              return {
                ...article,
                summary: 'Summary unavailable',
              };
            }
          })
        );
        
        setNews(summarizedArticles);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    getNews();
  }, [searchQuery]);
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      // Trigger news fetch when Enter key is pressed
      event.preventDefault(); // Prevent form submission behavior
      // You don't need to call fetchNews here, as the useEffect will
      // automatically refetch when searchQuery changes
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
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && <NewsList news={news} />}
    </div>
  );
}

export default App;