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
}

export default PedidoVenda;
