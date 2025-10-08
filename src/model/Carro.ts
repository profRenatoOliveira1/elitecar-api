import type { CarroDTO } from "../interfaces/CarroDTO.js"; // Importa a interface do DTO
import { DatabaseModel } from "./DatabaseModel.js"; // Importa a classe DatabaseModel para realizar a conexão com o banco de dados

const database = new DatabaseModel().pool; //Inicializa o pool de conexões com o banco de dados

/*
* Classe Carro representa um modelo de carro com seus atributos principais (marca, modelo, ano, cor e ID).
* Permite criar objetos de carro, acessar e modificar seus dados, e consultar informações no banco de dados.
* Inclui métodos estáticos para listar todos os carros ou buscar um carro específico pelo ID.
*/
class Carro {

    /* Atributos */
    private idCarro: number = 0;
    private marca: string;
    private modelo: string;
    private ano: number;
    private cor: string;

    /**
     * Construtor da classe Carro
     * @param _marca Marca do carro
     * @param _modelo Modelo do carro
     * @param _ano Ano do carro
     * @param _cor Cor do carro
     */
    constructor(_marca: string, _modelo: string, _ano: number, _cor: string) {
        this.marca = _marca;
        this.modelo = _modelo;
        this.ano = _ano;
        this.cor = _cor;
    }

    /**
     * Retorna o ID do carro
     * @returns ID do carro
     */
    public getIdCarro(): number {
        return this.idCarro;
    }

    /**
     * Atribui um ID ao carro
     * @param idCarro novo ID
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    /**
     * Retorna a marca do carro
     * @returns Marca do carro
     */
    public getMarca(): string {
        return this.marca;
    }

    /**
     * Atribui uma marca ao carro
     * @param marca nova marca do carro
     */
    public setMarca(marca: string): void {
        this.marca = marca;
    }

    /**
     * Retorna o modelo do carro
     * @returns Modelo do carro
     */
    public getModelo(): string {
        return this.modelo;
    }

    /**
     * Atribui um modelo ao carro
     * @param modelo novo modelo do carro
     */
    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    /**
     * Retorna o ano do carro
     * @returns Ano do carro
     */
    public getAno(): number {
        return this.ano;
    }

    /**
     * Atribui um ano ao carro
     * @param ano novo ano do carro
     */
    public setAno(ano: number): void {
        this.ano = ano;
    }

    /**
     * Retorna a cor do carro
     * @returns Cor do carro
     */
    public getCor(): string {
        return this.cor;
    }

    /**
     * Atribui uma cor ao carro
     * @param cor nova cor do carro
     */
    public setCor(cor: string): void {
        this.cor = cor;
    }

    /**
     * Retorna os carros cadastrados no banco de dados
     * @returns Lista com carros cadastrados
     * @returns valor nulo em caso de erro na consulta
     */
    static async listarCarros(): Promise<Array<Carro> | null> {
        try {
            // Inicializa uma lista vazia que irá armazenar os objetos do tipo CarroDTO
            let listaDeCarros: Array<Carro> = [];

            // Define a query SQL que será executada no banco de dados para buscar todos os registros da tabela 'carro'
            const querySelectCarros = `SELECT * FROM carros;`;

            // Executa a query no banco de dados e aguarda a resposta
            const respostaBD = await database.query(querySelectCarros);

            // Itera sobre cada linha retornada pela consulta
            respostaBD.rows.forEach((carroBD) => {
                // Cria um novo objeto CarroDTO com os dados da linha atual
                const novoCarro: Carro = new Carro(
                    carroBD.marca,     // Marca do carro
                    carroBD.modelo,   // Modelo do carro
                    carroBD.ano,         // Ano de fabricação
                    carroBD.cor          // Cor do carro
                )

                novoCarro.setIdCarro(carroBD.id_carro);

                // Adiciona o novo objeto CarroDTO à lista de carros
                listaDeCarros.push(novoCarro);
            });

            // Retorna a lista completa de carros
            return listaDeCarros;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna null para indicar que houve uma falha na operação
            return null;
        }
    }

    /**
     * Retorna informações de um carro com base no ID
     * @param idCarro id do carro a ser buscado
     * @returns Carro selecionado
     */
    static async listarCarro(idCarro: number): Promise<Carro | null> {
        try {
            // Inicializa a variável carro como null, que será preenchida com os dados do carro encontrado
            let carro: Carro | null = null;

            // Define a query SQL que busca um carro específico pelo ID
            const querySelectCarro = `SELECT * FROM carros WHERE id_carro=$1;`;

            // Executa a query no banco de dados, passando o idCarro como parâmetro
            const respostaBD = await database.query(querySelectCarro, [idCarro]);

            // Itera sobre os resultados retornados pela consulta (espera-se apenas um carro)
            respostaBD.rows.forEach((carroBD) => {
                // Cria um novo objeto CarroDTO com os dados do carro retornado
                const novoCarro: Carro = new Carro(
                    carroBD.marca,     // Marca do carro
                    carroBD.modelo,    // Modelo do carro
                    carroBD.ano,       // Ano de fabricação
                    carroBD.cor        // Cor do carro
                )

                novoCarro.setIdCarro(carroBD.id_carro);

                // Atribui o novo objeto à variável carro
                carro = novoCarro;
            });

            // Retorna o carro encontrado ou null se não houver resultado
            return carro;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna null para indicar que houve uma falha na operação
            return null;
        }
    }
}

export default Carro