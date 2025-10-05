export function iniciarPagina() {
    const inicioDiv = document.getElementById("inicio");
    const questionariDiv = document.getElementById("questionari");
    const marcadorDiv = document.getElementById("marcador");
    const btnPanelAdmin = document.getElementById("btnPanelAdmin");

    inicioDiv.innerHTML = "";
    inicioDiv.style.display = "block";
    inicioDiv.style.textAlign = "center"; 
    inicioDiv.style.paddingTop = "100px"; 

    inicioDiv.innerHTML += "<h1 class='mb-4'>Bienvenido al Cuestionario</h1>"; 
    inicioDiv.innerHTML += "<button id='btnComenzar' class='btn btn-primary btn-lg mt-3'>Comenzar Cuestionario</button>";


    questionariDiv.style.display = "none";
    marcadorDiv.style.display = "none";


    if (btnPanelAdmin) btnPanelAdmin.style.display = "inline-block";

    const btnComenzar = document.getElementById("btnComenzar");

    btnComenzar.addEventListener("click", async () => {

        inicioDiv.style.display = "none";


        if (btnPanelAdmin) btnPanelAdmin.style.display = "none";


        questionariDiv.style.display = "block";
        marcadorDiv.style.display = "block";


        const script = await import('./script.js');
        script.iniciarCuestionario();
    });
}

iniciarPagina();
