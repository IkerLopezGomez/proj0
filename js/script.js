let estatPartida = {
    contadorPreguntas: 0,
    respostesUsuari: []
};

function actualizarMarcador() {
    let marcador = document.getElementById("marcador");
    let htmlString = `Pregunta ${estatPartida.contadorPreguntas + 1}<br>`;
    for (let i = 0; i < estatPartida.respostesUsuari.length; i++) {
        htmlString += `Pregunta ${i + 1} : <span class='badge text-bg-primary'>
        ${(estatPartida.respostesUsuari[i] ? "X" : "O")}</span><br>`;
    }
    marcador.innerHTML = htmlString;
}

function marcarRespuesta(numPregunta, numRespuesta, data) {
    
    if (!estatPartida.respostesUsuari[numPregunta]) {
            estatPartida.contadorPreguntas++;
    }
    estatPartida.respostesUsuari[numPregunta] = {
        idPregunta: parseInt(data.preguntas[numPregunta].idPregunta),
        idRespuesta: parseInt(numRespuesta)
    };

    if (estatPartida.contadorPreguntas == 10) {
        document.getElementById("btnEnviar").style.display = "block";
    }

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
            .then(res => console.log(res));
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetch('php/getPregunta.php')
        .then(res => res.json())
        .then(data => renderJuego(data));
});
