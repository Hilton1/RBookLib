import promptSync from "prompt-sync";

export class ConsoleUI {
  constructor(service) {
    this.service = service;
    this.prompt = promptSync({ sigint: true });
  }

  start() {
    console.log("R Book Lib - Console (demonstração). Para testes, use `npm test`.");
    this.run();
  }

  run() {
    let opt;
    do {
      opt = this.showMenu();

      try {
        switch (opt) {
          case "1": {  // Cadastrar Livro
            const title = this.prompt("Título: ");
            const author = this.prompt("Autor: ");
            const q = parseInt(this.prompt("Quantidade: "), 10);
            this.service.addBook(title, author, q);
            console.log("Livro cadastrado.");
            break;
          }
          case "2": {  // Listar Livros
            console.log("Livros cadastrados:");
            this.service.listBooks().forEach(b => {
              console.log(`${b.title} - ${b.author} | Disponível: ${b.quantityAvailable}`);
            });
            break;
          }
          case "3": {  // Remover Livro
            const title = this.prompt("Título a remover: ");
            this.service.removeBook(title);
            console.log("Livro removido.");
            break;
          }
          case "4": {  // Cadastrar Usuário
            const id = this.prompt("ID do usuário: ");
            const name = this.prompt("Nome: ");
            this.service.addUser(id, name);
            console.log("Usuário cadastrado.");
            break;
          }
          case "5": {  // Listar Usuários
            console.log("Usuários cadastrados:");
            this.service.listUsers().forEach(u => {
              console.log(`${u.id} - ${u.name}`);
            });
            break;
          }
          case "6": {  // Emprestar Livro
            const userId = this.prompt("ID do usuário: ");
            const title = this.prompt("Título do livro: ");
            this.service.borrowBook(userId, title);
            console.log("Empréstimo realizado.");
            break;
          }
          case "7": {  // Devolver Livro
            const userId = this.prompt("ID do usuário: ");
            const title = this.prompt("Título do livro: ");
            this.service.returnBook(userId, title);
            console.log("Devolução realizada.");
            break;
          }
          case "8": {  // Listar Empréstimos de Usuário
            const userId = this.prompt("ID do usuário: ");
            const loans = this.service.listUserLoans(userId);
            console.log(`Empréstimos de ${userId}: ${loans.join(", ") || "(nenhum)"}`);
            break;
          }
          case "9": {  // Buscar Livro
            const term = this.prompt("Digite o termo de busca (título ou autor): ");
            const results = this.service.searchBooks(term);
            if (results.length === 0) {
              console.log("Nenhum livro encontrado.");
            } else {
              results.forEach(b => console.log(`${b.title} - ${b.author}`));
            }
            break;
          }
          case "10": {  // Relatório de Disponibilidade
            const report = this.service.getAvailabilityReport();
            console.log("Relatório de Disponibilidade:");
            console.log(`Total de livros: ${report.totalTitles}`);
            console.log(`Total de exemplares: ${report.totalExemplares}`);
            console.log(`Livros emprestados: ${report.emprestados}`);
            console.log(`Livros disponíveis: ${report.disponiveis}`);
            break;
          }
          case "11": {  // Definir Limite de Empréstimos
            const limit = parseInt(this.prompt("Defina o limite de empréstimos por usuário: "), 10);
            try {
              this.service.setLoanLimit(limit);
              console.log(`Limite de empréstimos alterado para ${limit}.`);
            } catch (err) {
              console.log("Erro:", err.message);
            }
            break;
          }
          case "12": {  // Remover Usuário
            const userId = this.prompt("ID do usuário a remover: ");
            try {
              this.service.removeUser(userId);
              console.log("Usuário removido.");
            } catch (err) {
              console.log("Erro:", err.message);
            }
            break;
          }
          case "0": {  // Sair
            console.log("Até logo!");
            break;
          }
          default:
            console.log("Opção inválida.");
        }
      } catch (err) {
        console.log("Erro:", err.message);
      }

      if (opt !== "0") this.pause();
    } while (opt !== "0");
  }

  showMenu() {
    console.log("\nEscolha uma opção:");
    console.log("1 - Cadastrar Livro");
    console.log("2 - Listar Livros");
    console.log("3 - Remover Livro");
    console.log("4 - Cadastrar Usuário");
    console.log("5 - Listar Usuários");
    console.log("6 - Emprestar Livro");
    console.log("7 - Devolver Livro");
    console.log("8 - Listar Empréstimos de Usuário");
    console.log("9 - Buscar Livro");
    console.log("10 - Relatório de Disponibilidade");
    console.log("11 - Definir Limite de Empréstimos");
    console.log("12 - Remover Usuário");
    console.log("0 - Sair");

    return this.prompt("Opção: ");
  }

  pause() {
    console.log("\nPressione qualquer tecla para continuar...");
    this.prompt();
  }
}
