export function iniciarCuestionario() {
    let estatPartida = {
    contadorPreguntas: 0,
    respostesUsuari: [],
    temps: 0
};

let temporizador = null;

function actualizarMarcador() {
    let marcador = document.getElementById("marcador");
    let minutos = Math.floor(estatPartida.temps / 60);
    let segundos = estatPartida.temps % 60;
    let tiempoMin = 
        String(minutos).padStart(2, '0') + ':' +
        String(segundos).padStart(2, '0');
    let htmlString = `Tiempo: ${tiempoMin}<br>`;
    htmlString += `Pregunta ${estatPartida.contadorPreguntas + 1}<br>`;
    for (let i = 0; i < estatPartida.respostesUsuari.length; i++) {
        htmlString += `Pregunta ${i + 1} : <span class='badge text-bg-primary'>
        ${(estatPartida.respostesUsuari[i] ? "X" : "O")}</span><br>`;
    }
    marcador.innerHTML = htmlString;
    localStorage.setItem("Partida", JSON.stringify(estatPartida));
    if(estatPartida.contadorPreguntas >= 10) {
        document.getElementById("btnEnviar").style.display = "block";
    }
}

function marcarRespuesta(numPregunta, numRespuesta, data) {
    
    if (!estatPartida.respostesUsuari[numPregunta]) {
            estatPartida.contadorPreguntas++;
    }
    estatPartida.respostesUsuari[numPregunta] = {
        idPregunta: parseInt(data.preguntas[numPregunta].idPregunta),
        idRespuesta: parseInt(numRespuesta)
    };
    actualizarMarcador();
}

fetch('php/getPregunta.php')
  .then(res => res.json())
  .then(data => {
      console.log("JSON recibido:", data);
      renderJuego(data);
  })
  .catch(err => console.error("Error al obtener preguntas:", err));


function renderJuego(data) {
    let contenidor = document.getElementById("questionari");
    let htmlString = "";

    data.preguntas.forEach((preg, i) => {
        htmlString += `<h3>${preg.Pregunta}</h3>`;
        htmlString += `<img src="${preg.imatge}" class="img-fluid d-block mx-auto" style="max-width:30%;"><br>`;

    
        [preg.Respuesta1, preg.Respuesta2, preg.Respuesta3].forEach((textoResp, j) => {
            htmlString += `<button preg="${i}" resp="${j}" class="btn btn-outline-secondary btn-sm mb-2 d-block">
            ${textoResp}
        </button>`;
    });
});


    htmlString += `<button id="btnEnviar" class="btn btn-danger" style="display:none">Enviar Respuestas</button>`;
    contenidor.innerHTML = htmlString;

    contenidor.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn") && e.target.id !== "btnEnviar") {
            marcarRespuesta(e.target.getAttribute("preg"), e.target.getAttribute("resp"), data);
        }
    });

    document.getElementById("btnEnviar").addEventListener("click", () => {
        fetch("php/recogida.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ respuestas: estatPartida.respostesUsuari })
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === "ok") {
                    let correctas = res.resultados.filter(r => r.acertada).length;
                    clearInterval(temporizador);
                    temporizador = null;
                    document.getElementById("marcador").innerHTML = `Has acertado ${correctas} de 10 preguntas`;
                    document.getElementById("marcador").innerHTML += `<button id="btnReinicio" class="btn btn-danger m-auto" style="display:block">Reiniciar Partida</button>`;
                    res.resultados.forEach(r => {
                        const btnsPregunta = document.querySelectorAll(`[preg="${r.idPregunta - 1}"]`);
                        btnsPregunta.forEach((btn, i) => {
                            if (i === r.idRespuestaUsuario) {
                                btn.classList.remove("btn-outline-secondary");
                                btn.classList.add(r.acertada ? "btn-success" : "btn-danger");
                                btn.classList.add("fw-bold");
                            }
                            
                            if (i === r.idRespuestaCorrecta) {
                                btn.classList.add ("btn-success");
                                btn.classList.add("fw-bold");
                                btn.classList.add("text-white");
                            }
                        });
                    });
                };
            });
            estatPartida.contadorPreguntas = 0;
            estatPartida.respostesUsuari = [];
            estatPartida.temps = 0;
            actualizarMarcador();
            document.getElementById("btnEnviar").style.display = "none";
            let marcador = document.getElementById("marcador");

    });
    document.getElementById("btnReinicio").addEventListener("click", () => {
        localStorage.removeItem("Partida");
        const script = import ('./inicio.js');
        script .iniciarPagina();
    });
};

window.addEventListener('DOMContentLoaded', () => {
    let contenidor = document.getElementById("questionari");
    fetch('php/getPregunta.php')
        .then(res => res.json())
        .then(data => {
            renderJuego(data);
            if(localStorage.Partida){
                estatPartida = JSON.parse(localStorage.getItem("Partida"));
                actualizarMarcador();
            }
        });
});
window.addEventListener('DOMContentLoaded', () => {
    temporizador = setInterval(function(){
        estatPartida.temps++;
        actualizarMarcador();
    }, 1000);
});
}
