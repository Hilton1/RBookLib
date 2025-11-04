
import { ConsoleUI } from "./ui/consoleUI.js";
import { InMemoryRepository } from "./repos/InMemoryRepository.js";
import { LibraryService } from "./services/LibraryService.js";

const repo = new InMemoryRepository();
const service = new LibraryService(repo);
const ui = new ConsoleUI(service);

ui.start();
