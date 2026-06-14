// === СКРИПТЫ ДЛЯ СТРАНИЦЫ ПОИСКА ===

// База товаров
const searchProductsDB = [
    { id: 1, name: "Acuvue Oasys 1-Day", price: 2490, description: "Ежедневные контактные линзы с высокой степенью увлажнения", category: "contacts", image: "product1.jpg" },
    { id: 2, name: "CooperVision Biofinity", price: 3200, description: "Двухнедельные силикон-гидрогелевые линзы", category: "contacts", image: "product2.jpg" },
    { id: 3, name: "Air Optix Night & Day", price: 3850, description: "Линзы непрерывного ношения до 30 дней", category: "contacts", image: "product3.jpg" },
    { id: 4, name: "Dailies Total 1", price: 2990, description: "Однодневные линзы с водоградиентным профилем", category: "contacts", image: "product4.jpg" },
    { id: 5, name: "Очки Ray-Ban RX", price: 12900, description: "Классические оправы с диоптриями", category: "glasses", image: "product5.jpg" },
    { id: 6, name: "MyDay daily disposable", price: 1890, description: "Ежедневные линзы для активного образа жизни", category: "contacts", image: "product6.jpg" },
    { id: 7, name: "Очки Oakley", price: 15500, description: "Спортивные очки с защитой от ультрафиолета", category: "sunglasses", image: "product7.jpg" },
    { id: 8, name: "Clariti 1-Day", price: 2190, description: "Однодневные силикон-гидрогелевые линзы", category: "contacts", image: "product8.jpg" },
    { id: 9, name: "Ночные линзы Paragon CRT", price: 25000, description: "Ортокератологические линзы для коррекции зрения во время сна", category: "ortho", image: "product9.jpg" },
    { id: 10, name: "Очки Polaroid", price: 8900, description: "Поляризационные очки для вождения", category: "sunglasses", image: "product10.jpg" },
    { id: 11, name: "Солнцезащитные очки Tom Ford", price: 21900, description: "Премиум оправа с защитой UV400", category: "sunglasses", image: "product11.jpg" },
    { id: 12, name: "Menicon Z Night", price: 28000, description: "Ночные ортокератологические линзы", category: "ortho", image: "product12.jpg" }
];

function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
}

function searchProducts(query) {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return searchProductsDB.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery)
    );
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderSearchResults() {
    const query = getSearchQuery();
    const container = document.getElementById('searchContent');
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput && query) {
        searchInput.value = query;
    }
    
    if (!query) {
        container.innerHTML = `
            <div class="no-results">
                <p>🔍 Введите поисковый запрос</p>
                <div class="search-again">
                    <form action="search.html" method="GET">
                        <input type="text" name="q" placeholder="Например: линзы, очки, Ray-Ban..." required>
                        <button type="submit" class="btn">Найти</button>
                    </form>
                </div>
            </div>
        `;
        return;
    }
    
    const results = searchProducts(query);
    
    if (results.length === 0) {
        container.innerHTML = `
            <h1 class="search-header">🔍 Результаты поиска: <span class="search-query">"${escapeHtml(query)}"</span></h1>
            <div class="no-results">
                <p>😕 Товары не найдены</p>
                <p style="font-size: 14px;">Проверьте написание или попробуйте другой запрос</p>
                <div class="search-again">
                    <form action="search.html" method="GET">
                        <input type="text" name="q" placeholder="Попробуйте другой запрос..." required>
                        <button type="submit" class="btn">Найти</button>
                    </form>
                </div>
                <a href="catalog.html" class="btn" style="margin-top: 20px; display: inline-block;">Посмотреть весь каталог</a>
            </div>
        `;
        return;
    }
    
    let productsHtml = '';
    results.forEach(product => {
        const isFav = typeof window.isInFavorites === 'function' ? window.isInFavorites(product.id) : false;
        productsHtml += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="assets/images/${product.image}" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                <div class="product-info">
                    <h3>${escapeHtml(product.name)}</h3>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <div class="card-buttons">
                        <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="fav-btn" data-id="${product.id}" onclick="event.stopPropagation(); window.toggleFavorite(${product.id})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <h1 class="search-header">🔍 Результаты поиска: <span class="search-query">"${escapeHtml(query)}"</span></h1>
        <p style="margin-bottom: 20px; color: #5B6E8C;">Найдено товаров: ${results.length}</p>
        <div class="products-grid">
            ${productsHtml}
        </div>
    `;
    
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

function updateCounters() {
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderSearchResults();
    updateCounters();
});