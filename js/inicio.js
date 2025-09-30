const btnComenzar = document.getElementById("btnComenzar");

btnComenzar.addEventListener("click", () => {
    document.getElementById("inicio").style.display = "none";

    document.getElementById("questionari").style.display = "block";
    document.getElementById("marcador").style.display = "block";


    import('./script.js');
});