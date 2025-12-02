CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, nombre, descripcion, created_at) VALUES
  (1, 'Administrador', 'Acceso completo al sistema', '2025-10-23 07:26:49'),
  (2, 'Cliente', 'Puede gestionar sus documentos', '2025-10-23 07:26:49');

CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol_id BIGINT NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (id, nombre, email, password, rol_id, activo, created_at, updated_at) VALUES
  (1, 'Administrador Sistema', 'admin@insolvencia.com', '$2a$10$v4J0ukHy2.Q3VXBOWpbm4O/vcL4BUUO8uGR.O9qvBvqqYFi/wGWty', 1, TRUE, '2025-10-23 07:26:49', '2025-10-23 20:10:13');

CREATE TABLE documentos (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
  nombre_archivo VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
