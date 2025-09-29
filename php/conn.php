<?php
$servername = "localhost";
$username = "a24ikelopgom_proj0";
$password = "M[tJw?8RtF{KEc9Q";
$dbname = "a24ikelopgom_proj0";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>