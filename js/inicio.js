export function iniciarPagina(){
    document.getElementById("inicio").innerHTML = "";
    document.getElementById("inicio").style.display = "block";
    document.getElementById("inicio").innerHTML += "<h1 class='text-center'>Bienvenido al Cuestionario</h1>";
    document.getElementById("inicio").innerHTML += "<button id='btnComenzar' class='btn btn-primary btn-lg d-block mx-auto mt-3'>Comenzar Cuestionario</button>";
    const btnComenzar = document.getElementById("btnComenzar");
    document.getElementById("questionari").style.display = "none";
    document.getElementById("marcador").style.display = "none";

    btnComenzar.addEventListener("click", async () => {
        document.getElementById("inicio").style.display = "none";

        document.getElementById("questionari").style.display = "block";
        document.getElementById("marcador").style.display = "block";

        const script = await import ('./script.js');
        script .iniciarCuestionario();
    });
}
iniciarPagina();