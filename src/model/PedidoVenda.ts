import type { PedidoVendaDTO } from "../interfaces/PedidoVendaDTO.js"; // Importa a interface do DTO
import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe DatabaseModel para realizar a conexão com o banco de dados

const database = new DatabaseModel().pool;  //Inicializa o pool de conexões com o banco de dados

/*
* Classe PedidoVenda representa um modelo de pedido de venda com seus atributos principais (ID cliente, ID carro, Data do Pedido, Valor do Pedido e ID).
* Permite criar objetos de pedido de vendas, acessar e modificar seus dados, e consultar informações no banco de dados.
* Inclui métodos estáticos para listar todos os pedidos de venda ou buscar um pedido específico pelo ID.
*/
class PedidoVenda {

    /* Atributos */
    private idPedido: number = 0;
    private idCliente: number;
    private idCarro: number;
    private dataPedido: Date;
    private valorPedido: number;
    private situacao: boolean = true;

    /**
     * Construtor da classe PedidoVenda
     * @param _idCliente ID do cliente relacionado ao pedido
     * @param _idCarro ID do carro vendido
     * @param _dataPedido Data do pedido
     * @param _valorPedido Valor total do pedido
     */
    constructor(_idCliente: number, _idCarro: number, _dataPedido: Date, _valorPedido: number) {
        this.idCliente = _idCliente;
        this.idCarro = _idCarro;
        this.dataPedido = _dataPedido;
        this.valorPedido = _valorPedido;
    }

    /**
     * Retorna o ID do pedido
     * @returns ID do pedido
     */
    public getIdPedido(): number {
        return this.idPedido;
    }

    /**
     * Atribui um ID ao pedido
     * @param idPedido novo ID do pedido
     */
    public setIdPedido(idPedido: number): void {
        this.idPedido = idPedido;
    }

    /**
     * Retorna o ID do cliente associado ao pedido
     * @returns ID do cliente
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Atribui o ID do cliente ao pedido
     * @param idCliente novo ID do cliente
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Retorna o ID do carro vendido
     * @returns ID do carro
     */
    public getIdCarro(): number {
        return this.idCarro;
    }

    /**
     * Atribui o ID do carro ao pedido
     * @param idCarro novo ID do carro
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    /**
     * Retorna a data do pedido
     * @returns Data do pedido
     */
    public getDataPedido(): Date {
        return this.dataPedido;
    }

    /**
     * Atribui uma data ao pedido
     * @param dataPedido nova data do pedido
     */
    public setDataPedido(dataPedido: Date): void {
        this.dataPedido = dataPedido;
    }

    /**
     * Retorna o valor total do pedido
     * @returns Valor do pedido
     */
    public getValorPedido(): number {
        return this.valorPedido;
    }

    /**
     * Atribui um valor ao pedido
     * @param valorPedido novo valor do pedido
     */
    public setValorPedido(valorPedido: number): void {
        this.valorPedido = valorPedido;
    }

    /**
     * Retorna a situacão do carro
     * @returns **true** para ativdo, **false** para inativo
     */
    public getSituacao(): boolean {
        return this.situacao;
    }

    /**
     * Atribui a situação ao carro
     * @param _situacao **true** para ativo, **false** para inativo
     */
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao;
    }

    /**
     * Retorna os pedidos de venda cadastrados no banco de dados
     * @returns Lista com pedidos de venda cadastrados
     * @returns valor nulo em caso de erro na consulta
     */
    static async listarPedidosVenda(): Promise<Array<PedidoVendaDTO> | null> {
        try {
            // Inicializa uma lista vazia que irá armazenar os objetos do tipo PedidoVendaDTO
            let listaDePedidos: Array<PedidoVendaDTO> = [];

            // Define a query SQL que busca os pedidos de venda ativos (situacao = TRUE)
            // A consulta junta dados das tabelas pedidos_venda, clientes e carros
            const querySelectPedidos = `
                SELECT
                    pv.id_pedido,
                    pv.id_cliente,
                    c.nome AS nome_cliente,
                    pv.id_carro,
                    ca.marca AS marca_carro,
                    ca.modelo AS modelo_carro,
                    pv.data_pedido,
                    pv.valor_pedido,
                    pv.situacao
                FROM pedidos_venda pv
                JOIN clientes c ON pv.id_cliente = c.id_cliente
                JOIN carros ca ON pv.id_carro = ca.id_carro
                WHERE pv.situacao = TRUE;
            `;

            // Executa a query no banco de dados e aguarda a resposta
            const respostaBD = await database.query(querySelectPedidos);

            // Percorre cada linha retornada pela consulta
            respostaBD.rows.forEach((pedidoBD) => {
                // Cria um objeto DTO (Data Transfer Object) com os dados do pedido
                const dto: PedidoVendaDTO = {
                    idPedido: pedidoBD.id_pedido,             // ID do pedido
                    idCliente: pedidoBD.id_cliente,           // ID do cliente
                    nomeCliente: pedidoBD.nome_cliente,       // Nome do cliente
                    idCarro: pedidoBD.id_carro,               // ID do carro
                    marcaCarro: pedidoBD.marca_carro,         // Marca do carro
                    modeloCarro: pedidoBD.modelo_carro,       // Modelo do carro
                    dataPedido: pedidoBD.data_pedido,         // Data do pedido
                    valorPedido: pedidoBD.valor_pedido,       // Valor do pedido
                    situacao: pedidoBD.situacao               // Situação do pedido
                };

                // Adiciona o objeto DTO à lista de pedidos
                listaDePedidos.push(dto);
            });

            // Retorna a lista completa de pedidos ativos
            return listaDePedidos;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta com o banco de dados.`, error);

            // Retorna null indicando que houve uma falha na operação
            return null;
        }
    }

    /**
     * Retorna informações de um pedido com base no ID
     * @param idPedido ID do pedido a ser buscado
     * @returns Pedido selecionado
     */
    static async listarPedidoVenda(idPedido: number): Promise<PedidoVendaDTO | null> {
        try {
            // Inicializa uma lista vazia que irá armazenar os objetos do tipo PedidoVendaDTO
            let pedidoVenda: PedidoVendaDTO | null = null;

            // Define a query SQL que busca os pedidos de venda ativos (situacao = TRUE)
            // A consulta junta dados das tabelas pedidos_venda, clientes e carros
            const querySelectPedidos = `
                SELECT
                    pv.id_pedido,
                    pv.id_cliente,
                    c.nome AS nome_cliente,
                    pv.id_carro,
                    ca.marca AS marca_carro,
                    ca.modelo AS modelo_carro,
                    pv.data_pedido,
                    pv.valor_pedido,
                    pv.situacao
                FROM pedidos_venda pv
                JOIN clientes c ON pv.id_cliente = c.id_cliente
                JOIN carros ca ON pv.id_carro = ca.id_carro
                WHERE pv.id_pedido = $1;
            `;

            // Executa a query no banco de dados e aguarda a resposta
            const respostaBD = await database.query(querySelectPedidos, [idPedido]);

            // Percorre cada linha retornada pela consulta
            respostaBD.rows.forEach((pedidoBD) => {
                // Cria um objeto DTO (Data Transfer Object) com os dados do pedido
                const dto: PedidoVendaDTO = {
                    idPedido: pedidoBD.id_pedido,             // ID do pedido
                    idCliente: pedidoBD.id_cliente,           // ID do cliente
                    nomeCliente: pedidoBD.nome_cliente,       // Nome do cliente
                    idCarro: pedidoBD.id_carro,               // ID do carro
                    marcaCarro: pedidoBD.marca_carro,         // Marca do carro
                    modeloCarro: pedidoBD.modelo_carro,       // Modelo do carro
                    dataPedido: pedidoBD.data_pedido,         // Data do pedido
                    valorPedido: pedidoBD.valor_pedido,       // Valor do pedido
                    situacao: pedidoBD.situacao               // Situação do pedido
                };

                // Adiciona o objeto DTO à lista de pedidos
                pedidoVenda = dto;
            });

            // Retorna a lista completa de pedidos ativos
            return pedidoVenda;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem no console
            console.error(`Erro na consulta com o banco de dados. ${error}`);

            // Retorna null para indicar que houve uma falha na operação
            return null;
        }
    }

    /**
     * Insere um pedido de vendas no banco de dados
     * 
     * @param pedido objeto a ser inserido no banco 
     * @returns **true** caso a inserção tenha sido feita, **false** em caso de erro
     */
    static async cadastrarPedido(pedido: PedidoVendaDTO): Promise<boolean> {
        try {
            // Define a query SQL para inserir um novo pedido na tabela 'pedidos_venda'
            // Os valores serão passados como parâmetros ($1, $2, $3, $4)
            // O comando RETURNING retorna o id_pedido gerado automaticamente pelo banco
            const queryInsertPedido = `INSERT INTO pedidos_venda (id_cliente, id_carro, data_pedido, valor_pedido)
                                VALUES
                                ($1, $2, $3, $4)
                                RETURNING id_pedido;`;

            // Executa a query no banco de dados, passando os dados do pedido como parâmetros
            // Os valores são extraídos do objeto 'pedido' recebido pela aplicação
            const respostaBD = await database.query(queryInsertPedido, [
                pedido.idCarro,                        // ID do carro relacionado ao pedido
                pedido.idCliente,                     // ID do cliente que está fazendo o pedido
                new Date(pedido.dataPedido),          // Data do pedido convertida para objeto Date
                pedido.valorPedido                    // Valor total do pedido
            ]);

            // Verifica se a resposta do banco contém pelo menos uma linha
            // Isso indica que o pedido foi inserido com sucesso
            if (respostaBD.rows.length > 0) {
                // Exibe no console uma mensagem de sucesso com o ID do pedido gerado
                console.info(`Pedido de venda cadastrado com sucesso. ID: ${respostaBD.rows[0].id_pedido}`);

                // Retorna true indicando que o cadastro foi realizado com sucesso
                return true;
            }

            // Se nenhuma linha foi retornada, significa que o cadastro falhou
            // Retorna false indicando falha na operação
            return false;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna false indicando que houve uma falha na operação
            return false;
        }
    }

    /**
     * Atualiza um pedido no banco de dados
     * 
     * @param pedido Objeto com as informações a serem atualizadas
     * @returns **true** em caso de sucesso, **false** em caso de falha
     */
    static async atualizarPedido(pedido: PedidoVendaDTO): Promise<boolean> {
        try {
            // Define a query SQL para atualizar os dados de um pedido na tabela 'pedidos_venda'
            // Os campos atualizados são: id_carro, id_cliente, data_pedido e valor_pedido
            // A atualização é feita com base no id_pedido
            const queryUpdatePedido = `UPDATE pedidos_venda SET id_carro=$1, id_cliente=$2, data_pedido=$3, valor_pedido$4 WHERE id_pedido=$5;`;

            // Executa a query no banco de dados, passando os valores atualizados como parâmetros
            // Os valores são extraídos do objeto 'pedido' recebido pela aplicação
            const respostaBD = await database.query(queryUpdatePedido, [
                pedido.idCarro,                      // Novo ID do carro
                pedido.idCliente,                   // Novo ID do cliente
                new Date(pedido.dataPedido),        // Nova data do pedido convertida para objeto Date
                pedido.valorPedido,                 // Novo valor do pedido
                pedido.idPedido                     // ID do pedido que será atualizado
            ]);

            // Verifica se alguma linha foi afetada pela atualização
            // Se rowCount for diferente de zero, significa que o pedido foi atualizado com sucesso
            if (respostaBD.rowCount != 0) {
                // Exibe uma mensagem no console informando que o pedido foi atualizado
                console.info(`Pedido de venda atualizado com sucesso. ID: ${pedido.idPedido}`);

                // Retorna true indicando que a operação foi bem-sucedida
                return true;
            }

            // Se nenhuma linha foi atualizada, retorna false indicando falha na operação
            return false;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna false indicando que houve uma falha na operação
            return false;
        }
    }

    /**
     * Remove um pedido do banco de dados
     * 
     * @param idPedido ID do pedido a ser removido
     * @returns **true** em caso de sucesso, **false** em caso de falha
     */
    static async removerPedido(idPedido: number): Promise<boolean> {
        try {
            // Define a query SQL para "remover" um pedido de venda da tabela 'pedidos_venda'
            // Em vez de excluir o registro, o campo 'situacao' é atualizado para false
            // Isso é chamado de remoção lógica, pois o pedido continua no banco, mas é marcado como inativo
            const queryRemoveCarro = `UPDATE pedidos_venda SET situacao=false WHERE id_pedido=$1;`;

            // Executa a query no banco de dados, passando o ID do pedido como parâmetro
            // O valor de idPedido será usado no lugar de $1 na query
            const repostaBD = await database.query(queryRemoveCarro, [
                idPedido    // ID do pedido a ser removido
            ]);

            // Verifica se alguma linha foi afetada pela atualização
            // Se rowCount for diferente de zero, significa que o pedido foi marcado como removido com sucesso
            if (repostaBD.rowCount != 0) {
                // Exibe uma mensagem no console informando que o pedido foi removido
                console.info(`Pedido removido com sucesso.`);

                // Retorna true indicando que a operação foi realizada com sucesso
                return true;
            }

            // Se nenhuma linha foi atualizada, retorna false indicando que o pedido não foi encontrado ou não foi removido
            return false;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta com o banco de dados. ${error}`);

            // Retorna false indicando que houve uma falha na operação
            return false;
        }
    }
}

export default PedidoVenda;
