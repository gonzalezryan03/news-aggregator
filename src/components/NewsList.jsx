import './NewsList.css';

export function NewsList({ news }) {
  // Filter out articles with [Removed] source
  const filteredNews = news.filter(article => 
    article.source && 
    article.source.name && 
    !article.source.name.includes('[Removed]')
  );

  return (
    <div className="news-grid">
      {filteredNews.map((article, index) => (
        <article key={index} className="news-card">
          {article.urlToImage && (
            <div className="news-image">
              <img 
                src={article.urlToImage} 
                alt={article.title}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <div className="news-content">
            <h2>{article.title}</h2>
            <p className="news-source">
              {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p className="news-description">{article.description}</p>
            <div className="news-summary">
              <h3>AI Summary:</h3>
              <p>{article.summary}</p>
            </div>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="read-more"
            >
              Read Full Article →
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}