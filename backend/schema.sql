-- Base de datos Huellitas Huancaínas
CREATE DATABASE IF NOT EXISTS huellitas_huancainas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huellitas_huancainas;

-- 1. Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(150) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    rol ENUM('adoptante', 'rescatista', 'admin') NOT NULL DEFAULT 'adoptante',
    estado_rescatista ENUM('ninguno', 'pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'ninguno',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Animales
CREATE TABLE IF NOT EXISTS animales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie ENUM('Perro', 'Gato') NOT NULL,
    edad VARCHAR(50) NOT NULL,
    tamano ENUM('Pequeño', 'Mediano', 'Grande') NOT NULL,
    caracter VARCHAR(255) NOT NULL,
    vacunado BOOLEAN NOT NULL DEFAULT FALSE,
    esterilizado BOOLEAN NOT NULL DEFAULT FALSE,
    foto VARCHAR(255) NOT NULL,
    estado ENUM('disponible', 'en_proceso', 'adoptado') NOT NULL DEFAULT 'disponible',
    rescatista_id INT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_animales_rescatista FOREIGN KEY (rescatista_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 3. Tabla Solicitudes de Adopción
CREATE TABLE IF NOT EXISTS solicitudes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    adoptante_id INT NOT NULL,
    mensaje TEXT NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_solicitud_animal FOREIGN KEY (animal_id) REFERENCES animales(id) ON DELETE CASCADE,
    CONSTRAINT fk_solicitud_adoptante FOREIGN KEY (adoptante_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. Tabla Denuncias
CREATE TABLE IF NOT EXISTS denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    contacto VARCHAR(100) NULL,
    estado ENUM('pendiente', 'en_revision', 'atendida') NOT NULL DEFAULT 'pendiente',
    fecha_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla Seguimientos
CREATE TABLE IF NOT EXISTS seguimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    comentarios TEXT NOT NULL,
    foto_avance VARCHAR(255) NULL,
    fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seguimiento_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
);

-- Datos semilla de usuarios iniciales
INSERT IGNORE INTO usuarios (id, dni, nombres, telefono, correo, clave, rol)
VALUES 
(1, '12345678', 'Albergue Huancayo', '954123456', 'albergue@huellitas.org', '12345678', 'rescatista'),
(2, '87654321', 'Juan Pérez', '987654321', 'juan@gmail.com', '12345678', 'adoptante');

-- Datos semilla de animales iniciales
INSERT IGNORE INTO animales (id, nombre, especie, edad, tamano, caracter, vacunado, esterilizado, foto, estado, rescatista_id)
VALUES
(1, 'Toby', 'Perro', '2 años', 'Mediano', 'Juguetón y cariñoso', TRUE, TRUE, '/fotos-animales/toby.jpg', 'disponible', 1),
(2, 'Luna', 'Gato', '1 año', 'Pequeño', 'Tranquila y sociable', TRUE, TRUE, '/fotos-animales/luna-gato.jpg', 'disponible', 1),
(3, 'Rocky', 'Perro', '4 años', 'Grande', 'Protector y leal', TRUE, FALSE, '/fotos-animales/rocky-perro.jpg', 'disponible', 1),
(4, 'Mía', 'Gato', '6 meses', 'Pequeño', 'Curiosa y activa', FALSE, FALSE, '/fotos-animales/mia-gato.jpg', 'disponible', 1),
(5, 'Canela', 'Perro', '3 años', 'Pequeño', 'Dócil con niños', TRUE, TRUE, '/fotos-animales/canela.jpg', 'disponible', 1),
(6, 'Max', 'Perro', '5 años', 'Grande', 'Tranquilo, ideal para casa con patio', TRUE, TRUE, '/fotos-animales/max.jpg', 'disponible', 1);
