import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    server: {
        host: true,
        allowedHosts: true
    },

    build: {
        rollupOptions: {
            input: {
                main: resolve("index.html"),

                // ==============================
                // AUTENTICAÇÃO
                // ==============================

                login: resolve("pages/login.html"),

                // ==============================
                // PERFIL
                // ==============================

                perfil: resolve("pages/perfil.html"),
                editarPerfil: resolve("pages/editar-perfil.html"),

                // ==============================
                // SURF
                // ==============================

                diario: resolve("pages/diario.html"),
                coach: resolve("pages/coach.html"),
                coachPro: resolve("pages/coach-pro.html"),
                evolucao: resolve("pages/evolucao.html"),
                conquistas: resolve("pages/conquistas.html"),
                pranchas: resolve("pages/pranchas.html"),
                mar: resolve("pages/mar.html"),
                calendario: resolve("pages/calendario.html"),
                planoEvolucao: resolve("pages/plano-evolucao.html"),
                melhorHorario: resolve("pages/melhor-horario.html"),
                compararPraias: resolve("pages/comparar-praias.html"),
                alertas: resolve("pages/alertas.html"),
                pranchaIdeal: resolve("pages/prancha-ideal.html"),

                // ==============================
                // PRO
                // ==============================

                pro: resolve("pages/pro.html"),

                // ==============================
                // ANÁLISES DO COACH IA
                // ==============================

                analiseFoto: resolve(
                    "pages/analise-foto.html"
                ),

                analiseVideo: resolve(
                    "pages/analise-video.html"
                )
            }
        }
    }
});