// ============================================================
// 1. АНИМАЦИЯ ПРИ СКРОЛЛЕ
// ============================================================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .hero, .category-card, .advantage-card, .banner-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ============================================================
// 2. ГЛОБАЛЬНЫЕ ФУНКЦИИ (Корзина + Избранное + Уведомления)
// ============================================================

// ---------- Уведомления ----------
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

// ---------- Корзина ----------
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

// ---------- Избранное ----------
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
            btn.style.background = '#dc3545';
            btn.style.color = 'white';
        } else {
            btn.innerHTML = '🤍';
            btn.style.background = '#E1E8F0';
            btn.style.color = '#333';
        }
    });
}

// ---------- Вспомогательные ----------
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function updateCounters() {
    updateCartCount();
    updateFavoritesCount();
}

// ---------- Стили для анимации ----------
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
window.escapeHtml = escapeHtml;
window.updateCounters = updateCounters;

// ============================================================
// 3. БАЗЫ ТОВАРОВ (для разных страниц)
// ============================================================

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

const productsForAccount = [
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

const productDB = [
    { id: 1, name: "Acuvue Oasys 1-Day", price: 2490, description: "Ежедневные контактные линзы с высокой степенью увлажнения. Технология HydraLuxe для комфорта в течение всего дня. Подходят для чувствительных глаз.", category: "contacts", image: "product1.jpg", brand: "Johnson & Johnson", material: "Силикон-гидрогель", wearing_period: "1 день", packaging: "30 линз", moisture: "Высокое" },
    { id: 2, name: "CooperVision Biofinity", price: 3200, description: "Двухнедельные силикон-гидрогелевые линзы с технологией Aquaform. Обеспечивают высокую кислородопроницаемость и естественное увлажнение.", category: "contacts", image: "product2.jpg", brand: "CooperVision", material: "Силикон-гидрогель (Comfilcon A)", wearing_period: "2 недели", packaging: "6 линз", moisture: "Естественное" },
    { id: 3, name: "Air Optix Night & Day", price: 3850, description: "Линзы непрерывного ношения до 30 дней. Разрешены для сна в линзах. Высокая кислородопроницаемость.", category: "contacts", image: "product3.jpg", brand: "Alcon", material: "Силикон-гидрогель (Lotrafilcon A)", wearing_period: "до 30 дней непрерывно", packaging: "3 линзы", moisture: "Среднее" },
    { id: 4, name: "Dailies Total 1", price: 2990, description: "Однодневные линзы с водоградиентным профилем. Мягкие как вода, обеспечивают исключительный комфорт.", category: "contacts", image: "product4.jpg", brand: "Alcon", material: "Делефилькон А", wearing_period: "1 день", packaging: "30 линз", moisture: "Максимальное" },
    { id: 5, name: "Очки Ray-Ban RX", price: 12900, description: "Классические оправы с диоптриями. Стильный дизайн и качественные линзы от Ray-Ban.", category: "glasses", image: "product5.jpg", brand: "Ray-Ban", material: "Ацетат/Металл", lens_type: "С диоптриями", coating: "Антибликовое", protection: "UV400" },
    { id: 6, name: "MyDay daily disposable", price: 1890, description: "Ежедневные линзы для активного образа жизни. Тонкие, дышащие, не ощущаются на глазах.", category: "contacts", image: "product6.jpg", brand: "CooperVision", material: "Силикон-гидрогель (Stenfilcon A)", wearing_period: "1 день", packaging: "30 линз", moisture: "Высокое" },
    { id: 7, name: "Очки Oakley", price: 15500, description: "Спортивные очки с защитой от ультрафиолета. Идеально для активного отдыха и спорта.", category: "sunglasses", image: "product7.jpg", brand: "Oakley", material: "O-Matter", lens_type: "Поляризационные", protection: "UV400", sport: "Бег, велоспорт" },
    { id: 8, name: "Clariti 1-Day", price: 2190, description: "Однодневные силикон-гидрогелевые линзы. Сочетание комфорта и доступной цены.", category: "contacts", image: "product8.jpg", brand: "CooperVision", material: "Силикон-гидрогель (Somofilcon A)", wearing_period: "1 день", packaging: "30 линз", moisture: "Хорошее" },
    { id: 9, name: "Ночные линзы Paragon CRT", price: 25000, description: "Ортокератологические линзы для коррекции зрения во время сна. Утром видите отлично без линз и очков.", category: "ortho", image: "product9.jpg", brand: "Paragon", material: "Paragon HDS 100", wearing_period: "Ночное ношение", packaging: "2 линзы", effect: "Временная коррекция" },
    { id: 10, name: "Очки Polaroid", price: 8900, description: "Поляризационные очки для вождения. Убирают блики, повышают контрастность.", category: "sunglasses", image: "product10.jpg", brand: "Polaroid", material: "Пластик", lens_type: "Поляризационные", protection: "UV400", feature: "Для вождения" }
];

// ============================================================
// 4. ПОЛЬЗОВАТЕЛИ И АДМИН
// ============================================================

// Админские данные
const ADMIN_CREDENTIALS = {
    email: 'admin@lenslook.ru',
    password: '123456'
};

function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function isAdmin(user) {
    return user && user.email === ADMIN_CREDENTIALS.email;
}

function loginUser(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
            id: 'admin',
            email: ADMIN_CREDENTIALS.email,
            full_name: 'Администратор',
            phone: '',
            isAdmin: true,
            orders: [],
            favorites: []
        };
        setCurrentUser(adminUser);
        return { success: true, isAdmin: true };
    }
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        setCurrentUser(user);
        return { success: true, isAdmin: false };
    }
    return { success: false, error: 'Неверный email или пароль' };
}

function registerUser(email, password, fullName, phone) {
    if (email === ADMIN_CREDENTIALS.email) {
        return { success: false, error: 'Этот email занят' };
    }
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
    }
    const newUser = {
        id: Date.now(),
        email: email,
        password: password,
        full_name: fullName,
        phone: phone || '',
        orders: [],
        favorites: [],
        isAdmin: false
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true };
}

function logoutUser() {
    setCurrentUser(null);
    updateFavoritesCount();
    if (typeof renderAccountPage === 'function') renderAccountPage();
}

function updateUserProfile(fullName, phone) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.isAdmin) return;
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].full_name = fullName;
        users[userIndex].phone = phone;
        saveUsers(users);
        setCurrentUser(users[userIndex]);
    }
}

function getUserFavorites() {
    const user = getCurrentUser();
    if (!user) return [];
    return user.favorites || [];
}

// ============================================================
// 5. ФУНКЦИИ ДЛЯ СТРАНИЦ
// ============================================================

// ---------- Каталог ----------
function displayProducts(category = "all") {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    let filteredProducts = productsForCatalog;
    if (category !== "all") {
        filteredProducts = productsForCatalog.filter(p => p.category === category);
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="no-products">Товары не найдены</div>';
        return;
    }
    
    let html = '';
    filteredProducts.forEach(product => {
        const isFav = isInFavorites(product.id);
        html += `
            <div class="product-card" data-id="${product.id}">
                <img src="assets/images/${product.image}" onclick="window.location.href='product.html?id=${product.id}'" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                <div class="product-info">
                    <h3 onclick="window.location.href='product.html?id=${product.id}'">${product.name}</h3>
                    <p style="color: #5B6E8C; font-size: 14px;">${product.description.substring(0, 80)}...</p>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <div class="card-buttons">
                        <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="fav-btn" data-id="${product.id}" onclick="event.stopPropagation(); toggleFavorite(${product.id})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
}

// ---------- Корзина ----------
function renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Ваша корзина пуста</h2>
                <p>Добавьте товары из каталога, чтобы оформить заказ</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        updateCartCount();
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
                <div class="price">${item.price.toLocaleString('ru-RU')} ₽</div>
                <div class="item-quantity" style="display: flex; gap: 10px; align-items: center;">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-remove">
                    <button class="remove-btn" onclick="removeFromCartItem(${item.id})">🗑️</button>
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
                <h3>Итого</h3>
                <div><span>Товары (${itemsWithDetails.reduce((s, i) => s + i.quantity, 0)} шт.):</span> <strong>${subtotal.toLocaleString('ru-RU')} ₽</strong></div>
                <div><span>Доставка:</span> <span>от 200 ₽</span></div>
                <hr>
                <div><span>К оплате:</span> <span style="color: #5F9EF0; font-size: 24px;">${total.toLocaleString('ru-RU')} ₽</span></div>
                <button class="btn" onclick="checkout()">Оформить заказ</button>
                <button onclick="clearCart()" style="width: 100%; margin-top: 10px; padding: 12px; background: none; border: 1px solid #dc3545; border-radius: 40px; color: #dc3545; cursor: pointer;">Очистить корзину</button>
                <a href="catalog.html">← Продолжить покупки</a>
            </div>
        </div>
    `;
    updateCartCount();
}

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

function removeFromCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showNotification('🗑️ Товар удалён из корзины');
    renderCart();
}

function clearCart() {
    if (confirm('Очистить всю корзину?')) {
        saveCart([]);
        renderCart();
        showNotification('🧹 Корзина очищена');
    }
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('🛒 Корзина пуста!');
        return;
    }
    const user = getCurrentUser();
    if (!user) {
        showNotification('⚠️ Для оформления заказа необходимо войти в аккаунт');
        window.location.href = 'account.html';
        return;
    }
    if (typeof createOrder === 'function') {
        createOrder();
    } else {
        alert('Функция оформления заказа временно недоступна');
    }
}

// ---------- Избранное ----------
function renderFavoritesPage() {
    const container = document.getElementById('favoritesContent');
    if (!container) return;
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <div class="empty-icon">❤️</div>
                <h2>Избранное пусто</h2>
                <p>Добавляйте товары в избранное, чтобы не потерять их</p>
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
                            <button class="btn btn-small" onclick="addToCart(${product.id}, 1); event.stopPropagation();">🛒 В корзину</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    productsHtml += '</div>';
    container.innerHTML = productsHtml;
}

function removeFromFavoritesPage(productId) {
    removeFromFavorites(productId);
    renderFavoritesPage();
    updateFavoritesCount();
}

// ---------- Поиск ----------
function renderSearchResults() {
    const container = document.getElementById('searchContent');
    if (!container) return;
    const query = getSearchQuery();
    const searchInput = document.getElementById('searchInput');
    if (searchInput && query) searchInput.value = query;
    
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
                <a href="catalog.html" class="btn">Посмотреть весь каталог</a>
            </div>
        `;
        return;
    }
    
    let productsHtml = '';
    results.forEach(product => {
        const isFav = isInFavorites(product.id);
        productsHtml += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="assets/images/${product.image}" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                <div class="product-info">
                    <h3>${escapeHtml(product.name)}</h3>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <div class="card-buttons">
                        <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="fav-btn" data-id="${product.id}" onclick="event.stopPropagation(); toggleFavorite(${product.id})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = `
        <h1 class="search-header">🔍 Результаты поиска: <span class="search-query">"${escapeHtml(query)}"</span></h1>
        <p>Найдено товаров: ${results.length}</p>
        <div class="products-grid">${productsHtml}</div>
    `;
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
}

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

// ---------- Страница товара ----------
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

function renderProduct() {
    const container = document.getElementById('productContent');
    if (!container) return;
    const productId = getProductIdFromUrl();
    const product = productDB.find(p => p.id === productId);
    
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
    
    const isFav = isInFavorites(product.id);
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
            addToCart(product.id, quantity);
        });
    }
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            toggleFavorite(product.id);
            favBtn.innerHTML = isInFavorites(product.id) ? '❤️' : '🤍';
        });
    }
}

// ============================================================
// 6. ЛИЧНЫЙ КАБИНЕТ
// ============================================================

function renderLoginRegister() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Вход
                </h2>
                <div id="loginError" class="error-message" style="display: none;"></div>
                <form id="loginForm">
                    <div class="form-group"><label>Email</label><input type="email" id="loginEmail" placeholder="admin@lenslook.ru" required></div>
                    <div class="form-group"><label>Пароль</label><input type="password" id="loginPassword" placeholder="123456" required></div>
                    <div class="admin-hint">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <polyline points="9 12 11 14 15 10"/>
                        </svg>
                        <span>Для входа как администратор: <strong>admin@lenslook.ru</strong> / пароль <strong>123456</strong></span>
                    </div>
                    <button type="submit" class="btn btn-full">Войти</button>
                </form>
            </div>
            <div class="auth-card">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Регистрация
                </h2>
                <div id="registerError" class="error-message" style="display: none;"></div>
                <div id="registerSuccess" class="success-message" style="display: none;"></div>
                <form id="registerForm">
                    <div class="form-group"><label>ФИО</label><input type="text" id="regFullName" placeholder="Иванов Иван Иванович"></div>
                    <div class="form-group"><label>Email *</label><input type="email" id="regEmail" placeholder="user@example.com" required></div>
                    <div class="form-group"><label>Телефон</label><input type="tel" id="regPhone" placeholder="+7 (999) 123-45-67"></div>
                    <div class="form-group"><label>Пароль *</label><input type="password" id="regPassword" placeholder="Минимум 6 символов" required></div>
                    <button type="submit" class="btn btn-full">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    `;
}

function renderProfileTab() {
    const user = getCurrentUser();
    return `
        <div class="tab-content">
            <h2>📋 Профиль</h2>
            <form id="profileForm">
                <div class="form-group"><label>ФИО</label><input type="text" id="profileFullName" value="${escapeHtml(user.full_name || '')}"></div>
                <div class="form-group"><label>Email</label><input type="email" id="profileEmail" value="${escapeHtml(user.email)}" disabled style="background: #F8F9FC;"></div>
                <div class="form-group"><label>Телефон</label><input type="tel" id="profilePhone" value="${escapeHtml(user.phone || '')}"></div>
                <button type="submit" class="btn">Сохранить изменения</button>
            </form>
            <div id="profileMessage"></div>
        </div>
    `;
}

function renderOrdersTab() {
    const user = getCurrentUser();
    const orders = user.orders || [];
    if (orders.length === 0) {
        return `
            <div class="tab-content">
                <h2>📦 Мои заказы</h2>
                <div class="empty-state"><p>У вас пока нет заказов</p><a href="catalog.html" class="btn">Перейти в каталог</a></div>
            </div>
        `;
    }
    let ordersHtml = '';
    orders.forEach(order => {
        ordersHtml += `
            <div class="order-card">
                <div class="order-header"><span><strong>Заказ №${order.id}</strong></span><span class="order-status">${order.status || 'Оформлен'}</span></div>
                <div class="order-header"><span>📅 ${order.date}</span><span>💰 ${order.total.toLocaleString('ru-RU')} ₽</span></div>
                <p>Товаров: ${order.itemsCount} шт.</p>
            </div>
        `;
    });
    return `<div class="tab-content"><h2>📦 Мои заказы</h2>${ordersHtml}</div>`;
}

function renderFavoritesTab() {
    const favorites = getUserFavorites();
    if (favorites.length === 0) {
        return `
            <div class="tab-content">
                <h2>❤️ Избранное</h2>
                <div class="empty-state"><p>Нет избранных товаров</p><a href="catalog.html" class="btn">Перейти в каталог</a></div>
            </div>
        `;
    }
    let productsHtml = '<div class="favorites-grid">';
    favorites.forEach(id => {
        const product = productsForAccount.find(p => p.id === id);
        if (product) {
            productsHtml += `
                <div class="favorite-card">
                    <button class="remove-fav" onclick="removeFromFavoritesInAccount(${product.id})">✖</button>
                    <img src="assets/images/${product.image}" onclick="window.location.href='product.html?id=${product.id}'">
                    <div class="info">
                        <h3 onclick="window.location.href='product.html?id=${product.id}'">${product.name}</h3>
                        <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                        <button class="btn" style="width: 100%; margin-top: 10px;" onclick="addToCart(${product.id}, 1); event.stopPropagation();">🛒 В корзину</button>
                    </div>
                </div>
            `;
        }
    });
    productsHtml += '</div>';
    return `<div class="tab-content"><h2>❤️ Избранное</h2>${productsHtml}</div>`;
}

function removeFromFavoritesInAccount(productId) {
    removeFromFavorites(productId);
    updateFavoritesCount();
    showTab('favorites');
}

function renderAccount() {
    const user = getCurrentUser();
    const isAdminUser = user && user.isAdmin;
    return `
        <div class="account-container">
            <div class="sidebar">
                <div class="user-avatar">
                    <div class="avatar-icon">${isAdminUser ? '🛡️' : '👤'}</div>
                    <h3>${escapeHtml(user.full_name || 'Пользователь')}${isAdminUser ? ' <span style="color: #5F9EF0; font-size: 14px;">(Админ)</span>' : ''}</h3>
                    <p>${escapeHtml(user.email)}</p>
                </div>
                <hr style="margin: 20px 0;">
                <nav class="sidebar-nav">
                    <a href="#" onclick="showTab('profile'); return false;" class="active" data-tab="profile">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Профиль
                    </a>
                    <a href="#" onclick="showTab('orders'); return false;" data-tab="orders">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        Мои заказы
                    </a>
                    <a href="#" onclick="showTab('favorites'); return false;" data-tab="favorites">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        Избранное
                    </a>
                    ${isAdminUser ? `<a href="admin.html" data-tab="admin" style="background: #5F9EF0; color: white; border-radius: 12px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Админ-панель
                    </a>` : ''}
                    <a href="#" onclick="logout(); return false;" class="logout-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Выйти
                    </a>
                </nav>
            </div>
            <div id="tabContent"></div>
        </div>
    `;
}

function showTab(tabName) {
    const user = getCurrentUser();
    if (!user) return;
    let content = '';
    switch(tabName) {
        case 'profile': content = renderProfileTab(); break;
        case 'orders': content = renderOrdersTab(); break;
        case 'favorites': content = renderFavoritesTab(); break;
        case 'admin': content = renderAdminPanel(); break;
        default: content = renderProfileTab();
    }
    document.getElementById('tabContent').innerHTML = content;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) link.classList.add('active');
    });
    if (tabName === 'profile') {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullName = document.getElementById('profileFullName').value;
                const phone = document.getElementById('profilePhone').value;
                updateUserProfile(fullName, phone);
                document.getElementById('profileMessage').innerHTML = '<div class="success-message">✅ Профиль обновлён</div>';
                setTimeout(() => document.getElementById('profileMessage').innerHTML = '', 3000);
                renderAccountPage();
            });
        }
    }
    if (tabName === 'admin') {
        setTimeout(() => {
            if (typeof renderAdminOrders === 'function') renderAdminOrders();
        }, 100);
    }
}

function renderAccountPage() {
    const currentUser = getCurrentUser();
    const container = document.getElementById('accountContent');
    if (!container) return;
    if (currentUser) {
        container.innerHTML = renderAccount();
        showTab('profile');
    } else {
        container.innerHTML = renderLoginRegister();
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const result = loginUser(email, password);
                if (result.success) {
                    updateFavoritesCount();
                    renderAccountPage();
                } else {
                    const errorDiv = document.getElementById('loginError');
                    errorDiv.textContent = result.error;
                    errorDiv.style.display = 'block';
                }
            });
        }
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullName = document.getElementById('regFullName').value;
                const email = document.getElementById('regEmail').value;
                const phone = document.getElementById('regPhone').value;
                const password = document.getElementById('regPassword').value;
                const result = registerUser(email, password, fullName, phone);
                if (result.success) {
                    document.getElementById('registerSuccess').textContent = '✅ Регистрация успешна! Теперь вы можете войти.';
                    document.getElementById('registerSuccess').style.display = 'block';
                    document.getElementById('registerForm').reset();
                    setTimeout(() => document.getElementById('registerSuccess').style.display = 'none', 3000);
                } else {
                    const errorDiv = document.getElementById('registerError');
                    errorDiv.textContent = result.error;
                    errorDiv.style.display = 'block';
                    setTimeout(() => errorDiv.style.display = 'none', 3000);
                }
            });
        }
    }
    updateCartCount();
    updateFavoritesCount();
}

function logout() {
    logoutUser();
    renderAccountPage();
}

// ============================================================
// 7. ОТРИСОВКА ТОВАРОВ В FLEXBOX
// ============================================================

function renderFlexProducts(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    products.forEach(product => {
        const isFav = isInFavorites(product.id);
        html += `
            <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="./assets/images/${product.image}" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
                        <button class="fav-btn" data-id="${product.id}" onclick="event.stopPropagation(); toggleFavorite(${product.id})">${isFav ? '❤️' : '🤍'}</button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    container.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
}

// ============================================================
// 8. ФИЛЬТРЫ В КАТАЛОГЕ
// ============================================================

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

// ============================================================
// 9. СИСТЕМА ЗАКАЗОВ
// ============================================================

function createOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('🛒 Корзина пуста!');
        return false;
    }
    const user = getCurrentUser();
    if (!user) {
        showNotification('⚠️ Для оформления заказа необходимо войти в аккаунт');
        window.location.href = 'account.html';
        return false;
    }
    const itemsWithDetails = cart.map(cartItem => {
        const product = productsForCart.find(p => p.id === cartItem.id);
        return { ...cartItem, ...product };
    }).filter(item => item.name);
    if (itemsWithDetails.length === 0) {
        showNotification('⚠️ Ошибка: товары не найдены');
        return false;
    }
    let subtotal = 0;
    let itemsCount = 0;
    itemsWithDetails.forEach(item => {
        subtotal += item.price * item.quantity;
        itemsCount += item.quantity;
    });
    const delivery = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + delivery;
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        items: itemsWithDetails.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        subtotal: subtotal,
        delivery: delivery,
        total: total,
        itemsCount: itemsCount,
        status: 'new',
        statusLabel: 'Новый',
        userEmail: user.email,
        userName: user.full_name || 'Пользователь'
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    if (user && !user.isAdmin) {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].orders = users[userIndex].orders || [];
            users[userIndex].orders.unshift({ id: order.id, date: order.date, total: order.total, itemsCount: order.itemsCount, status: order.statusLabel });
            saveUsers(users);
        }
    }
    saveCart([]);
    renderCart();
    showNotification(`✅ Заказ №${order.id} успешно оформлен!`);
    return true;
}

function getOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        const statusMap = { 'new': 'Новый', 'processing': 'В обработке', 'shipped': 'Отправлен', 'delivered': 'Доставлен', 'completed': 'Завершён', 'cancelled': 'Отменён' };
        orders[orderIndex].status = newStatus;
        orders[orderIndex].statusLabel = statusMap[newStatus] || newStatus;
        saveOrders(orders);
        renderAdminOrders();
        showNotification(`✅ Статус заказа №${orderId} обновлён`);
    }
}

function deleteOrder(orderId) {
    if (confirm(`Удалить заказ №${orderId}?`)) {
        let orders = getOrders();
        orders = orders.filter(o => o.id !== orderId);
        saveOrders(orders);
        renderAdminOrders();
        showNotification(`🗑️ Заказ №${orderId} удалён`);
    }
}

// ============================================================
// 10. АДМИН-ПАНЕЛЬ
// ============================================================

function renderAdminPanel() {
    const users = getUsers();
    const orders = getOrders();
    const cart = getCart();
    const favorites = getFavorites();
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalFavorites = favorites.length;
    const totalProducts = productsForCart.length;
    const statusStats = {
        new: orders.filter(o => o.status === 'new').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    return `
        <div class="tab-content admin-panel">
            <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 10px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Админ-панель</h2>
            <div class="admin-stats">
                <div class="stat-card"><div class="stat-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="stat-info"><span class="stat-number">${totalUsers}</span><span class="stat-label">Пользователей</span></div></div>
                <div class="stat-card"><div class="stat-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><div class="stat-info"><span class="stat-number">${totalOrders}</span><span class="stat-label">Заказов</span></div></div>
                <div class="stat-card"><div class="stat-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div><div class="stat-info"><span class="stat-number">${totalRevenue.toLocaleString('ru-RU')} ₽</span><span class="stat-label">Выручка</span></div></div>
                <div class="stat-card"><div class="stat-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div><div class="stat-info"><span class="stat-number">${totalItemsInCart}</span><span class="stat-label">Товаров в корзинах</span></div></div>
                <div class="stat-card"><div class="stat-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div><div class="stat-info"><span class="stat-number">${totalFavorites}</span><span class="stat-label">В избранном</span></div></div>
                <div class="stat-card"><div class="stat-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5F9EF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="stat-info"><span class="stat-number">${totalProducts}</span><span class="stat-label">Товаров в каталоге</span></div></div>
            </div>
            <div class="admin-statuses">
                <div class="status-item"><span class="status-dot status-new"></span>Новые: ${statusStats.new}</div>
                <div class="status-item"><span class="status-dot status-processing"></span>В обработке: ${statusStats.processing}</div>
                <div class="status-item"><span class="status-dot status-shipped"></span>Отправлены: ${statusStats.shipped}</div>
                <div class="status-item"><span class="status-dot status-delivered"></span>Доставлены: ${statusStats.delivered}</div>
                <div class="status-item"><span class="status-dot status-completed"></span>Завершены: ${statusStats.completed}</div>
                <div class="status-item"><span class="status-dot status-cancelled"></span>Отменены: ${statusStats.cancelled}</div>
            </div>
            <div class="admin-section">
                <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2A3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>Управление заказами</h3>
                <div id="adminOrdersList"></div>
            </div>
            <div class="admin-section">
                <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2A3E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Пользователи (${totalUsers})</h3>
                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead><tr><th>ID</th><th>Email</th><th>ФИО</th><th>Телефон</th><th>Заказов</th></tr></thead>
                        <tbody>${users.map(user => `<tr><td>${user.id}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.full_name || '-')}</td><td>${escapeHtml(user.phone || '-')}</td><td>${(user.orders || []).length}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderAdminOrders() {
    const orders = getOrders();
    const container = document.getElementById('adminOrdersList');
    if (!container) return;
    if (orders.length === 0) {
        container.innerHTML = '<p style="color: #5B6E8C; text-align: center; padding: 20px;">Заказов пока нет</p>';
        return;
    }
    let html = '';
    orders.forEach(order => {
        html += `
            <div class="admin-order-card">
                <div class="order-header-info">
                    <div><strong>Заказ №${order.id}</strong><span class="order-date">${order.date} ${order.time || ''}</span></div>
                    <div class="order-total">${order.total.toLocaleString('ru-RU')} ₽</div>
                </div>
                <div class="order-body-info">
                    <div class="order-user">👤 ${escapeHtml(order.userName || order.userEmail || 'Гость')}</div>
                    <div class="order-items-count">📦 ${order.itemsCount || order.items?.length || 0} товаров</div>
                    <div class="order-status-select">
                        <select onchange="updateOrderStatus(${order.id}, this.value)" class="status-select status-${order.status || 'new'}">
                            <option value="new" ${order.status === 'new' ? 'selected' : ''}>🆕 Новый</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>🔄 В обработке</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>📦 Отправлен</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>✅ Доставлен</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>✔️ Завершён</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ Отменён</option>
                        </select>
                        <button onclick="deleteOrder(${order.id})" class="btn-delete-order"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
                    </div>
                </div>
                <div class="order-items">${(order.items || []).map(item => `<span class="order-item">${escapeHtml(item.name)} × ${item.quantity}</span>`).join(', ') || 'Товары не указаны'}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ============================================================
// 11. ЗАГРУЗКА СТРАНИЦЫ (DOMContentLoaded)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('newProductsFlex')) {
        const newProducts = productsForIndex.filter(p => p.category === 'new');
        const popularProducts = productsForIndex.filter(p => p.category === 'popular');
        renderFlexProducts('newProductsFlex', newProducts);
        renderFlexProducts('popularProductsFlex', popularProducts);
    }
    if (document.getElementById('productsGrid')) {
        displayProducts('all');
        initFilters();
    }
    if (document.getElementById('cartContent')) renderCart();
    if (document.getElementById('favoritesContent')) renderFavoritesPage();
    if (document.getElementById('searchContent')) renderSearchResults();
    if (document.getElementById('productContent')) renderProduct();
    if (document.getElementById('accountContent')) renderAccountPage();
    updateCounters();
    window.addEventListener('storage', function(e) {
        if (e.key === 'favorites') {
            updateFavoritesCount();
            updateFavoriteButtonsGlobal();
            if (document.getElementById('favoritesContent')) renderFavoritesPage();
            if (document.getElementById('productsGrid')) displayProducts(document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all');
            if (document.getElementById('searchContent')) renderSearchResults();
        }
        if (e.key === 'cart') {
            updateCartCount();
            if (document.getElementById('cartContent')) renderCart();
        }
    });
});

// ============================================================
// 12. ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML
// ============================================================

window.renderFlexProducts = renderFlexProducts;
window.displayProducts = displayProducts;
window.renderCart = renderCart;
window.renderFavoritesPage = renderFavoritesPage;
window.renderSearchResults = renderSearchResults;
window.renderProduct = renderProduct;
window.renderAccountPage = renderAccountPage;
window.showTab = showTab;
window.logout = logout;
window.removeFromFavoritesPage = removeFromFavoritesPage;
window.removeFromFavoritesInAccount = removeFromFavoritesInAccount;
window.updateQuantity = updateQuantity;
window.removeFromCartItem = removeFromCartItem;
window.clearCart = clearCart;
window.checkout = checkout;
window.initFilters = initFilters;
window.toggleFavorite = toggleFavorite;
window.addToCart = addToCart;
window.updateFavoritesCount = updateFavoritesCount;
window.updateCartCount = updateCartCount;
window.escapeHtml = escapeHtml;
window.isInFavorites = isInFavorites;
window.getFavorites = getFavorites;
window.getCart = getCart;
window.showNotification = showNotification;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;
window.renderAdminOrders = renderAdminOrders;