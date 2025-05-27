-- ####################################################
--  MySQL Schema
-- ####################################################

CREATE TABLE users (
  id              BIGINT       AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(100) NOT NULL UNIQUE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  status          ENUM('active','inactive','suspended','deleted')
                   NOT NULL DEFAULT 'active',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL
                   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL
                 DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT
);

CREATE TABLE role_permissions (
  role_id       BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  PRIMARY KEY(role_id, permission_id),
  FOREIGN KEY(role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
  FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY(user_id, role_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
  id         BIGINT   AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT   NOT NULL,
  token      VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
  id          BIGINT   AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT   NOT NULL,
  token       VARCHAR(255) NOT NULL UNIQUE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at  DATETIME NOT NULL,
  used        BOOLEAN  NOT NULL DEFAULT FALSE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE components (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  metadata    JSON,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL
               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE component_types (
  id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
  component_id BIGINT       NOT NULL,
  name         VARCHAR(100) NOT NULL,
  description  TEXT,
  metadata     JSON,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL
                DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(component_id) REFERENCES components(id) ON DELETE CASCADE
);

CREATE TABLE templates (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  content     JSON,
  created_by  BIGINT,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL
               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE config (
  `key`       VARCHAR(100) PRIMARY KEY,
  `value`     TEXT,
  description TEXT,
  updated_at  DATETIME     NOT NULL
               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE feature_flags (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  flag_key    VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  enabled     BOOLEAN      NOT NULL DEFAULT FALSE,
  settings    JSON,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL
               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT,
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(100),
  entity_id   VARCHAR(100),
  timestamp   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata    JSON,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE metrics (
  id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  value        DOUBLE,
  metadata     JSON,
  recorded_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  condition   TEXT         NOT NULL,
  enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
  settings    JSON,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL
               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE teams (
  id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL
               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE team_users (
  team_id     BIGINT NOT NULL,
  user_id     BIGINT NOT NULL,
  role_in_team VARCHAR(100),
  PRIMARY KEY(team_id, user_id),
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
