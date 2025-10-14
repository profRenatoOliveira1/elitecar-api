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

    /**
     * Faz a chamada ao modelo para inserir um novo carro
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do carro inserido
     * @returns (400) Erro ao inserir carro
     * @returns (500) Erro na consulta
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados enviados pelo cliente na requisição HTTP (normalmente via POST)
            // Esses dados devem estar no corpo da requisição e seguir o formato da interface CarroDTO
            const dadosRecebidosCarro: CarroDTO = req.body;

            // Define um array com os nomes dos campos obrigatórios (idCarro fica de fora)
            // 'as const' transforma o array em uma tupla de literais, útil para inferência de tipo
            const camposObrigatorios = ["marca", "modelo", "ano", "cor"] as const;

            // Cria uma lista com os campos que estão inválidos (undefined, null ou string vazia)
            const camposInvalidos = camposObrigatorios.filter(campo => {
                // Pega o valor do campo específico do DTO dinamicamente
                const valor = dadosRecebidosCarro[campo];

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
            const respostaModelo = await Carro.cadastrarCarro(dadosRecebidosCarro);

            // Verifica se o cadastro foi bem-sucedido
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 201 (Created)
                // Envia uma mensagem informando que o carro foi cadastrado com sucesso
                return res.status(201).json({ mensagem: "Carro cadastrado com sucesso." });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que houve erro no cadastro
                return res.status(400).json({ mensagem: "Erro ao cadastrar carro." });
            }
        } catch (error) {
            // Em caso de erro inesperado (como falha de conexão ou erro interno), exibe a mensagem no console
            console.error(`Erro no modelo. ${error}`);

            // Retorna uma resposta HTTP com status 500 (Internal Server Error)
            // Envia uma mensagem informando que não foi possível inserir o novo carro
            return res.status(500).json({ mensagem: "Não foi possível inserir o novo carro." });
        }
    }

    /**
     * Faz a chamada ao modelo para atualizar um carro
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do carro atualizado
     * @returns (400) Erro ao atualizar carro
     * @returns (500) Erro na consulta 
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idCarro da URL e converte para número
            // Exemplo: se a rota for /carros/5, o valor 5 será convertido para número
            const idCarro: number = parseInt(req.params.idCarro as string);
            const carro: CarroDTO = req.body; // recupera informações do corpo da requisição e coloca no objeto DTO
            carro.idCarro = idCarro; // insere o ID no objeto DTO

            // Verifica se o ID é inválido (NaN ou zero)
            // Se for, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(carro.idCarro) || carro.idCarro <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto" });
            }

            // Chama o método atualizar da classe Carro, passando o carro como argumento
            // Se não encontrar o carro, retorna false
            const respostaModelo: boolean = await Carro.atualizarCarro(carro);

            // Verifica se nenhum carro foi encontrado com o ID fornecido
            // Se for o caso, retorna uma resposta HTTP com status 200 (OK) e uma mensagem informando isso
            if (carro === null) {
                return res.status(200).json({ mensagem: "Nenhum carro encontrado com o ID fornecido" });
            }

            // Verifica se a reposta é true
            if (respostaModelo) {
                // Se sim retorna mensagem com status 200 (OK)
                return res.status(200).json({ mensagem: `Carro ${carro.idCarro} atualizado com sucesso` });
            } else {
                // Em caso de erro retorna mensagem com status 400 (Erro no cliente)
                return res.status(400).json({ mensagem: "Não foi possível atualizar carro, verifique se as informações foram passadas corretamente." });
            }
        } catch (error) {
            // Em caso de erro durante a consulta, retorna a mensagem para o cliente com status (500)
            console.error(`Erro no modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível atualizar o carro." })
        }
    }

    /**
     * Faz a chamada ao modelo para remover um carro
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do carro removido
     * @returns (400) Erro ao remover carro
     * @returns (500) Erro na consulta 
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai o parâmetro idCarro da URL e converte para número
            // Exemplo: se a rota for /carros/5, o valor "5" será convertido para o número 5
            const idCarro: number = parseInt(req.params.idCarro as string);

            // Verifica se o ID é inválido (não é um número ou é menor ou igual a zero)
            // Se for inválido, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(idCarro) || idCarro <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto" });
            }

            // Chama o método removerCarro da classe Carro, passando o ID como argumento
            // Esse método deve realizar a remoção lógica do carro no banco de dados
            const respostaModelo = await Carro.removerCarro(idCarro);

            // Verifica se a remoção foi bem-sucedida
            if (respostaModelo) {
                // Se sim, retorna uma resposta HTTP com status 200 (OK) e uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Carro removido com sucesso!" });
            } else {
                // Se não, retorna uma resposta HTTP com status 400 (Bad Request)
                // Envia uma mensagem informando que a remoção falhou e sugere verificar os dados
                return res.status(400).json({ mensagem: "Não foi possível remover o carro, verifique se as informações foram passadas corretamente." });
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

export default CarroController;