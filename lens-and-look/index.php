<?php include 'includes/db.php'; ?>
<?php include 'includes/functions.php'; ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lens & Look - Интернет-магазин оптики</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<?php include 'includes/header.php'; ?>

<main class="container">
    <!-- Hero-блок с анимацией -->
    <div class="hero">
        <div class="hero-text">
            <h1>Идеальное зрение<br>начинается здесь</h1>
            <p>Очки, контактные линзы, ночные и склеральные линзы от ведущих брендов</p>
            <a href="catalog.php" class="btn">В каталог →</a>
        </div>
        <div class="hero-image">
            <img src="./assets/images/glasses_hero.png" alt="Модные очки">
        </div>
    </div>

    <!-- Новые поступления -->
    <section>
        <h2>✨ Новые поступления</h2>
        <div class="products-grid">
            <?php
            $stmt = $pdo->query("SELECT * FROM products WHERE is_new = 1 LIMIT 4");
            while($product = $stmt->fetch(PDO::FETCH_ASSOC)):
            ?>
            <div class="product-card" onclick="window.location.href='product.php?id=<?= $product['id'] ?>'">
                <img src="assets/images/<?= $product['image'] ?>" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=Product'">
                <div class="product-info">
                    <h3><?= htmlspecialchars($product['name']) ?></h3>
                    <div class="price"><?= number_format($product['price'], 0, ',', ' ') ?> ₽</div>
                    <button class="btn add-to-cart" data-id="<?= $product['id'] ?>">В корзину</button>
                </div>
            </div>
            <?php endwhile; ?>
        </div>
    </section>

    <!-- Популярное -->
    <section>
        <h2>⭐ Популярное</h2>
        <div class="products-grid">
            <?php
            $stmt = $pdo->query("SELECT * FROM products WHERE is_popular = 1 LIMIT 4");
            while($product = $stmt->fetch(PDO::FETCH_ASSOC)):
            ?>
            <div class="product-card" onclick="window.location.href='product.php?id=<?= $product['id'] ?>'">
                <img src="assets/images/<?= $product['image'] ?>" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=Popular'">
                <div class="product-info">
                    <h3><?= htmlspecialchars($product['name']) ?></h3>
                    <div class="price"><?= number_format($product['price'], 0, ',', ' ') ?> ₽</div>
                    <button class="btn add-to-cart" data-id="<?= $product['id'] ?>">Купить</button>
                </div>
            </div>
            <?php endwhile; ?>
        </div>
    </section>
</main>

<?php include 'includes/footer.php'; ?>
<script src="assets/js/main.js"></script>
</body>
</html>