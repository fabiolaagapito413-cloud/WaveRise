import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ======================================================
// ANALISAR FOTO
// ======================================================

export async function analisarFoto(caminhoArquivo) {

    const base64 = fs
        .readFileSync(caminhoArquivo)
        .toString("base64");

    try {

        const resposta = await client.responses.create({

            model: "gpt-4.1",

            input: [

                {
                    role: "user",

                    content: [

                        {
                            type: "input_text",

                            text: `
Você é um treinador profissional de surf.

Analise tecnicamente esta foto de um surfista.

Observe principalmente:

- postura
- equilíbrio
- posicionamento do corpo
- distribuição de peso
- posição dos pés
- flexão dos joelhos
- braços
- controle da prancha
- relação do surfista com a onda
- possível manobra

Responda SOMENTE em JSON.

Formato:

{
  "nota": 90,
  "manobra": "Bottom Turn",
  "pontosFortes": [
    "...",
    "..."
  ],
  "melhorias": [
    "...",
    "..."
  ],
  "treino": "..."
}
`
                        },

                        {
                            type: "input_image",

                            image_url:
                                `data:image/jpeg;base64,${base64}`,

                            detail: "high"
                        }

                    ]

                }

            ]

        });

        const texto = resposta.output_text;

        return JSON.parse(texto);

    }

    catch (erro) {

        console.error("ERRO NA ANÁLISE DA FOTO:", erro);

        return {

            nota: 0,

            manobra: "Não identificada",

            pontosFortes: [],

            melhorias: [
                erro.message
            ],

            treino: ""

        };

    }

}


// ======================================================
// ANALISAR VÍDEO
// ======================================================
//
// A análise de vídeo será feita a partir de quadros
// extraídos do vídeo.
//
// Cada quadro será enviado como imagem para a IA.
// ======================================================

export async function analisarVideo(quadros) {

    try {

        if (!quadros || quadros.length === 0) {

            throw new Error(
                "Nenhum quadro do vídeo foi recebido."
            );

        }

        console.log(
            `🎥 Analisando ${quadros.length} quadros do vídeo...`
        );


        const imagens = quadros.map((quadro) => {

            return {

                type: "input_image",

                image_url:
                    `data:image/jpeg;base64,${quadro}`,

                detail: "high"

            };

        });


        const resposta = await client.responses.create({

            model: "gpt-4.1",

            input: [

                {

                    role: "user",

                    content: [

                        {

                            type: "input_text",

                            text: `
Você é um treinador profissional de surf.

Você recebeu vários quadros de um vídeo
de uma sessão de surf.

Analise a evolução do surfista ao longo
dos quadros.

Observe:

- postura
- equilíbrio
- flexão dos joelhos
- posição dos pés
- distribuição de peso
- posição dos braços
- controle da prancha
- posicionamento no pico
- leitura da onda
- execução da manobra
- estabilidade
- fluidez
- possíveis erros técnicos
- pontos fortes
- pontos que precisam melhorar

Não invente informações que não possam ser
observadas nos quadros.

Se alguma informação não puder ser avaliada,
informe isso claramente.

Responda SOMENTE em JSON.

Formato:

{
  "nota": 85,

  "resumo": "...",

  "pontosFortes": [
    "...",
    "..."
  ],

  "melhorias": [
    "...",
    "..."
  ],

  "tecnica": {
    "postura": "...",
    "equilibrio": "...",
    "pernas": "...",
    "bracos": "...",
    "posicaoNaPrancha": "..."
  },

  "manobra": "...",

  "treino": "...",

  "proximoObjetivo": "..."
}
`
                        },

                        ...imagens

                    ]

                }

            ]

        });


        const texto = resposta.output_text;

        console.log("🤖 RESPOSTA DA IA:");

        console.log(texto);


        return JSON.parse(texto);

    }

    catch (erro) {

        console.error(
            "ERRO NA ANÁLISE DO VÍDEO:",
            erro
        );

        return {

            nota: 0,

            resumo:
                "Não foi possível concluir a análise.",

            pontosFortes: [],

            melhorias: [
                erro.message
            ],

            tecnica: {

                postura: "",

                equilibrio: "",

                pernas: "",

                bracos: "",

                posicaoNaPrancha: ""

            },

            manobra:
                "Não identificada",

            treino: "",

            proximoObjetivo: ""

        };

    }

}