import type { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "Se você está vendo essa mensagem, seu servidor está funcionando." });
});

export { router };