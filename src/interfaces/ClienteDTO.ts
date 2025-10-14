/**
 * Interface para Cliente
 * 
 * DTO => Data Transfer Object
 * 
 * É um padrão de design de software que consiste em criar um objeto para transportar dados entre as diferentes camadas de uma aplicação
 */
export interface ClienteDTO {
    idCliente?: number;     // ID do cliente (? indica um parâmetro opcional)
    nome: string;           // Nome do cliente
    cpf: string;            // CPF do cliente
    telefone: string;       // Telefone do cliente
    situacao?: boolean;     // Situaçào do objeto
}