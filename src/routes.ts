import type { Request, Response } from "express"; // Importa módulo Request e Response do pacote Express
import { Router } from "express"; // Importa o módulo Router do pacote Express
import CarroController from "./controller/CarroController.js";
import ClienteController from "./controller/ClienteController.js";

const router = Router(); // Cria um novo roteador

// Cria uma rota no servidor, acessível pelo verbo GET no endpoint /
// Essa rota apenas exibe uma menssagem para o cliente com o status da API
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Se você está vendo essa mensagem, seu servidor está funcionando." });
});

/**
 * Endpoints (rotas) para Carros
 */
// Retorna a lista com todos os carros
router.get("/api/carros", CarroController.todos);
// Retorna um carro com ID específico
router.get("/api/carros/:idCarro", CarroController.carro);
// Insere um novo carro no banco
router.post("/api/carros", CarroController.novo);
// Atualiza um carro no banco
router.put("/api/carros/:idCarro", CarroController.atualizar)
// Remove um carro no banco
router.put("/api/remover/carros/:idCarro", CarroController.remover);

/**
 * Endpoints (rotas) para Clientes
 */
// Retorna a lista com todos os clientes
router.get("/api/clientes", ClienteController.todos);
// Retorna um cliente com o ID específico
router.get("/api/clientes/:idCliente", ClienteController.cliente);
// Insere um novo cliente no banco
router.post("/api/clientes", ClienteController.novo);
// Atualiza um cliente no banco
router.put("/api/clientes/:idCliente", ClienteController.atualizar);
// Remover um cliente do banco
router.put("/api/remover/clientes/:idCliente", ClienteController.remover);

export { router }; // Exporta do roteador