<?php
require 'conn.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['respuestas'])){
    echo json_encode(["error" => "No se recibieron respuestas"]);
    exit;
}

$respuestasUsuari = $data['respuestas'];
$resultats = [];

foreach($respuestasUsuari as $r){
    $idPregunta = $r['idPregunta'];
    $idRespuesta = $r['idRespuesta'];

    $stmt = $conn->prepare("SELECT idRespuesta FROM Preguntas WHERE idPregunta = ?");
    $stmt->bind_param("i", $idPregunta);
    $stmt->execute();
    $stmt->bind_result($correcta);
    $stmt->fetch();
    $stmt->close();

    $resultats[] = [
        "idPregunta" => $idPregunta,
        "idRespuestaUsuario" => $idRespuesta,
        "idRespuestaCorrecta" => $correcta,
        "acertada" => ($idRespuesta == $correcta)
    ];
}

echo json_encode([
    "status" => "ok",
    "resultados" => $resultats]);
?>