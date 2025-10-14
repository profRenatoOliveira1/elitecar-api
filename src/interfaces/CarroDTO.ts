/**
 * Interface para Carro
 * 
 * DTO => Data Transfer Object
 * 
 * É um padrão de design de software que consiste em criar um objeto para transportar dados entre as diferentes camadas de uma aplicação
 */
export interface CarroDTO {
    idCarro?: number,   // ID do carro (? indica um parâmetro opcional)
    marca: string,      // Marca do carro
    modelo: string,     // Modelo do carro
    ano: string,        // Ano do carro
    cor: string,        // Cor do carro
    situacao?: boolean   // Situação do objeto
}