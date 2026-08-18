console.log("Pranchas WaveRise 🏄");

const botaoSalvar = document.getElementById("salvarPrancha");

const lista = document.getElementById("listaPranchas");


carregarPranchas();



botaoSalvar.addEventListener("click", salvarPrancha);



// ============================
// SALVAR PRANCHA
// ============================

function salvarPrancha(){


const prancha = {


id: Date.now(),


marca:
document.getElementById("marca").value,


modelo:
document.getElementById("modelo").value,


tamanho:
document.getElementById("tamanho").value,


volume:
document.getElementById("volume").value,


cor:
document.getElementById("cor").value,


ano:
document.getElementById("ano").value,


valor:
document.getElementById("valor").value,


observacoes:
document.getElementById("observacoesPrancha").value,


sessoes:0


};



if(!prancha.marca || !prancha.modelo){


alert("Digite pelo menos marca e modelo da prancha.");

return;


}




let pranchas = JSON.parse(

localStorage.getItem("pranchasWaveRise")

) || [];





pranchas.push(prancha);





localStorage.setItem(

"pranchasWaveRise",

JSON.stringify(pranchas)

);





limparFormulario();


carregarPranchas();





alert("🏄 Prancha cadastrada!");



}





// ============================
// MOSTRAR PRANCHAS
// ============================


function carregarPranchas(){


lista.innerHTML = "";



const pranchas = JSON.parse(

localStorage.getItem("pranchasWaveRise")

) || [];





if(pranchas.length === 0){


lista.innerHTML =

"<p>Nenhuma prancha cadastrada.</p>";

return;


}





pranchas.forEach(prancha => {



lista.innerHTML += `


<div class="card prancha-item">


<h3>
🏄 ${prancha.modelo}
</h3>



<p>
<strong>Marca:</strong>
${prancha.marca}
</p>



<p>
<strong>Tamanho:</strong>
${prancha.tamanho}
</p>



<p>
<strong>Volume:</strong>
${prancha.volume} L
</p>



<p>
<strong>Cor:</strong>
${prancha.cor}
</p>



<p>
<strong>Ano:</strong>
${prancha.ano}
</p>



<p>
<strong>Valor:</strong>
${prancha.valor}
</p>



<p>
🌊 Sessões:
${prancha.sessoes}
</p>



<p>
${prancha.observacoes}
</p>



<button onclick="excluirPrancha(${prancha.id})">

🗑 Excluir

</button>


</div>


`;



});


}







// ============================
// EXCLUIR
// ============================


window.excluirPrancha = function(id){



let pranchas = JSON.parse(

localStorage.getItem("pranchasWaveRise")

) || [];





pranchas = pranchas.filter(

p => p.id !== id

);





localStorage.setItem(

"pranchasWaveRise",

JSON.stringify(pranchas)

);





carregarPranchas();



}







// ============================
// LIMPAR FORMULÁRIO
// ============================


function limparFormulario(){



document.getElementById("marca").value="";

document.getElementById("modelo").value="";

document.getElementById("tamanho").value="";

document.getElementById("volume").value="";

document.getElementById("cor").value="";

document.getElementById("ano").value="";

document.getElementById("valor").value="";

document.getElementById("observacoesPrancha").value="";


}