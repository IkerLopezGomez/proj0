<?php
require 'conn.php';

$sql = "SELECT idPregunta, Pregunta, Respuesta1, Respuesta2, Respuesta3, imatge 
        FROM Preguntas 
        LIMIT 10"; 

$result = $conn->query($sql);

$preguntas = [];
while($row = $result->fetch_assoc()) {
    $preguntas[] = $row;
}

echo json_encode(["preguntas" => $preguntas]);
?>
