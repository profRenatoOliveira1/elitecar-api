import type { Request, Response } from "express";
import PedidoVenda from "../model/PedidoVenda.js";
import type { PedidoVendaDTO } from "../interface/PedidoVendaDTO.js";

/**
 * Classe responsável por receber a requisição do cliente, processar essa requisição e devolver a resposta ao cliente
 * 
 * Trata apenas de requisições relacionadas ao recurso PedidoVenda
 */
class PedidoVendaController extends PedidoVenda {

    /**
     * Faz a chamada ao modelo para inserir um novo pedido
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do pedido inserido
     * @returns (400) Erro ao inserir pedido
     * @returns (500) Erro na consulta
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados enviados pelo cliente na requisição HTTP (normalmente via POST)
            // Esses dados devem estar no corpo da requisição e seguir o formato da interface PedidoVendaDTO
            const dadosRecebidosPedido: PedidoVendaDTO = req.body;

            // Chama o método cadastrarPedido da classe PedidoVenda, passando os dados recebidos
            // Esse método deve inserir o pedido no banco de dados e retornar true ou false
            const respostaModelo = await PedidoVenda.cadastrarPedido(dadosRecebidosPedido);

            // Verifica se o cadastro foi bem-sucedido
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 201 (Created)
                // Envia uma mensagem informando que o pedido foi cadastrado com sucesso
                return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso." });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que houve erro no cadastro
                return res.status(400).json({ mensagem: "Erro ao cadastrar pedido." });
            }
        } catch (error) {
            // Em caso de erro inesperado (como falha de conexão ou erro interno), exibe a mensagem no console
            console.error(`Erro no modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível inserir o novo pedido
            return res.status(500).json({ mensagem: "Não foi possível inserir o novo pedido." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idPedido da URL e converte para número
            // Exemplo: se a rota for /pedidos/5, o valor "5" será convertido para o número 5
            const idPedido: number = parseInt(req.params.idPedido as string);

            // Verifica se o ID é inválido (não é um número ou é menor ou igual a zero)
            // Se for inválido, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(idPedido) || idPedido <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto" });
            }

            // Chama o método removerPedido da classe Pedido, passando o ID como argumento
            // Esse método deve realizar a remoção lógica do pedido no banco de dados
            const respostaModelo = await PedidoVenda.removerPedido(idPedido);

            // Verifica se a remoção foi bem-sucedida
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 200 (OK) e uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Pedido de venda removido com sucesso!" });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que a remoção falhou e sugere verificar os dados
                return res.status(400).json({ mensagem: "Não foi possível remover o pedido de venda, verifique se as informações foram passadas corretamente." });
            }
        } catch (error) {
            // Em caso de erro inesperado (como falha de conexão ou erro interno), exibe a mensagem no console
            console.error(`Erro no modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível concluir a remoção
            return res.status(500).json({ mensagem: "Não foi possível remover o carro." });
        }
    }
}

export default PedidoVendaController;