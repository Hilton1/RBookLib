
# Relatório de Testes – R Book Lib

## Escopo
Foram implementados testes unitários para a camada **LibraryService** (regras de negócio), cobrindo cadastros, empréstimos, devoluções e remoções, além de quatro evoluções solicitadas.

## Itens testados (Parte 1)
- Cadastro de Livro: título duplicado; quantidade inválida.
- Cadastro de Usuário: duplicidade de ID.
- Empréstimo: livro inexistente; livro sem estoque; usuário inexistente; limite de 3; empréstimo duplicado; sucesso.
- Devolução: usuário não tem o livro; livro inexistente; exceder quantidade máxima; sucesso.
- Remoção de Livro: erro quando há empréstimos; sucesso quando disponível.

## Evoluções implementadas e testadas (Parte 2)
- **NF01**: busca por termo no título/autor (case-insensitive).
- **NF05**: relatório de disponibilidade (títulos, emprestados e disponíveis).
- **NF07**: limite de empréstimos configurável, com validações.
- **NF08**: remoção de usuário apenas sem empréstimos ativos.

## Como rodar
```
npm install
npm test
# cobertura opcional
npx jest --coverage --runInBand
```

## Resultados esperados
Todos os testes devem passar. A cobertura pode ser inspecionada com o comando de coverage.

## Observações
- O repositório em memória simula o armazenamento e o histórico mínimo para datas de empréstimo/devolução.
- O pacote traz uma UI mínima (não testada), pois o objetivo é avaliar a camada de domínio.
