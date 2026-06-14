<?php
include 'includes/db.php';
include 'includes/functions.php';
include 'includes/header.php';
?>

<main class="container">
    <h1 style="margin: 40px 0 20px;">Каталог товаров</h1>
    
    <!-- Фильтр по категориям -->
    <div style="display: flex; gap: 15px; margin-bottom: 40px; flex-wrap: wrap;">
        <a href="/catalog.php" class="btn" style="background: <?= !isset($_GET['cat']) ? '#5F9EF0' : '#E1E8F0' ?>; color: <?= !isset($_GET['cat']) ? 'white' : '#333' ?>">Все</a>
        <a href="?cat=glasses" class="btn" style="background: <?= isset($_GET['cat']) && $_GET['cat'] == 'glasses' ? '#5F9EF0' : '#E1E8F0' ?>; color: <?= isset($_GET['cat']) && $_GET['cat'] == 'glasses' ? 'white' : '#333' ?>">Очки</a>
        <a href="?cat=sunglasses" class="btn" style="background: <?= isset($_GET['cat']) && $_GET['cat'] == 'sunglasses' ? '#5F9EF0' : '#E1E8F0' ?>; color: <?= isset($_GET['cat']) && $_GET['cat'] == 'sunglasses' ? 'white' : '#333' ?>">Солнцезащитные очки</a>
        <a href="?cat=contacts" class="btn" style="background: <?= isset($_GET['cat']) && $_GET['cat'] == 'contacts' ? '#5F9EF0' : '#E1E8F0' ?>; color: <?= isset($_GET['cat']) && $_GET['cat'] == 'contacts' ? 'white' : '#333' ?>">Контактные линзы</a>
        <a href="?cat=ortho" class="btn" style="background: <?= isset($_GET['cat']) && $_GET['cat'] == 'ortho' ? '#5F9EF0' : '#E1E8F0' ?>; color: <?= isset($_GET['cat']) && $_GET['cat'] == 'ortho' ? 'white' : '#333' ?>">Ночные линзы</a>
    </div>
    
    <div class="products-grid">
        <?php
        // Получаем товары из БД
        $sql = "SELECT * FROM products WHERE 1=1";
        if (isset($_GET['cat'])) {
            $cat = $_GET['cat'];
            if ($cat == 'glasses') $sql .= " AND category_id = 1";
            if ($cat == 'contacts') $sql .= " AND category_id = 2";
            if ($cat == 'ortho') $sql .= " AND category_id = 3";
            if ($cat == 'sunglasses') $sql .= " AND category_id = 4";
        }
        
        $stmt = $pdo->query($sql);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($products) > 0):
            foreach($products as $product):
        ?>
            <div class="product-card" onclick="window.location.href='product.php?id=<?= $product['id'] ?>'">
                <img src="/assets/images/<?= $product['image'] ?>" 
                     onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text='+encodeURIComponent('<?= $product['name'] ?>')">
                <div class="product-info">
                    <h3><?= htmlspecialchars($product['name']) ?></h3>
                    <p style="color: #5B6E8C; font-size: 14px;"><?= mb_substr($product['description'], 0, 80) ?>...</p>
                    <div class="price"><?= number_format($product['price'], 0, ',', ' ') ?> ₽</div>
                    <button class="btn add-to-cart" data-id="<?= $product['id'] ?>">В корзину</button>
                </div>
            </div>
        <?php 
            endforeach;
        else:
        ?>
            <p>Товары не найдены</p>
        <?php endif; ?>
    </div>
</main>

<?php include 'includes/footer.php'; ?>