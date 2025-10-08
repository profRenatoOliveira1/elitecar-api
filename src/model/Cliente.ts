import type { ClienteDTO } from "../interfaces/ClienteDTO.js"; // Importa a interface do DTO
import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe DatabaseModel para realizar a conexão com o banco de dados

const database = new DatabaseModel().pool; //Inicializa o pool de conexões com o banco de dados

/*
* Classe Cliente representa um modelo de cliente com seus atributos principais (nome, cpf, telefone e ID).
* Permite criar objetos de cliente, acessar e modificar seus dados, e consultar informações no banco de dados.
* Inclui métodos estáticos para listar todos os clientes ou buscar um carro específico pelo ID.
*/
class Cliente {

    /* Atributos */
    private idCliente: number = 0;
    private nome: string;
    private cpf: string;
    private telefone: string;

    /**
     * Construtor da classe Cliente
     * @param _nome Nome do cliente
     * @param _cpf CPF do cliente
     * @param _telefone Telefone do cliente
     */
    constructor(_nome: string, _cpf: string, _telefone: string) {
        this.nome = _nome;
        this.cpf = _cpf;
        this.telefone = _telefone;
    }

    /**
     * Retorna o ID do cliente
     * @returns ID do cliente
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Atribui um ID ao cliente
     * @param idCliente novo ID
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Retorna o nome do cliente
     * @returns Nome do cliente
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Atribui um nome ao cliente
     * @param nome novo nome do cliente
     */
    public setNome(nome: string): void {
        this.nome = nome;
    }

    /**
     * Retorna o CPF do cliente
     * @returns CPF do cliente
     */
    public getCpf(): string {
        return this.cpf;
    }

    /**
     * Atribui um CPF ao cliente
     * @param cpf novo CPF do cliente
     */
    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    /**
     * Retorna o telefone do cliente
     * @returns Telefone do cliente
     */
    public getTelefone(): string {
        return this.telefone;
    }

    /**
     * Atribui um telefone ao cliente
     * @param telefone novo telefone do cliente
     */
    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    public toDTO(): ClienteDTO {
        return {
            idCliente: this.idCliente,
            nome: this.nome,
            cpf: this.cpf,
            telefone: this.telefone
        }
    }

    static async listarClientes(): Promise<Array<Cliente> | null> {
        try {
            let listaDeClientes: Array<Cliente> = [];

            const querySelectClientes = `SELECT * FROM clientes;`;

            const respostaBD = await database.query(querySelectClientes);

            respostaBD.rows.forEach((clienteBD) => {
                const novoCliente: Cliente = new Cliente(
                    clienteBD.nome,
                    clienteBD.cpf,
                    clienteBD.telefone
                )

                novoCliente.setIdCliente(clienteBD.id_cliente);

                listaDeClientes.push(novoCliente);
            });

            return listaDeClientes;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados. ${error}`);
            return null;
        }
    }

    static async listarCliente(idCliente: number): Promise<Cliente | null> {
        try {
            let cliente: Cliente | null = null;

            const querySelectCliente = `SELECT * FROM clientes WHERE id_cliente=$1;`;

            const respostaBD = await database.query(querySelectCliente, [idCliente]);

            respostaBD.rows.forEach((clienteBD) => {
                const novoCliente: Cliente = new Cliente(
                    clienteBD.nome,
                    clienteBD.cpf,
                    clienteBD.telefone
                );

                novoCliente.setIdCliente(clienteBD.id_cliente);

                cliente = novoCliente;
            });

            return cliente;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados. ${error}`);
            return null;
        }
    }
}

export default Cliente;
