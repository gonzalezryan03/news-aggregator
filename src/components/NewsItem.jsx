import React from 'react';

function NewsItem({ article }) {
  return (
    <div className="news-item">
      <h3>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
      </h3>
      <p>Source: {article.source.name}</p>
      <p>{article.summary}</p>
    </div>
  );
}

export default NewsItem;