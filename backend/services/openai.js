import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function analisarFoto(caminhoArquivo){

    const base64 = fs.readFileSync(caminhoArquivo).toString("base64");

    try{

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

Analise tecnicamente esta foto.

Responda SOMENTE em JSON.

Formato:

{
  "nota":90,
  "manobra":"Bottom Turn",
  "pontosFortes":[
    "...",
    "..."
  ],
  "melhorias":[
    "...",
    "..."
  ],
  "treino":"..."
}
`
                        },

                        {
                            type: "input_image",

                            image_url: `data:image/jpeg;base64,${base64}`
                        }

                    ]

                }

            ]

        });

        const texto = resposta.output_text;

        return JSON.parse(texto);

    }

    catch(erro){

        console.error(erro);

        return {

            nota:0,

            manobra:"Erro",

            pontosFortes:[],

            melhorias:[erro.message],

            treino:""

        };

    }

}