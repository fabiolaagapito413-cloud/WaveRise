// ======================================================
// WaveRise — Auth
// Controle central de sessão do usuário
// ======================================================

import { createClient } from "@supabase/supabase-js";


// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL =
    "https://qsrgdrqxpoydkugyrzyp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_FqVlrPkVfJoSOmLYUrz-lQ_GOYZoMPe";

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ======================================================
// OBTER USUÁRIO ATUAL
// ======================================================

export async function obterUsuario() {

    const {
        data,
        error
    } =
        await supabase.auth.getUser();


    if (error) {

        console.error(
            "Erro ao obter usuário:",
            error
        );

        return null;

    }


    return data.user || null;

}


// ======================================================
// OBTER SESSÃO ATUAL
// ======================================================

export async function obterSessao() {

    const {
        data,
        error
    } =
        await supabase.auth.getSession();


    if (error) {

        console.error(
            "Erro ao obter sessão:",
            error
        );

        return null;

    }


    return data.session || null;

}


// ======================================================
// VERIFICAR SE ESTÁ LOGADO
// ======================================================

export async function estaLogado() {

    const sessao =
        await obterSessao();

    return !!sessao;

}


// ======================================================
// PROTEGER PÁGINA
// ======================================================

export async function protegerPagina() {

    const sessao =
        await obterSessao();


    if (!sessao) {

        const paginaAtual =
            window.location.pathname;


        /*
         * Evita redirecionar o próprio login.
         */

        if (
            !paginaAtual.endsWith(
                "/login.html"
            )
        ) {

            window.location.href =
                "./login.html";

        }

        return null;

    }


    return sessao.user;

}


// ======================================================
// LOGOUT
// ======================================================

export async function sair() {

    const {
        error
    } =
        await supabase.auth.signOut();


    if (error) {

        console.error(
            "Erro ao sair:",
            error
        );

        throw error;

    }


    window.location.href =
        "./login.html";

}


// ======================================================
// DADOS BÁSICOS DO USUÁRIO
// ======================================================

export async function dadosUsuario() {

    const usuario =
        await obterUsuario();


    if (!usuario) {

        return null;

    }


    const metadata =
        usuario.user_metadata || {};


    return {

        id:
            usuario.id,

        email:
            usuario.email || "",

        nome:
            metadata.nome ||
            metadata.name ||
            metadata.full_name ||
            "Surfista",

        foto:
            metadata.avatar_url ||
            metadata.picture ||
            null

    };

}


// ======================================================
// OBSERVAR LOGIN / LOGOUT
// ======================================================

export function observarAuth(callback) {

    return supabase.auth.onAuthStateChange(

        (
            evento,
            sessao
        ) => {

            callback(
                evento,
                sessao
            );

        }

    );

}


// ======================================================
// EXPORTAÇÃO
// ======================================================

export default supabase;


console.log(
    "🔐 WaveRise Auth carregado."
);