// Анимация при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .hero').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Работа с корзиной через fetch
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const productId = btn.dataset.id;
        
        const response = await fetch('cart.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=add&id=${productId}`
        });
        
        const data = await response.json();
        if (data.success) {
            updateCartCount(data.count);
            showNotification('Товар добавлен в корзину');
        }
    });
});

function updateCartCount(count) {
    const counter = document.querySelector('.cart-count');
    if (counter) counter.textContent = count;
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #5F9EF0; color: white; padding: 12px 24px;
        border-radius: 40px; z-index: 1000; animation: fadeInUp 0.3s;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===

// Корзина
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, quantity = 1) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    saveCart(cart);
    showNotification('✅ Добавлено в корзину');
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) cartCountElement.textContent = totalItems;
}

// Избранное (независимое от пользователя)
function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    updateFavoriteButtonsGlobal();
}

function addToFavorites(productId) {
    let favorites = getFavorites();
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        saveFavorites(favorites);
        showNotification('❤️ Добавлено в избранное');
    }
}

function removeFromFavorites(productId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== productId);
    saveFavorites(favorites);
    showNotification('🗑️ Удалено из избранного');
}

function isInFavorites(productId) {
    return getFavorites().includes(productId);
}

function toggleFavorite(productId) {
    if (isInFavorites(productId)) {
        removeFromFavorites(productId);
    } else {
        addToFavorites(productId);
    }
}

function updateFavoritesCount() {
    const count = getFavorites().length;
    const favoritesCountElement = document.getElementById('favoritesCount');
    if (favoritesCountElement) favoritesCountElement.textContent = count;
}

function updateFavoriteButtonsGlobal() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (isInFavorites(id)) {
            btn.innerHTML = '❤️';
        } else {
            btn.innerHTML = '🤍';
        }
    });
}

// Уведомления
function showNotification(message) {
    let notif = document.getElementById('globalNotification');
    if (notif) notif.remove();
    notif = document.createElement('div');
    notif.id = 'globalNotification';
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

// Стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Делаем функции глобальными
window.getCart = getCart;
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.getFavorites = getFavorites;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.isInFavorites = isInFavorites;
window.toggleFavorite = toggleFavorite;
window.updateFavoritesCount = updateFavoritesCount;
window.showNotification = showNotification;