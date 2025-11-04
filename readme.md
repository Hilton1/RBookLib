
# R Book Lib – Testes de Unidade (Jest)

Implementação do **Sistema Biblioteca R Book Lib** com regras de negócio e **testes unitários em Jest**.

## Requisitos

- Node.js LTS
- npm

## Instalação

```bash
cd rbooklib
npm install
```

## Rodar testes

```bash
npm test
```

Para cobertura:

```bash
npx jest --coverage --runInBand
```

## Estrutura

```
rbooklib/
├─ package.json
├─ app.js
├─ ui/consoleUI.js        # (placeholder)
├─ models/Book.js
├─ models/User.js
├─ repos/InMemoryRepository.js
├─ services/LibraryService.js
└─ tests/libraryService.test.js
```

## Regras cobertas nos testes

- Cadastro de livro: título duplicado; quantidade inválida (<=0); máximo 5 por título.
- Cadastro de usuário: ID duplicado.
- Empréstimo: livro inexistente; quantidade 0; usuário inexistente; limite de empréstimos (padrão 3); empréstimo duplicado; caminho de sucesso.
- Devolução: usuário não possui o livro; livro inexistente; exceder quantidade máxima; caminho de sucesso.
- Remoção de livro: bloqueada com exemplares emprestados; permitida se todos disponíveis.

## Evoluções implementadas (com testes)

- **NF01** – Busca por termo (título/autor), case-insensitive.  
- **NF05** – Relatório de disponibilidade (títulos, emprestados, disponíveis).  
- **NF07** – Limite de empréstimos configurável.  
- **NF08** – Remover usuário (somente quando sem empréstimos).  

## Observações

- O foco dos testes é a camada **LibraryService** (domínio), conforme a atividade.
- A UI de console também está funcional. Para executar rode o comando abaixo no terminal:


```bash
npm start
```

## Equipe
- José Hilton
- Eduardo Augusto
- Wyddenberg Thallys
- João Paulo