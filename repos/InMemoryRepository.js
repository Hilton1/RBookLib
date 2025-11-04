
export class InMemoryRepository {
  constructor() {
    this.books = new Map();   // key: title
    this.users = new Map();   // key: id
    this.loanHistory = new Map(); // key: userId -> [{title, borrowedAt, returnedAt}]
  }

  addBook(book) {
    if (this.books.has(book.title)) throw new Error("Livro já cadastrado.");
    this.books.set(book.title, book);
  }
  getBook(title) {
    return this.books.get(title);
  }
  listBooks() {
    return Array.from(this.books.values());
  }
  removeBook(title) {
    return this.books.delete(title);
  }

  addUser(user) {
    if (this.users.has(user.id)) throw new Error("Usuário já cadastrado.");
    this.users.set(user.id, user);
  }
  getUser(id) {
    return this.users.get(id);
  }
  listUsers() {
    return Array.from(this.users.values());
  }
  removeUser(id) {
    return this.users.delete(id);
  }

  recordLoan(userId, title, borrowedAt) {
    if (!this.loanHistory.has(userId)) this.loanHistory.set(userId, []);
    this.loanHistory.get(userId).push({ title, borrowedAt, returnedAt: null });
  }
  recordReturn(userId, title, returnedAt) {
    const list = this.loanHistory.get(userId) || [];
    const last = [...list].reverse().find(r => r.title === title && r.returnedAt === null);
    if (last) last.returnedAt = returnedAt;
  }
  getLoanHistory(userId) {
    return this.loanHistory.get(userId) || [];
  }
}
