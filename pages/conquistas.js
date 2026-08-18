console.log("Conquistas WaveRise 🌊");


const historico = JSON.parse(
    localStorage.getItem("historicoSurfWaveRise")
) || [];


// Calcula XP

let xp = historico.length * 100;


// Define nível

let nivel = "Iniciante";

if (xp >= 500) {
    nivel = "Surfista";
}

if (xp >= 1500) {
    nivel = "Avançado";
}

if (xp >= 3000) {
    nivel = "Pro";
}


// Mostra nível e XP

document.getElementById("nivelAtual").textContent =
"🌊 Nível: " + nivel;


document.getElementById("xpAtual").textContent =
"XP: " + xp;



// Barra de progresso

let progresso = xp % 500;

let porcentagem = (progresso / 500) * 100;


document.getElementById("progressoXP").style.width =
porcentagem + "%";



// Medalhas

const primeira = document.getElementById("primeira");
const dez = document.getElementById("dez");
const cinquenta = document.getElementById("cinquenta");



if(historico.length >= 1){

    primeira.classList.remove("bloqueada");
    primeira.classList.add("liberada");

    primeira.innerHTML =
    `
    🌊
    <h3>Primeira Onda</h3>
    <p>Desbloqueada!</p>
    `;

}



if(historico.length >= 10){

    dez.classList.remove("bloqueada");
    dez.classList.add("liberada");

    dez.innerHTML =
    `
    🏄
    <h3>10 Sessões</h3>
    <p>Desbloqueada!</p>
    `;

}



let ondas = 0;


historico.forEach(sessao => {

    ondas += Number(sessao.ondas || 0);

});



if(ondas >= 50){

    cinquenta.classList.remove("bloqueada");
    cinquenta.classList.add("liberada");

    cinquenta.innerHTML =
    `
    🔥
    <h3>50 Ondas</h3>
    <p>Desbloqueada!</p>
    `;

}