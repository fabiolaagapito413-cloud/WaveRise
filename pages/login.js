// ======================================================
// WaveRise — Login / Cadastro
// Supabase Auth
// Web + Android Capacitor
// ======================================================

import { createClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";


// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL =
    "https://qsrgdrqxpoydkugyrzyp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_FqVlrPkVfJoSOmLYUrz-lQ_GOYZoMPe";

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ======================================================
// CONFIGURAÇÃO
// ======================================================

const EH_APP =
    Capacitor.isNativePlatform();

const REDIRECT_ANDROID =
    "com.waverise.app://login-callback";


// ======================================================
// ELEMENTOS
// ======================================================

const formLogin =
    document.getElementById("formLogin");

const formCadastro =
    document.getElementById("formCadastro");

const btnLogin =
    document.getElementById("btnLogin");

const btnCadastro =
    document.getElementById("btnCadastro");

const btnEsqueciSenha =
    document.getElementById("btnEsqueciSenha");

const btnGoogle =
    document.getElementById("btnGoogle");

const btnFacebook =
    document.getElementById("btnFacebook");

const tabLogin =
    document.getElementById("tabLogin");

const tabCadastro =
    document.getElementById("tabCadastro");

const mensagem =
    document.getElementById("mensagem");


// ======================================================
// MENSAGEM
// ======================================================

function mostrarMensagem(
    texto = "",
    tipo = ""
) {

    if (!mensagem) return;

    mensagem.textContent =
        texto;

    mensagem.className =
        "mensagem";

    if (tipo) {

        mensagem.classList.add(
            tipo
        );

    }

}

async function sincronizarPerfil(usuario, nomeInformado = "") {

    if (!usuario) {
        return;
    }

    const metadata =
        usuario.user_metadata || {};

    const nome =
        nomeInformado ||
        metadata.nome ||
        metadata.name ||
        metadata.full_name ||
        "Surfista";

    const foto =
        metadata.avatar_url ||
        metadata.picture ||
        null;

    const {
        error
    } =
        await supabase
            .from("perfis")
            .upsert(
                {
                    id:
                        usuario.id,

                    nome:
                        nome,

                    email:
                        usuario.email || "",

                    foto:
                        foto
                },
                {
                    onConflict:
                        "id"
                }
            );

    if (error) {

        console.error(
            "Erro ao sincronizar perfil:",
            error
        );

        return false;

    }

    console.log(
        "✅ Perfil sincronizado:",
        usuario.id
    );

    return true;
}
// ======================================================
// REDIRECIONAR
// ======================================================

function redirecionarUsuario() {

    window.location.href =
        "../index.html";

}


// ======================================================
// PROCESSAR CALLBACK DO GOOGLE
// ======================================================

async function processarCallbackOAuth(
    url
) {

    if (!url) return false;

    console.log(
        "🔗 Callback OAuth recebido:",
        url
    );


    try {

        const urlObj =
            new URL(url);


        /*
         * Supabase pode retornar os tokens
         * no fragmento (#) no fluxo implícito.
         */

        const hashParams =
            new URLSearchParams(
                urlObj.hash.substring(1)
            );


        const queryParams =
            urlObj.searchParams;


        const accessToken =
            hashParams.get(
                "access_token"
            ) ||
            queryParams.get(
                "access_token"
            );


        const refreshToken =
            hashParams.get(
                "refresh_token"
            ) ||
            queryParams.get(
                "refresh_token"
            );


        /*
         * Se o Supabase estiver usando
         * PKCE, pode retornar um code.
         */

        const code =
            queryParams.get(
                "code"
            );


        if (code) {

            console.log(
                "🔐 Código OAuth recebido."
            );


            const {
                error
            } =
                await supabase.auth
                    .exchangeCodeForSession(
                        code
                    );


            if (error) {

                console.error(
                    "Erro ao trocar código:",
                    error
                );

                mostrarMensagem(
                    "Não foi possível concluir o login com Google.",
                    "erro"
                );

                return false;

            }

        }

        else if (
            accessToken &&
            refreshToken
        ) {

            console.log(
                "🔐 Tokens OAuth recebidos."
            );


            const {
                error
            } =
                await supabase.auth
                    .setSession({

                        access_token:
                            accessToken,

                        refresh_token:
                            refreshToken

                    });


            if (error) {

                console.error(
                    "Erro ao criar sessão:",
                    error
                );

                mostrarMensagem(
                    "Não foi possível criar sua sessão.",
                    "erro"
                );

                return false;

            }

        }

        else {

            console.warn(
                "Callback OAuth sem tokens ou código."
            );

            return false;

        }


        /*
         * Fecha o navegador externo
         * depois que o app recebeu o retorno.
         */

        if (EH_APP) {

            try {

                await Browser.close();

            }

            catch (erro) {

                console.log(
                    "Browser.close:",
                    erro
                );

            }

        }


        mostrarMensagem(
            "Login realizado com sucesso! 🌊",
            "sucesso"
        );


        setTimeout(
            redirecionarUsuario,
            500
        );


        return true;

    }

    catch (erro) {

        console.error(
            "Erro processando OAuth:",
            erro
        );

        mostrarMensagem(
            "Não foi possível concluir o login.",
            "erro"
        );

        return false;

    }

}


// ======================================================
// DEEP LINK ANDROID
// ======================================================

async function configurarDeepLink() {

    if (!EH_APP) {

        return;

    }


    /*
     * Quando o aplicativo já está aberto
     * e recebe o retorno do Google.
     */

    await App.addListener(
        "appUrlOpen",
        async ({
            url
        }) => {

            console.log(
                "📱 App recebeu URL:",
                url
            );

            await processarCallbackOAuth(
                url
            );

        }
    );


    /*
     * Quando o aplicativo é aberto
     * diretamente pelo link OAuth.
     */

    try {

        const launchUrl =
            await App.getLaunchUrl();


        if (
            launchUrl?.url
        ) {

            console.log(
                "🚀 App iniciado por URL:",
                launchUrl.url
            );


            await processarCallbackOAuth(
                launchUrl.url
            );

        }

    }

    catch (erro) {

        console.error(
            "Erro ao verificar launch URL:",
            erro
        );

    }

}


// ======================================================
// VERIFICAR SESSÃO
// ======================================================

async function verificarSessao() {

    try {

        const {
            data,
            error
        } =
            await supabase.auth.getSession();


        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return;

        }


        if (data.session) {

            redirecionarUsuario();

        }

    }

    catch (erro) {

        console.error(
            "Erro ao verificar sessão:",
            erro
        );

    }

}


// ======================================================
// LOGIN E-MAIL
// ======================================================

formLogin?.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                ?.value
                .trim();


        const senha =
            document
                .getElementById("loginSenha")
                ?.value;


        if (!email || !senha) {

            mostrarMensagem(
                "Preencha seu e-mail e sua senha.",
                "erro"
            );

            return;

        }


        btnLogin.disabled =
            true;


        btnLogin.textContent =
            "Entrando...";


        mostrarMensagem("");


        try {

            const {
                data,
                error
            } =
                await supabase.auth
                    .signInWithPassword({

                        email,

                        password:
                            senha

                    });


            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                mostrarMensagem(
                    traduzirErroAuth(
                        error
                    ),
                    "erro"
                );

                return;

            }


            if (!data.session) {

                mostrarMensagem(
                    "Não foi possível iniciar sua sessão.",
                    "erro"
                );

                return;

            }


            mostrarMensagem(
                "Login realizado com sucesso! 🌊",
                "sucesso"
            );


            setTimeout(
                redirecionarUsuario,
                600
            );

        }

        catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );

            mostrarMensagem(
                "Não foi possível realizar o login.",
                "erro"
            );

        }

        finally {

            btnLogin.disabled =
                false;

            btnLogin.textContent =
                "Entrar";

        }

    }
);


// ======================================================
// CADASTRO
// ======================================================

formCadastro?.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const nome =
            document
                .getElementById("cadastroNome")
                ?.value
                .trim();


        const email =
            document
                .getElementById("cadastroEmail")
                ?.value
                .trim();


        const senha =
            document
                .getElementById("cadastroSenha")
                ?.value;


        const confirmacao =
            document
                .getElementById(
                    "cadastroSenhaConfirmacao"
                )
                ?.value;


        if (
            !nome ||
            !email ||
            !senha ||
            !confirmacao
        ) {

            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );

            return;

        }


        if (senha.length < 6) {

            mostrarMensagem(
                "A senha precisa ter pelo menos 6 caracteres.",
                "erro"
            );

            return;

        }


        if (
            senha !== confirmacao
        ) {

            mostrarMensagem(
                "As senhas não são iguais.",
                "erro"
            );

            return;

        }


        btnCadastro.disabled =
            true;


        btnCadastro.textContent =
            "Criando conta...";


        mostrarMensagem("");


        try {

            const {
                data,
                error
            } =
                await supabase.auth
                    .signUp({

                        email,

                        password:
                            senha,

                        options: {

                            data: {

                                nome:
                                    nome

                            }

                        }

                    });


            if (error) {

                console.error(
                    "Erro no cadastro:",
                    error
                );

                mostrarMensagem(
                    traduzirErroAuth(
                        error
                    ),
                    "erro"
                );

                return;

            }


            if (!data.session) {

                mostrarMensagem(
                    "Conta criada! Verifique seu e-mail para confirmar a conta.",
                    "sucesso"
                );

                formCadastro.reset();

                return;

            }


            mostrarMensagem(
                "Conta criada com sucesso! 🌊",
                "sucesso"
            );


            setTimeout(
                redirecionarUsuario,
                600
            );

        }

        catch (erro) {

            console.error(
                "Erro no cadastro:",
                erro
            );

            mostrarMensagem(
                "Não foi possível criar sua conta.",
                "erro"
            );

        }

        finally {

            btnCadastro.disabled =
                false;

            btnCadastro.textContent =
                "Criar minha conta";

        }

    }
);


// ======================================================
// RECUPERAÇÃO DE SENHA
// ======================================================

btnEsqueciSenha?.addEventListener(
    "click",
    async () => {

        const email =
            document
                .getElementById("loginEmail")
                ?.value
                .trim();


        if (!email) {

            mostrarMensagem(
                "Digite seu e-mail primeiro.",
                "erro"
            );

            return;

        }


        mostrarMensagem(
            "Enviando e-mail de recuperação..."
        );


        try {

            const {
                error
            } =
                await supabase.auth
                    .resetPasswordForEmail(
                        email,
                        {

                            redirectTo:
                                EH_APP
                                    ? REDIRECT_ANDROID
                                    : `${window.location.origin}/pages/login.html`

                        }
                    );


            if (error) {

                console.error(
                    "Erro na recuperação:",
                    error
                );

                mostrarMensagem(
                    traduzirErroAuth(
                        error
                    ),
                    "erro"
                );

                return;

            }


            mostrarMensagem(
                "Enviamos um link para redefinir sua senha.",
                "sucesso"
            );

        }

        catch (erro) {

            console.error(
                "Erro na recuperação:",
                erro
            );

            mostrarMensagem(
                "Não foi possível enviar o e-mail.",
                "erro"
            );

        }

    }
);


// ======================================================
// GOOGLE
// ======================================================

btnGoogle?.addEventListener(
    "click",
    async () => {

        btnGoogle.disabled =
            true;


        btnGoogle.textContent =
            "Abrindo Google...";


        mostrarMensagem(
            "Abrindo login do Google..."
        );


        try {

            /*
             * ANDROID / CAPACITOR
             */

            if (EH_APP) {

                const {
                    data,
                    error
                } =
                    await supabase.auth
                        .signInWithOAuth({

                            provider:
                                "google",

                            options: {

                                redirectTo:
                                    REDIRECT_ANDROID,

                                skipBrowserRedirect:
                                    true

                            }

                        });


                if (error) {

                    throw error;

                }


                if (!data?.url) {

                    throw new Error(
                        "Supabase não retornou a URL do Google."
                    );

                }


                console.log(
                    "🌐 Abrindo OAuth:",
                    data.url
                );


                await Browser.open({

                    url:
                        data.url

                });


                return;

            }


            /*
             * WEB / COMPUTADOR
             */

            const {
                error
            } =
                await supabase.auth
                    .signInWithOAuth({

                        provider:
                            "google",

                        options: {

                            redirectTo:
                                `${window.location.origin}/index.html`

                        }

                    });


            if (error) {

                throw error;

            }

        }

        catch (erro) {

            console.error(
                "Erro no Google:",
                erro
            );

            mostrarMensagem(
                traduzirErroAuth(
                    erro
                ),
                "erro"
            );


            btnGoogle.disabled =
                false;


            btnGoogle.textContent =
                "Continuar com Google";

        }

    }
);


// ======================================================
// FACEBOOK
// ======================================================

btnFacebook?.addEventListener(
    "click",
    async () => {

        btnFacebook.disabled = true;

        btnFacebook.textContent =
            "Abrindo Facebook...";

        mostrarMensagem(
            "Abrindo login do Facebook..."
        );

        try {

            // ANDROID / CAPACITOR
            if (EH_APP) {

                const {
                    data,
                    error
                } =
                    await supabase.auth
                        .signInWithOAuth({

                            provider:
                                "facebook",

                            options: {

                                redirectTo:
                                    REDIRECT_ANDROID,

                                skipBrowserRedirect:
                                    true

                            }

                        });

                if (error) {
                    throw error;
                }

                if (!data?.url) {
                    throw new Error(
                        "Supabase não retornou a URL do Facebook."
                    );
                }

                console.log(
                    "🌐 Abrindo Facebook:",
                    data.url
                );

                await Browser.open({
                    url: data.url
                });

                return;
            }

            // WEB / COMPUTADOR
            const {
                error
            } =
                await supabase.auth
                    .signInWithOAuth({

                        provider:
                            "facebook",

                        options: {

                            redirectTo:
                                `${window.location.origin}/index.html`

                        }

                    });

            if (error) {
                throw error;
            }

        }

        catch (erro) {

            console.error(
                "Erro no Facebook:",
                erro
            );

            mostrarMensagem(
                traduzirErroAuth(erro),
                "erro"
            );

            btnFacebook.disabled = false;

            btnFacebook.textContent =
                "Continuar com Facebook";
        }

    }
);

// ======================================================
// TABS
// ======================================================

tabLogin?.addEventListener(
    "click",
    () => {

        formLogin?.classList
            .remove("hidden");

        formCadastro?.classList
            .add("hidden");

        tabLogin?.classList
            .add("active");

        tabCadastro?.classList
            .remove("active");

        mostrarMensagem("");

    }
);


tabCadastro?.addEventListener(
    "click",
    () => {

        formLogin?.classList
            .add("hidden");

        formCadastro?.classList
            .remove("hidden");

        tabLogin?.classList
            .remove("active");

        tabCadastro?.classList
            .add("active");

        mostrarMensagem("");

    }
);


// ======================================================
// TRADUZIR ERROS
// ======================================================

function traduzirErroAuth(
    error
) {

    const mensagemErro =
        (
            error?.message ||
            ""
        ).toLowerCase();


    if (
        mensagemErro.includes(
            "invalid login credentials"
        )
    ) {

        return "E-mail ou senha incorretos.";

    }


    if (
        mensagemErro.includes(
            "email not confirmed"
        )
    ) {

        return "Confirme seu e-mail antes de entrar.";

    }


    if (
        mensagemErro.includes(
            "user already registered"
        )
    ) {

        return "Este e-mail já possui uma conta.";

    }


    if (
        mensagemErro.includes(
            "password should be at least"
        )
    ) {

        return "A senha precisa ter pelo menos 6 caracteres.";

    }


    if (
        mensagemErro.includes(
            "rate limit"
        )
    ) {

        return "Muitas tentativas. Aguarde alguns minutos.";

    }


    if (
        mensagemErro.includes(
            "provider is not enabled"
        )
    ) {

        return "Este método de login ainda não está ativado.";

    }


    if (
        mensagemErro.includes(
            "redirect"
        )
    ) {

        return "O endereço de retorno do login não está configurado corretamente.";

    }


    return (
        error?.message ||
        "Ocorreu um erro. Tente novamente."
    );

}


// ======================================================
// OBSERVAR AUTH
// ======================================================

supabase.auth.onAuthStateChange(
    (
        evento,
        session
    ) => {

        console.log(
            "WaveRise Auth:",
            evento,
            session?.user?.email ||
                "sem usuário"
        );

    }
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

configurarDeepLink();

verificarSessao();


console.log(
    "🔐 WaveRise Login carregado."
);