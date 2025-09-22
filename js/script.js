let estatPartida = {
    contadorPreguntas: 0,
    respostesUsuari:[]
};

function actualizarMarcador(){
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `Pregunta ${estatPartida.contadorPreguntas}`
}
window.actualizarMarcador = actualizarMarcador;


function marcarRespuesta(numPregunta, numRespuesta){

    console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);
    if (estatPartida.respostesUsuari[numPregunta] === undefined) {
        estatPartida.contadorPreguntas++;
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
            htmlString += `<button onclick = "marcarRespuesta(${i},${j})">
                ${data.preguntes[i].respostes[j]}
            </button>`;
        }
        actualizarMarcador();
    }
    contenidor.innerHTML = htmlString;
}

window.addEventListener('DOMContentLoaded', (event) =>{
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => renderJuego(data))
    }
    );