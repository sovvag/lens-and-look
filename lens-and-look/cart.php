<?php
include 'includes/db.php';
include 'includes/functions.php';

// Обработка AJAX запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $product_id = $_POST['id'] ?? 0;
    $session_id = session_id();
    
    if ($action === 'add') {
        addToCart($pdo, $session_id, $product_id);
    } elseif ($action === 'remove') {
        removeFromCart($pdo, $session_id, $product_id);
    } elseif ($action === 'update') {
        $quantity = $_POST['quantity'] ?? 1;
        updateCartQuantity($pdo, $session_id, $product_id, $quantity);
    }
    
    // Возвращаем общее количество
    $count = getCartCount($pdo, $session_id);
    echo json_encode(['success' => true, 'count' => $count]);
    exit;
}

// Отображение корзины (GET запрос)
include 'includes/header.php';

$session_id = session_id();
$cart_items = getCartItems($pdo, $session_id);
$cart_total = getCartTotal($pdo, $session_id);
?>

<main class="container">
    <h1 style="margin: 40px 0 30px;">🛒 Корзина</h1>
    
    <?php if (empty($cart_items)): ?>
        <!-- Пустая корзина -->
        <div style="text-align: center; padding: 80px 20px; background: #F8F9FC; border-radius: 24px;">
            <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
            <h2 style="margin-bottom: 15px; color: #1E2A3E;">Ваша корзина пуста</h2>
            <p style="color: #5B6E8C; margin-bottom: 30px;">Добавьте товары из каталога, чтобы оформить заказ</p>
            <a href="/catalog.php" class="btn" style="font-size: 16px; padding: 12px 30px;">Перейти в каталог</a>
        </div>
    <?php else: ?>
        <!-- Корзина с товарами -->
        <div style="display: grid; grid-template-columns: 1fr 380px; gap: 30px;">
            <!-- Список товаров -->
            <div>
                <div style="background: #F8F9FC; padding: 15px 20px; border-radius: 16px; margin-bottom: 20px; font-weight: 600; display: grid; grid-template-columns: 100px 1fr 150px 120px 50px; gap: 15px;">
                    <div>Товар</div>
                    <div>Название</div>
                    <div>Цена</div>
                    <div>Количество</div>
                    <div></div>
                </div>
                
                <?php foreach($cart_items as $item): ?>
                <div class="cart-item" data-id="<?= $item['product_id'] ?>" style="background: white; padding: 20px; border-radius: 16px; margin-bottom: 15px; box-shadow: var(--shadow); display: grid; grid-template-columns: 100px 1fr 150px 120px 50px; gap: 15px; align-items: center;">
                    <!-- Изображение -->
                    <img src="/assets/images/<?= $item['image'] ?>" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px;"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%225F9EF0%22/%3E%3Ctext x=%2240%22 y=%2245%22 text-anchor=%22middle%22 fill=%22white%22%3E👓%3C/text%3E%3C/svg%3E'">
                    
                    <!-- Название -->
                    <div>
                        <h3 style="font-size: 16px; margin-bottom: 5px;"><?= htmlspecialchars($item['name']) ?></h3>
                        <p style="color: #5B6E8C; font-size: 12px;">Арт: <?= $item['product_id'] ?></p>
                    </div>
                    
                    <!-- Цена -->
                    <div class="price" style="font-size: 18px;"><?= number_format($item['price'], 0, ',', ' ') ?> ₽</div>
                    
                    <!-- Количество -->
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button class="btn-update" data-id="<?= $item['product_id'] ?>" data-change="-1" style="background: #E1E8F0; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-size: 18px;">-</button>
                        <span id="qty-<?= $item['product_id'] ?>" style="min-width: 30px; text-align: center; font-weight: 600;"><?= $item['quantity'] ?></span>
                        <button class="btn-update" data-id="<?= $item['product_id'] ?>" data-change="1" style="background: #E1E8F0; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-size: 18px;">+</button>
                    </div>
                    
                    <!-- Удалить -->
                    <button class="btn-remove" data-id="<?= $item['product_id'] ?>" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #dc3545;">🗑️</button>
                </div>
                <?php endforeach; ?>
            </div>
            
            <!-- Итого и оформление -->
            <div style="background: #F8F9FC; padding: 30px; border-radius: 24px; height: fit-content; position: sticky; top: 100px;">
                <h3 style="margin-bottom: 20px;">Итого</h3>
                <div style="margin-bottom: 15px; display: flex; justify-content: space-between;">
                    <span>Товары (<?= count($cart_items) ?> шт.):</span>
                    <span><strong><?= number_format($cart_total, 0, ',', ' ') ?> ₽</strong></span>
                </div>
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
                    <span>Доставка:</span>
                    <span>от 200 ₽</span>
                </div>
                <hr style="margin: 20px 0; border-color: #E1E8F0;">
                <div style="margin-bottom: 25px; display: flex; justify-content: space-between; font-size: 24px; font-weight: 700;">
                    <span>К оплате:</span>
                    <span style="color: #5F9EF0;"><?= number_format($cart_total, 0, ',', ' ') ?> ₽</span>
                </div>
                <button class="btn" onclick="checkout()" style="width: 100%; padding: 15px; font-size: 16px;">Оформить заказ</button>
                <a href="/catalog.php" style="display: block; text-align: center; margin-top: 15px; color: #5F9EF0; text-decoration: none;">← Продолжить покупки</a>
            </div>
        </div>
    <?php endif; ?>
</main>

<script>
// Обновление количества товаров
document.querySelectorAll('.btn-update').forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.stopPropagation();
        const productId = this.dataset.id;
        const change = parseInt(this.dataset.change);
        const quantitySpan = document.getElementById(`qty-${productId}`);
        let newQuantity = parseInt(quantitySpan.textContent) + change;
        
        if (newQuantity < 1) newQuantity = 1;
        
        try {
            const response = await fetch('/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=update&id=${productId}&quantity=${newQuantity}`
            });
            
            const data = await response.json();
            if (data.success) {
                location.reload(); // Перезагружаем страницу для обновления
            }
        } catch(error) {
            console.error('Ошибка:', error);
            showNotification('❌ Ошибка при обновлении');
        }
    });
});

// Удаление товаров из корзины
document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.stopPropagation();
        const productId = this.dataset.id;
        
        if (confirm('Удалить товар из корзины?')) {
            try {
                const response = await fetch('/cart.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=remove&id=${productId}`
                });
                
                const data = await response.json();
                if (data.success) {
                    location.reload(); // Перезагружаем страницу
                }
            } catch(error) {
                console.error('Ошибка:', error);
                showNotification('❌ Ошибка при удалении');
            }
        }
    });
});

function checkout() {
    alert('Оформление заказа в разработке. Спасибо за покупку!');
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #5F9EF0;
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Стиль для sticky
const style = document.createElement('style');
style.textContent = `
    .cart-item {
        transition: all 0.3s;
    }
    .cart-item:hover {
        transform: translateX(5px);
    }
`;
document.head.appendChild(style);
</script>

<?php include 'includes/footer.php'; ?>