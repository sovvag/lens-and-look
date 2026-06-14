// === СКРИПТЫ ДЛЯ СТРАНИЦЫ ИЗБРАННОГО ===

// База товаров
const favoritesProducts = [
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

// Функция для отображения избранного
function renderFavoritesPage() {
    const favorites = typeof window.getFavorites === 'function' ? window.getFavorites() : [];
    const container = document.getElementById('favoritesContent');

    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <div class="empty-icon">❤️</div>
                <h2 style="margin-bottom: 15px;">Избранное пусто</h2>
                <p style="color: #5B6E8C; margin-bottom: 30px;">Добавляйте товары в избранное, чтобы не потерять их</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    let productsHtml = '<div class="favorites-grid">';
    favorites.forEach(id => {
        const product = favoritesProducts.find(p => p.id === id);
        if (product) {
            productsHtml += `
                <div class="favorite-card">
                    <button class="remove-fav" onclick="removeFromFavoritesPage(${product.id})">✖</button>
                    <img src="assets/images/${product.image}" onclick="window.location.href='product.html?id=${product.id}'" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                    <div class="favorite-info">
                        <h3 onclick="window.location.href='product.html?id=${product.id}'">${product.name}</h3>
                        <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                        <div class="card-buttons">
                            <button class="btn btn-small" onclick="addToCartFromFavorites(${product.id}, 1); event.stopPropagation();">🛒 В корзину</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    productsHtml += '</div>';
    container.innerHTML = productsHtml;
}

// Удаление из избранного
function removeFromFavoritesPage(productId) {
    if (typeof window.removeFromFavorites === 'function') {
        window.removeFromFavorites(productId);
        renderFavoritesPage();
        if (typeof window.updateFavoritesCount === 'function') {
            window.updateFavoritesCount();
        }
    }
}

// Добавление в корзину со страницы избранного
function addToCartFromFavorites(productId, quantity) {
    if (typeof window.addToCart === 'function') {
        window.addToCart(productId, quantity);
    }
}

// Обновление счётчиков
function updateCounters() {
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
}

// Слушаем изменения в localStorage (для синхронизации)
window.addEventListener('storage', (e) => {
    if (e.key === 'favorites') {
        renderFavoritesPage();
        updateCounters();
    }
    if (e.key === 'cart') {
        updateCounters();
    }
});

// Загрузка страницы
document.addEventListener('DOMContentLoaded', () => {
    renderFavoritesPage();
    updateCounters();
});

window.renderFavoritesPage = renderFavoritesPage;
window.removeFromFavoritesPage = removeFromFavoritesPage;
window.addToCartFromFavorites = addToCartFromFavorites;