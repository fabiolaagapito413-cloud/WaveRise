import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import coachRoutes from "./routes/coach.js";
import usuariosRoutes from "./routes/usuarios.js";
import pagamentosRoutes from "./routes/pagamentos.js";

dotenv.config();

console.log(
    "🔐 Mercado Pago:",
    process.env.MERCADOPAGO_ACCESS_TOKEN
        ? process.env.MERCADOPAGO_ACCESS_TOKEN.substring(0, 8) + "..."
        : "NÃO ENCONTRADO"
);

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(
        "📥 REQUISIÇÃO:",
        req.method,
        req.originalUrl
    );
    next();
});


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {

    console.log("HOME ACESSADA");

    res.send(
        "WaveRise Backend funcionando! 🌊"
    );

});


// ======================================================
// ROTAS
// ======================================================

app.use(
    "/coach",
    coachRoutes
);

app.use(
    "/usuarios",
    usuariosRoutes
);

app.use(
    "/pagamentos",
    pagamentosRoutes
);


// ======================================================
// SERVIDOR
// ======================================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀 Servidor WaveRise rodando na porta ${PORT}`
    );

});