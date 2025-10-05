let temporizador = null;

export function iniciarCuestionario() {
    let indicePregunta = 0;
    let preguntasData = [];
    let estatPartida = {
        contadorPreguntas: 0,
        respostesUsuari: [],
        temps: 0,
        finalizado: false,
        resultadosFinales: null
    };

    function actualizarMarcador() {
        const marcador = document.getElementById("marcador");
        let minutos = Math.floor(estatPartida.temps / 60);
        let segundos = estatPartida.temps % 60;
        let tiempoMin = String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');

        let htmlString = `<button id="btnReinicio" class="btn btn-danger btn-sm mb-2">Reiniciar Cuestionario</button><br>`;
        htmlString += `Tiempo: ${tiempoMin}<br>`;
        if (estatPartida.resultadosFinales != null) {
            htmlString += `Preguntas acertadas: ${estatPartida.resultadosFinales}<br>`;
        }

        marcador.innerHTML = htmlString;

        document.getElementById("btnReinicio").addEventListener("click", () => {
            if (temporizador) {
                clearInterval(temporizador);
                temporizador = null;
            }
            localStorage.removeItem("Partida");
            estatPartida = { contadorPreguntas: 0, respostesUsuari: [], temps: 0, finalizado: false, resultadosFinales: null };
            indicePregunta = 0;
            document.getElementById("questionari").innerHTML = "";
            actualizarMarcador();
            import('./inicio.js').then(module => module.iniciarPagina());
        });

        localStorage.setItem("Partida", JSON.stringify(estatPartida));
    }

    function mostrarPregunta(indice) {
        const contenidor = document.getElementById("questionari");
        contenidor.innerHTML = "";

        const preg = preguntasData[indice];

        contenidor.innerHTML += `<h5 class="text-center mb-2">Pregunta ${indice + 1} de ${preguntasData.length}</h5>`;
        contenidor.innerHTML += `<h3 class="text-center mb-3">${preg.Pregunta}</h3>`;
        contenidor.innerHTML += `<img src="${preg.imatge}" class="img-fluid d-block mx-auto mb-3" style="max-width:30%;"><br>`;

        [preg.Respuesta1, preg.Respuesta2, preg.Respuesta3].forEach((textoResp, j) => {
            contenidor.innerHTML += `<button class="btn btn-outline-secondary btn-sm mb-2 d-block w-50 mx-auto" data-resp="${j}">
                ${textoResp}</button>`;
        });

        contenidor.innerHTML += `<div class="d-flex justify-content-center mt-3 gap-2">
            ${indice === 0 ? '<button id="btnSiguiente" class="btn btn-primary w-100">Siguiente</button>' : ''}
            ${indice === preguntasData.length - 1 ? '<button id="btnAnterior" class="btn btn-secondary w-100">Anterior</button>' : ''}
            ${indice > 0 && indice < preguntasData.length - 1 ? '<button id="btnAnterior" class="btn btn-secondary flex-fill">Anterior</button><button id="btnSiguiente" class="btn btn-primary flex-fill">Siguiente</button>' : ''}
            ${indice === preguntasData.length -1 ? '<button id="btnEnviar" class="btn btn-danger ms-2">Finalizar</button>' : ''}
        </div>`;

        const respuestaPrev = estatPartida.respostesUsuari[indice];
        const botones = contenidor.querySelectorAll('button[data-resp]');

        if (!estatPartida.finalizado) {
            if (respuestaPrev) {
                botones.forEach(btn => btn.classList.remove("border-primary"));
                botones[respuestaPrev.idRespuesta].classList.add("border-primary");
            }
        } else if (respuestaPrev) {
            botones.forEach((btn, j) => {
                btn.disabled = true;
                btn.classList.remove("btn-outline-secondary");
                if (respuestaPrev.idRespuestaCorrecta === j) btn.classList.add("btn-success");
                if (respuestaPrev.idRespuesta !== respuestaPrev.idRespuestaCorrecta && respuestaPrev.idRespuesta === j) {
                    btn.classList.add("btn-danger");
                }
            });
            const btnEnviar = document.getElementById("btnEnviar");
            if (btnEnviar) btnEnviar.style.display = "none";
        }

        actualizarMarcador();
    }

    function enviarResultados() {
        fetch("php/recogida.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ respuestas: estatPartida.respostesUsuari })
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === "ok") {
                estatPartida.resultadosFinales = res.resultados.filter(r => r.acertada).length;
                estatPartida.finalizado = true;
                if (temporizador) {
                    clearInterval(temporizador);
                    temporizador = null;
                }
                res.resultados.forEach(r => {
                    estatPartida.respostesUsuari[r.idPregunta - 1] = {
                        idPregunta: r.idPregunta,
                        idRespuesta: r.idRespuestaUsuario,
                        idRespuestaCorrecta: r.idRespuestaCorrecta,
                        acertada: r.acertada
                    };
                });
                mostrarPregunta(indicePregunta);
                actualizarMarcador();
            }
        })
        .catch(err => console.error("Error en enviarResultados:", err));
    }

    fetch('php/getPregunta.php')
        .then(res => res.json())
        .then(data => {
            preguntasData = data.preguntas || [];
            mostrarPregunta(indicePregunta);
            if (localStorage.getItem("Partida")) {
                const partidaGuardada = JSON.parse(localStorage.getItem("Partida"));
                estatPartida = { ...estatPartida, ...partidaGuardada };
                mostrarPregunta(indicePregunta);
            }
        })
        .catch(err => console.error("Error al obtener preguntas:", err));

    document.getElementById("questionari").addEventListener("click", (e) => {
        if (e.target.dataset.resp != null && !estatPartida.finalizado) {
            estatPartida.respostesUsuari[indicePregunta] = {
                idPregunta: parseInt(preguntasData[indicePregunta].idPregunta),
                idRespuesta: parseInt(e.target.dataset.resp)
            };
            e.target.parentElement.querySelectorAll("button[data-resp]").forEach(btn => btn.classList.remove("border-primary"));
            e.target.classList.add("border-primary");
            actualizarMarcador();
        } else if (e.target.id === "btnSiguiente") {
            indicePregunta++;
            mostrarPregunta(indicePregunta);
        } else if (e.target.id === "btnAnterior") {
            indicePregunta--;
            mostrarPregunta(indicePregunta);
        } else if (e.target.id === "btnEnviar") {
            enviarResultados();
        }
    });

    if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
    }
    temporizador = setInterval(() => {
        estatPartida.temps++;
        actualizarMarcador();
    }, 1000);
}
