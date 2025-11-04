
import { InMemoryRepository } from "../repos/InMemoryRepository.js";
import { LibraryService } from "../services/LibraryService.js";

function setup() {
  const repo = new InMemoryRepository();
  const service = new LibraryService(repo);
  return { repo, service };
}

describe("Cadastro de Livro", () => {
  test("não permite título duplicado", () => {
    const { service } = setup();
    service.addBook("Clean Code", "Robert C. Martin", 2);
    expect(() => service.addBook("Clean Code", "Outro", 1)).toThrow("Livro já cadastrado.");
  });

  test("quantidade inválida (<=0) deve lançar erro", () => {
    const { service } = setup();
    expect(() => service.addBook("TDD", "Kent Beck", 0)).toThrow("Quantidade inválida.");
  });
});

describe("Cadastro de Usuário", () => {
  test("ID duplicado deve lançar erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    expect(() => service.addUser(1, "Maria")).toThrow("Usuário já cadastrado.");
  });
});

describe("Empréstimo", () => {
  test("livro inexistente => erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    expect(() => service.borrowBook(1, "Inexistente")).toThrow("Livro não encontrado.");
  });

  test("quantidade 0 => erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    service.addBook("DDD", "Evans", 1);
    service.borrowBook(1, "DDD");
    expect(() => service.borrowBook(1, "DDD")).toThrow("Livro indisponível.");
  });

  test("usuário inexistente => erro", () => {
    const { service } = setup();
    service.addBook("DDD", "Evans", 1);
    expect(() => service.borrowBook(99, "DDD")).toThrow("Usuário não encontrado.");
  });

  test("usuário com 3 livros emprestados => erro (limite padrão)", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 1);
    service.addBook("B", "X", 1);
    service.addBook("C", "X", 1);
    service.addBook("D", "X", 1);
    service.borrowBook(1, "A");
    service.borrowBook(1, "B");
    service.borrowBook(1, "C");
    expect(() => service.borrowBook(1, "D")).toThrow("Limite de empréstimos atingido.");
  });

  test("empréstimo duplicado do mesmo livro => erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 2);
    service.borrowBook(1, "A");
    expect(() => service.borrowBook(1, "A")).toThrow("Empréstimo duplicado proibido.");
  });

  test("empréstimo bem-sucedido atualiza quantidade e registro", () => {
    const { service, repo } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 2);
    service.borrowBook(1, "A", new Date("2024-01-01"));
    const book = repo.getBook("A");
    const user = repo.getUser(1);
    expect(book.quantityAvailable).toBe(1);
    expect(user.loans).toEqual(["A"]);
    expect(repo.getLoanHistory(1)[0].borrowedAt).toEqual(new Date("2024-01-01"));
  });
});

describe("Devolução", () => {
  test("devolver livro que usuário não emprestou => erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 1);
    expect(() => service.returnBook(1, "A")).toThrow("Usuário não possui este livro.");
  });

  test("devolver quando livro não existe => erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    expect(() => service.returnBook(1, "Inexistente")).toThrow("Livro não encontrado.");
  });

  test("devolução que excederia quantidade máxima (5) => erro", () => {
    const { service, repo } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 1);
    // tentar devolver sem ter emprestado, fará available=1 e exceder 2? Precisamos simular exceder > original
    const book = repo.getBook("A");
    book.quantityAvailable = 5; // já no máximo
    expect(() => service.returnBook(1, "A")).toThrow("Usuário não possui este livro."); // primeiro garante regra
    // agora simula empréstimo e exceder
    service.borrowBook(1, "A");
    book.quantityAvailable = book.quantityOriginal; // igual ao original; devolver excede
    expect(() => service.returnBook(1, "A")).toThrow("Devolução excede quantidade máxima.");
  });

  test("devolução bem-sucedida", () => {
    const { service, repo } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 2);
    service.borrowBook(1, "A");
    service.returnBook(1, "A", new Date("2024-01-03"));
    const book = repo.getBook("A");
    const user = repo.getUser(1);
    expect(book.quantityAvailable).toBe(2);
    expect(user.loans).toEqual([]);
    expect(repo.getLoanHistory(1)[0].returnedAt).toEqual(new Date("2024-01-03"));
  });
});

describe("Remoção de livro", () => {
  test("não pode remover com exemplares emprestados => erro", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 1);
    service.borrowBook(1, "A");
    expect(() => service.removeBook("A")).toThrow("Não é possível remover: há exemplares emprestados.");
  });

  test("pode remover quando todas as cópias disponíveis", () => {
    const { service, repo } = setup();
    service.addBook("A", "X", 1);
    service.removeBook("A");
    expect(repo.getBook("A")).toBeUndefined();
  });
});

// Evoluções
describe("NF01 - busca por termo (título/autor)", () => {
  test("case-insensitive, parcial e vazio", () => {
    const { service } = setup();
    service.addBook("Clean Code", "Robert Martin", 1);
    service.addBook("Domain-Driven Design", "Eric Evans", 1);
    expect(service.searchBooks("clean").map(b => b.title)).toEqual(["Clean Code"]);
    expect(service.searchBooks("eric").map(b => b.title)).toEqual(["Domain-Driven Design"]);
    expect(service.searchBooks("zzz")).toEqual([]);
  });
});

describe("NF07 - limite configurável", () => {
  test("define novo limite e aplica", () => {
    const { service } = setup();
    service.setLoanLimit(2);
    service.addUser(1, "Ana");
    service.addBook("A", "X", 1);
    service.addBook("B", "X", 1);
    service.addBook("C", "X", 1);
    service.borrowBook(1, "A");
    service.borrowBook(1, "B");
    expect(() => service.borrowBook(1, "C")).toThrow("Limite de empréstimos atingido.");
  });

  test("não permite limite < 1", () => {
    const { service } = setup();
    expect(() => service.setLoanLimit(0)).toThrow("Limite inválido.");
  });
});

describe("NF08 - remover usuário sem empréstimos ativos", () => {
  test("não remove quando há empréstimos ativos", () => {
    const { service } = setup();
    service.addUser(1, "Ana");
    service.addBook("A", "X", 1);
    service.borrowBook(1, "A");
    expect(() => service.removeUser(1)).toThrow("Usuário possui empréstimos ativos.");
  });

  test("remove quando não há empréstimos", () => {
    const { service, repo } = setup();
    service.addUser(1, "Ana");
    service.removeUser(1);
    expect(repo.getUser(1)).toBeUndefined();
  });
});

describe("NF05 - relatório de disponibilidade", () => {
  test("contagens corretas", () => {
    const { service } = setup();
    service.addBook("A", "X", 2);
    service.addBook("B", "Y", 1);
    service.addUser(1, "Ana");
    service.borrowBook(1, "A");
    const rep = service.getAvailabilityReport();
    expect(rep.totalTitles).toBe(2);
    expect(rep.totalExemplares).toBe(3);
    expect(rep.emprestados).toBe(1);
    expect(rep.disponiveis).toBe(2);
  });
});
