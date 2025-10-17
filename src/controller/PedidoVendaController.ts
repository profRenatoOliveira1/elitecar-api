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

    /**
     * Faz a chamada ao modelo para obter a um pedidos de venda e devolve ao cliente
     * 
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Informações do pedido
     * @returns (500) Erro na consulta
     */
    static async pedido(req: Request, res: Response): Promise<Response> {
        try {
            const idPedido: number = parseInt(req.params.idPedido as string);

            if (isNaN(idPedido) || idPedido <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto." });
            }

            const pedido: PedidoVendaDTO | null = await PedidoVenda.listarPedidoVenda(idPedido);

            if (pedido === null) {
                return res.status(200).json({ mensagem: "Nenhum pedido encontrado com o ID fornecido." });
            }

            return res.status(200).json(pedido);
        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de pedidos." });
        }
    }

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

            // Define um array com os nomes dos campos obrigatórios (idPedido fica de fora)
            // 'as const' transforma o array em uma tupla de literais, útil para inferência de tipo
            const camposObrigatorios = ["idCliente", "idCarro", "dataPedido", "valorPedido"] as const;

            // Cria uma lista com os campos que estão inválidos (undefined, null ou string vazia)
            const camposInvalidos = camposObrigatorios.filter(campo => {
                // Pega o valor do campo específico do DTO dinamicamente
                const valor = dadosRecebidosPedido[campo];

                // Considera inválido quando:
                // - valor === undefined (campo não enviado)
                // - valor === null (enviado mas nulo)
                // - valor.toString().trim() === "" (string vazia ou espaços)
                // Usamos toString() para tratar casos onde o valor possa não ser string (ainda que aqui sejam strings)
                return valor === undefined || valor === null || valor.toString().trim() === "";
            });

            // Validação adicional: dataPedido deve ser uma data válida
            const dataRaw = dadosRecebidosPedido.dataPedido;
            // Verifica se dataRaw foi fornecida e não é null/undefined/string vazia
            if (dataRaw !== undefined && dataRaw !== null && dataRaw.toString().trim() !== "") {
                // Constrói um objeto Date a partir do valor bruto recebido
                const data = new Date(dataRaw);
                // Se a data gerada for inválida, getTime() retorna NaN
                if (isNaN(data.getTime())) {
                    // Se "dataPedido" ainda não estiver listado como inválido, adiciona ao array
                    if (!camposInvalidos.includes("dataPedido")) camposInvalidos.push("dataPedido");
                } else {
                    // Se for válida, mantém o objeto Date no DTO (normaliza o valor)
                    dadosRecebidosPedido.dataPedido = data;
                }
            }

            // Validação adicional: valorPedido deve ser numérico e maior que zero
            const valorRaw = dadosRecebidosPedido.valorPedido;
            if (valorRaw !== undefined && valorRaw !== null && valorRaw.toString().trim() !== "") {
                // Verifica se o valor bruto (valorRaw) foi fornecido:
                // - não é undefined
                // - não é null
                // - ao converter para string e remover espaços em volta não resulta em string vazia
                const valorNum = typeof valorRaw === "number" ? valorRaw : Number(String(valorRaw).replace(",", "."));
                // Se valorRaw já for um número, usa-o diretamente.
                // Caso contrário:
                // - converte para string
                // - troca a primeira vírgula por ponto (para aceitar "1,23")
                // - converte para número com Number(...)
                //
                // Observação: String.replace(",", ".") substitui somente a primeira vírgula.
                // Para substituir múltiplas vírgulas (ex.: formatos com milhares) use replace(/,/g, ".")
                if (!isFinite(valorNum) || isNaN(valorNum) || valorNum <= 0) {
                    // Validações para considerar o valor inválido:
                    // - !isFinite(valorNum): rejeita ±Infinity e valores não numéricos
                    // - isNaN(valorNum): rejeita NaN (não número)
                    // - valorNum <= 0: rejeita zero e números negativos (regra de negócio)
                    if (!camposInvalidos.includes("valorPedido")) camposInvalidos.push("valorPedido");
                    // Se o campo ainda não estiver listado em camposInvalidos, adiciona "valorPedido"
                } else {
                    // Normaliza o valor para número (opcional)
                    dadosRecebidosPedido.valorPedido = valorNum as any;
                    // Atribui o número normalizado ao objeto de dados recebido.
                    // O cast "as any" provavelmente está sendo usado para ignorar incompatibilidade de tipos.
                    // É preferível tipar corretamente dadosRecebidosPedido.valorPedido em vez de usar "any".
                }
            }

            // Se encontrou algum campo inválido, retorna status 400 com mensagem indicando quais são
            if (camposInvalidos.length > 0) {
                return res.status(400).json({
                    mensagem: `Campos inválidos ou ausentes: ${camposInvalidos.join(", ")}.`,
                    campos: camposInvalidos
                });
            }

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

    /**
     * Faz a chamada ao modelo para atualizar um pedido
     * @param req Requisição do cliente
     * @param res Resposta do servidor
     * @returns (200) Objeto do pedido atualizado
     * @returns (400) Erro ao atualizar pedido
     * @returns (500) Erro na consulta 
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Extrai os dados enviados pelo cliente na requisição HTTP (normalmente via POST)
            // Esses dados devem estar no corpo da requisição e seguir o formato da interface PedidoVendaDTO
            const idPedido : number = parseInt(req.params.idPedido as string);
            const dadosRecebidosPedido: PedidoVendaDTO = req.body;
            dadosRecebidosPedido.idPedido = idPedido;

            // Verifica se o ID é inválido (NaN ou zero)
            // Se for, retorna uma resposta HTTP com status 400 (Bad Request) e uma mensagem de erro
            if (isNaN(dadosRecebidosPedido.idPedido) || dadosRecebidosPedido.idPedido <= 0) {
                return res.status(400).json({ mensagem: "ID incorreto" });
            }

            // Define um array com os nomes dos campos obrigatórios (idPedido fica de fora)
            // 'as const' transforma o array em uma tupla de literais, útil para inferência de tipo
            const camposObrigatorios = ["idCliente", "idCarro", "dataPedido", "valorPedido"] as const;

            // Cria uma lista com os campos que estão inválidos (undefined, null ou string vazia)
            const camposInvalidos = camposObrigatorios.filter(campo => {
                // Pega o valor do campo específico do DTO dinamicamente
                const valor = dadosRecebidosPedido[campo];

                // Considera inválido quando:
                // - valor === undefined (campo não enviado)
                // - valor === null (enviado mas nulo)
                // - valor.toString().trim() === "" (string vazia ou espaços)
                // Usamos toString() para tratar casos onde o valor possa não ser string (ainda que aqui sejam strings)
                return valor === undefined || valor === null || valor.toString().trim() === "";
            });

            // Validação adicional: dataPedido deve ser uma data válida
            const dataRaw = dadosRecebidosPedido.dataPedido;
            // Verifica se dataRaw foi fornecida e não é null/undefined/string vazia
            if (dataRaw !== undefined && dataRaw !== null && dataRaw.toString().trim() !== "") {
                // Constrói um objeto Date a partir do valor bruto recebido
                const data = new Date(dataRaw);
                // Se a data gerada for inválida, getTime() retorna NaN
                if (isNaN(data.getTime())) {
                    // Se "dataPedido" ainda não estiver listado como inválido, adiciona ao array
                    if (!camposInvalidos.includes("dataPedido")) camposInvalidos.push("dataPedido");
                } else {
                    // Se for válida, mantém o objeto Date no DTO (normaliza o valor)
                    dadosRecebidosPedido.dataPedido = data;
                }
            }

            // Validação adicional: valorPedido deve ser numérico e maior que zero
            const valorRaw = dadosRecebidosPedido.valorPedido;
            if (valorRaw !== undefined && valorRaw !== null && valorRaw.toString().trim() !== "") {
                // Verifica se o valor bruto (valorRaw) foi fornecido:
                // - não é undefined
                // - não é null
                // - ao converter para string e remover espaços em volta não resulta em string vazia
                const valorNum = typeof valorRaw === "number" ? valorRaw : Number(String(valorRaw).replace(",", "."));
                // Se valorRaw já for um número, usa-o diretamente.
                // Caso contrário:
                // - converte para string
                // - troca a primeira vírgula por ponto (para aceitar "1,23")
                // - converte para número com Number(...)
                //
                // Observação: String.replace(",", ".") substitui somente a primeira vírgula.
                // Para substituir múltiplas vírgulas (ex.: formatos com milhares) use replace(/,/g, ".")
                if (!isFinite(valorNum) || isNaN(valorNum) || valorNum <= 0) {
                    // Validações para considerar o valor inválido:
                    // - !isFinite(valorNum): rejeita ±Infinity e valores não numéricos
                    // - isNaN(valorNum): rejeita NaN (não número)
                    // - valorNum <= 0: rejeita zero e números negativos (regra de negócio)
                    if (!camposInvalidos.includes("valorPedido")) camposInvalidos.push("valorPedido");
                    // Se o campo ainda não estiver listado em camposInvalidos, adiciona "valorPedido"
                } else {
                    // Normaliza o valor para número (opcional)
                    dadosRecebidosPedido.valorPedido = valorNum as any;
                    // Atribui o número normalizado ao objeto de dados recebido.
                    // O cast "as any" provavelmente está sendo usado para ignorar incompatibilidade de tipos.
                    // É preferível tipar corretamente dadosRecebidosPedido.valorPedido em vez de usar "any".
                }
            }

            // Se encontrou algum campo inválido, retorna status 400 com mensagem indicando quais são
            if (camposInvalidos.length > 0) {
                return res.status(400).json({
                    mensagem: `Campos inválidos ou ausentes: ${camposInvalidos.join(", ")}.`,
                    campos: camposInvalidos
                });
            }

            // Chama o método cadastrarPedido da classe PedidoVenda, passando os dados recebidos
            // Esse método deve inserir o pedido no banco de dados e retornar true ou false
            const respostaModelo = await PedidoVenda.cadastrarPedido(dadosRecebidosPedido);

            // Verifica se nenhum pedido foi encontrado com o ID fornecido
            // Se for o caso, retorna uma resposta HTTP com status 200 (OK) e uma mensagem informando isso
            if(dadosRecebidosPedido === null) {
                return res.status(200).json({ mensagem: "Nenhum carro encontrado com o ID fornecido" });
            }

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