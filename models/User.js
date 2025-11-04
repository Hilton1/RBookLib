
export class User {
  constructor(id, name) {
    if (!id && id !== 0) throw new Error("ID inválido.");
    this.id = id;
    this.name = name || "";
    this.loans = []; // array de títulos
  }
}
