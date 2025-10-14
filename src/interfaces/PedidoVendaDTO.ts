/**
 * Interface para Pedido de Venda
 * 
 * DTO => Data Transfer Object
 * 
 * É um padrão de design de software que consiste em criar um objeto para transportar dados entre as diferentes camadas de uma aplicação
 */
export interface PedidoVendaDTO {
    idPedido?: number;      // ID do pedido
    idCliente: number;      // ID do cliente
    idCarro: number;        // ID do Carro
    dataPedido: Date;       // Data do Pedido
    valorPedido: number;    // Valor do Pedido
    nomeCliente?: string;   // Nome do cliente
    marcaCarro?: string;    // Marca do carro
    modeloCarro?: string;   // Modelo do carro
    situacao?: boolean;     // Situação do objeto
}