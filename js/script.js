let estatPartida = {
    contadorPreguntas: 0,
    respostesUsuari:[]
};

function actualizarMarcador(){
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `Pregunta ${estatPartida.contadorPreguntas + 1}`
    for (let i = 0; i < estatPartida.respostesUsuari.length; i++) {
        htmlString += `Pregunta ${i} : <span class = 'badge text-bg-primary'> 
        ${(estatPartida.respostesUsuari[i] == undefined ? "O" : "X")}
         </span> <br>`;
    }
}
window.actualizarMarcador = actualizarMarcador;


function marcarRespuesta(numPregunta, numRespuesta){

    console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);
    if (estatPartida.respostesUsuari[numPregunta] === undefined) {
        estatPartida.contadorPreguntas++;
        if(estatPartida.contadorPreguntas == 10){
            document.getElementById ("btnEnviar").style.display = "block";
        }
    }   
    estatPartida.respostesUsuari[numPregunta] = numRespuesta;
    console.log(estatPartida);
    actualizarMarcador();
}

localStorage.setItem("partida", JSON.stringify(estatPartida));
window.marcarRespuesta = marcarRespuesta;

function renderJuego(data){
    console.log(data);
    let contenidor = document.getElementById("questionari");

    let htmlString= "";

    for (let i = 0; i < data.preguntes.length; i++) {
        console.log(data.preguntes[i].imatge)
        htmlString += `<h3> ${data.preguntes[i].pregunta} </h3>`;
       htmlString += `<img src="${data.preguntes[i].imatge}" 
                   alt="imagen pregunta ${i + 1}" 
                   class="img-fluid d-block mx-auto" 
                   style="max-width:30%;"> <br>`;

        for (let j = 0; j < data.preguntes[i].respostes.length; j++){
           htmlString += `<button preg = "${i}" resp = "${j}" id = "btnFinal" class="btn btn-outline-secondary btn-sm mb-2 d-block">
            ${data.preguntes[i].respostes[j]}
            </button>`;
        }
        actualizarMarcador();
    }
    contenidor.addEventListener("click", function(e){
        if (e.target.classList.contains("btn")) {
            e.target.getAttribute("resp");
            marcarRespuesta(e.target.getAttribute("preg"), e.target.getAttribute("resp"));
        }
    });
    htmlString+=`<button id="btnEnviar"  class="btn btn-danger"  style="display:none" >Enviar Respuestas</button>`
    contenidor.innerHTML = htmlString;
    document.getElementById("btnEnviar").addEventListener("click", function(){
    const url = "recogida.php";
    fetch (url,{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contadorPreguntas: estatPartida.contadorPreguntas,
            respostesUsuari: estatPartida.respostesUsuari
        })
    })
    .then(response => response.json())
    .then(data => console.log("JSON ->", data));
    });
}

window.addEventListener('DOMContentLoaded', (event) =>{
    if(localStorage.partida){
        estatPartida = JSON.parse(localStorage.getItem("partida"));
        actualizarMarcador();
    }
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => renderJuego(data))
    }
    );