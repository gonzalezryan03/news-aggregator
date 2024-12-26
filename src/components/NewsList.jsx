import React from 'react';
import NewsItem from './NewsItem';

function NewsList({ news }) {
  return (
    <div className="news-list">
      {news.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </div>
  );
}

export default NewsList;