import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";

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


            // ==================================================
            // LOG PARA DEBUG
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
            // DEFINIR VALOR
            // ==================================================

            const ehAnual =
                plano === "anual";

            const valor =
                ehAnual
                    ? 149.90
                    : 19.90;

            const nomePlano =
                ehAnual
                    ? "WaveRise PRO - Plano Anual"
                    : "WaveRise PRO - Plano Mensal";


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
                                    `waverise-pro-${crypto.randomUUID()}`,

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

                                    // ==================================================
                                    // MERCADO PAGO SANDBOX
                                    // ==================================================
                                    // No ambiente de teste o Mercado Pago
                                    // exige um e-mail @testuser.com.
                                    //
                                    // O e-mail real do usuário continua
                                    // sendo recebido pelo WaveRise acima.
                                    // Aqui usamos apenas o usuário de teste
                                    // exigido pelo Sandbox.
                                    // ==================================================

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
            // VERIFICAR DADOS DO PIX
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
            // RETORNAR DADOS DO PIX
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
// EXPORTAR ROTAS
// ======================================================

console.log(
    "📌 Rotas de pagamentos carregadas:"
);

console.log(
    router.stack
        .map(
            r => r.route?.path
        )
        .filter(Boolean)
);


export default router;