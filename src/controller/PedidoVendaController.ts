import type { Request, Response } from "express";
import PedidoVenda from "../model/PedidoVenda.js";
import type { PedidoVendaDTO } from "../interfaces/PedidoVendaDTO.js";

/**
 * Classe responsável por receber a requisição do cliente, processar essa requisição e devolver a resposta ao cliente
 * 
 * Trata apenas de requisições relacionadas ao recurso PedidoVenda
 */
class PedidoVendaController extends PedidoVenda {

    /**
     * Faz a chamada ao modelo para obter a lista de pedidos de venda e devolve ao cliente
     * 
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os pedidos
     * @returns (500) Erro na consulta
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarPedidosVenda da classe PedidoVenda para buscar os pedidos no banco de dados
            // Se o método retornar null ou undefined, usa um array vazio como valor padrão
            const listaPedidos: Array<PedidoVendaDTO> = await PedidoVenda.listarPedidosVenda() ?? [];

            // Retorna uma resposta HTTP com status 200 (OK)
            // Envia a lista de pedidos em formato JSON para o cliente
            return res.status(200).json(listaPedidos);
        } catch (error) {
            // Em caso de erro na execução do método, exibe uma mensagem de erro no console
            console.error(`Erro ao consultar modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível acessar os dados
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de pedidos." });
        }
    }

    static async pedido(req: Request, res: Response): Promise<Response> {
        try {
            const idPedido: number = parseInt(req.params.idPedido as string);

            if(isNaN(idPedido) || idPedido <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto." });
            }

            const pedido: PedidoVendaDTO | null = await PedidoVenda.listarPedidoVenda(idPedido);

            if(pedido === null) {
                return res.status(200).json({ mensagem: "Nenhum pedido encontrado com o ID fornecido." });
            }

            return res.status(200).json(pedido);
        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de pedidos." });
        }
    }
}

export default PedidoVendaController;