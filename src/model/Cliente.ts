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

    /**
     * Retorna os clientes cadastrados no banco de dados
     * @returns Lista com clientes cadastrados
     * @returns valor nulo em caso de erro na consulta
     */
    static async listarClientes(): Promise<Array<Cliente> | null> {
        try {
            // Cria uma lista vazia que irá armazenar os objetos do tipo Cliente
            let listaDeClientes: Array<Cliente> = [];

            // Define a consulta SQL que irá buscar todos os registros da tabela 'clientes'
            const querySelectClientes = `SELECT * FROM clientes;`;

            // Executa a consulta no banco de dados e aguarda a resposta
            const respostaBD = await database.query(querySelectClientes);

            // Percorre cada linha retornada pela consulta
            respostaBD.rows.forEach((clienteBD) => {
                // Cria um novo objeto Cliente usando os dados da linha atual (nome, cpf, telefone)
                const novoCliente: Cliente = new Cliente(
                    clienteBD.nome,
                    clienteBD.cpf,
                    clienteBD.telefone
                );

                // Define o ID do cliente usando o valor retornado do banco
                novoCliente.setIdCliente(clienteBD.id_cliente);

                // Adiciona o novo cliente à lista de clientes
                listaDeClientes.push(novoCliente);
            });

            // Retorna a lista completa de clientes
            return listaDeClientes;
        } catch (error) {
            // Em caso de erro na execução da consulta, exibe uma mensagem no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna null para indicar que houve uma falha na operação
            return null;
        }
    }

    /**
     * Retorna informações de um cliente com base no ID
     * @param idCliente id do cliente a ser buscado
     * @returns Cliente selecionado
     */
    static async listarCliente(idCliente: number): Promise<Cliente | null> {
        try {
            // Inicializa a variável cliente como null. Ela será preenchida com os dados do cliente encontrado no banco.
            let cliente: Cliente | null = null;

            // Define a consulta SQL que busca um cliente específico pelo ID.
            const querySelectCliente = `SELECT * FROM clientes WHERE id_cliente=$1;`;

            // Executa a consulta no banco de dados, passando o idCliente como parâmetro.
            const respostaBD = await database.query(querySelectCliente, [idCliente]);

            // Percorre os resultados retornados pela consulta (espera-se apenas um cliente).
            respostaBD.rows.forEach((clienteBD) => {
                // Cria um novo objeto Cliente com os dados retornados do banco (nome, cpf, telefone).
                const novoCliente: Cliente = new Cliente(
                    clienteBD.nome,
                    clienteBD.cpf,
                    clienteBD.telefone
                );

                // Define o ID do cliente usando o valor retornado do banco.
                novoCliente.setIdCliente(clienteBD.id_cliente);

                // Atribui o novo cliente à variável cliente.
                cliente = novoCliente;
            });

            // Retorna o cliente encontrado ou null se não houver resultado.
            return cliente;
        } catch (error) {
            // Em caso de erro na execução da consulta, exibe uma mensagem no console.
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna null para indicar que houve uma falha na operação.
            return null;
        }
    }

    /**
     * Insere um cliente no banco de dados
     * 
     * @param cliente objeto a ser inserido no banco
     * @returns **true** caso a inserção tenha sido feita, **false** em caso de erro
     */
    static async cadastrarCliente(cliente: ClienteDTO): Promise<boolean> {
        try {
            // Define a query SQL para inserir um novo cliente na tabela 'cliente'
            // Os valores serão passados como parâmetros ($1, $2, $3)
            // O comando RETURNING retorna o id_cliente gerado automaticamente pelo banco
            const queryInsertCliente = `INSERT INTO clientes (nome, cpf, telefone)
                                VALUES
                                ($1, $2, $3)
                                RETURNING id_cliente;`;

            // Executa a query no banco de dados, passando os dados do cliente como parâmetros
            // Usa toUpperCase() para padronizar o nome em letras maiúsculas
            const respostaBD = await database.query(queryInsertCliente, [
                cliente.nome.toUpperCase(), // Nome do cliente em maiúsculas
                cliente.cpf,                // CPF do cliente
                cliente.telefone            // Telefone do cliente
            ]);

            // Verifica se a resposta do banco contém pelo menos uma linha
            // Isso indica que o cliente foi inserido com sucesso
            if (respostaBD.rows.length > 0) {
                // Exibe no console uma mensagem de sucesso com o ID do cliente cadastrado
                console.info(`Cliente cadastrado com sucesso. ID: ${respostaBD.rows[0].id_cliente}`);

                // Retorna true indicando que o cadastro foi realizado com sucesso
                return true;
            }

            // Se nenhuma linha foi retornada, significa que o cadastro falhou
            // Retorna false indicando falha na operação
            return false;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna false indicando que houve uma falha na operação
            return false;
        }
    }
}

export default Cliente;
