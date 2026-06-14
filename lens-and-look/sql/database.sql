CREATE DATABASE IF NOT EXISTS lens_look;
USE lens_look;

-- Таблица категорий
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    parent_id INT DEFAULT NULL,
    slug VARCHAR(100)
);

-- Таблица товаров
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    image VARCHAR(255),
    category_id INT,
    is_new BOOLEAN DEFAULT 0,
    is_popular BOOLEAN DEFAULT 0,
    stock INT DEFAULT 10,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    full_name VARCHAR(150),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица корзины (сессия или пользователь)
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    session_id VARCHAR(255),
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Таблица заказов
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица элементов заказа
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2)
);

-- Вставка категорий
INSERT INTO categories (name, parent_id, slug) VALUES
('Очки', NULL, 'glasses'),
('Контактные линзы', NULL, 'contacts'),
('Ортокератологические линзы', NULL, 'ortho-lenses'),
('Склеральные линзы', NULL, 'scleral-lenses');

-- Вставка товаров (пример)
INSERT INTO products (name, description, price, image, category_id, is_new, is_popular) VALUES
('Очки для зрения "Элегант"', 'Лёгкие, прочные, с антибликовым покрытием', 4990.00, 'glasses1.jpg', 1, 1, 1),
('Солнцезащитные очки "Полярикс"', '100% UV защита, стильный дизайн', 3590.00, 'glasses2.jpg', 1, 0, 1),
('Контактные линзы "AirSoft"', 'Дышащие, увлажнённые, 30 дней', 1290.00, 'contacts1.jpg', 2, 1, 1),
('Ночные линзы "Ortho-K Pro"', 'Коррекция зрения во сне', 15990.00, 'ortho1.jpg', 3, 0, 1),
('Склеральные линзы "ScleraFit"', 'Для сложных случаев кератоконуса', 19990.00, 'sclera1.jpg', 4, 1, 0);