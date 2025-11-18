import { Router } from "express"; // Importa o módulo Router do express
import type { Request, Response } from "express"; // Importa os módulos de requisição e resposta
import ClienteController from "./controller/ClienteController.js";
import PedidoVendaController from "./controller/PedidoVendaController.js";
import CarroController from "./controller/CarroController.js";

const router = Router(); // cria uma instância de Router

router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Olá, seja bem-vindo!" });
});

/**
 * Endpoints (rotas) para Clientes
 */
// Retorna a lista com todos os clientes
router.get("/api/clientes", ClienteController.todos);
// Cadastra um novo cliente
router.post("/api/clientes", ClienteController.novo);
// Retorna um cliente a partir do ID
router.get("/api/clientes/:idCliente", ClienteController.cliente);
// Remove um cliente a partir do ID
router.delete("/api/clientes/remover/:idCliente", ClienteController.remover);

/**
 * Endpoints (rotas) para Carros
 */
// Retorna a lista com todos os carros
router.get("/api/carros", CarroController.todos);
// Retorna um carro com ID específico
router.get("/api/carros/:idCarro", CarroController.carro);
// Insere um novo carro no banco
router.post("/api/carros", CarroController.novo);
// Remove um carro no banco
router.delete("/api/carros/remover/:idCarro", CarroController.remover);

/**
 * Endpoints (rotas) para PedidosVenda
 */
// Insere um novo pedido no banco
router.post("/api/pedidos", PedidoVendaController.novo);
// Remover um pedido do banco
router.put("/api/pedidos/remover/:idPedido", PedidoVendaController.remover);

export { router }; // Exporta o roteador