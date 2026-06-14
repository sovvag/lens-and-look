// === СКРИПТЫ ДЛЯ СТРАНИЦЫ ОПЛАТЫ ===

document.addEventListener('DOMContentLoaded', () => {
    // Обновляем счётчик корзины
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    // Обновляем счётчик избранного
    if (typeof window.updateFavoritesCount === 'function') {
        window.updateFavoritesCount();
    }
});