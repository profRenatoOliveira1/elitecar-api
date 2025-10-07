/**
 * Interface para Cliente
 * 
 * DTO => Data Transfer Object
 * 
 * É um padrão de design de software que consiste em criar um objeto para transportar dados entre as diferentes camadas de uma aplicação
 */
export interface ClienteDTO {
    idCliente?: number;
    nome: string;
    cpf: string;
    telefone: string;
}