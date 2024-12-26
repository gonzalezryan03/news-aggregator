// Simple auth service (you might want to replace this with Firebase Auth or similar)
export const auth = {
  currentUser: null,
  
  async login(email, password) {
    // TODO: Replace with real authentication
    if (email && password) {
      this.currentUser = { email, id: Date.now().toString() };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error('Invalid credentials');
  },

  async register(email, password) {
    // TODO: Replace with real registration
    if (email && password) {
      this.currentUser = { email, id: Date.now().toString() };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error('Invalid registration');
  },

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
    return this.currentUser;
  }
}; 