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


// ======================================================
// ATIVAR PRO PELO E-MAIL
// Usado principalmente pela assinatura do cartão
// ======================================================

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

    const inicio = new Date();

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
            "⚠️ Usuário não encontrado pelo e-mail:",
            emailNormalizado
        );

        return null;
    }

    console.log(
        "✅ PRO ativado pelo e-mail:",
        emailNormalizado
    );

    return resultado.rows[0];
}


// ======================================================
// ATIVAR PRO PELO ID
// Usado pelo PIX
// ======================================================

async function ativarProUsuarioPorId({
    usuarioId,
    plano = "mensal",
    assinaturaId = null
}) {

    if (!usuarioId) {
        console.warn(
            "⚠️ Não foi possível ativar PRO: ID do usuário não informado."
        );

        return null;
    }

    const inicio = new Date();

    const expiracao =
        obterDataExpiracao(plano);

    const resultado =
        await pool.query(
            `
            UPDATE usuarios
            SET
                pro = TRUE,
                pro_plano = $2,
                pro_inicio = $3,
                pro_expira = $4,
                mercadopago_assinatura_id =
                    COALESCE($5, mercadopago_assinatura_id)

            WHERE id = $1

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
                usuarioId,
                plano,
                inicio,
                expiracao,
                assinaturaId
            ]
        );

    if (resultado.rowCount === 0) {
        console.warn(
            "⚠️ Usuário não encontrado pelo ID:",
            usuarioId
        );

        return null;
    }

    console.log(
        "✅ PRO ativado pelo ID:",
        usuarioId
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

    const emailNormalizado =
        String(email)
            .trim()
            .toLowerCase();

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
                email,
                pro,
                pro_plano,
                pro_expira
            `,
            [emailNormalizado]
        );

    if (resultado.rowCount > 0) {

        console.log(
            "🔴 PRO desativado:",
            emailNormalizado
        );

        return resultado.rows[0];
    }

    return null;
}


// ======================================================
// LER REFERÊNCIA DO PIX
//
// Formato:
//
// wrp-8-mensal-a7f32c91
//
// wrp = WaveRise PRO
// 8 = ID do usuário
// mensal/anual = plano
// últimos caracteres = identificador
// ======================================================

function lerReferenciaPix(externalReference) {

    if (!externalReference) {
        return null;
    }

    const match =
        String(externalReference)
            .match(
                /^wrp-(\d+)-(mensal|anual)-([A-Za-z0-9]+)$/
            );

    if (!match) {
        console.warn(
            "⚠️ Referência PIX inválida:",
            externalReference
        );

        return null;
    }

    return {
        usuarioId: Number(match[1]),
        plano: match[2]
    };
}


// ======================================================
// VALIDAR WEBHOOK MERCADO PAGO
// ======================================================

function validarWebhookMercadoPago(req) {

    const secret =
        process.env.MERCADOPAGO_WEBHOOK_SECRET;

    // Se ainda não houver secret configurado,
    // aceita para não quebrar o ambiente.
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
// CRIAR PLANO DE ASSINATURA
// CARTÃO
// ======================================================

router.post(
    "/criar-plano",
    async (req, res) => {

        try {

            const {
                plano
            } = req.body;

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


            console.log(
                "💳 Criando plano Mercado Pago:",
                plano
            );


            const resultado =
                await planoAssinatura.create({
                    body:
                        dadosPlano
                });


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


            console.log(
                "📥 Solicitação PIX recebida"
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
            // BUSCAR USUÁRIO NO BANCO
            // ==================================================

            const usuarioResultado =
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


            if (
                usuarioResultado.rowCount === 0
            ) {

                return res.status(404).json({

                    sucesso:
                        false,

                    erro:
                        "Usuário WaveRise não encontrado."
                });
            }


            const usuario =
                usuarioResultado.rows[0];


            console.log(
                "👤 Usuário encontrado:",
                usuario.id
            );


            // ==================================================
            // DEFINIR PLANO
            // ==================================================

            const planoFinal =
                plano === "anual"
                    ? "anual"
                    : "mensal";


            const valor =
                obterValorPlano(
                    planoFinal
                );


            const nomePlano =
                obterNomePlano(
                    planoFinal
                );


            // ==================================================
            // REFERÊNCIA SEGURA DO PIX
            //
            // IMPORTANTE:
            // NÃO colocamos e-mail aqui.
            //
            // Exemplo:
            //
            // wrp-8-mensal-a7f32c91
            // ==================================================

            const identificador =
                crypto
                    .randomUUID()
                    .replace(/-/g, "")
                    .slice(0, 8);


            const externalReference =
                `wrp-${usuario.id}-${planoFinal}-${identificador}`;


            console.log(
                "🔗 External Reference PIX:",
                externalReference
            );


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

                                    // Usuário de teste
                                    // do Mercado Pago Sandbox

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
                        resultado?.errors ||
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
            // LOG
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
            // RETORNAR DADOS PARA O FRONTEND
            // ==================================================

            return res.json({

                sucesso:
                    true,

                plano:
                    planoFinal,

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
                erro
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
// WEBHOOK MERCADO PAGO
// ======================================================

router.post(
    "/webhook",
    async (req, res) => {

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


            // ==================================================
            // EVENTOS SEM DADOS
            // ==================================================

            if (!tipo || !dataId) {

                return res
                    .status(200)
                    .json({
                        recebido:
                            true
                    });
            }


            // ==================================================
            // PAYMENT
            // PIX / PAGAMENTOS
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
                        "❌ Erro ao consultar pagamento:",
                        pagamento
                    );

                    return res
                        .status(200)
                        .json({
                            recebido:
                                true
                        });
                }


                console.log(
                    "💰 Status pagamento:",
                    pagamento?.status
                );


                // ==================================================
                // PAGAMENTO APROVADO
                // ==================================================

                if (
                    pagamento?.status ===
                    "approved"
                ) {

                    const externalReference =
                        pagamento
                            ?.external_reference;


                    const dadosReferencia =
                        lerReferenciaPix(
                            externalReference
                        );


                    // ==================================================
                    // PIX
                    // ==================================================

                    if (dadosReferencia) {

                        await ativarProUsuarioPorId({

                            usuarioId:
                                dadosReferencia.usuarioId,

                            plano:
                                dadosReferencia.plano,

                            assinaturaId:
                                pagamento
                                    ?.id
                                    ?.toString()
                        });

                    }

                    // ==================================================
                    // CARTÃO
                    // ==================================================

                    else {

                        const email =
                            pagamento
                                ?.payer
                                ?.email;


                        if (email) {

                            await ativarProUsuario({

                                email,

                                plano:
                                    "mensal",

                                assinaturaId:
                                    pagamento
                                        ?.id
                                        ?.toString()
                            });
                        }
                    }
                }


                return res
                    .status(200)
                    .json({
                        recebido:
                            true
                    });
            }


            // ======================================================
            // ORDER
            // PIX ORDERS API
            // ======================================================

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
                        "❌ Erro ao consultar Order:",
                        order
                    );

                    return res
                        .status(200)
                        .json({
                            recebido:
                                true
                        });
                }


                console.log(
                    "📦 Order Mercado Pago:",
                    {
                        id:
                            order?.id,

                        status:
                            order?.status
                    }
                );


                // ==================================================
                // VERIFICAR PAGAMENTO
                // ==================================================

                const pagamentos =
                    order
                        ?.transactions
                        ?.payments ||
                    [];


                const pagamentoAprovado =
                    pagamentos.find(
                        pagamento =>
                            pagamento?.status ===
                            "processed" ||
                            pagamento?.status ===
                            "approved" ||
                            pagamento?.status ===
                            "completed"
                    );


                if (pagamentoAprovado) {

                    const externalReference =
                        order
                            ?.external_reference;


                    const dadosReferencia =
                        lerReferenciaPix(
                            externalReference
                        );


                    if (dadosReferencia) {

                        await ativarProUsuarioPorId({

                            usuarioId:
                                dadosReferencia.usuarioId,

                            plano:
                                dadosReferencia.plano,

                            assinaturaId:
                                order
                                    ?.id
                                    ?.toString()
                        });


                    } else {

                        console.warn(
                            "⚠️ Order aprovada sem referência WaveRise válida."
                        );
                    }
                }


                return res
                    .status(200)
                    .json({
                        recebido:
                            true
                    });
            }


            // ======================================================
            // SUBSCRIPTION PREAPPROVAL
            // CARTÃO / ASSINATURA
            // ======================================================

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
                        "❌ Erro ao consultar assinatura:",
                        assinatura
                    );

                    return res
                        .status(200)
                        .json({
                            recebido:
                                true
                        });
                }


                console.log(
                    "🔄 Status assinatura:",
                    assinatura?.status
                );


                // ==================================================
                // ASSINATURA ATIVA
                // ==================================================

                if (
                    assinatura?.status ===
                    "authorized"
                ) {

                    const email =
                        assinatura
                            ?.payer_email;


                    if (email) {

                        const plano =
                            assinatura
                                ?.auto_recurring
                                ?.frequency === 12
                                ? "anual"
                                : "mensal";


                        await ativarProUsuario({

                            email,

                            plano,

                            assinaturaId:
                                assinatura
                                    ?.id
                                    ?.toString()
                        });
                    }
                }


                // ==================================================
                // ASSINATURA CANCELADA / PAUSADA
                // ==================================================

                if (
                    assinatura?.status ===
                    "cancelled" ||
                    assinatura?.status ===
                    "paused"
                ) {

                    const email =
                        assinatura
                            ?.payer_email;


                    if (email) {

                        await desativarProUsuario(
                            email
                        );
                    }
                }


                return res
                    .status(200)
                    .json({
                        recebido:
                            true
                    });
            }


            // ======================================================
            // OUTROS EVENTOS
            // ======================================================

            console.log(
                "ℹ️ Evento Mercado Pago não processado:",
                tipo
            );


            return res
                .status(200)
                .json({
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


            // Mercado Pago deve receber 200
            // para evitar reenvios desnecessários.

            return res
                .status(200)
                .json({
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
                "Webhook Mercado Pago ativo."
        });
    }
);


// ======================================================
// ROTAS CARREGADAS
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


// ======================================================
// EXPORTAR
// ======================================================

export default router;