// DTO => Data Transfer Object

export interface CarroDTO {
    idCarro? : number,  // ID do carro (? indica um parâmetro opcional)
    marca: string,      // Marca do carro
    modelo: string,     // Modelo do carro
    ano: number,        // Ano do carro
    cor: string,        // Cor do carro
    situacao?: boolean  // Situação (cenas para os próximos capítulos)
}