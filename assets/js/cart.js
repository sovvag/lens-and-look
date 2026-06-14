// === СКРИПТЫ ДЛЯ КОРЗИНЫ ===

// База товаров
const productsForCart = [
    { id: 1, name: "Acuvue Oasys 1-Day", price: 2490, image: "product1.jpg" },
    { id: 2, name: "CooperVision Biofinity", price: 3200, image: "product2.jpg" },
    { id: 3, name: "Air Optix Night & Day", price: 3850, image: "product3.jpg" },
    { id: 4, name: "Dailies Total 1", price: 2990, image: "product4.jpg" },
    { id: 5, name: "Очки Ray-Ban RX", price: 12900, image: "product5.jpg" },
    { id: 6, name: "MyDay daily disposable", price: 1890, image: "product6.jpg" },
    { id: 7, name: "Очки Oakley", price: 15500, image: "product7.jpg" },
    { id: 8, name: "Clariti 1-Day", price: 2190, image: "product8.jpg" },
    { id: 9, name: "Ночные линзы Paragon CRT", price: 25000, image: "product9.jpg" },
    { id: 10, name: "Очки Polaroid", price: 8900, image: "product10.jpg" }
];

// Получить корзину
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Сохранить корзину
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
}

// Обновить количество
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCart();
    }
}

// Удалить товар
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showNotification('🗑️ Товар удалён из корзины');
    renderCart();
}

// Очистить корзину
function clearCart() {
    if (confirm('Очистить всю корзину?')) {
        saveCart([]);
        renderCart();
        showNotification('🧹 Корзина очищена');
    }
}

// Показать уведомление
function showNotification(message) {
    let notif = document.getElementById('cartNotification');
    if (notif) notif.remove();
    
    notif = document.createElement('div');
    notif.id = 'cartNotification';
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
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Отрисовка корзины
function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2 style="margin-bottom: 15px; color: #1E2A3E;">Ваша корзина пуста</h2>
                <p style="color: #5B6E8C; margin-bottom: 30px;">Добавьте товары из каталога, чтобы оформить заказ</p>
                <a href="catalog.html" class="btn" style="font-size: 16px; padding: 12px 30px;">Перейти в каталог</a>
            </div>
        `;
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
        return;
    }
    
    const itemsWithDetails = cart.map(cartItem => {
        const product = productsForCart.find(p => p.id === cartItem.id);
        return { ...cartItem, ...product };
    }).filter(item => item.name);
    
    if (itemsWithDetails.length === 0) {
        saveCart([]);
        renderCart();
        return;
    }
    
    let subtotal = 0;
    let itemsHtml = '';
    
    itemsWithDetails.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHtml += `
            <div class="cart-item" data-id="${item.id}">
                <img src="assets/images/${item.image}" onerror="this.src='https://placehold.co/80x80/5F9EF0/white?text=👓'">
                <div>
                    <h3>${item.name}</h3>
                    <p style="color: #5B6E8C; font-size: 12px;">Арт: ${item.id}</p>
                </div>
                <div class="price" style="font-size: 18px;">${item.price.toLocaleString('ru-RU')} ₽</div>
                <div class="item-quantity" style="display: flex; gap: 10px; align-items: center;">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-remove">
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    const delivery = 200;
    const total = subtotal + delivery;
    
    container.innerHTML = `
        <div class="cart-container">
            <div>
                <div class="cart-header">
                    <div>Товар</div>
                    <div>Название</div>
                    <div>Цена</div>
                    <div>Количество</div>
                    <div></div>
                </div>
                ${itemsHtml}
            </div>
            <div class="cart-summary">
                <h3 style="margin-bottom: 20px;">Итого</h3>
                <div style="margin-bottom: 15px; display: flex; justify-content: space-between;">
                    <span>Товары (${itemsWithDetails.reduce((s, i) => s + i.quantity, 0)} шт.):</span>
                    <span><strong>${subtotal.toLocaleString('ru-RU')} ₽</strong></span>
                </div>
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
                    <span>Доставка:</span>
                    <span>от 200 ₽</span>
                </div>
                <hr style="margin: 20px 0; border-color: #E1E8F0;">
                <div style="margin-bottom: 25px; display: flex; justify-content: space-between; font-size: 24px; font-weight: 700;">
                    <span>К оплате:</span>
                    <span style="color: #5F9EF0;">${total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button class="btn" onclick="checkout()" style="width: 100%; padding: 15px; font-size: 16px;">Оформить заказ</button>
                <button onclick="clearCart()" style="width: 100%; margin-top: 10px; padding: 12px; background: none; border: 1px solid #dc3545; border-radius: 40px; color: #dc3545; cursor: pointer;">Очистить корзину</button>
                <a href="catalog.html" style="display: block; text-align: center; margin-top: 15px; color: #5F9EF0; text-decoration: none;">← Продолжить покупки</a>
            </div>
        </div>
    `;
    
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('🛒 Корзина пуста!');
        return;
    }
    alert('🎉 Спасибо за покупку!\n\nФункция оформления заказа в разработке.\nВаш заказ принят!');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
});

window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;