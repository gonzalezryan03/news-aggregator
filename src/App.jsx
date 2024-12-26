import React, { useState, useEffect } from 'react';
import { NewsList } from './components/NewsList';
import { LoginForm } from './components/LoginForm';
import { auth } from './services/auth';
import { userService } from './services/userService';
import { fetchNews, summarizeArticle } from './services/api';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [searchInput, setSearchInput] = useState('technology');
  const [searchQuery, setSearchQuery] = useState('technology');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    // Check for logged in user
    const checkUser = async () => {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
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

  const handleLogin = async () => {
    const currentUser = await auth.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
  };

  const handleSaveArticle = (article) => {
    if (user) {
      userService.saveArticle(user.id, article);
      // Force re-render
      setNews([...news]);
    }
  };

  const handleRemoveSaved = (articleUrl) => {
    if (user) {
      userService.removeSavedArticle(user.id, articleUrl);
      // Force re-render
      setNews([...news]);
    }
  };

  const toggleSaved = () => {
    setShowSaved(!showSaved);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>My News Feed</h1>
        <div className="user-controls">
          <button 
            className="show-saved-btn"
            onClick={toggleSaved}
          >
            {showSaved ? 'Show All News' : 'Show Saved Articles'}
          </button>
          <span className="user-email">{user.email}</span>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {!showSaved && (
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search news..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      )}

      {isLoading && <p>Loading articles...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && (
        <NewsList 
          news={showSaved ? userService.getSavedArticles()[user.id] || [] : news}
          onSaveArticle={handleSaveArticle}
          onRemoveSaved={handleRemoveSaved}
          userId={user.id}
        />
      )}
    </div>
  );
}

export default App;