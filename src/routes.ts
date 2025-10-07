import type { Request, Response } from "express"; // Importa módulo Request e Response do pacote Express
import { Router } from "express"; // Importa o módulo Router do pacote Express

const router = Router(); // Cria um novo roteador

// Cria uma rota no servidor, acessível pelo verbo GET no endpoint /
// Essa rota apenas exibe uma menssagem para o cliente com o status da API
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Se você está vendo essa mensagem, seu servidor está funcionando." });
});

export { router }; // Exporta do roteador