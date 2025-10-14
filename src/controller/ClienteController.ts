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

            // Define um array com os nomes dos campos obrigatórios (idCarro fica de fora)
            // 'as const' transforma o array em uma tupla de literais, útil para inferência de tipo
            const camposObrigatorios = ["nome", "cpf", "telefone"] as const;

            // Cria uma lista com os campos que estão inválidos (undefined, null ou string vazia)
            const camposInvalidos = camposObrigatorios.filter(campo => {
                // Pega o valor do campo específico do DTO dinamicamente
                const valor = dadosRecebidosCliente[campo];

                // Considera inválido quando:
                // - valor === undefined (campo não enviado)
                // - value === null (enviado mas nulo)
                // - valor.toString().trim() === "" (string vazia ou espaços)
                // Usamos toString() para tratar casos onde o valor possa não ser string (ainda que aqui sejam strings)
                return valor === undefined || valor === null || valor.toString().trim() === "";
            });

            // Se encontrou algum campo inválido, retorna status 400 com mensagem indicando quais são
            if (camposInvalidos.length > 0) {
                return res.status(400).json({
                    mensagem: `Os seguintes campos são obrigatórios e não podem estar vazios: ${camposInvalidos.join(", ")}.`
                });
            }

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
     * Faz a chamada ao modelo para atualizar um cliente
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do cliente atualizado
     * @returns (400) Erro ao atualizar cliente
     * @returns (500) Erro na consulta 
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idCliente da URL e converte para número
            // Exemplo: se a rota for /clientes/5, o valor "5" será convertido para o número 5
            const idCliente: number = parseInt(req.params.idCliente as string);

            // Extrai os dados do cliente enviados no corpo da requisição (normalmente via PUT ou PATCH)
            const cliente: ClienteDTO = req.body;

            // Atribui o ID extraído da URL ao objeto cliente recebido
            cliente.idCliente = idCliente;

            // Verifica se o ID é inválido (não é número ou é menor ou igual a zero)
            // Se for inválido, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(cliente.idCliente) || cliente.idCliente <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto." });
            }

            // Chama o método atualizarCliente da classe Cliente, passando o objeto com os dados atualizados
            // Esse método deve realizar a atualização no banco de dados e retornar true ou false
            const respostaModelo = await Cliente.atualizarCliente(cliente);

            // Verifica se o objeto cliente é nulo (essa verificação está incorreta, pois cliente nunca será null aqui)
            // Mesmo assim, retorna uma mensagem informando que nenhum cliente foi encontrado
            if (cliente === null) {
                return res.status(200).json({ mensagem: "Nenhum cliente encontrado com o ID fornecedio." });
            }

            // Verifica se a atualização foi bem-sucedida
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 200 (OK) e uma mensagem de sucesso
                return res.status(200).json({ mensagem: `Cliente ${cliente.idCliente} atualizado com sucesso.` });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que a atualização falhou e sugere verificar os dados
                return res.status(400).json({ mensagem: "Não foi possível atualizar cliente, verifique se as informações foram passadas corretamente." });
            }
        } catch (error) {
            // Em caso de erro inesperado (como falha de conexão ou erro interno), exibe a mensagem no console
            console.error(`Erro no modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível concluir a atualização
            return res.status(500).json({ mensagem: "Não foi possível atualizar o cliente." });
        }
    }

    /**
     * Faz a chamada ao modelo para remover um cliente
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do cliente removido
     * @returns (400) Erro ao remover cliente
     * @returns (500) Erro na consulta 
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idCliente da URL e converte para número
            // Exemplo: se a rota for /clientes/3, o valor "3" será convertido para o número 3
            const idCliente: number = parseInt(req.params.idCliente as string);

            // Verifica se o ID é inválido (não é um número ou é menor ou igual a zero)
            // Se for inválido, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(idCliente) || idCliente <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto." });
            }

            // Chama o método removerCliente da classe Cliente, passando o ID como argumento
            // Esse método deve realizar a remoção lógica do cliente no banco de dados e retornar true ou false
            const respostaModelo = await Cliente.removerCliente(idCliente);

            // Verifica se a remoção foi bem-sucedida
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 200 (OK) e uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Cliente removido com sucesso." });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que a remoção falhou e sugere verificar os dados
                return res.status(400).json({ mensagem: "Não foi possível remover o cliente, verifique se as informações foram passadas corretamente." });
            }
        } catch (error) {
            // Em caso de erro inesperado (como falha de conexão ou erro interno), exibe a mensagem no console
            console.error(`Erro no modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível concluir a remoção
            return res.status(500).json({ mensagem: "Não foi possível remover o cliente." });
        }
    }
}

export default ClienteController;