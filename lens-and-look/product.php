<?php
include 'includes/db.php';
$id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
$stmt->execute([$id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$product) { header('Location: 404.php'); exit; }
?>
<!-- Подробное описание, цена, фото, характеристики, отзывы (заглушка) -->