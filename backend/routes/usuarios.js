import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({
                erro: "Nome e e-mail são obrigatórios."
            });
        }

        const resultado = await pool.query(
            `
            INSERT INTO usuarios (
                nome,
                email
            )
            VALUES ($1, $2)

            ON CONFLICT (email)
            DO UPDATE SET
                nome = EXCLUDED.nome

            RETURNING
                id,
                nome,
                email,
                nivel,
                xp,
                criado_em
            `,
            [nome, email]
        );

        res.status(200).json({
            sucesso: true,
            usuario: resultado.rows[0]
        });

    } catch (erro) {
        console.error(
            "❌ Erro ao salvar usuário:",
            erro
        );

        res.status(500).json({
            erro: "Não foi possível salvar o usuário."
        });
    }
});

export default router;