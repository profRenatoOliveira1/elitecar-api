import type { Request, Response } from "express";
import Cliente from "../model/Cliente.js";
import type { ClienteDTO } from "../interfaces/ClienteDTO.js";

/**
 * Classe responsável por receber a requisição do cliente, processar essa requisição e devolver a resposta ao cliente
 * 
 * Trata apenas de requisições relacionadas ao recurso Cliente
 */
class ClienteController {

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

    /**
     * Faz a chamada ao modelo para obter o cliente selecionado e devolve ao cliente
     * 
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do cliente selecionado
     * @returns (400) Erro no ID do cliente
     * @returns (500) Erro na consulta
     */
    static async cliente(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idCliente da URL e converte para número
            // Exemplo: se a rota for /clientes/3, o valor "3" será convertido para número
            const idCliente: number = parseInt(req.params.idCliente as string);

            // Verifica se o ID é inválido (não é número ou é menor ou igual a zero)
            // Se for, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(idCliente) || idCliente <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto." });
            }

            // Chama o método listarCliente da classe Cliente, passando o idCliente como argumento
            // Se não encontrar o cliente, retorna null
            const cliente: Cliente | null = await Cliente.listarCliente(idCliente);

            // Verifica se nenhum cliente foi encontrado com o ID fornecido
            // Se for o caso, retorna uma resposta HTTP com status 200 (OK) e uma mensagem informando isso
            if (cliente === null) {
                return res.status(200).json({ mensagem: "Nenhum cliente encontrado com o ID fornecido." });
            }

            // Se o ID for válido e o cliente existir, retorna o objeto cliente com status 200 (OK)
            return res.status(200).json(cliente);
        } catch (error) {
            // Em caso de erro, exibe a mensagem no console para ajudar na depuração
            console.error(`Erro ao consultar modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (erro interno do servidor)
            // Envia uma mensagem informando que não foi possível acessar os dados
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de clientes." });
        }
    }
}

export default ClienteController;