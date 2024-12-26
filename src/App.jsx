import React, { useState, useEffect } from 'react';
import NewsList from './components/NewsList'; // Correct import path
import { fetchNews, summarizeArticle } from './services/api'; // Correct import path
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('technology'); // Default query

  useEffect(() => {
    const getNews = async () => {
      const articles = await fetchNews(searchQuery);
  
      // Conditional check before using map
      const summarizedArticles = Array.isArray(articles) 
        ? await Promise.all(
            articles.map(async (article) => ({
              ...article,
              summary: await summarizeArticle(article.content || article.description),
            }))
          )
        : []; // or handle the error differently
      
      setNews(summarizedArticles);
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
      <NewsList news={news} />
    </div>
  );
}

export default App;