// === СКРИПТЫ ДЛЯ КАТАЛОГА ===

// База данных товаров
const productsForCatalog = [
    { id: 1, name: "Acuvue Oasys 1-Day", price: 2490, description: "Ежедневные контактные линзы с высокой степенью увлажнения", category: "contacts", image: "product1.jpg" },
    { id: 2, name: "CooperVision Biofinity", price: 3200, description: "Двухнедельные линзы с технологией Aquaform", category: "contacts", image: "product2.jpg" },
    { id: 3, name: "Air Optix Night & Day", price: 3850, description: "Линзы непрерывного ношения до 30 дней", category: "contacts", image: "product3.jpg" },
    { id: 4, name: "Dailies Total 1", price: 2990, description: "Однодневные линзы с водоградиентным профилем", category: "contacts", image: "product4.jpg" },
    { id: 5, name: "Очки Ray-Ban RX", price: 12900, description: "Классические оправы с диоптриями", category: "glasses", image: "product5.jpg" },
    { id: 6, name: "MyDay daily disposable", price: 1890, description: "Ежедневные линзы для активного образа жизни", category: "contacts", image: "product6.jpg" },
    { id: 7, name: "Очки Oakley", price: 15500, description: "Спортивные очки с защитой от ультрафиолета", category: "sunglasses", image: "product7.jpg" },
    { id: 8, name: "Clariti 1-Day", price: 2190, description: "Однодневные силикон-гидрогелевые линзы", category: "contacts", image: "product8.jpg" },
    { id: 9, name: "Очки имиджевые для компьютера прозрачные", price: 25000, description: "Имиджевые очки для работы за компьютером", category: "glasses", image: "product9.jpg" },
    { id: 10, name: "Очки Polaroid", price: 8900, description: "Поляризационные очки для вождения", category: "sunglasses", image: "product10.jpg" },
    { id: 11, name: "Солнцезащитные очки Tom Ford", price: 21900, description: "Премиум оправа с защитой UV400", category: "sunglasses", image: "product11.jpg" },
    { id: 12, name: "Очки Kitten", price: 28000, description: "Культовые очки для настоящих офисных сирен", category: "glasses", image: "product12.jpg" }
];

// Функция для отображения товаров
function displayProducts(category = "all") {
    const grid = document.getElementById('productsGrid');
    
    let filteredProducts = productsForCatalog;
    if (category !== "all") {
        filteredProducts = productsForCatalog.filter(p => p.category === category);
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="no-products">😕 Товары не найдены</div>';
        return;
    }
    
    let html = '';
    filteredProducts.forEach(product => {
        const isFav = typeof window.isInFavorites === 'function' ? window.isInFavorites(product.id) : false;
        html += `
            <div class="product-card" data-id="${product.id}">
                <img src="assets/images/${product.image}" onclick="window.location.href='product.html?id=${product.id}'" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                <div class="product-info">
                    <h3 onclick="window.location.href='product.html?id=${product.id}'">${product.name}</h3>
                    <p style="color: #5B6E8C; font-size: 14px;">${product.description.substring(0, 80)}...</p>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <div class="card-buttons">
                        <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="fav-btn" data-id="${product.id}" onclick="event.stopPropagation(); window.toggleFavorite(${product.id})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
    
    // Навешиваем обработчики на кнопки "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-id'));
            if (typeof window.addToCart === 'function') {
                window.addToCart(productId, 1);
            }
        });
    });
}

// Фильтрация при клике на кнопки
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            displayProducts(category);
        });
    });
}

// Обновление кнопок избранного (при синхронизации)
function updateFavoriteButtons() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (typeof window.isInFavorites === 'function' && window.isInFavorites(id)) {
            btn.innerHTML = '❤️';
        } else {
            btn.innerHTML = '🤍';
        }
    });
}

// Загружаем всё при старте
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
    initFilters();
    
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
});

// Слушаем изменения в избранном (для обновления кнопок)
window.addEventListener('storage', (e) => {
    if (e.key === 'favorites' || e.key === 'currentUser') {
        updateFavoriteButtons();
        if (typeof window.updateFavoritesCount === 'function') {
            window.updateFavoritesCount();
        }
    }
});

window.displayProducts = displayProducts;
window.updateFavoriteButtons = updateFavoriteButtons;