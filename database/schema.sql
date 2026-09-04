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
