export interface PedidoVendaDTO {
    idPedido?: number,      // ID do pedido (opcional)
    idCliente: number,      // ID do cliente
    idCarro: number,        // ID do carro
    dataPedido: Date,       // Data do pedido
    valorPedido: number,    // Valor do pedido
    nomeCliente?: string,   // Nome do cliente (opcional)
    marcaCarro?: string,    // Marca do carro (opcional)
    modeloCarro?: string,   // Modelo do carro (opcional)
    situacao?: boolean      // Situação do pedido (opcional)
}