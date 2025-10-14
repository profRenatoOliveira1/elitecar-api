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
}

export default PedidoVenda;
