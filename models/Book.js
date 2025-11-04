
export class Book {
  constructor(title, author, quantity) {
    if (!title || typeof title !== "string" || !title.trim()) {
      throw new Error("Título inválido.");
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      throw new Error("Quantidade inválida.");
    }
    // Regra: quantidade original máxima 5 (RN02)
    if (quantity > 5) {
      throw new Error("Quantidade máxima por título é 5.");
    }
    this.title = title.trim();
    this.author = author || "";
    this.quantityOriginal = quantity;
    this.quantityAvailable = quantity;
  }
}
