import express from "express";
import multer from "multer";
import fs from "fs";
import { analisarFoto } from "../services/openai.js";

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

// =====================================
// ANALISAR FOTO
// =====================================

router.post("/foto", upload.single("foto"), async (req, res) => {

    console.log("✅ CHEGOU NA ROTA /coach/foto");

    try {

        if (!req.file) {

            return res.status(400).json({
                sucesso: false,
                erro: "Nenhuma foto enviada."
            });

        }

        console.log("📷 Foto recebida:", req.file.originalname);

        const analise = await analisarFoto(req.file.path);
        console.log("ENTROU NA ROTA");
        console.log("RESPOSTA DA IA:")
        console.log(analise);

        fs.unlink(req.file.path, () => {});

        res.json({
            sucesso: true,
            analise
        });

    } catch (erro) {

        console.error("ERRO IA:", erro);

        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

export default router;