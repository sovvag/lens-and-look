<?php
include 'includes/db.php';
include 'includes/functions.php';
session_start();

// Простая имитация входа (для демонстрации)
$is_logged_in = isset($_SESSION['user_id']);
$user_data = null;

if ($is_logged_in) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user_data = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Обработка регистрации
$registration_error = '';
$registration_success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    
    if ($email && $password) {
        try {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (email, password, full_name, phone) VALUES (?, ?, ?, ?)");
            $stmt->execute([$email, $hashed_password, $full_name, $phone]);
            $registration_success = "Регистрация успешна! Теперь вы можете войти.";
        } catch(PDOException $e) {
            $registration_error = "Ошибка: email уже существует";
        }
    } else {
        $registration_error = "Заполните обязательные поля";
    }
}

// Обработка входа
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        header('Location: account.php');
        exit;
    } else {
        $login_error = "Неверный email или пароль";
    }
}

// Выход
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: account.php');
    exit;
}

include 'includes/header.php';
?>

<main class="container">
    <h1 style="margin: 40px 0;">👤 Личный кабинет</h1>
    
    <?php if ($is_logged_in): ?>
        <!-- Личный кабинет для авторизованных пользователей -->
        <div style="display: grid; grid-template-columns: 280px 1fr; gap: 40px;">
            <!-- Боковое меню -->
            <div style="background: #F8F9FC; padding: 30px; border-radius: 24px; height: fit-content;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 64px;">👤</div>
                    <h3><?= htmlspecialchars($user_data['full_name'] ?? $_SESSION['user_name'] ?? 'Пользователь') ?></h3>
                    <p style="color: #5B6E8C;"><?= htmlspecialchars($user_data['email'] ?? '') ?></p>
                </div>
                <hr style="margin: 20px 0;">
                <nav style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="#" onclick="showTab('profile')" style="text-decoration: none; color: #1E2A3E; padding: 10px; border-radius: 12px;" class="tab-link active">📋 Профиль</a>
                    <a href="#" onclick="showTab('orders')" style="text-decoration: none; color: #1E2A3E; padding: 10px; border-radius: 12px;" class="tab-link">📦 Мои заказы</a>
                    <a href="#" onclick="showTab('favorites')" style="text-decoration: none; color: #1E2A3E; padding: 10px; border-radius: 12px;" class="tab-link">❤️ Избранное</a>
                    <a href="?logout=1" style="text-decoration: none; color: #dc3545; padding: 10px; border-radius: 12px; margin-top: 20px;">🚪 Выйти</a>
                </nav>
            </div>
            
            <!-- Контент -->
            <div>
                <div id="profile-tab" class="tab-content">
                    <div style="background: white; padding: 30px; border-radius: 24px; box-shadow: var(--shadow);">
                        <h2>Профиль</h2>
                        <form method="POST" style="margin-top: 20px;">
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px;">ФИО</label>
                                <input type="text" value="<?= htmlspecialchars($user_data['full_name'] ?? '') ?>" 
                                       style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                            </div>
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px;">Телефон</label>
                                <input type="tel" value="<?= htmlspecialchars($user_data['phone'] ?? '') ?>" 
                                       style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                            </div>
                            <button class="btn" disabled style="background: #E1E8F0; cursor: not-allowed;">Редактирование (в разработке)</button>
                        </form>
                    </div>
                </div>
                
                <div id="orders-tab" class="tab-content" style="display: none;">
                    <div style="background: white; padding: 30px; border-radius: 24px; box-shadow: var(--shadow);">
                        <h2>История заказов</h2>
                        <p style="color: #5B6E8C; text-align: center; padding: 40px;">У вас пока нет заказов</p>
                    </div>
                </div>
                
                <div id="favorites-tab" class="tab-content" style="display: none;">
                    <div style="background: white; padding: 30px; border-radius: 24px; box-shadow: var(--shadow);">
                        <h2>Избранное</h2>
                        <p style="color: #5B6E8C; text-align: center; padding: 40px;">Нет избранных товаров</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        function showTab(tabName) {
            // Скрыть все вкладки
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            // Показать выбранную
            document.getElementById(`${tabName}-tab`).style.display = 'block';
            
            // Обновить активную ссылку
            document.querySelectorAll('.tab-link').forEach(link => {
                link.classList.remove('active');
                link.style.background = 'transparent';
            });
            event.target.classList.add('active');
            event.target.style.background = '#5F9EF0';
            event.target.style.color = 'white';
        }
        </script>
        
    <?php else: ?>
        <!-- Формы регистрации и входа -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <!-- Форма входа -->
            <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: var(--shadow);">
                <h2 style="margin-bottom: 20px;">Вход</h2>
                <?php if ($login_error): ?>
                    <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; margin-bottom: 20px;"><?= $login_error ?></div>
                <?php endif; ?>
                <form method="POST">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Email</label>
                        <input type="email" name="email" required style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Пароль</label>
                        <input type="password" name="password" required style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                    </div>
                    <button type="submit" name="login" class="btn" style="width: 100%;">Войти</button>
                </form>
            </div>
            
            <!-- Форма регистрации -->
            <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: var(--shadow);">
                <h2 style="margin-bottom: 20px;">Регистрация</h2>
                <?php if ($registration_error): ?>
                    <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; margin-bottom: 20px;"><?= $registration_error ?></div>
                <?php endif; ?>
                <?php if ($registration_success): ?>
                    <div style="background: #d4edda; color: #155724; padding: 12px; border-radius: 8px; margin-bottom: 20px;"><?= $registration_success ?></div>
                <?php endif; ?>
                <form method="POST">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">ФИО</label>
                        <input type="text" name="full_name" style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Email *</label>
                        <input type="email" name="email" required style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Телефон</label>
                        <input type="tel" name="phone" style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Пароль *</label>
                        <input type="password" name="password" required style="width: 100%; padding: 12px; border: 2px solid #E1E8F0; border-radius: 12px;">
                    </div>
                    <button type="submit" name="register" class="btn" style="width: 100%;">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    <?php endif; ?>
</main>

<?php include 'includes/footer.php'; ?>