import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import pool from "../db.js";

import {
    MercadoPagoConfig,
    PreApprovalPlan
} from "mercadopago";

dotenv.config();

const router = express.Router();

console.log("💳 pagamentos.js CARREGADO");

// ======================================================
// MERCADO PAGO
// ======================================================

const client = new MercadoPagoConfig({
    accessToken:
        process.env.MERCADOPAGO_ACCESS_TOKEN
});

const planoAssinatura =
    new PreApprovalPlan(client);


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function obterValorPlano(plano) {
    return plano === "anual"
        ? 149.90
        : 19.90;
}


function obterNomePlano(plano) {
    return plano === "anual"
        ? "WaveRise PRO - Plano Anual"
        : "WaveRise PRO - Plano Mensal";
}


function obterDataExpiracao(plano) {
    const data = new Date();

    if (plano === "anual") {
        data.setFullYear(
            data.getFullYear() + 1
        );
    } else {
        data.setMonth(
            data.getMonth() + 1
        );
    }

    return data;
}


async function ativarProUsuario({
    email,
    plano = "mensal",
    assinaturaId = null
}) {

    if (!email) {
        console.warn(
            "⚠️ Não foi possível ativar PRO: e-mail não informado."
        );

        return null;
    }

    const emailNormalizado =
        String(email)
            .trim()
            .toLowerCase();

    const inicio =
        new Date();

    const expiracao =
        obterDataExpiracao(plano);

    const resultado =
        await pool.query(
            `
            UPDATE usuarios
            SET
                pro = TRUE,
                pro_plano = $1,
                pro_inicio = $2,
                pro_expira = $3,
                mercadopago_assinatura_id =
                    COALESCE($4, mercadopago_assinatura_id)
            WHERE LOWER(email) = LOWER($5)
            RETURNING
                id,
                nome,
                email,
                pro,
                pro_plano,
                pro_inicio,
                pro_expira,
                mercadopago_assinatura_id
            `,
            [
                plano,
                inicio,
                expiracao,
                assinaturaId,
                emailNormalizado
            ]
        );

    if (resultado.rowCount === 0) {

        console.warn(
            "⚠️ Pagamento aprovado, mas usuário não encontrado:",
            emailNormalizado
        );

        return null;
    }

    console.log(
        "🌊 WaveRise PRO ativado:",
        resultado.rows[0]
    );

    return resultado.rows[0];
}


// ======================================================
// DESATIVAR PRO
// ======================================================

async function desativarProUsuario(email) {

    if (!email) {
        return null;
    }

    const resultado =
        await pool.query(
            `
            UPDATE usuarios
            SET
                pro = FALSE,
                pro_expira = CURRENT_TIMESTAMP
            WHERE LOWER(email) = LOWER($1)
            RETURNING
                id,
                nome,
                email,
                pro
            `,
            [
                String(email)
                    .trim()
                    .toLowerCase()
            ]
        );

    if (resultado.rowCount > 0) {

        console.log(
            "🛑 WaveRise PRO desativado:",
            resultado.rows[0]
        );

        return resultado.rows[0];
    }

    return null;
}


// ======================================================
// CRIAR PLANO DE ASSINATURA
// CARTÃO
// ======================================================

router.post(
    "/criar-plano",
    async (req, res) => {

        try {

            const {
                plano,
                email
            } = req.body;


            // ==================================================
            // VALIDAR E-MAIL
            // ==================================================

            if (!email) {

                return res.status(400).json({

                    sucesso:
                        false,

                    erro:
                        "O e-mail do comprador é obrigatório."

                });
            }


            // ==================================================
            // DEFINIR PLANO
            // ==================================================

            const ehAnual =
                plano === "anual";

            const dadosPlano = {

                reason:
                    ehAnual
                        ? "WaveRise PRO - Plano Anual"
                        : "WaveRise PRO - Plano Mensal",

                auto_recurring: {

                    frequency:
                        ehAnual
                            ? 12
                            : 1,

                    frequency_type:
                        "months",

                    transaction_amount:
                        ehAnual
                            ? 149.90
                            : 19.90,

                    currency_id:
                        "BRL"

                },

                payment_methods_allowed: {

                    payment_types: [

                        {
                            id:
                                "credit_card"
                        }

                    ]

                },

                back_url:
                    "https://www.mercadopago.com.br"

            };


            // ==================================================
            // CRIAR PLANO NO MERCADO PAGO
            // ==================================================

            console.log(
                "💳 Criando plano Mercado Pago:",
                plano
            );

            const resultado =
                await planoAssinatura.create({

                    body:
                        dadosPlano

                });


            console.log(
                "✅ Plano Mercado Pago criado:",
                resultado?.id
            );


            return res.json({

                sucesso:
                    true,

                plano:
                    resultado

            });


        } catch (erro) {

            console.error(
                "❌ Erro Mercado Pago - Plano:"
            );

            console.error(
                "Status:",
                erro?.status
            );

            console.error(
                "Mensagem:",
                erro?.message
            );

            console.error(
                "Causas:",
                JSON.stringify(
                    erro?.causes ||
                        [],
                    null,
                    2
                )
            );


            return res.status(
                erro?.status || 500
            ).json({

                sucesso:
                    false,

                erro:
                    erro?.message ||
                    "Erro ao criar plano.",

                causas:
                    erro?.causes ||
                    []

            });

        }

    }
);


// ======================================================
// CRIAR PAGAMENTO PIX
// MERCADO PAGO ORDERS API
// ======================================================

router.post(
    "/criar-pix",
    async (req, res) => {

        try {

            const {
                plano,
                email
            } = req.body;


            // ==================================================
            // LOG
            // ==================================================

            console.log(
                "📥 Solicitação PIX recebida:"
            );

            console.log(
                "Plano:",
                plano
            );

            console.log(
                "E-mail:",
                email
            );


            // ==================================================
            // VALIDAR E-MAIL
            // ==================================================

            if (!email) {

                return res.status(400).json({

                    sucesso:
                        false,

                    erro:
                        "O e-mail do comprador é obrigatório."

                });

            }


            // ==================================================
            // CONFIRMAR USUÁRIO
            // ==================================================

            const usuario =
                await pool.query(
                    `
                    SELECT
                        id,
                        nome,
                        email
                    FROM usuarios
                    WHERE LOWER(email) = LOWER($1)
                    LIMIT 1
                    `,
                    [
                        String(email)
                            .trim()
                            .toLowerCase()
                    ]
                );


            if (usuario.rowCount === 0) {

                return res.status(404).json({

                    sucesso:
                        false,

                    erro:
                        "Usuário WaveRise não encontrado."

                });

            }


            // ==================================================
            // DEFINIR VALOR
            // ==================================================

            const ehAnual =
                plano === "anual";

            const valor =
                obterValorPlano(plano);

            const nomePlano =
                obterNomePlano(plano);


            // ==================================================
            // REFERÊNCIA DO NOSSO SISTEMA
            // ==================================================

            const referenciaId =
                crypto.randomUUID();

            const externalReference =
                `waverise-pro|email=${encodeURIComponent(
                    email
                )}|plano=${plano || "mensal"}|id=${referenciaId}`;


            // ==================================================
            // CHAVE DE IDEMPOTÊNCIA
            // ==================================================

            const idempotencyKey =
                crypto.randomUUID();


            // ==================================================
            // CRIAR ORDER PIX
            // ==================================================

            console.log(
                "💳 Enviando PIX para Mercado Pago..."
            );

            const resposta =
                await fetch(
                    "https://api.mercadopago.com/v1/orders",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json",

                            "Authorization":
                                `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,

                            "X-Idempotency-Key":
                                idempotencyKey

                        },

                        body:
                            JSON.stringify({

                                type:
                                    "online",

                                total_amount:
                                    valor.toFixed(2),

                                external_reference:
                                    externalReference,

                                processing_mode:
                                    "automatic",

                                transactions: {

                                    payments: [

                                        {

                                            amount:
                                                valor.toFixed(2),

                                            payment_method: {

                                                id:
                                                    "pix",

                                                type:
                                                    "bank_transfer"

                                            },

                                            expiration_time:
                                                "P1D"

                                        }

                                    ]

                                },

                                payer: {

                                    // Ambiente de teste
                                    // do Mercado Pago.

                                    email:
                                        "test_user_br@testuser.com"

                                }

                            })

                    }
                );


            // ==================================================
            // LER RESPOSTA
            // ==================================================

            const resultado =
                await resposta.json();


            console.log(
                "💳 Mercado Pago PIX HTTP:",
                resposta.status
            );


            // ==================================================
            // TRATAR ERRO
            // ==================================================

            if (!resposta.ok) {

                console.error(
                    "❌ Erro Mercado Pago PIX:"
                );

                console.error(
                    JSON.stringify(
                        resultado,
                        null,
                        2
                    )
                );


                return res.status(
                    resposta.status
                ).json({

                    sucesso:
                        false,

                    erro:
                        resultado?.message ||
                        resultado?.error ||
                        "Erro ao criar PIX.",

                    causas:
                        resultado?.causes ||
                        []

                });

            }


            // ==================================================
            // LOCALIZAR PAGAMENTO
            // ==================================================

            const pagamento =
                resultado
                    ?.transactions
                    ?.payments
                    ?.[0];


            const metodoPagamento =
                pagamento
                    ?.payment_method;


            // ==================================================
            // VERIFICAR DADOS
            // ==================================================

            console.log(
                "✅ PIX criado com sucesso!"
            );

            console.log(
                "Order ID:",
                resultado?.id
            );

            console.log(
                "Pagamento ID:",
                pagamento?.id
            );


            // ==================================================
            // RETORNAR DADOS
            // ==================================================

            return res.json({

                sucesso:
                    true,

                plano:
                    plano ||
                    "mensal",

                valor:
                    valor,

                descricao:
                    nomePlano,

                pagamento: {

                    orderId:
                        resultado?.id,

                    pagamentoId:
                        pagamento?.id,

                    status:
                        pagamento?.status,

                    statusDetalhe:
                        pagamento?.status_detail,

                    qrCode:
                        metodoPagamento
                            ?.qr_code,

                    qrCodeBase64:
                        metodoPagamento
                            ?.qr_code_base64,

                    copiaCola:
                        metodoPagamento
                            ?.qr_code,

                    ticketUrl:
                        metodoPagamento
                            ?.ticket_url

                }

            });


        } catch (erro) {

            console.error(
                "❌ Erro interno Mercado Pago - PIX:"
            );

            console.error(
                JSON.stringify(
                    erro,
                    null,
                    2
                )
            );


            return res.status(500).json({

                sucesso:
                    false,

                erro:
                    erro?.message ||
                    "Não foi possível criar o pagamento PIX."

            });

        }

    }
);


// ======================================================
// VALIDAR ASSINATURA DO WEBHOOK
// ======================================================

function validarWebhookMercadoPago(req) {

    const secret =
        process.env.MERCADOPAGO_WEBHOOK_SECRET;

    // Durante a configuração inicial,
    // se a variável ainda não existir,
    // deixamos o webhook funcionar.
    //
    // Depois que a chave for configurada no Render,
    // a validação HMAC será obrigatória.

    if (!secret) {

        console.warn(
            "⚠️ MERCADOPAGO_WEBHOOK_SECRET não configurado."
        );

        return true;
    }


    const xSignature =
        req.headers["x-signature"];

    const xRequestId =
        req.headers["x-request-id"];

    const dataId =
        req.query["data.id"];


    if (
        !xSignature ||
        !xRequestId ||
        !dataId
    ) {

        console.warn(
            "⚠️ Webhook sem dados necessários para validação."
        );

        return false;
    }


    let ts = "";
    let v1 = "";

    const partes =
        xSignature.split(",");

    for (const parte of partes) {

        const [chave, valor] =
            parte.split("=");

        if (chave === "ts") {
            ts = valor;
        }

        if (chave === "v1") {
            v1 = valor;
        }

    }


    if (!ts || !v1) {
        return false;
    }


    const manifest =
        `id:${dataId};request-id:${xRequestId};ts:${ts};`;


    const assinaturaEsperada =
        crypto
            .createHmac(
                "sha256",
                secret
            )
            .update(manifest)
            .digest("hex");


    try {

        return crypto.timingSafeEqual(
            Buffer.from(
                assinaturaEsperada
            ),
            Buffer.from(v1)
        );

    } catch {

        return false;
    }

}


// ======================================================
// WEBHOOK MERCADO PAGO
// ======================================================

router.post(
    "/webhook",
    async (req, res) => {

        // O Mercado Pago precisa receber
        // resposta rapidamente.

        try {

            // ==================================================
            // VALIDAR ORIGEM
            // ==================================================

            const webhookValido =
                validarWebhookMercadoPago(req);


            if (!webhookValido) {

                console.warn(
                    "🚫 Webhook Mercado Pago rejeitado."
                );

                return res
                    .status(401)
                    .json({
                        sucesso:
                            false
                    });

            }


            // ==================================================
            // IDENTIFICAR EVENTO
            // ==================================================

            const tipo =
                req.body?.type ||
                req.query?.type;

            const dataId =
                req.body?.data?.id ||
                req.query?.["data.id"];


            console.log(
                "🔔 Webhook Mercado Pago recebido:",
                {
                    tipo,
                    dataId
                }
            );


            // Sempre responder OK para
            // notificações que não precisamos processar.

            if (!tipo || !dataId) {

                return res.status(200).json({
                    recebido:
                        true
                });

            }


            // ==================================================
            // EVENTO: PAYMENT
            // ==================================================

            if (tipo === "payment") {

                const resposta =
                    await fetch(
                        `https://api.mercadopago.com/v1/payments/${dataId}`,
                        {

                            headers: {

                                Authorization:
                                    `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`

                            }

                        }
                    );


                const pagamento =
                    await resposta.json();


                if (!resposta.ok) {

                    console.error(
                        "❌ Não foi possível consultar pagamento:",
                        pagamento
                    );

                    return res.status(200).json({
                        recebido:
                            true
                    });

                }


                console.log(
                    "💳 Status pagamento:",
                    pagamento?.status
                );


                // Pagamento aprovado

                if (
                    pagamento?.status ===
                    "approved"
                ) {

                    const email =
                        pagamento
                            ?.payer
                            ?.email;

                    let plano =
                        "mensal";


                    // Tentar descobrir o plano
                    // através da referência.

                    const referencia =
                        pagamento
                            ?.external_reference ||
                        pagamento
                            ?.order
                            ?.external_reference;


                    if (
                        referencia
                            ?.includes(
                                "plano=anual"
                            )
                    ) {

                        plano =
                            "anual";

                    }


                    await ativarProUsuario({

                        email,
                        plano,

                        assinaturaId:
                            pagamento?.id
                                ?.toString()

                    });

                }


                return res.status(200).json({
                    recebido:
                        true
                });

            }


            // ==================================================
            // EVENTO: ORDER
            // ==================================================

            if (tipo === "order") {

                const resposta =
                    await fetch(
                        `https://api.mercadopago.com/v1/orders/${dataId}`,
                        {

                            headers: {

                                Authorization:
                                    `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`

                            }

                        }
                    );


                const order =
                    await resposta.json();


                if (!resposta.ok) {

                    console.error(
                        "❌ Não foi possível consultar order:",
                        order
                    );

                    return res.status(200).json({
                        recebido:
                            true
                    });

                }


                console.log(
                    "🧾 Status order:",
                    order?.status
                );


                const pagamento =
                    order
                        ?.transactions
                        ?.payments
                        ?.[0];


                const pagamentoAprovado =
                    [
                        "processed",
                        "approved",
                        "completed"
                    ].includes(
                        pagamento?.status
                    ) ||
                    [
                        "processed",
                        "approved",
                        "completed"
                    ].includes(
                        order?.status
                    );


                if (
                    pagamentoAprovado
                ) {

                    const referencia =
                        order
                            ?.external_reference;


                    let email =
                        order
                            ?.payer
                            ?.email;


                    let plano =
                        "mensal";


                    // ==================================================
                    // RECUPERAR E-MAIL DA NOSSA REFERÊNCIA
                    // ==================================================

                    if (
                        referencia
                    ) {

                        const matchEmail =
                            referencia.match(
                                /email=([^|]+)/
                            );

                        const matchPlano =
                            referencia.match(
                                /plano=([^|]+)/
                            );


                        if (
                            matchEmail
                        ) {

                            try {

                                email =
                                    decodeURIComponent(
                                        matchEmail[1]
                                    );

                            } catch {

                                console.warn(
                                    "⚠️ Não foi possível decodificar o e-mail."
                                );

                            }

                        }


                        if (
                            matchPlano &&
                            matchPlano[1] ===
                                "anual"
                        ) {

                            plano =
                                "anual";

                        }

                    }


                    await ativarProUsuario({

                        email,

                        plano,

                        assinaturaId:
                            order
                                ?.id
                                ?.toString()

                    });

                }


                return res.status(200).json({
                    recebido:
                        true
                });

            }


            // ==================================================
            // EVENTO: SUBSCRIPTION_PREAPPROVAL
            // ==================================================

            if (
                tipo ===
                "subscription_preapproval"
            ) {

                const resposta =
                    await fetch(
                        `https://api.mercadopago.com/preapproval/${dataId}`,
                        {

                            headers: {

                                Authorization:
                                    `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`

                            }

                        }
                    );


                const assinatura =
                    await resposta.json();


                if (!resposta.ok) {

                    console.error(
                        "❌ Não foi possível consultar assinatura:",
                        assinatura
                    );

                    return res.status(200).json({
                        recebido:
                            true
                    });

                }


                console.log(
                    "📋 Status assinatura:",
                    assinatura?.status
                );


                const status =
                    assinatura?.status;


                const email =
                    assinatura
                        ?.payer_email;


                let plano =
                    "mensal";


                if (
                    assinatura
                        ?.auto_recurring
                        ?.frequency === 12
                ) {

                    plano =
                        "anual";

                }


                // ==================================================
                // ASSINATURA AUTORIZADA
                // ==================================================

                if (
                    status ===
                    "authorized"
                ) {

                    await ativarProUsuario({

                        email,

                        plano,

                        assinaturaId:
                            assinatura?.id
                                ?.toString()

                    });

                }


                // ==================================================
                // ASSINATURA CANCELADA
                // ==================================================

                if (
                    status ===
                        "cancelled" ||
                    status ===
                        "paused"
                ) {

                    await desativarProUsuario(
                        email
                    );

                }


                return res.status(200).json({
                    recebido:
                        true
                });

            }


            // ==================================================
            // OUTROS EVENTOS
            // ==================================================

            console.log(
                "ℹ️ Evento Mercado Pago não processado:",
                tipo
            );


            return res.status(200).json({
                recebido:
                    true
            });


        } catch (erro) {

            console.error(
                "❌ Erro no webhook Mercado Pago:"
            );

            console.error(
                erro
            );

            // Mesmo em erro interno,
            // respondemos 200 para evitar
            // uma tempestade de reenvios
            // durante a fase inicial.

            return res.status(200).json({
                recebido:
                    true
            });

        }

    }
);


// ======================================================
// TESTE DO WEBHOOK
// ======================================================

router.get(
    "/webhook",
    (req, res) => {

        res.json({

            sucesso:
                true,

            mensagem:
                "Webhook WaveRise Mercado Pago ativo.",

            endpoint:
                "/pagamentos/webhook"

        });

    }
);


// ======================================================
// EXPORTAR ROTAS
// ======================================================

console.log(
    "📌 Rotas de pagamentos carregadas:"
);

console.log(
    router.stack
        .map(
            r =>
                r.route?.path
        )
        .filter(Boolean)
);


export default router;