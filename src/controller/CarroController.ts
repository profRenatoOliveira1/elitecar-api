import type { Request, Response } from "express";
import Carro from "../model/Carro.js";
import type { CarroDTO } from "../interfaces/CarroDTO.js";

/**
 * Classe responsável por receber a requisição do cliente, processar essa requisição e devolver a resposta ao cliente
 * 
 * Trata apenas de requisições relacionadas ao recurso Carro
 */
class CarroController extends Carro {

    /**
     * Faz a chamada ao modelo para obter a lista de carros e devolve ao cliente
     * 
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Lista de todos os carros
     * @returns (500) Erro na consulta
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            // Chama o método listarCarros da classe Carro para obter a lista de carros
            // Se o resultado for null, utiliza um array vazio como valor padrão
            const listaCarros: Array<Carro> = await Carro.listarCarros() ?? [];

            // Retorna a resposta HTTP com status 200 (OK) e envia a lista de carros em formato JSON
            return res.status(200).json(listaCarros);
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console para fins de depuração
            console.error(`Erro ao consultar modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (erro interno do servidor)
            // Envia uma mensagem JSON informando que não foi possível acessar os dados
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de carros." });
        }
    }

    /**
     * Faz a chamada ao modelo para obter a o carro selecionado e devolve ao cliente
     * 
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do carro selecionado
     * @returns (400) Erro no ID do carro
     * @returns (500) Erro na consulta
     */
    static async carro(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idCarro da URL e converte para número
            // Exemplo: se a rota for /carros/5, o valor 5 será convertido para número
            const idCarro: number = parseInt(req.params.idCarro as string);

            // Verifica se o ID é inválido (NaN ou zero)
            // Se for, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(idCarro) || idCarro <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto" });
            }

            // Chama o método listarCarro da classe Carro, passando o idCarro como argumento
            // Se não encontrar o carro, retorna null
            const carro: Carro | null = await Carro.listarCarro(idCarro);

            // Verifica se nenhum carro foi encontrado com o ID fornecido
            // Se for o caso, retorna uma resposta HTTP com status 200 (OK) e uma mensagem informando isso
            if (carro === null) {
                return res.status(200).json({ mensagem: "Nenhum carro encontrado com o ID fornecido" });
            }

            // Se o ID for válido e o carro existir, retorna o objeto carro com status 200 (OK)
            return res.status(200).json(carro);
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console para fins de depuração
            console.error(`Erro ao consultar modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (erro interno do servidor)
            // Envia uma mensagem JSON informando que não foi possível acessar os dados
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de carros." });
        }
    }
}

export default CarroController;