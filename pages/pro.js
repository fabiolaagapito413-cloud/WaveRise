// ======================================================
// WaveRise PRO
// Pagamentos Mercado Pago
// ======================================================

console.log("⭐ WaveRise PRO carregado!");

import { createClient } from "@supabase/supabase-js";


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
// PRO — MODO DE TESTE
// ======================================================

function criarBotaoResetTeste() {

    // ==============================================
    // ATIVAR PRO — MODO DE TESTE
    // ==============================================

    const ativar =
        document.createElement("button");

    ativar.id =
        "btnAtivarWaveRisePRO";

    ativar.type =
        "button";

    ativar.textContent =
        "🧪 Ativar PRO para teste";

    ativar.style.cssText = `
        width:100%;
        margin-top:12px;
        padding:12px;
        border:1px solid rgba(80,210,255,.25);
        border-radius:14px;
        background:rgba(40,185,255,.08);
        color:#8fe8ff;
        font-size:13px;
        font-weight:700;
        cursor:pointer;
    `;

    ativar.onclick = () => {

        localStorage.setItem(
            "waveRisePRO",
            "true"
        );

        localStorage.setItem(
            "waveRisePlano",
            "teste"
        );

        localStorage.setItem(
            "waveRiseProAtivadoEm",
            Date.now().toString()
        );

        alert(
            "🧪 WaveRise PRO ativado para teste!\n\n" +
            "Todos os recursos PRO estão liberados neste dispositivo."
        );

        location.reload();
    };

    const offer =
        document.querySelector(
            ".proOffer"
        );

    if (offer) {
        offer.appendChild(ativar);
    }


    // ==============================================
    // RESETAR PRO — MODO DE TESTE
    // ==============================================

    const botao =
        document.createElement("button");

    botao.id =
        "btnResetWaveRisePRO";

    botao.type =
        "button";

    botao.textContent =
        "🧪 Resetar assinatura de teste";

    botao.style.cssText = `
        width:100%;
        margin-top:12px;
        padding:12px;
        border:1px solid rgba(255,255,255,.18);
        border-radius:14px;
        background:transparent;
        color:#9fb5c8;
        font-size:13px;
        cursor:pointer;
    `;

    botao.onclick = () => {

        const confirmar =
            confirm(
                "🧪 RESETAR TESTE\n\n" +
                "Isso vai remover a assinatura PRO salva " +
                "neste dispositivo.\n\n" +
                "Deseja continuar?"
            );

        if (!confirmar) {
            return;
        }

        localStorage.removeItem(
            "waveRisePRO"
        );

        localStorage.removeItem(
            "waveRisePlano"
        );

        localStorage.removeItem(
            "waveRiseProAtivadoEm"
        );

        localStorage.removeItem(
            "waveRisePlanoPagamento"
        );

        localStorage.removeItem(
            "waveRisePagamentoIniciadoEm"
        );

        localStorage.removeItem(
            "waveRisePagamentoPendente"
        );

        location.reload();
    };

    const offerReset =
        document.querySelector(
            ".proOffer"
        );

    if (offerReset) {
        offerReset.appendChild(botao);
    }
}


// ======================================================
// CONFIGURAÇÃO
// ======================================================

const BACKEND_URL =
    "https://waverise.onrender.com";


// ======================================================
// PÁGINAS DOS RECURSOS PRO
// ======================================================

const paginasPro = [

    "analise-foto.html",

    "analise-video.html",

    "coach-pro.html",

    "prancha-ideal.html",

    "melhor-horario.html",

    null,

    "plano-evolucao.html",

    "comparar-praias.html",

    "score-pessoal.html",

    null
];


// ======================================================
// VERIFICAR SE PRO ESTÁ ATIVO
// ======================================================

function usuarioTemPRO() {

    return (
        localStorage.getItem(
            "waveRisePRO"
        ) === "true"
    );
}


// ======================================================
// ABRIR RECURSO PRO
// ======================================================

function abrirPro(pagina) {

    // ==============================================
    // RECURSO AINDA NÃO IMPLEMENTADO
    // ==============================================

    if (!pagina) {

        alert(
            "⭐ WAVERISE PRO\n\n" +
            "Este recurso será desenvolvido " +
            "na próxima etapa."
        );

        return;
    }


    // ==============================================
    // VERIFICAR ASSINATURA
    // ==============================================

    if (!usuarioTemPRO()) {

        alert(
            "🔒 RECURSO EXCLUSIVO PRO\n\n" +
            "Este recurso está disponível apenas " +
            "para assinantes do WaveRise PRO.\n\n" +
            "Assine o PRO para desbloquear."
        );

        const oferta =
            document.querySelector(
                ".proOffer"
            );

        if (oferta) {

            oferta.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        return;
    }


    // ==============================================
    // USUÁRIO PRO
    // ==============================================

    console.log(
        "⭐ Recurso PRO liberado:",
        pagina
    );

    window.location.href =
        `./${pagina}`;
}


// ======================================================
// CONFIGURAR CARDS
// ======================================================

const cards =
    document.querySelectorAll(
        ".proBenefit"
    );

cards.forEach(
    (card, index) => {

        const pagina =
            paginasPro[index];

        card.style.cursor =
            "pointer";

        card.addEventListener(
            "click",
            () => {

                abrirPro(
                    pagina
                );

            }
        );

    }
);
// ======================================================
// ELEMENTOS
// ======================================================

const planoMensal =
    document.getElementById(
        "planoMensal"
    );

const planoAnual =
    document.getElementById(
        "planoAnual"
    );

const btnAssinar =
    document.getElementById(
        "btnAssinarPro"
    );

const proStatus =
    document.getElementById(
        "proStatus"
    );

const btnVoltar =
    document.getElementById(
        "btnVoltar"
    );


// ======================================================
// PLANO SELECIONADO
// ======================================================

let planoSelecionado =
    localStorage.getItem(
        "waveRisePlanoSelecionado"
    ) || "mensal";


// ======================================================
// ATUALIZAR VISUAL DO PLANO
// ======================================================

function atualizarPlano() {

    if (
        !planoMensal ||
        !planoAnual
    ) {
        return;
    }

    planoMensal.classList.remove(
        "selecionado"
    );

    planoAnual.classList.remove(
        "selecionado"
    );


    if (
        planoSelecionado ===
        "anual"
    ) {

        planoAnual.classList.add(
            "selecionado"
        );

    } else {

        planoMensal.classList.add(
            "selecionado"
        );

    }
}


// ======================================================
// SELECIONAR MENSAL
// ======================================================

if (planoMensal) {

    planoMensal.addEventListener(
        "click",
        () => {

            planoSelecionado =
                "mensal";

            localStorage.setItem(
                "waveRisePlanoSelecionado",
                "mensal"
            );

            atualizarPlano();

        }
    );
}


// ======================================================
// SELECIONAR ANUAL
// ======================================================

if (planoAnual) {

    planoAnual.addEventListener(
        "click",
        () => {

            planoSelecionado =
                "anual";

            localStorage.setItem(
                "waveRisePlanoSelecionado",
                "anual"
            );

            atualizarPlano();

        }
    );
}


// ======================================================
// OBTER E-MAIL DO USUÁRIO
// ======================================================

async function obterEmailUsuario() {

    // ==============================================
    // PRIMEIRO: SUPABASE
    // ==============================================

    try {

        const {
            data: {
                session
            }
        } =
            await supabase.auth.getSession();


        const emailSupabase =
            session?.user?.email;


        if (emailSupabase) {

            console.log(
                "📧 E-mail encontrado no Supabase:",
                emailSupabase
            );


            localStorage.setItem(
                "emailWaveRise",
                emailSupabase
            );


            localStorage.setItem(
                "usuarioWaveRise",
                JSON.stringify({

                    email:
                        emailSupabase,

                    id:
                        session.user.id

                })
            );


            return emailSupabase;
        }

    } catch (erro) {

        console.warn(
            "⚠️ Não foi possível obter a sessão do Supabase:",
            erro
        );

    }


    // ==============================================
    // FALLBACK: LOCAL STORAGE
    // ==============================================

    const chaves = [

        "emailWaveRise",

        "usuarioWaveRise",

        "usuario",

        "usuarioLogado",

        "waveRiseUsuario"

    ];


    for (
        const chave of chaves
    ) {

        const valor =
            localStorage.getItem(
                chave
            );


        if (!valor) {
            continue;
        }


        // Caso seja diretamente um e-mail

        if (
            valor.includes("@") &&
            !valor
                .trim()
                .startsWith("{")
        ) {

            return valor.trim();

        }


        // Caso seja objeto JSON

        try {

            const usuario =
                JSON.parse(
                    valor
                );


            const email =
                usuario?.email ||
                usuario?.user?.email ||
                usuario?.usuario?.email;


            if (email) {

                return email;

            }

        } catch (erro) {

            console.warn(
                `⚠️ Não foi possível ler ${chave}.`
            );

        }

    }


    return "";
}


// ======================================================
// VERIFICAR PRO
// ======================================================

function verificarPRO() {

    const proAtivo =
        usuarioTemPRO();


    if (!proAtivo) {

        if (proStatus) {

            proStatus.classList.remove(
                "ativo"
            );

        }


        if (btnAssinar) {

            btnAssinar.disabled =
                false;

            btnAssinar.textContent =
                "⭐ Quero ser PRO";

            btnAssinar.style.opacity =
                "1";

        }

        return;
    }


    // ==============================================
    // PRO ATIVO
    // ==============================================

    console.log(
        "⭐ WaveRise PRO ativo."
    );


    if (proStatus) {

        proStatus.classList.add(
            "ativo"
        );

    }


    if (btnAssinar) {

        btnAssinar.textContent =
            "⭐ PRO ATIVO";

        btnAssinar.disabled =
            true;

        btnAssinar.style.opacity =
            "0.65";

    }
}


// ======================================================
// CRIAR MODAL DE PAGAMENTO
// ======================================================

function criarModalPagamento() {

    const antigo =
        document.getElementById(
            "waveRisePagamentoModal"
        );


    if (antigo) {
        antigo.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "waveRisePagamentoModal";


    modal.innerHTML = `

        <div
            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.78);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:99999;
                padding:20px;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:430px;
                    background:#111827;
                    color:white;
                    border-radius:24px;
                    padding:28px;
                    box-sizing:border-box;
                    text-align:center;
                    box-shadow:0 20px 60px rgba(0,0,0,.5);
                "
            >

                <div
                    style="
                        font-size:28px;
                        margin-bottom:8px;
                    "
                >
                    ⭐
                </div>

                <h2
                    style="
                        margin:0 0 8px;
                    "
                >
                    WaveRise PRO
                </h2>

                <p
                    id="waveRisePagamentoPlano"
                    style="
                        margin:0 0 24px;
                        opacity:.8;
                    "
                ></p>


                <div
                    id="waveRiseOpcoesPagamento"
                >

                    <button
                        id="btnPagamentoPix"
                        style="
                            width:100%;
                            padding:15px;
                            border:0;
                            border-radius:14px;
                            margin-bottom:12px;
                            cursor:pointer;
                            font-size:16px;
                            font-weight:700;
                        "
                    >
                        💠 Pagar com PIX
                    </button>


                    <button
                        id="btnPagamentoCartao"
                        style="
                            width:100%;
                            padding:15px;
                            border:0;
                            border-radius:14px;
                            margin-bottom:12px;
                            cursor:pointer;
                            font-size:16px;
                            font-weight:700;
                        "
                    >
                        💳 Pagar com Cartão
                    </button>


                    <button
                        id="btnFecharPagamento"
                        style="
                            width:100%;
                            padding:12px;
                            border:0;
                            background:transparent;
                            color:white;
                            opacity:.7;
                            cursor:pointer;
                            font-size:14px;
                        "
                    >
                        Cancelar
                    </button>

                </div>


                <div
                    id="waveRisePixArea"
                    style="
                        display:none;
                    "
                >

                    <p
                        id="waveRisePixStatus"
                        style="
                            opacity:.85;
                        "
                    >
                        Gerando PIX...
                    </p>


                    <img
                        id="waveRisePixImagem"
                        alt="QR Code PIX"
                        style="
                            width:250px;
                            max-width:100%;
                            background:white;
                            padding:10px;
                            border-radius:14px;
                            display:none;
                            margin:15px auto;
                        "
                    />


                    <textarea
                        id="waveRisePixCopiaCola"
                        readonly
                        style="
                            width:100%;
                            min-height:90px;
                            box-sizing:border-box;
                            border-radius:12px;
                            padding:12px;
                            resize:none;
                            margin-top:10px;
                            display:none;
                        "
                    ></textarea>


                    <button
                        id="btnCopiarPix"
                        style="
                            width:100%;
                            padding:14px;
                            border:0;
                            border-radius:14px;
                            margin-top:10px;
                            cursor:pointer;
                            font-weight:700;
                            display:none;
                        "
                    >
                        📋 Copiar PIX
                    </button>


                    <button
                        id="btnVoltarPagamento"
                        style="
                            width:100%;
                            padding:12px;
                            border:0;
                            background:transparent;
                            color:white;
                            opacity:.7;
                            cursor:pointer;
                            margin-top:8px;
                        "
                    >
                        Voltar
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const preco =
        planoSelecionado ===
        "anual"
            ? "R$ 149,90"
            : "R$ 9,90";


    const nomePlano =
        planoSelecionado ===
        "anual"
            ? "Plano Anual"
            : "Plano Mensal";


    document.getElementById(
        "waveRisePagamentoPlano"
    ).textContent =
        `${nomePlano} • ${preco}`;


    document.getElementById(
        "btnFecharPagamento"
    ).onclick =
        () => modal.remove();


    document.getElementById(
        "btnVoltarPagamento"
    ).onclick =
        () => {

            document.getElementById(
                "waveRisePixArea"
            ).style.display =
                "none";


            document.getElementById(
                "waveRiseOpcoesPagamento"
            ).style.display =
                "block";

        };


    document.getElementById(
        "btnPagamentoPix"
    ).onclick =
        criarPagamentoPix;


    document.getElementById(
        "btnPagamentoCartao"
    ).onclick =
        criarPagamentoCartao;
}
// ======================================================
// CRIAR PIX
// ======================================================

async function criarPagamentoPix() {

    const email =
        await obterEmailUsuario();


    if (!email) {

        alert(
            "⚠️ Não encontramos o e-mail da sua conta WaveRise.\n\n" +
            "Faça login novamente para continuar."
        );

        return;
    }


    const opcoes =
        document.getElementById(
            "waveRiseOpcoesPagamento"
        );


    const areaPix =
        document.getElementById(
            "waveRisePixArea"
        );


    const status =
        document.getElementById(
            "waveRisePixStatus"
        );


    opcoes.style.display =
        "none";


    areaPix.style.display =
        "block";


    status.textContent =
        "⏳ Gerando seu PIX...";


    try {

        const resposta =
            await fetch(
                `${BACKEND_URL}/pagamentos/criar-pix`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            plano:
                                planoSelecionado,

                            email:
                                email

                        })

                }
            );


        const dados =
            await resposta.json();


        console.log(
            "💠 Resposta PIX:",
            dados
        );


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.erro ||
                "Não foi possível gerar o PIX."
            );
        }


        const pix =
            dados.pagamento;


        if (!pix) {

            throw new Error(
                "O Mercado Pago não retornou os dados do PIX."
            );
        }


        // ==================================================
        // QR CODE
        // ==================================================

        const imagem =
            document.getElementById(
                "waveRisePixImagem"
            );


        if (pix.qrCodeBase64) {

            imagem.src =
                `data:image/png;base64,${pix.qrCodeBase64}`;

            imagem.style.display =
                "block";

        }


        // ==================================================
        // COPIA E COLA
        // ==================================================

        const copiaCola =
            document.getElementById(
                "waveRisePixCopiaCola"
            );


        if (pix.copiaCola) {

            copiaCola.value =
                pix.copiaCola;

            copiaCola.style.display =
                "block";


            document.getElementById(
                "btnCopiarPix"
            ).style.display =
                "block";

        }


        // ==================================================
        // STATUS
        // ==================================================

        status.innerHTML =
            `
                <strong>💠 PIX gerado!</strong><br>
                <small>
                    Escaneie o QR Code ou copie o código abaixo.
                </small>
            `;


        // ==================================================
        // COPIAR PIX
        // ==================================================

        document.getElementById(
            "btnCopiarPix"
        ).onclick =
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        pix.copiaCola
                    );


                    document.getElementById(
                        "btnCopiarPix"
                    ).textContent =
                        "✅ PIX copiado!";


                } catch (erro) {

                    copiaCola.select();

                    document.execCommand(
                        "copy"
                    );


                    document.getElementById(
                        "btnCopiarPix"
                    ).textContent =
                        "✅ PIX copiado!";

                }

            };


        // ==================================================
        // SALVAR PAGAMENTO PENDENTE
        // ==================================================

        localStorage.setItem(
            "waveRisePagamentoPendente",
            JSON.stringify({

                orderId:
                    pix.orderId,

                pagamentoId:
                    pix.pagamentoId,

                plano:
                    planoSelecionado,

                valor:
                    dados.valor,

                criadoEm:
                    Date.now()

            })
        );


    } catch (erro) {

        console.error(
            "❌ Erro ao gerar PIX:",
            erro
        );


        status.textContent =
            "❌ Não foi possível gerar o PIX.";


        alert(
            "❌ Não foi possível gerar o PIX.\n\n" +
            (
                erro?.message ||
                "Tente novamente."
            )
        );


        opcoes.style.display =
            "block";


        areaPix.style.display =
            "none";

    }
}


// ======================================================
// PAGAMENTO COM CARTÃO
// ======================================================

async function criarPagamentoCartao() {

    const email =
        await obterEmailUsuario();


    if (!email) {

        alert(
            "⚠️ Não encontramos o e-mail da sua conta WaveRise.\n\n" +
            "Faça login novamente para continuar."
        );

        return;
    }


    const opcoes =
        document.getElementById(
            "waveRiseOpcoesPagamento"
        );


    opcoes.style.display =
        "none";


    try {

        const resposta =
            await fetch(
                `${BACKEND_URL}/pagamentos/criar-plano`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            plano:
                                planoSelecionado,

                            email:
                                email

                        })

                }
            );


        const dados =
            await resposta.json();


        console.log(
            "💳 Resposta Cartão:",
            dados
        );


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.erro ||
                "Não foi possível iniciar o pagamento."
            );
        }


        const initPoint =
            dados?.plano?.init_point;


        if (!initPoint) {

            throw new Error(
                "O Mercado Pago não retornou o link de pagamento."
            );
        }


        localStorage.setItem(
            "waveRisePlanoPagamento",
            planoSelecionado
        );


        localStorage.setItem(
            "waveRisePagamentoIniciadoEm",
            Date.now().toString()
        );


        // ==================================================
        // IR PARA MERCADO PAGO
        // ==================================================

        window.location.href =
            initPoint;


    } catch (erro) {

        console.error(
            "❌ Erro cartão:",
            erro
        );


        alert(
            "❌ Não foi possível iniciar o pagamento.\n\n" +
            (
                erro?.message ||
                "Tente novamente."
            )
        );


        opcoes.style.display =
            "block";

    }
}
// ======================================================
// BOTÃO ASSINAR PRO
// ======================================================

if (btnAssinar) {

    btnAssinar.addEventListener(
        "click",
        () => {

            criarModalPagamento();

        }
    );

}


// ======================================================
// BOTÃO VOLTAR
// ======================================================

if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        () => {

            window.location.href =
                "../index.html";

        }
    );

}


// ======================================================
// DISPONIBILIZA PARA OUTROS CÓDIGOS
// ======================================================

window.abrirPro =
    abrirPro;

window.paginasPro =
    paginasPro;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

atualizarPlano();

verificarPRO();

criarBotaoResetTeste();


// ======================================================
// DIAGNÓSTICO
// ======================================================

console.log(
    `⭐ ${cards.length} recursos PRO encontrados.`
);

console.log(
    "⭐ Sistema de pagamentos WaveRise PRO carregado."
);