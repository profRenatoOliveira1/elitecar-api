import { server } from "./server.js"; // importa o servidor HTTP

const port: number = 3333; // define a porta que o servidor vai executar

// liga o servidor HTTP
server.listen(port, () => {
    console.log(`Servidor executando no endereço http://localhost:${port}`);
});