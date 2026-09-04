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
                login: resolve("pages/login.html"),
                perfil: resolve("pages/perfil.html"),
                editarPerfil: resolve("pages/editar-perfil.html"),
                diario: resolve("pages/diario.html"),
                coach: resolve("pages/coach.html"),
                evolucao: resolve("pages/evolucao.html"),
                conquistas: resolve("pages/conquistas.html"),
                pranchas: resolve("pages/pranchas.html"),
                mar: resolve("pages/mar.html"),
                calendario: resolve("pages/calendario.html"),
                pro: resolve("pages/pro.html"),
                analiseFoto: resolve("pages/analise-foto.html"),
            }
        }
    }
});