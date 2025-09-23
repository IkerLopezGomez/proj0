let estatPartida = {
    contadorPreguntas: 0,
    respostesUsuari:[]
};

function actualizarMarcador(){
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `Pregunta ${estatPartida.contadorPreguntas + 1}`
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
           htmlString += `<button type="button" id = "btnFinal" class="btn btn-outline-secondary btn-sm mb-2 d-block" onclick="marcarRespuesta(${i},${j})">
            ${data.preguntes[i].respostes[j]}
            </button>`;

        }
        actualizarMarcador();
    }
    htmlString+=`<button id="btnEnviar" onclick="enviarEstat()" class="btn btn-danger"  style="display:none" >Enviar Respuestas</button>`
    contenidor.innerHTML = htmlString;
}

window.addEventListener('DOMContentLoaded', (event) =>{
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => renderJuego(data))
    }
    );
function enviarEstat(){
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
}