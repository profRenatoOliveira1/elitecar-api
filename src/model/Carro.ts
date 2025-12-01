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
    private idCarro: number = 0;        // Identificador único do objeto
    private marca: string;              // Marca do carro
    private modelo: string;             // Modelo do carro
    private ano: number;                // Ano de fabricacão do carro
    private cor: string;                // Cor da pintura do carro
    private situacao: boolean = true;   // Situação do carro (true = ativo, false = inativo)

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
     * Retorna a situacão do carro
     * @returns **true** para ativdo, **false** para inativo
     */
    public getSituacao(): boolean {
        return this.situacao;
    }

    /**
     * Atribui a situação ao carro
     * @param _situacao **true** para ativo, **false** para inativo
     */
    public setSituacao(_situacao: boolean): void {
        this.situacao = _situacao;
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
            const querySelectCarros = `SELECT * FROM carros WHERE situacao=TRUE;`;

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
                novoCarro.setSituacao(carroBD.situacao);

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
                novoCarro.setSituacao(carroBD.situacao);

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

    /**
     * Insere um carro no banco de dados
     * 
     * @param carro objeto a ser inserido no banco
     * @returns **true** caso a inserção tenha sido feita, **false** em caso de erro
     */
    static async cadastrarCarro(carro: CarroDTO): Promise<boolean> {
        try {
            // Define a query SQL para inserir um novo carro na tabela 'carros'
            // Os valores serão passados como parâmetros ($1, $2, $3, $4)
            // O comando RETURNING retorna o id_carro gerado automaticamente pelo banco
            const queryInsertCarro = `INSERT INTO carros (marca, modelo, ano, cor)
                                VALUES
                                ($1, $2, $3, $4)
                                RETURNING id_carro;`;

            // Executa a query no banco de dados, passando os valores do carro como parâmetros
            // Usa toUpperCase() para padronizar os textos e parseInt() para garantir que o ano seja um número
            const respostaBD = await database.query(queryInsertCarro, [
                carro.marca.toUpperCase(), // marca do carro em letra maiúscula
                carro.modelo.toUpperCase(), // modelo do carro em letra maiúscula
                parseInt(carro.ano),        // ano do carro convertido em inteiro
                carro.cor.toUpperCase()     // cor do carro em letra maiúscula
            ]);

            // Verifica se a resposta do banco contém pelo menos uma linha (ou seja, se o carro foi inserido)
            if (respostaBD.rows.length > 0) {
                // Exibe no console uma mensagem de sucesso com o ID do carro cadastrado
                console.info(`Carro cadastrado com sucesso. ID: ${respostaBD.rows[0].id_carro}`);

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

    /**
     * Atualiza um carro no banco de dados
     * 
     * @param carro Objeto com as informações a serem atualizadas
     * @returns **true** em caso de sucesso, **false** em caso de falha
     */
    static async atualizarCarro(carro: CarroDTO): Promise<boolean> {
        try {
            // Define a query SQL para atualizar os dados de um carro na tabela 'carro'
            // Os campos marca, modelo, ano e cor serão atualizados com base no ID do carro
            const queryAtualizaCarro = `UPDATE carros SET marca = $1, modelo = $2, ano = $3, cor = $4 WHERE id_carro = $5`;

            // Executa a query no banco de dados, passando os valores atualizados como parâmetros
            // Usa toUpperCase() para padronizar os textos em letras maiúsculas
            // Usa parseInt() para garantir que o ano seja tratado como número
            const respostaBD = await database.query(queryAtualizaCarro, [
                carro.marca.toUpperCase(),     // Nova marca do carro
                carro.modelo.toUpperCase(),    // Novo modelo do carro
                parseInt(carro.ano),           // Novo ano do carro
                carro.cor.toUpperCase(),       // Nova cor do carro
                carro.idCarro                  // ID do carro que será atualizado
            ]);

            // Verifica se alguma linha foi afetada pela atualização
            // Se rowCount for diferente de zero, significa que o carro foi atualizado com sucesso
            if (respostaBD.rowCount != 0) {
                // Exibe uma mensagem no console informando que o carro foi atualizado
                console.info(`Carro atualizado com sucesso. ID: ${carro.idCarro}`);

                // Retorna true indicando que a operação foi bem-sucedida
                return true;
            }

            // Se nenhuma linha foi atualizada, retorna false indicando falha na operação
            return false;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta ao banco de dados. ${error}`);

            // Retorna false indicando que houve uma falha na operação
            return false;
        }
    }

    /**
     * Remove um carro do banco de dados
     * 
     * @param idCarro ID do carro a ser removido
     * @returns **true** em caso de sucesso, **false** em caso de falha
     */
    static async removerCarro(idCarro: number): Promise<boolean> {
        try {
            // Define a query SQL para "remover" um carro da tabela 'carros'
            // Em vez de apagar o registro, ela apenas altera o campo 'situacao' para false
            // Isso é chamado de remoção lógica, pois os dados continuam no banco, mas são marcados como inativos
            const queryRemoveCarro = `UPDATE carros SET situacao=false WHERE id_carro=$1;`;

            // Executa a query no banco de dados, passando o ID do carro como parâmetro
            // O parâmetro $1 será substituído pelo valor de idCarro
            const respostaBD = await database.query(queryRemoveCarro, [idCarro]);

            // Verifica se alguma linha foi afetada pela atualização
            // Se rowCount for diferente de zero, significa que o carro foi marcado como removido com sucesso
            if (respostaBD.rowCount != 0) {
                // Exibe uma mensagem no console informando que o carro foi removido
                console.info(`Carro removido com sucesso.`);

                // Retorna true indicando que a operação foi bem-sucedida
                return true;
            }

            // Se nenhuma linha foi atualizada, retorna false indicando que o carro não foi encontrado ou não foi removido
            return false;
        } catch (error) {
            // Em caso de erro na execução da query, exibe uma mensagem de erro no console
            console.error(`Erro na consulta com o banco de dados. ${error}`);

            // Retorna false indicando que houve uma falha na operação
            return false;
        }
    }
}

export default Carro