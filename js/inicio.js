export function iniciarPagina(){
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
