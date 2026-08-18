console.log("Evolução WaveRise 🌊");


const totalSessoes = document.getElementById("totalSessoes");
const totalOndas = document.getElementById("totalOndas");
const mediaNota = document.getElementById("mediaNota");
const xp = document.getElementById("xp");
const mensagem = document.getElementById("mensagem");



const historico = JSON.parse(
    localStorage.getItem("historicoSurfWaveRise")
) || [];



let ondas = 0;
let somaNotas = 0;
let totalXP = 0;



historico.forEach(sessao => {

    ondas += Number(sessao.ondas || 0);

    somaNotas += Number(sessao.nota || 0);

    totalXP += Number(sessao.xp || 100);

});



let media = 0;


if(historico.length > 0){

    media = (somaNotas / historico.length).toFixed(1);

}



totalSessoes.textContent = historico.length;

totalOndas.textContent = ondas;

mediaNota.textContent = media;

xp.textContent = totalXP;



if(totalXP >= 3000){

    mensagem.textContent =
    "🏆 Nível Pro! Você está no caminho dos profissionais.";

}

else if(totalXP >= 1500){

    mensagem.textContent =
    "🔥 Surfista avançado! Continue evoluindo.";

}

else if(totalXP >= 500){

    mensagem.textContent =
    "🌊 Boa evolução! Continue treinando.";

}

else{

    mensagem.textContent =
    "🏄 Continue surfando para evoluir!";

}




// Gráfico

const grafico = document.getElementById("graficoSurf");



if(grafico && historico.length > 0){


const labels = historico.map((sessao,index)=>{

    return "Sessão " + (index + 1);

});



const notas = historico.map(sessao=>{

    return sessao.nota;

});



new Chart(grafico, {


type:"line",


data:{


labels:labels,


datasets:[{


label:"Evolução da nota de surf",


data:notas,


tension:0.4


}]


},



options:{


responsive:true,


scales:{


y:{


beginAtZero:true,

max:10


}


}


}


});


}