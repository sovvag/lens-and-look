// === СКРИПТЫ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ===

// База товаров
const productsForIndex = [
    { id: 1, name: "Acuvue Oasys 1-Day", price: 2490, image: "product1.jpg", category: "new" },
    { id: 2, name: "CooperVision Biofinity", price: 3200, image: "product2.jpg", category: "new" },
    { id: 3, name: "Air Optix Night & Day", price: 3850, image: "product3.jpg", category: "new" },
    { id: 4, name: "Dailies Total 1", price: 2990, image: "product4.jpg", category: "new" },
    { id: 5, name: "Очки Ray-Ban RX", price: 12900, image: "product5.jpg", category: "popular" },
    { id: 6, name: "MyDay daily disposable", price: 1890, image: "product6.jpg", category: "popular" },
    { id: 7, name: "Очки Oakley", price: 15500, image: "product7.jpg", category: "popular" },
    { id: 8, name: "Clariti 1-Day", price: 2190, image: "product8.jpg", category: "popular" }
];

// Функция для отображения товаров
function renderProducts(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '<div class="products-grid">';
    products.forEach(product => {
        const isFav = window.isInFavorites ? window.isInFavorites(product.id) : false;
        html += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="./assets/images/${product.image}" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="fav-btn" data-id="${product.id}" onclick="event.stopPropagation(); window.toggleFavorite(${product.id})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
    
    // Навешиваем обработчики на кнопки "В корзину"
    document.querySelectorAll(`#${containerId} .add-to-cart`).forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-id'));
            if (typeof window.addToCart === 'function') {
                window.addToCart(productId, 1);
            }
        });
    });
}

// Загрузка страницы
document.addEventListener('DOMContentLoaded', () => {
    // Новые поступления
    const newProducts = productsForIndex.filter(p => p.category === 'new');
    // Популярные
    const popularProducts = productsForIndex.filter(p => p.category === 'popular');
    
    renderProducts('newProductsGrid', newProducts);
    renderProducts('popularProductsGrid', popularProducts);
});