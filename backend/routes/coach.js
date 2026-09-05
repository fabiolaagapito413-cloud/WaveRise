import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

import {
    analisarFoto,
    analisarVideo
} from "../services/openai.js";

const router = express.Router();

const execFileAsync = promisify(execFile);

// ======================================================
// CONFIGURAÇÃO DO UPLOAD
// ======================================================

const upload = multer({
    dest: "uploads/"
});

// ======================================================
// CAMINHO DO FFMPEG
// ======================================================
//
// Este é o caminho do FFmpeg instalado no seu Windows.
// ======================================================

const FFMPEG_PATH =
    "C:\\Users\\fabia\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-full_build\\bin\\ffmpeg.exe";

// ======================================================
// ANALISAR FOTO
// ======================================================

router.post("/foto", upload.single("foto"), async (req, res) => {

    console.log("✅ CHEGOU NA ROTA /coach/foto");

    try {

        if (!req.file) {

            return res.status(400).json({
                sucesso: false,
                erro: "Nenhuma foto enviada."
            });

        }

        console.log(
            "📷 Foto recebida:",
            req.file.originalname
        );

        console.log(
            "📁 Arquivo temporário:",
            req.file.path
        );

        // ----------------------------------------------
        // ANALISAR FOTO
        // ----------------------------------------------

        const analise = await analisarFoto(
            req.file.path
        );

        console.log("🤖 RESPOSTA DA IA:");
        console.log(analise);

        // ----------------------------------------------
        // APAGAR FOTO
        // ----------------------------------------------

        fs.unlink(req.file.path, (erro) => {

            if (erro) {

                console.error(
                    "⚠️ Erro ao apagar foto:",
                    erro
                );

            } else {

                console.log(
                    "🗑️ Foto temporária apagada."
                );

            }

        });

        // ----------------------------------------------
        // RESPONDER
        // ----------------------------------------------

        return res.json({
            sucesso: true,
            analise
        });

    } catch (erro) {

        console.error(
            "❌ ERRO NA ANÁLISE DA FOTO:",
            erro
        );

        if (req.file?.path) {
            fs.unlink(req.file.path, () => {});
        }

        return res.status(500).json({
            sucesso: false,
            erro:
                erro.message ||
                "Erro ao analisar a foto."
        });

    }

});

// ======================================================
// ANALISAR VÍDEO
// ======================================================

router.post(
    "/video",
    upload.single("video"),
    async (req, res) => {

        console.log(
            "🎥 CHEGOU NA ROTA /coach/video"
        );

        let pastaFrames = null;

        try {

            // ------------------------------------------
            // VERIFICAR VÍDEO
            // ------------------------------------------

            if (!req.file) {

                return res.status(400).json({
                    sucesso: false,
                    erro: "Nenhum vídeo enviado."
                });

            }

            console.log(
                "🎥 Vídeo recebido:",
                req.file.originalname
            );

            console.log(
                "📁 Arquivo temporário:",
                req.file.path
            );

            // ------------------------------------------
            // VERIFICAR FFMPEG
            // ------------------------------------------

            if (!fs.existsSync(FFMPEG_PATH)) {

                throw new Error(
                    "FFmpeg não foi encontrado no caminho configurado."
                );

            }

            console.log(
                "✅ FFmpeg encontrado."
            );

            // ------------------------------------------
            // CRIAR PASTA TEMPORÁRIA DOS FRAMES
            // ------------------------------------------

            pastaFrames = await fs.promises.mkdtemp(
                path.join(
                    os.tmpdir(),
                    "waverise-frames-"
                )
            );

            console.log(
                "📂 Pasta dos frames:",
                pastaFrames
            );

            // ------------------------------------------
            // EXTRAIR FRAMES
            // ------------------------------------------
            //
            // -vf fps=2
            //
            // Extrai aproximadamente 2 frames
            // por segundo.
            //
            // -frames:v 10
            //
            // Limita a análise aos primeiros 10 frames.
            //
            // Depois podemos melhorar essa estratégia.
            // ------------------------------------------

            const saidaFrames = path.join(
                pastaFrames,
                "frame-%02d.jpg"
            );

            console.log(
                "🎞️ Extraindo frames do vídeo..."
            );

            await execFileAsync(
                FFMPEG_PATH,
                [
                    "-i",
                    req.file.path,

                    "-vf",
                    "fps=2",

                    "-frames:v",
                    "10",

                    "-q:v",
                    "3",

                    saidaFrames,

                    "-y"
                ]
            );

            console.log(
                "✅ Frames extraídos."
            );

            // ------------------------------------------
            // LISTAR FRAMES
            // ------------------------------------------

            const arquivosFrames =
                (await fs.promises.readdir(
                    pastaFrames
                ))
                .filter((arquivo) =>
                    arquivo.toLowerCase().endsWith(".jpg")
                )
                .sort();

            console.log(
                `🎞️ ${arquivosFrames.length} frames encontrados.`
            );

            if (arquivosFrames.length === 0) {

                throw new Error(
                    "Não foi possível extrair frames do vídeo."
                );

            }

            // ------------------------------------------
            // CONVERTER FRAMES PARA BASE64
            // ------------------------------------------

            const quadros = [];

            for (const arquivo of arquivosFrames) {

                const caminhoFrame = path.join(
                    pastaFrames,
                    arquivo
                );

                const base64 =
                    await fs.promises
                        .readFile(caminhoFrame)
                        .then(buffer =>
                            buffer.toString("base64")
                        );

                quadros.push(base64);

            }

            console.log(
                `🖼️ ${quadros.length} quadros preparados para a IA.`
            );

            // ------------------------------------------
            // ENVIAR QUADROS PARA A IA
            // ------------------------------------------

            console.log(
                "🤖 Enviando vídeo para o Coach IA..."
            );

            const analise =
                await analisarVideo(quadros);

            console.log(
                "🤖 RESPOSTA DA IA:"
            );

            console.log(analise);

            // ------------------------------------------
            // RESPONDER AO APLICATIVO
            // ------------------------------------------

            return res.json({
                sucesso: true,
                analise
            });

        } catch (erro) {

            console.error(
                "❌ ERRO NA ANÁLISE DO VÍDEO:"
            );

            console.error(erro);

            return res.status(500).json({
                sucesso: false,
                erro:
                    erro.message ||
                    "Erro ao analisar o vídeo."
            });

        } finally {

            // ==========================================
            // APAGAR VÍDEO TEMPORÁRIO
            // ==========================================

            if (req.file?.path) {

                try {

                    await fs.promises.unlink(
                        req.file.path
                    );

                    console.log(
                        "🗑️ Vídeo temporário apagado."
                    );

                } catch (erro) {

                    console.error(
                        "⚠️ Não foi possível apagar o vídeo:",
                        erro
                    );

                }

            }

            // ==========================================
            // APAGAR FRAMES TEMPORÁRIOS
            // ==========================================

            if (pastaFrames) {

                try {

                    const arquivos =
                        await fs.promises.readdir(
                            pastaFrames
                        );

                    for (const arquivo of arquivos) {

                        await fs.promises.unlink(
                            path.join(
                                pastaFrames,
                                arquivo
                            )
                        );

                    }

                    await fs.promises.rmdir(
                        pastaFrames
                    );

                    console.log(
                        "🗑️ Frames temporários apagados."
                    );

                } catch (erro) {

                    console.error(
                        "⚠️ Erro ao limpar frames:",
                        erro
                    );

                }

            }

        }

    }
);

// ======================================================
// EXPORTAR
// ======================================================

export default router;