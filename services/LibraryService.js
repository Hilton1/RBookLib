
import { Book } from "../models/Book.js";
import { User } from "../models/User.js";

export class LibraryService {
  constructor(repo) {
    this.repo = repo;
    this.loanLimit = 3; // NF07: limite configurável (padrão 3)
  }

  // NF07: configurar limite
  setLoanLimit(n) {
    if (typeof n !== "number" || n < 1) throw new Error("Limite inválido.");
    this.loanLimit = n;
  }
  getLoanLimit() {
    return this.loanLimit;
  }

  // Livros
  addBook(title, author, quantity) {
    // RN01 + RN02
    const book = new Book(title, author, quantity);
    if (this.repo.getBook(book.title)) throw new Error("Livro já cadastrado.");
    this.repo.addBook(book);
    return book;
  }
  listBooks() {
    return this.repo.listBooks();
  }
  removeBook(title) {
    const book = this.repo.getBook(title);
    if (!book) throw new Error("Livro não encontrado.");
    // RN06: só pode remover se todos os exemplares estiverem disponíveis
    if (book.quantityAvailable !== book.quantityOriginal) {
      throw new Error("Não é possível remover: há exemplares emprestados.");
    }
    this.repo.removeBook(title);
  }

  // Usuários
  addUser(id, name) {
    if (this.repo.getUser(id)) throw new Error("Usuário já cadastrado.");
    const user = new User(id, name);
    this.repo.addUser(user);
    return user;
  }
  listUsers() {
    return this.repo.listUsers();
  }
  // NF08: remover usuário sem empréstimos ativos
  removeUser(id) {
    const user = this.repo.getUser(id);
    if (!user) throw new Error("Usuário não encontrado.");
    if (user.loans.length > 0) throw new Error("Usuário possui empréstimos ativos.");
    this.repo.removeUser(id);
  }

  // Empréstimos
  borrowBook(userId, title, now = new Date()) {
    const user = this.repo.getUser(userId);
    if (!user) throw new Error("Usuário não encontrado.");
    const book = this.repo.getBook(title);
    if (!book) throw new Error("Livro não encontrado.");
    if (book.quantityAvailable <= 0) throw new Error("Livro indisponível.");
    // RN04: limite de empréstimos (configurável NF07)
    if (user.loans.length >= this.loanLimit) throw new Error("Limite de empréstimos atingido.");
    // RN05: não pode pegar o mesmo livro duas vezes
    if (user.loans.includes(title)) throw new Error("Empréstimo duplicado proibido.");
    // efetivar
    book.quantityAvailable -= 1;
    user.loans.push(title);
    // NF02: registrar datas (mínimo: registro de empréstimo)
    this.repo.recordLoan(userId, title, now);
    return { user, book };
  }

  returnBook(userId, title, now = new Date()) {
    const user = this.repo.getUser(userId);
    if (!user) throw new Error("Usuário não encontrado.");
    const book = this.repo.getBook(title);
    if (!book) throw new Error("Livro não encontrado.");
    if (!user.loans.includes(title)) throw new Error("Usuário não possui este livro.");
    // RN02: não ultrapassar quantidade original
    if (book.quantityAvailable + 1 > book.quantityOriginal) {
      throw new Error("Devolução excede quantidade máxima.");
    }
    // efetivar
    book.quantityAvailable += 1;
    user.loans = user.loans.filter(t => t !== title);
    // NF02: registrar devolução
    this.repo.recordReturn(userId, title, now);
  }

  listUserLoans(userId) {
    const user = this.repo.getUser(userId);
    if (!user) throw new Error("Usuário não encontrado.");
    return [...user.loans];
  }

  // NF01: buscar por título parcial ou autor (case-insensitive)
  searchBooks(term) {
    const t = (term || "").toLowerCase();
    const all = this.repo.listBooks();
    return all.filter(b =>
      b.title.toLowerCase().includes(t) || (b.author || "").toLowerCase().includes(t)
    );
  }

  // NF05: relatório de disponibilidade
  getAvailabilityReport() {
    const all = this.repo.listBooks();
    let totalTitles = all.length;
    let totalOriginal = all.reduce((acc, b) => acc + b.quantityOriginal, 0);
    let totalAvailable = all.reduce((acc, b) => acc + b.quantityAvailable, 0);
    let totalBorrowed = totalOriginal - totalAvailable;
    return {
      totalTitles,
      totalExemplares: totalOriginal,
      emprestados: totalBorrowed,
      disponiveis: totalAvailable
    };
  }
}
