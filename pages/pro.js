// ======================================================
// WaveRise PRO
// Controle completo da página PRO
// ======================================================

console.log("⭐ WaveRise PRO carregado!");

// ======================================================
// PÁGINAS DOS RECURSOS PRO
// A ordem é a mesma da tela
// ======================================================

const paginasPro = [

    "analise-foto.html",       // 1
    "analise-video.html",      // 2
    "coach-pro.html",          // 3
    "prancha-ideal.html",      // 4
    "melhor-horario.html",     // 5
    null,                      // 6 - Minha evolução
    "plano-evolucao.html",     // 7
    "comparar-praias.html",    // 8
    "score-pessoal.html",      // 9
    null                       // 10 - Alertas
];


// ======================================================
// ABRIR RECURSO PRO
// ======================================================

function abrirPro(pagina){

    if(!pagina){

        alert(
            "⭐ WAVERISE PRO\n\n" +
            "Este recurso será desenvolvido na próxima etapa."
        );

        return;
    }

    window.location.href = `./${pagina}`;
}


// ======================================================
// CONFIGURAR CARDS
// ======================================================

const cards = document.querySelectorAll(
    ".proBenefit"
);

cards.forEach((card, index) => {

    const pagina = paginasPro[index];

    card.style.cursor = "pointer";

    card.addEventListener(
        "click",
        () => {

            abrirPro(pagina);

        }
    );

});


// ======================================================
// PLANOS
// ======================================================

const planoMensal =
    document.getElementById("planoMensal");

const planoAnual =
    document.getElementById("planoAnual");

const btnAssinar =
    document.getElementById("btnAssinarPro");

const proStatus =
    document.getElementById("proStatus");

const btnVoltar =
    document.getElementById("btnVoltar");


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

function atualizarPlano(){

    if(!planoMensal || !planoAnual){
        return;
    }

    planoMensal.classList.remove(
        "selecionado"
    );

    planoAnual.classList.remove(
        "selecionado"
    );


    if(planoSelecionado === "anual"){

        planoAnual.classList.add(
            "selecionado"
        );

    }else{

        planoMensal.classList.add(
            "selecionado"
        );

    }

}


// ======================================================
// SELECIONAR MENSAL
// ======================================================

if(planoMensal){

    planoMensal.addEventListener(
        "click",
        () => {

            planoSelecionado = "mensal";

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

if(planoAnual){

    planoAnual.addEventListener(
        "click",
        () => {

            planoSelecionado = "anual";

            localStorage.setItem(
                "waveRisePlanoSelecionado",
                "anual"
            );

            atualizarPlano();

        }
    );

}


// ======================================================
// VERIFICAR SE O PRO ESTÁ ATIVO
// ======================================================

function verificarPRO(){

    const proAtivo =
        localStorage.getItem(
            "waveRisePRO"
        ) === "true";


    if(!proAtivo){
        return;
    }


    if(proStatus){

        proStatus.classList.add(
            "ativo"
        );

    }


    if(btnAssinar){

        btnAssinar.textContent =
            "⭐ PRO ATIVO";

        btnAssinar.disabled = true;

        btnAssinar.style.opacity =
            "0.65";

    }

}


// ======================================================
// ATIVAR PRO — MODO DE TESTE
// ======================================================

if(btnAssinar){

    btnAssinar.addEventListener(
        "click",
        () => {

            const preco =
                planoSelecionado === "anual"
                    ? "R$ 149,90"
                    : "R$ 19,90";


            const nomePlano =
                planoSelecionado === "anual"
                    ? "Plano Anual"
                    : "Plano Mensal";


            const confirmar =
                confirm(

                    "⭐ WAVERISE PRO\n\n" +

                    nomePlano +
                    "\n" +

                    preco +
                    "\n\n" +

                    "🧪 MODO DE TESTE\n\n" +

                    "Este teste não realiza cobrança.\n\n" +

                    "Deseja ativar o WaveRise PRO " +
                    "neste dispositivo?"

                );


            if(!confirmar){
                return;
            }


            // Ativa PRO
            localStorage.setItem(
                "waveRisePRO",
                "true"
            );


            // Salva plano
            localStorage.setItem(
                "waveRisePlano",
                planoSelecionado
            );


            // Salva data
            localStorage.setItem(
                "waveRiseProAtivadoEm",
                Date.now().toString()
            );


            // Mostra status
            if(proStatus){

                proStatus.classList.add(
                    "ativo"
                );

            }


            // Atualiza botão
            btnAssinar.textContent =
                "⭐ PRO ATIVO";


            btnAssinar.disabled =
                true;


            btnAssinar.style.opacity =
                "0.65";


            alert(

                "🎉 WaveRise PRO ativado!\n\n" +

                "Você agora pode testar " +
                "os recursos PRO."

            );

        }
    );

}


// ======================================================
// BOTÃO VOLTAR
// ======================================================

if(btnVoltar){

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

window.abrirPro = abrirPro;

window.paginasPro = paginasPro;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

atualizarPlano();

verificarPRO();


// ======================================================
// DIAGNÓSTICO
// ======================================================

console.log(
    `⭐ ${cards.length} recursos PRO encontrados.`
);

console.log(
    "⭐ Sistema de planos PRO carregado."
);