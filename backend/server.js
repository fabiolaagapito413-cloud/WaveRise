import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import coachRoutes from "./routes/coach.js";

dotenv.config();
console.log("API:", process.env.OPENAI_API_KEY);

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

    console.log("HOME ACESSADA");

    res.send("TESTE 12345");

});
// =============================
// ROTAS
// =============================

app.use("/coach", coachRoutes);

// =============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Servidor rodando na porta ${PORT}`);

});