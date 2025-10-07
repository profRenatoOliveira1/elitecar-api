import { server } from "./server.js"; // Importa o servidor
import dotenv from 'dotenv'; // Importa o dotenv
import { DatabaseModel } from "./model/DatabaseModel.js"; // Importa o modelo de conexão com o banco de dados

dotenv.config(); // Configura o dotenv

const port: number = parseInt(process.env.SERVER_PORT as string); // Define a porta do servidor a partir da variável de ambiente do arquivo .env

new DatabaseModel().testeConexao().then((resdb) => { // Testa a conexão com o banco de dados
  if (resdb) { // Se a conexão for bem-sucedida
    server.listen(port, () => { // Inicia o servidor
      console.clear(); // Limpa o console
      console.log(`Endereço do servidor: http://localhost:${port}`); // Exibe o endereço do servidor
    });
  } else { // Se a conexão falhar
    console.log(`Erro ao conectar com o banco de dados.`); // Exibe uma mensagem de erro
  }
});