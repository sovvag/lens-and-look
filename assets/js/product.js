// === СКРИПТЫ ДЛЯ СТРАНИЦЫ ТОВАРА ===

// База товаров
const productDB = [
    { 
        id: 1, 
        name: "Acuvue Oasys 1-Day", 
        price: 2490, 
        description: "Ежедневные контактные линзы с высокой степенью увлажнения. Технология HydraLuxe для комфорта в течение всего дня. Подходят для чувствительных глаз.",
        category: "contacts", 
        image: "product1.jpg",
        brand: "Johnson & Johnson",
        material: "Силикон-гидрогель",
        wearing_period: "1 день",
        packaging: "30 линз",
        moisture: "Высокое"
    },
    { 
        id: 2, 
        name: "CooperVision Biofinity", 
        price: 3200, 
        description: "Двухнедельные силикон-гидрогелевые линзы с технологией Aquaform. Обеспечивают высокую кислородопроницаемость и естественное увлажнение.",
        category: "contacts", 
        image: "product2.jpg",
        brand: "CooperVision",
        material: "Силикон-гидрогель (Comfilcon A)",
        wearing_period: "2 недели",
        packaging: "6 линз",
        moisture: "Естественное"
    },
    { 
        id: 3, 
        name: "Air Optix Night & Day", 
        price: 3850, 
        description: "Линзы непрерывного ношения до 30 дней. Разрешены для сна в линзах. Высокая кислородопроницаемость.",
        category: "contacts", 
        image: "product3.jpg",
        brand: "Alcon",
        material: "Силикон-гидрогель (Lotrafilcon A)",
        wearing_period: "до 30 дней непрерывно",
        packaging: "3 линзы",
        moisture: "Среднее"
    },
    { 
        id: 4, 
        name: "Dailies Total 1", 
        price: 2990, 
        description: "Однодневные линзы с водоградиентным профилем. Мягкие как вода, обеспечивают исключительный комфорт.",
        category: "contacts", 
        image: "product4.jpg",
        brand: "Alcon",
        material: "Делефилькон А",
        wearing_period: "1 день",
        packaging: "30 линз",
        moisture: "Максимальное"
    },
    { 
        id: 5, 
        name: "Очки Ray-Ban RX", 
        price: 12900, 
        description: "Классические оправы с диоптриями. Стильный дизайн и качественные линзы от Ray-Ban.",
        category: "glasses", 
        image: "product5.jpg",
        brand: "Ray-Ban",
        material: "Ацетат/Металл",
        lens_type: "С диоптриями",
        coating: "Антибликовое",
        protection: "UV400"
    },
    { 
        id: 6, 
        name: "MyDay daily disposable", 
        price: 1890, 
        description: "Ежедневные линзы для активного образа жизни. Тонкие, дышащие, не ощущаются на глазах.",
        category: "contacts", 
        image: "product6.jpg",
        brand: "CooperVision",
        material: "Силикон-гидрогель (Stenfilcon A)",
        wearing_period: "1 день",
        packaging: "30 линз",
        moisture: "Высокое"
    },
    { 
        id: 7, 
        name: "Очки Oakley", 
        price: 15500, 
        description: "Спортивные очки с защитой от ультрафиолета. Идеально для активного отдыха и спорта.",
        category: "sunglasses", 
        image: "product7.jpg",
        brand: "Oakley",
        material: "O-Matter",
        lens_type: "Поляризационные",
        protection: "UV400",
        sport: "Бег, велоспорт"
    },
    { 
        id: 8, 
        name: "Clariti 1-Day", 
        price: 2190, 
        description: "Однодневные силикон-гидрогелевые линзы. Сочетание комфорта и доступной цены.",
        category: "contacts", 
        image: "product8.jpg",
        brand: "CooperVision",
        material: "Силикон-гидрогель (Somofilcon A)",
        wearing_period: "1 день",
        packaging: "30 линз",
        moisture: "Хорошее"
    },
    { 
        id: 9, 
        name: "Ночные линзы Paragon CRT", 
        price: 25000, 
        description: "Ортокератологические линзы для коррекции зрения во время сна. Утром видите отлично без линз и очков.",
        category: "ortho", 
        image: "product9.jpg",
        brand: "Paragon",
        material: "Paragon HDS 100",
        wearing_period: "Ночное ношение",
        packaging: "2 линзы",
        effect: "Временная коррекция"
    },
    { 
        id: 10, 
        name: "Очки Polaroid", 
        price: 8900, 
        description: "Поляризационные очки для вождения. Убирают блики, повышают контрастность.",
        category: "sunglasses", 
        image: "product10.jpg",
        brand: "Polaroid",
        material: "Пластик",
        lens_type: "Поляризационные",
        protection: "UV400",
        feature: "Для вождения"
    }
];

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

function renderProduct() {
    const productId = getProductIdFromUrl();
    const product = productDB.find(p => p.id === productId);
    const container = document.getElementById('productContent');
    
    if (!product) {
        container.innerHTML = `
            <div class="not-found">
                <h1>404</h1>
                <h2>Товар не найден</h2>
                <p>К сожалению, такого товара нет в нашем каталоге.</p>
                <a href="catalog.html" class="btn back-link">Вернуться в каталог</a>
            </div>
        `;
        return;
    }
    
    const reviews = [
        { author: "Анна", rating: 5, text: "Отличные линзы! Очень комфортные, глаза не сохнут весь день.", date: "15.03.2024" },
        { author: "Михаил", rating: 5, text: "Беру не первый раз. Качество отличное, доставка быстрая.", date: "10.03.2024" },
        { author: "Екатерина", rating: 4, text: "Хорошие линзы, но цена кусается. В остальном всё отлично.", date: "05.03.2024" }
    ];
    
    let characteristicsHtml = '';
    if (product.brand) characteristicsHtml += `<div class="char-item"><span class="char-label">Бренд:</span><span class="char-value">${product.brand}</span></div>`;
    if (product.material) characteristicsHtml += `<div class="char-item"><span class="char-label">Материал:</span><span class="char-value">${product.material}</span></div>`;
    if (product.wearing_period) characteristicsHtml += `<div class="char-item"><span class="char-label">Срок ношения:</span><span class="char-value">${product.wearing_period}</span></div>`;
    if (product.packaging) characteristicsHtml += `<div class="char-item"><span class="char-label">Упаковка:</span><span class="char-value">${product.packaging}</span></div>`;
    if (product.moisture) characteristicsHtml += `<div class="char-item"><span class="char-label">Увлажнение:</span><span class="char-value">${product.moisture}</span></div>`;
    if (product.lens_type) characteristicsHtml += `<div class="char-item"><span class="char-label">Тип линз:</span><span class="char-value">${product.lens_type}</span></div>`;
    if (product.coating) characteristicsHtml += `<div class="char-item"><span class="char-label">Покрытие:</span><span class="char-value">${product.coating}</span></div>`;
    if (product.protection) characteristicsHtml += `<div class="char-item"><span class="char-label">Защита:</span><span class="char-value">${product.protection}</span></div>`;
    if (product.sport) characteristicsHtml += `<div class="char-item"><span class="char-label">Для спорта:</span><span class="char-value">${product.sport}</span></div>`;
    if (product.effect) characteristicsHtml += `<div class="char-item"><span class="char-label">Эффект:</span><span class="char-value">${product.effect}</span></div>`;
    if (product.feature) characteristicsHtml += `<div class="char-item"><span class="char-label">Особенность:</span><span class="char-value">${product.feature}</span></div>`;
    
    let reviewsHtml = '';
    reviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        reviewsHtml += `
            <div class="review-card">
                <div class="review-author">${review.author}</div>
                <div class="review-rating">${stars}</div>
                <div class="review-text">${review.text}</div>
                <div class="review-date">${review.date}</div>
            </div>
        `;
    });
    
    const isFav = typeof window.isInFavorites === 'function' ? window.isInFavorites(product.id) : false;
    
    container.innerHTML = `
        <div class="product-container">
            <div class="product-image">
                <img src="assets/images/${product.image}" onerror="this.src='https://placehold.co/400x400/5F9EF0/white?text=${product.name}'">
            </div>
            <div class="product-info">
                <h1 class="product-title">${product.name}</h1>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                <div class="product-description">${product.description}</div>
                
                <div class="product-characteristics">
                    <h3>📋 Характеристики</h3>
                    ${characteristicsHtml || '<p>Информация уточняется</p>'}
                </div>
                
                <div class="quantity-selector">
                    <button class="quantity-btn" id="decreaseQty">-</button>
                    <input type="number" id="quantityInput" class="quantity-input" value="1" min="1" max="10">
                    <button class="quantity-btn" id="increaseQty">+</button>
                </div>
                
                <div class="button-group">
                    <button class="btn add-to-cart-btn" id="addToCartBtn">🛒 Добавить в корзину</button>
                    <button class="fav-btn" id="favBtn">${isFav ? '❤️' : '🤍'}</button>
                </div>
            </div>
        </div>
        
        <div class="reviews-section">
            <h2 class="reviews-title">⭐ Отзывы покупателей</h2>
            ${reviewsHtml}
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn" onclick="alert('Функция добавления отзывов в разработке')">Оставить отзыв</button>
            </div>
        </div>
    `;
    
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantityInput');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const favBtn = document.getElementById('favBtn');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value);
            if (val > 1) quantityInput.value = val - 1;
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value);
            if (val < 10) quantityInput.value = val + 1;
        });
    }
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (typeof window.addToCart === 'function') {
                window.addToCart(product.id, quantity);
            }
        });
    }
    
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            if (typeof window.toggleFavorite === 'function') {
                window.toggleFavorite(product.id);
                const isNowFav = typeof window.isInFavorites === 'function' ? window.isInFavorites(product.id) : false;
                favBtn.innerHTML = isNowFav ? '❤️' : '🤍';
            }
        });
    }
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
    renderProduct();
    updateCounters();
});