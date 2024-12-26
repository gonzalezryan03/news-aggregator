// Service for managing saved articles
export const userService = {
  getSavedArticles() {
    const saved = localStorage.getItem('savedArticles');
    return saved ? JSON.parse(saved) : {};
  },

  saveArticle(userId, article) {
    const saved = this.getSavedArticles();
    if (!saved[userId]) {
      saved[userId] = [];
    }
    saved[userId].push({
      ...article,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedArticles', JSON.stringify(saved));
  },

  removeSavedArticle(userId, articleUrl) {
    const saved = this.getSavedArticles();
    if (saved[userId]) {
      saved[userId] = saved[userId].filter(article => article.url !== articleUrl);
      localStorage.setItem('savedArticles', JSON.stringify(saved));
    }
  },

  isArticleSaved(userId, articleUrl) {
    const saved = this.getSavedArticles();
    return saved[userId]?.some(article => article.url === articleUrl) || false;
  }
}; 