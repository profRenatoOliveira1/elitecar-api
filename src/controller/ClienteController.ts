import type { ClienteDTO } from "../interface/ClienteDTO.js";
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

    /**
     * Faz a chamada ao modelo para inserir um novo cliente
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do cliente inserido
     * @returns (400) Erro ao inserir cliente
     * @returns (500) Erro na consulta
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados enviados pelo cliente na requisição HTTP (normalmente via POST)
            // Esses dados devem estar no corpo da requisição e seguir o formato da interface CarroDTO
            const dadosRecebidosCliente = req.body;

            // validação de dados (vamos fazer no futuro)

            // Chama o método cadastrarCarro da classe Carro, passando os dados recebidos
            // Esse método deve inserir o carro no banco de dados e retornar true ou false
            const respostaModelo = await Cliente.cadastrarCliente(dadosRecebidosCliente);

            // Verifica se o cadastro foi bem-sucedido
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 201 (Created)
                // Envia uma mensagem informando que o carro foi cadastrado com sucesso
                return res.status(201).json({ mensagem: "Cliente cadastrado com sucesso." });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que houve erro no cadastro
                return res.status(400).json({ mensagem: "Erro ao cadastrar cliente." });
            }
        } catch (error) {
            // Em caso de erro inesperado (como falha de conexão ou erro interno), exibe a mensagem no console
            console.error(`Erro no modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível inserir o novo carro
            return res.status(500).json({ mensagem: "Não foi possível inserir o cliente" });
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
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            // Chama o método listarCliente da classe Cliente, passando o idCliente como argumento
            // Se não encontrar o cliente, retorna null
            const respostaModelo = await Cliente.listarCliente(idCliente);

            // Verifica se nenhum cliente foi encontrado com o ID fornecido
            // Se for o caso, retorna uma resposta HTTP com status 200 (OK) e uma mensagem informando isso
            if (respostaModelo === null) {
                return res.status(200).json({ mensagem: "Nenhum cliente encontrado com o ID fornecido." });
            }

            // Se o ID for válido e o cliente existir, retorna o objeto cliente com status 200 (OK)
            return res.status(200).json(respostaModelo);
        } catch (error) {
            // Em caso de erro, exibe a mensagem no console para ajudar na depuração
            console.error(`Erro ao acesso o modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (erro interno do servidor)
            // Envia uma mensagem informando que não foi possível acessar os dados
            return res.status(500).json({ mensagem: "Não foi possível recuperar o cliente." });
        }
    }
}

export default ClienteController;