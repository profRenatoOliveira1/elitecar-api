import Cliente from "../model/Cliente.js";
import type { Request, Response } from "express";

/**
 * Classe responsável por receber a requisição do cliente, processar essa requisição e devolver a resposta ao cliente
 * 
 * Trata apenas de requisições relacionadas ao recurso Cliente
 */
class ClienteController extends Cliente {

    /**
     * Faz a chamada ao modelo para obter a lista de clientes e devolve ao cliente
     * 
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os clientes
     * @returns (500) Erro na consulta
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarClientes da classe Cliente para buscar todos os clientes no banco de dados
            const listaClientes: Array<Cliente> | null = await Cliente.listarClientes();

            // Retorna uma resposta HTTP com status 200 (OK) e envia a lista de clientes em formato JSON
            return res.status(200).json(listaClientes);
        } catch (error) {
            // Em caso de erro, exibe a mensagem no console para ajudar na depuração
            console.error(`Erro ao consultar modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (erro interno do servidor)
            // Envia uma mensagem informando que não foi possível acessar os dados
            return res.status(500).json({ mensagem: "Não foi possivel acessar a lista de clientes." });
        }

    }
}

export default ClienteController;