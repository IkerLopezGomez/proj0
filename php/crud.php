<?php
require 'conn.php';

if (isset($_POST['action']) && $_POST['action'] === 'create') {
    $pregunta = $_POST['Pregunta'];
    $r1 = $_POST['Respuesta1'];
    $r2 = $_POST['Respuesta2'];
    $r3 = $_POST['Respuesta3'];
    $correcta = $_POST['respostaCorrecta'];
    $imagen = $_POST['imatge'] ?? '';
    $idResp = $_POST['idRespuesta'];

    $stmt = $conn->prepare("INSERT INTO Preguntas (Pregunta, Respuesta1, Respuesta2, Respuesta3, respostaCorrecta, imatge, idRespuesta) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssi", $pregunta, $r1, $r2, $r3, $correcta, $imagen, $idResp);
    $stmt->execute();
    $stmt->close();
    echo "Pregunta creada correctamente.";
}

if (isset($_GET['action']) && $_GET['action'] === 'read') {
    $result = $conn->query("SELECT * FROM Preguntas");
    $preguntas = [];
    while($row = $result->fetch_assoc()) {
        $preguntas[] = $row;
    }
    echo json_encode($preguntas);
}

if (isset($_POST['action']) && $_POST['action'] === 'update') {
    $id = $_POST['idPregunta'];
    $pregunta = $_POST['Pregunta'];
    $r1 = $_POST['Respuesta1'];
    $r2 = $_POST['Respuesta2'];
    $r3 = $_POST['Respuesta3'];
    $correcta = $_POST['respostaCorrecta'];
    $imagen = $_POST['imatge'] ?? '';
    $idResp = $_POST['idRespuesta'];

    $stmt = $conn->prepare("UPDATE Preguntas SET Pregunta=?, Respuesta1=?, Respuesta2=?, Respuesta3=?, respostaCorrecta=?, imatge=?, idRespuesta=? WHERE idPregunta=?");
    $stmt->bind_param("ssssssii", $pregunta, $r1, $r2, $r3, $correcta, $imagen, $idResp, $id);
    $stmt->execute();
    $stmt->close();
    echo "Pregunta actualizada correctamente.";
}

if (isset($_POST['action']) && $_POST['action'] === 'delete') {
    $id = $_POST['idPregunta'];
    $stmt = $conn->prepare("DELETE FROM Preguntas WHERE idPregunta=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    echo "Pregunta eliminada correctamente.";
}
?>
