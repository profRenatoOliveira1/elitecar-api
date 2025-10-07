import { server } from "./server.js";
import dotenv from 'dotenv';

dotenv.config();

const port: number = parseInt(process.env.SERVER_PORT as string);

server.listen(port, () => {
    console.clear();
    console.log(`Endereço do servidor: http://localhost:${port}`);
});