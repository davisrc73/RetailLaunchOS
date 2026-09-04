-- ==============================================================================
-- RetailLaunchOS - Esquema de Base de Dados Inicial
-- Gabinete Multimédia | Gestão de Aberturas de Lojas (Fnac / Darty)
-- ==============================================================================

-- 1. TABELA: ROLES (Perfis de Acesso e Permissões)
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA: USERS (Utilizadores do Sistema)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100) DEFAULT 'Gabinete Multimédia', -- Ex: Multimédia, IT, Obras, Operações
    status VARCHAR(30) DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. TABELA: PROJECTS (Lojas e Aberturas Fnac / Darty)
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ex: FNAC-CAS-2026, DARTY-PDN-2026
    name VARCHAR(150) NOT NULL,                 -- Ex: 'Fnac Cascais', 'Darty Parque das Nações'
    brand VARCHAR(50) NOT NULL,                 -- 'Fnac', 'Darty', 'Fnac Express'
    store_format VARCHAR(50) DEFAULT 'Standard',-- Flagship, Standard, Travel, Pop-up
    location VARCHAR(255) NOT NULL,             -- Centro Comercial ou Morada
    go_live_date DATE NOT NULL,                 -- Data prevista de inauguração
    target_completion_date DATE,                -- Data limite para entrega técnica multimédia
    daily_cost DECIMAL(12, 2) DEFAULT 0.00,     -- Custo operacional diário estimado
    total_budget DECIMAL(14, 2) DEFAULT 0.00,   -- Orçamento total alocado
    status VARCHAR(50) DEFAULT 'planeamento',   -- planeamento, em_curso, testes_signage, concluido, atrasado
    signage_status VARCHAR(50) DEFAULT 'pendente', -- pendente, configuracao, validacao, pronto
    playlist_version VARCHAR(50) DEFAULT 'v1.0.0-rc',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. TABELA: TASKS (Marcos e Tarefas por Departamento)
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    department VARCHAR(100) NOT NULL,           -- 'Multimédia & Telas', 'Redes & IT', 'Som & Iluminação'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium',      -- low, medium, high, critical
    status VARCHAR(50) DEFAULT 'pendente',      -- pendente, em_progresso, concluido, bloqueado
    due_date DATE,
    assigned_to INTEGER,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. TABELA: PROJECT_COSTS (Acompanhamento e Registo de Custos Diários)
CREATE TABLE IF NOT EXISTS project_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    cost_type VARCHAR(50) NOT NULL,             -- 'hardware_multimedia', 'licenciamento_telas', 'tecnico_externo', 'infraestrutura_rede', 'outro'
    amount DECIMAL(12, 2) NOT NULL,
    description VARCHAR(255),
    logged_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (logged_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS FREQUENTES
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_brand ON projects(brand);
CREATE INDEX IF NOT EXISTS idx_projects_go_live ON projects(go_live_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_dept ON tasks(department);
CREATE INDEX IF NOT EXISTS idx_costs_project ON project_costs(project_id);
CREATE INDEX IF NOT EXISTS idx_costs_entry_date ON project_costs(entry_date);

-- ==============================================================================
-- DADOS PILOTO / SEED INICIAIS
-- ==============================================================================

-- Perfis padrão
INSERT OR IGNORE INTO roles (id, name, description) VALUES 
(1, 'admin', 'Administrador de Sistema com acesso total'),
(2, 'multimedia_user', 'Técnico/Especialista do Gabinete Multimédia'),
(3, 'store_manager', 'Gestor de Abertura / Direção de Loja'),
(4, 'viewer', 'Acesso de consulta para Direção Executiva');

-- Utilizadores iniciais de teste
INSERT OR IGNORE INTO users (id, role_id, name, email, password_hash, department, status) VALUES
(1, 1, 'Administrador Multimédia', 'admin.multimedia@fnacdarty.pt', '$2b$10$demoHashedPassword999999999999999999999999999999999999999', 'Gabinete Multimédia', 'active'),
(2, 2, 'Técnico Digital Signage', 'signage.pilot@fnacdarty.pt', '$2b$10$demoHashedPassword999999999999999999999999999999999999999', 'Gabinete Multimédia', 'active');

-- Projetos Piloto
INSERT OR IGNORE INTO projects (id, code, name, brand, store_format, location, go_live_date, target_completion_date, daily_cost, total_budget, status, signage_status, playlist_version, created_by) VALUES
(1, 'FNAC-CAS-2026', 'Fnac Cascais', 'Fnac', 'Flagship', 'CascaiShopping, Piso 1, Loja 142', DATE('now', '+18 days'), DATE('now', '+14 days'), 485.50, 45000.00, 'em_curso', 'validacao', 'v2.4-cascais', 1),
(2, 'DARTY-PDN-2026', 'Darty Parque das Nações', 'Darty', 'Standard', 'Av. D. João II, Lisboa', DATE('now', '+42 days'), DATE('now', '+35 days'), 390.00, 32000.00, 'planeamento', 'configuracao', 'v1.1-darty-pt', 1),
(3, 'FNAC-BOA-2026', 'Fnac Porto Boavista', 'Fnac', 'Express', 'Avenida da Boavista, Porto', DATE('now', '+65 days'), DATE('now', '+58 days'), 260.00, 21500.00, 'planeamento', 'pendente', 'v1.0-porto', 1);

-- Tarefas exemplo para Fnac Cascais
INSERT OR IGNORE INTO tasks (id, project_id, department, title, description, priority, status, due_date, assigned_to) VALUES
(1, 1, 'Multimédia & Telas', 'Configuração de Video Wall de Entrada (4x4)', 'Calibração de painéis LED Samsung e sincronização de player BrightSign', 'critical', 'em_progresso', DATE('now', '+5 days'), 2),
(2, 1, 'Multimédia & Telas', 'Deploy da Playlist Institucional 4K', 'Carregamento dos conteúdos publicitários Fnac e campanhas de abertura', 'high', 'pendente', DATE('now', '+10 days'), 2),
(3, 1, 'Redes & IT', 'Certificação da VLAN Dedicada para Digital Signage', 'Garantir redundância e largura de banda mínima de 1 Gbps para streaming local', 'high', 'concluido', DATE('now', '-2 days'), 1);

-- Custos recentes de exemplo
INSERT OR IGNORE INTO project_costs (id, project_id, entry_date, cost_type, amount, description, logged_by) VALUES
(1, 1, DATE('now', '-3 days'), 'hardware_multimedia', 3450.00, 'Players BrightSign 4K e suportes de parede articulados', 1),
(2, 1, DATE('now', '-2 days'), 'tecnico_externo', 620.00, 'Diária de calibração acústica e vídeo', 1),
(3, 1, DATE('now', '-1 days'), 'licenciamento_telas', 485.50, 'Taxa diária de sincronização e streaming central', 2),
(4, 2, DATE('now', '-1 days'), 'licenciamento_telas', 390.00, 'Alocação inicial de infraestrutura cloud e players', 2);

-- ==============================================================================
-- FASE 4: DIGITAL SIGNAGE & CATÁLOGO DE PLAYLISTS
-- ==============================================================================

-- 6. TABELA: PLAYLISTS (Catálogo Central e Versionamento de Conteúdos)
CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,          -- Ex: PL-FNAC-GOLD-4K, PL-DARTY-PROMO
    name VARCHAR(150) NOT NULL,                 -- Ex: 'Fnac Flagship 4K - Campanha Inauguração'
    brand VARCHAR(50) NOT NULL,                 -- 'Fnac', 'Darty', 'Todas'
    version VARCHAR(50) NOT NULL,               -- Ex: 'v2.5-gold-cascais', 'v1.1-darty-pt'
    resolution VARCHAR(50) DEFAULT '3840x2160 (4K)', -- '3840x2160 (4K)', '1920x1080 (FHD)', 'Video Wall LED'
    duration_seconds INTEGER DEFAULT 180,       -- Duração do ciclo de loop em segundos
    status VARCHAR(50) DEFAULT 'publicada',     -- 'draft', 'em_validacao', 'publicada', 'arquivada'
    file_size_mb DECIMAL(8, 2) DEFAULT 0.0,
    media_count INTEGER DEFAULT 12,
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. TABELA: SIGNAGE_PLAYERS (Displays, Ecrãs e Media Players por Loja)
CREATE TABLE IF NOT EXISTS signage_players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,                 -- Ex: 'Video Wall Entrada 4x4', 'Display Montra Lateral'
    device_model VARCHAR(100) DEFAULT 'BrightSign XT1144 4K', -- 'BrightSign XT1144', 'Samsung SSP Tizen', 'LG webOS Signage'
    zone_location VARCHAR(100) NOT NULL,        -- 'Entrada Principal', 'Montra', 'Linha de Caixas', 'Auditório Fnac'
    resolution VARCHAR(50) DEFAULT '4K UHD',
    ip_address VARCHAR(45),                     -- Ex: '192.168.142.10'
    mac_address VARCHAR(20),                    -- Ex: '00:10:18:A4:21:01'
    status VARCHAR(30) DEFAULT 'online',        -- 'online', 'offline', 'testing', 'syncing'
    playlist_id INTEGER,
    current_firmware VARCHAR(50) DEFAULT 'v9.0.145',
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
);

-- Índices Fase 4
CREATE INDEX IF NOT EXISTS idx_playlists_brand ON playlists(brand);
CREATE INDEX IF NOT EXISTS idx_playlists_status ON playlists(status);
CREATE INDEX IF NOT EXISTS idx_signage_project ON signage_players(project_id);
CREATE INDEX IF NOT EXISTS idx_signage_status ON signage_players(status);

-- Sementes Fase 4: Playlists
INSERT OR IGNORE INTO playlists (id, code, name, brand, version, resolution, duration_seconds, status, file_size_mb, media_count, notes, created_by) VALUES
(1, 'PL-FNAC-CAS-4K', 'Fnac Flagship 4K - Campanha Inauguração', 'Fnac', 'v2.5-gold-cascais', '3840x2160 (4K)', 240, 'publicada', 1450.50, 18, 'Campanha oficial de abertura com spots institucionais Fnac, Clube Fnac e parceiros 4K.', 1),
(2, 'PL-DARTY-PROMO-1080', 'Darty Electro & Tech - Promoções Abertura', 'Darty', 'v1.1-darty-pt', '1920x1080 (FHD)', 180, 'publicada', 820.00, 12, 'Linha de produtos grande e pequeno eletrodoméstico com selo Confiança Darty.', 1),
(3, 'PL-FNAC-INSTITUCIONAL', 'Fnac Brand Universe & Bilheteira', 'Fnac', 'v3.0-standard', '3840x2160 (4K)', 300, 'em_validacao', 1850.00, 24, 'Pacote de conteúdos universais para auditórios e áreas culturais.', 1),
(4, 'PL-DARTY-SERVICE', 'Darty Contratos de Assistência & Entrega', 'Darty', 'v1.0-draft', '1920x1080 (FHD)', 120, 'draft', 450.00, 8, 'Em validação com o departamento de serviços e pós-venda.', 2);

-- Sementes Fase 4: Players e Telas Instaladas
INSERT OR IGNORE INTO signage_players (id, project_id, name, device_model, zone_location, resolution, ip_address, mac_address, status, playlist_id, current_firmware, last_ping) VALUES
(1, 1, 'Video Wall Entrada 4x4 (LED Wall)', 'BrightSign XT1144 4K', 'Entrada Principal', '3840x2160 (4K)', '192.168.142.10', '00:10:18:A4:21:01', 'online', 1, 'v9.0.145', CURRENT_TIMESTAMP),
(2, 1, 'Display Duplo Montra Shopping', 'Samsung SSP (Tizen 6.5)', 'Montra Lateral', '1920x1080 (FHD)', '192.168.142.12', '00:10:18:B2:14:88', 'online', 1, 'v6.5.210', CURRENT_TIMESTAMP),
(3, 1, 'Totem Interativo Bilheteira & Cultura', 'BrightSign HD224', 'Fórum Cultural', '1920x1080 (FHD)', '192.168.142.15', '00:10:18:C9:83:02', 'syncing', 3, 'v9.0.145', CURRENT_TIMESTAMP),
(4, 1, 'Telas Menu Linha de Caixas (3 Displays)', 'Samsung SSP (Tizen 6.5)', 'Linha de Caixas', '1920x1080 (FHD)', '192.168.142.18', '00:10:18:D1:45:90', 'testing', 1, 'v6.5.210', CURRENT_TIMESTAMP),
(5, 2, 'Painel LED Montra Exterior', 'BrightSign XT1144 4K', 'Fachada Principal', 'Video Wall LED', '192.168.150.10', '00:10:18:E7:22:19', 'online', 2, 'v9.0.145', CURRENT_TIMESTAMP),
(6, 2, 'Display Balcão Apoio ao Cliente', 'LG webOS Signage 6.0', 'Balcão de Serviços', '1920x1080 (FHD)', '192.168.150.14', '00:10:18:F3:11:44', 'offline', 2, 'v6.0.102', CURRENT_TIMESTAMP);

