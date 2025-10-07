import express from 'express'; // Importa o pacote Express
import cors from 'cors'; // Importa o pacote CORS
import { router } from './routes.js'; // Importa a configuração das rotas

const server = express(); // Cria um servidor HTTP com express
server.use(cors()); // Configura o servidor HTTP para usar o CORS
server.use(express.json()); // Configura o servidor HTTP para usar JSON na comunicação
server.use(router); // Adiciona as rotas ao servidor HTTP

export { server } // Exporta o servidor HTTP