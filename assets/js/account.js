// === СКРИПТЫ ДЛЯ ЛИЧНОГО КАБИНЕТА ===

// База товаров (для отображения избранного)
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

// === РАБОТА С ПОЛЬЗОВАТЕЛЯМИ ===

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

function registerUser(email, password, fullName, phone) {
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
        favorites: []
    };
    
    users.push(newUser);
    saveUsers(users);
    return { success: true };
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        return { success: true };
    }
    return { success: false, error: 'Неверный email или пароль' };
}

function logoutUser() {
    setCurrentUser(null);
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
    renderAccountPage();
}

function updateUserProfile(fullName, phone) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].full_name = fullName;
        users[userIndex].phone = phone;
        saveUsers(users);
        setCurrentUser(users[userIndex]);
    }
}

// === РАБОТА С ИЗБРАННЫМ ДЛЯ ПОЛЬЗОВАТЕЛЯ ===

function getUserFavorites() {
    const user = getCurrentUser();
    if (!user) return [];
    return user.favorites || [];
}

function addToUserFavorites(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    let favorites = user.favorites || [];
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        user.favorites = favorites;
        
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].favorites = favorites;
            saveUsers(users);
            setCurrentUser(user);
        }
        return true;
    }
    return false;
}

function removeFromUserFavorites(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    let favorites = user.favorites || [];
    favorites = favorites.filter(id => id !== productId);
    user.favorites = favorites;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].favorites = favorites;
        saveUsers(users);
        setCurrentUser(user);
    }
    return true;
}

function isInUserFavorites(productId) {
    const favorites = getUserFavorites();
    return favorites.includes(productId);
}

// === ОТРИСОВКА ===

function renderLoginRegister() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h2>Вход</h2>
                <div id="loginError" class="error-message" style="display: none;"></div>
                <form id="loginForm">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label>Пароль</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-full">Войти</button>
                </form>
            </div>
            <div class="auth-card">
                <h2>Регистрация</h2>
                <div id="registerError" class="error-message" style="display: none;"></div>
                <div id="registerSuccess" class="success-message" style="display: none;"></div>
                <form id="registerForm">
                    <div class="form-group">
                        <label>ФИО</label>
                        <input type="text" id="regFullName">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="regEmail" required>
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input type="tel" id="regPhone">
                    </div>
                    <div class="form-group">
                        <label>Пароль *</label>
                        <input type="password" id="regPassword" required>
                    </div>
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
                <div class="form-group">
                    <label>ФИО</label>
                    <input type="text" id="profileFullName" value="${escapeHtml(user.full_name || '')}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="profileEmail" value="${escapeHtml(user.email)}" disabled style="background: #F8F9FC;">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" id="profilePhone" value="${escapeHtml(user.phone || '')}">
                </div>
                <button type="submit" class="btn">Сохранить изменения</button>
            </form>
            <div id="profileMessage" style="margin-top: 15px;"></div>
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
                <div class="empty-state">
                    <p>У вас пока нет заказов</p>
                    <a href="catalog.html" class="btn" style="margin-top: 15px; display: inline-block;">Перейти в каталог</a>
                </div>
            </div>
        `;
    }
    
    let ordersHtml = '';
    orders.forEach(order => {
        ordersHtml += `
            <div class="order-card">
                <div class="order-header">
                    <span><strong>Заказ №${order.id}</strong></span>
                    <span class="order-status">${order.status || 'Оформлен'}</span>
                </div>
                <div class="order-header">
                    <span>📅 ${order.date}</span>
                    <span>💰 ${order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <p>Товаров: ${order.itemsCount} шт.</p>
            </div>
        `;
    });
    
    return `
        <div class="tab-content">
            <h2>📦 Мои заказы</h2>
            ${ordersHtml}
        </div>
    `;
}

function renderFavoritesTab() {
    const favorites = getUserFavorites();
    
    if (favorites.length === 0) {
        return `
            <div class="tab-content">
                <h2>❤️ Избранное</h2>
                <div class="empty-state">
                    <p>Нет избранных товаров</p>
                    <a href="catalog.html" class="btn" style="margin-top: 15px; display: inline-block;">Перейти в каталог</a>
                </div>
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
                    <img src="assets/images/${product.image}" onclick="window.location.href='product.html?id=${product.id}'" onerror="this.src='https://placehold.co/300x200/5F9EF0/white?text=${product.name}'">
                    <div class="info">
                        <h3 onclick="window.location.href='product.html?id=${product.id}'">${product.name}</h3>
                        <div class="price">${product.price.toLocaleString('ru-RU')} ₽</div>
                        <button class="btn" style="width: 100%; margin-top: 10px;" onclick="window.addToCart(${product.id}, 1); event.stopPropagation();">🛒 В корзину</button>
                    </div>
                </div>
            `;
        }
    });
    productsHtml += '</div>';
    
    return `
        <div class="tab-content">
            <h2>❤️ Избранное</h2>
            ${productsHtml}
        </div>
    `;
}

function removeFromFavoritesInAccount(productId) {
    removeFromUserFavorites(productId);
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
    showTab('favorites');
}

function renderAccount() {
    const user = getCurrentUser();
    return `
        <div class="account-container">
            <div class="sidebar">
                <div class="user-avatar">
                    <div class="avatar-icon">👤</div>
                    <h3>${escapeHtml(user.full_name || 'Пользователь')}</h3>
                    <p>${escapeHtml(user.email)}</p>
                </div>
                <hr style="margin: 20px 0;">
                <nav class="sidebar-nav">
                    <a href="#" onclick="showTab('profile'); return false;" class="active" data-tab="profile">📋 Профиль</a>
                    <a href="#" onclick="showTab('orders'); return false;" data-tab="orders">📦 Мои заказы</a>
                    <a href="#" onclick="showTab('favorites'); return false;" data-tab="favorites">❤️ Избранное</a>
                    <a href="#" onclick="logout(); return false;" class="logout-btn">🚪 Выйти</a>
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
        case 'profile':
            content = renderProfileTab();
            break;
        case 'orders':
            content = renderOrdersTab();
            break;
        case 'favorites':
            content = renderFavoritesTab();
            break;
        default:
            content = renderProfileTab();
    }
    
    document.getElementById('tabContent').innerHTML = content;
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        }
    });
    
    if (tabName === 'profile') {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullName = document.getElementById('profileFullName').value;
                const phone = document.getElementById('profilePhone').value;
                updateUserProfile(fullName, phone);
                const msg = document.getElementById('profileMessage');
                msg.innerHTML = '<div class="success-message">✅ Профиль обновлён</div>';
                setTimeout(() => msg.innerHTML = '', 3000);
                renderAccountPage();
            });
        }
    }
}

function renderAccountPage() {
    const currentUser = getCurrentUser();
    const container = document.getElementById('accountContent');
    
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
                    if (typeof window.updateFavoritesCount === 'function') {
                        window.updateFavoritesCount();
                    }
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
                    const successDiv = document.getElementById('registerSuccess');
                    successDiv.textContent = '✅ Регистрация успешна! Теперь вы можете войти.';
                    successDiv.style.display = 'block';
                    document.getElementById('registerForm').reset();
                    setTimeout(() => successDiv.style.display = 'none', 3000);
                } else {
                    const errorDiv = document.getElementById('registerError');
                    errorDiv.textContent = result.error;
                    errorDiv.style.display = 'block';
                    setTimeout(() => errorDiv.style.display = 'none', 3000);
                }
            });
        }
    }
    
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
}

function logout() {
    logoutUser();
    renderAccountPage();
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

document.addEventListener('DOMContentLoaded', () => {
    renderAccountPage();
});

window.showTab = showTab;
window.logout = logout;
window.removeFromFavoritesInAccount = removeFromFavoritesInAccount;