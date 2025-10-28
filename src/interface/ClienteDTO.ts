export interface ClienteDTO {
    idCliente? : number,    // ID do cliente (? indica um parâmetro opcional)
    nome: string,       // Nome do cliente
    cpf: string,        // CPF do cliente
    telefone: string,   // Telefone do cliente
    situacao?: boolean  // Situação do cliente
}