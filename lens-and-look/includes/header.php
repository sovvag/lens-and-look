<?php
// Получаем количество товаров в корзине
$session_id = session_id();
$cart_count = 0;
if (isset($pdo)) {
    try {
        $stmt = $pdo->prepare("SELECT SUM(quantity) as total FROM cart WHERE session_id = ?");
        $stmt->execute([$session_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $cart_count = $result['total'] ?? 0;
    } catch(PDOException $e) {
        $cart_count = 0;
    }
}

// Определяем корневой путь для CSS и JS
$root_path = '';
if (strpos($_SERVER['REQUEST_URI'], '/includes/') !== false) {
    $root_path = '../';
} elseif (basename($_SERVER['SCRIPT_NAME']) != 'index.php' && 
          strpos($_SERVER['REQUEST_URI'], '/') !== false && 
          $_SERVER['REQUEST_URI'] != '/' && 
          !in_array(basename($_SERVER['SCRIPT_NAME']), ['index.php', 'catalog.php', 'product.php', 'delivery.php', 'payment.php', 'returns.php', 'cart.php', 'account.php', 'search.php'])) {
    $root_path = '/';
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lens & Look - Интернет-магазин оптики</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/lens-and-look/assets/css/style.css">
    <style>
        /* Дублируем основные стили на случай, если CSS не загрузился */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary: #5F9EF0;
            --primary-dark: #3A7BD5;
            --secondary: #F0F4FF;
            --text: #1E2A3E;
            --text-light: #5B6E8C;
            --bg: #FFFFFF;
            --gray-light: #F8F9FC;
            --shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: var(--text);
            background: var(--bg);
            line-height: 1.5;
        }
        
        h1, h2, h3, h4, .logo, .nav-link, .btn {
            font-family: 'Manrope', sans-serif;
            font-weight: 600;
        }
        
        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }
        
        header {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .header-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-decoration: none;
        }
        
        .search-bar {
            flex: 1;
            max-width: 400px;
            display: flex;
            gap: 10px;
        }
        
        .search-bar input {
            flex: 1;
            padding: 12px 20px;
            border: 2px solid var(--gray-light);
            border-radius: 40px;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .search-bar input:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
            align-items: center;
        }
        
        .nav-links a {
            text-decoration: none;
            color: var(--text);
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .nav-links a:hover {
            color: var(--primary);
        }
        
        .cart-icon {
            position: relative;
            font-size: 24px;
        }
        
        .cart-count {
            position: absolute;
            top: -8px;
            right: -12px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 40px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn:hover {
            background: var(--primary-dark);
            transform: scale(1.02);
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        
        .product-card {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }
        
        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(95,158,240,0.15);
        }
        
        .product-card img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            transition: transform 0.5s;
        }
        
        .product-card:hover img {
            transform: scale(1.05);
        }
        
        .product-info {
            padding: 20px;
        }
        
        .price {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
            margin: 10px 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .header-inner {
                flex-direction: column;
            }
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
        }
    </style>
</head>
<body>
<header>
    <div class="container header-inner">
        <a href="index.php" class="logo">👓 Lens & Look</a>
        <div class="search-bar">
            <form action="search.php" method="GET" style="display: flex; gap: 10px; width: 100%;">
                <input type="text" name="q" placeholder="Поиск линз, очков..." required style="width: 100%;">
                <button type="submit" style="background: #5F9EF0; border: none; border-radius: 40px; padding: 0 20px; color: white; cursor: pointer;">🔍</button>
            </form>
        </div>
        <div class="nav-links">
            <a href="catalog.php">Каталог</a>
            <a href="delivery.php">Доставка</a>
            <a href="payment.php">Оплата</a>
            <a href="returns.php">Возврат</a>
            <a href="account.php">Личный кабинет</a>
            <a href="cart.php" class="cart-icon">
                🛒 
                <span class="cart-count"><?= $cart_count ?></span>
            </a>
        </div>
    </div>
</header>