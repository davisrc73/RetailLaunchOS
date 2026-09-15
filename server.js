// ==============================================================================
// RetailLaunchOS - Servidor Principal de Aplicação
// Gabinete Multimédia | Aberturas de Lojas Fnac & Darty
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const config = require('./config/app');
const projectController = require('./src/controllers/projectController');
const taskController = require('./src/controllers/taskController');
const costController = require('./src/controllers/costController');
const signageController = require('./src/controllers/signageController');
const authController = require('./src/controllers/authController');
const configController = require('./src/controllers/configController');
const databaseController = require('./src/controllers/databaseController');
const activityController = require('./src/controllers/activityController');
const authMiddleware = require('./src/middleware/authMiddleware');

// Helper para responder JSON em servidor HTTP nativo
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper para validar autenticação e permissões de perfil (RBAC)
function checkAuth(req, res, ...allowedRoles) {
  const user = authMiddleware.extractUserFromRequest(req);
  if (!user) {
    sendJson(res, 401, {
      success: false,
      message: 'Autenticação necessária. Por favor inicie sessão ou envie o header Authorization: Bearer <token>.'
    });
    return null;
  }

  req.user = user;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    sendJson(res, 403, {
      success: false,
      message: `Acesso recusado: O seu perfil (${user.role}) não tem permissão para esta operação. Requer: [${allowedRoles.join(', ')}].`
    });
    return null;
  }

  return user;
}

// Servidor de Aplicação
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Anexar utilizador autenticado opcionalmente a todas as requisições
  req.user = authMiddleware.extractUserFromRequest(req);

  // --- API ROUTES: /api/v1/auth ---
  if (pathname.startsWith('/api/v1/auth')) {
    // 1. POST /api/v1/auth/login
    if ((pathname === '/api/v1/auth/login' || pathname === '/api/v1/auth/login/') && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await authController.login(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 2. GET /api/v1/auth/me
    if ((pathname === '/api/v1/auth/me' || pathname === '/api/v1/auth/me/') && method === 'GET') {
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return authController.getCurrentUser(req, mockRes);
    }
  }

  // --- API ROUTES: /api/v1/users & /api/v1/roles ---
  if (pathname === '/api/v1/users' || pathname === '/api/v1/users/') {
    if (method === 'GET') {
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return authController.getUsersList(req, mockRes);
    }
    if (method === 'POST') {
      if (!checkAuth(req, res, 'admin')) return;
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await authController.createUser(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }
  }

  // PATCH /api/v1/users/:id — atualizar dados do utilizador
  // DELETE /api/v1/users/:id — desativar utilizador (soft delete)
  const usersUpdateMatch = pathname.match(/^\/api\/v1\/users\/(\d+)\/?$/);
  if (usersUpdateMatch) {
    req.params = { id: usersUpdateMatch[1] };
    if (method === 'PATCH') {
      if (!checkAuth(req, res, 'admin')) return;
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await authController.updateUser(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }
    if (method === 'DELETE') {
      if (!checkAuth(req, res, 'admin')) return;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return authController.deactivateUser(req, mockRes);
    }
  }

  if (pathname === '/api/v1/roles' || pathname === '/api/v1/roles/') {
    if (method === 'GET') {
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return authController.getRolesList(req, mockRes);
    }
  }

  // --- API ROUTES: /api/v1/projects ---
  if (pathname.startsWith('/api/v1/projects')) {
    // 1. GET /api/v1/projects/kpis
    if (pathname === '/api/v1/projects/kpis' && method === 'GET') {
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return projectController.getDashboardMetrics(req, mockRes);
    }

    // 2. GET /api/v1/projects (listagem com query params)
    if ((pathname === '/api/v1/projects' || pathname === '/api/v1/projects/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return projectController.getAll(req, mockRes);
    }

    // 3. POST /api/v1/projects (criação de nova loja - restrito a Admin)
    if ((pathname === '/api/v1/projects' || pathname === '/api/v1/projects/') && method === 'POST') {
      if (!checkAuth(req, res, 'admin')) return;

      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await projectController.create(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 4. GET /api/v1/projects/:id/tasks
    const tasksMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/tasks$/);
    if (tasksMatch && method === 'GET') {
      req.params = { projectId: tasksMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return taskController.getByProject(req, mockRes);
    }

    // 5. POST /api/v1/projects/:id/tasks (criar tarefa para projeto)
    if (tasksMatch && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user', 'store_manager')) return;

      req.params = { projectId: tasksMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await taskController.create(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 6. GET /api/v1/projects/:id/costs
    const costsMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/costs$/);
    if (costsMatch && method === 'GET') {
      req.params = { projectId: costsMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return costController.getByProject(req, mockRes);
    }

    // 7. POST /api/v1/projects/:id/costs (lançar despesa ou diária)
    if (costsMatch && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { projectId: costsMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await costController.create(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 8. GET /api/v1/projects/:id/players
    const playersMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/players$/);
    if (playersMatch && method === 'GET') {
      req.params = { projectId: playersMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.getByProject(req, mockRes);
    }

    // 9. POST /api/v1/projects/:id/players (registar display/player para loja)
    if (playersMatch && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { projectId: playersMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          req.body.project_id = req.params.projectId;
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await signageController.createPlayer(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 10. PATCH ou PUT /api/v1/projects/:id/signage (atualizar signage e playlist)
    const signageMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/signage$/);
    if (signageMatch && (method === 'PATCH' || method === 'PUT')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: signageMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await projectController.updateSignage(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 10a. POST /api/v1/projects/:id/floor-plan (upload de planta arquitetónica de loja - Fase 17)
    const floorPlanMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/floor-plan$/);
    if (floorPlanMatch && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: floorPlanMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await projectController.uploadFloorPlan(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 10b. DELETE /api/v1/projects/:id/floor-plan (remover planta de loja - Fase 17)
    if (floorPlanMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: floorPlanMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return projectController.deleteFloorPlan(req, mockRes);
    }

    // 10c. PATCH ou POST /api/v1/projects/:id/floor-plan/positions (gravar coordenadas dos ecrãs na planta - Fase 17)
    const floorPlanPositionsMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)\/floor-plan\/positions$/);
    if (floorPlanPositionsMatch && (method === 'PATCH' || method === 'POST' || method === 'PUT')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user', 'store_manager')) return;

      req.params = { id: floorPlanPositionsMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await projectController.updateFloorPlanPositions(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 11. GET /api/v1/projects/:id
    const singleMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)$/);
    if (singleMatch && method === 'GET') {
      req.params = { id: singleMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return projectController.getById(req, mockRes);
    }

    // 12. PATCH ou PUT /api/v1/projects/:id (atualizar dados da loja - admin e multimedia_user)
    if (singleMatch && (method === 'PATCH' || method === 'PUT')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singleMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await projectController.update(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 13. DELETE /api/v1/projects/:id (restrito exclusivamente a Admin)
    if (singleMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin')) return;

      req.params = { id: singleMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return projectController.delete(req, mockRes);
    }
  }

  // --- API ROUTES: /api/v1/signage ---
  if (pathname.startsWith('/api/v1/signage')) {
    // 1. GET /api/v1/signage/stats
    if (pathname === '/api/v1/signage/stats' && method === 'GET') {
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.getStats(req, mockRes);
    }

    // 2. GET /api/v1/signage/playlists
    if ((pathname === '/api/v1/signage/playlists' || pathname === '/api/v1/signage/playlists/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.getPlaylists(req, mockRes);
    }

    // 3. POST /api/v1/signage/playlists
    if ((pathname === '/api/v1/signage/playlists' || pathname === '/api/v1/signage/playlists/') && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await signageController.createPlaylist(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 4. PATCH /api/v1/signage/playlists/:id/status
    const playlistStatusMatch = pathname.match(/^\/api\/v1\/signage\/playlists\/([^\/]+)\/status$/);
    if (playlistStatusMatch && (method === 'PATCH' || method === 'POST')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: playlistStatusMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await signageController.updatePlaylistStatus(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 5. GET /api/v1/signage/playlists/:id
    const singlePlaylistMatch = pathname.match(/^\/api\/v1\/signage\/playlists\/([^\/]+)$/);
    if (singlePlaylistMatch && method === 'GET') {
      req.params = { id: singlePlaylistMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.getPlaylistById(req, mockRes);
    }

    // 6. DELETE /api/v1/signage/playlists/:id (restrito a Admin)
    if (singlePlaylistMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin')) return;

      req.params = { id: singlePlaylistMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.deletePlaylist(req, mockRes);
    }

    // 7. GET /api/v1/signage/players
    if ((pathname === '/api/v1/signage/players' || pathname === '/api/v1/signage/players/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.getPlayers(req, mockRes);
    }

    // 8. POST /api/v1/signage/players
    if ((pathname === '/api/v1/signage/players' || pathname === '/api/v1/signage/players/') && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await signageController.createPlayer(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 9. POST /api/v1/signage/players/:id/ping
    const playerPingMatch = pathname.match(/^\/api\/v1\/signage\/players\/([^\/]+)\/ping$/);
    if (playerPingMatch && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user', 'store_manager')) return;

      req.params = { id: playerPingMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.pingPlayer(req, mockRes);
    }

    // 10. PATCH ou PUT /api/v1/signage/players/:id
    const singlePlayerMatch = pathname.match(/^\/api\/v1\/signage\/players\/([^\/]+)$/);
    if (singlePlayerMatch && (method === 'PATCH' || method === 'PUT')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singlePlayerMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await signageController.updatePlayer(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 11. DELETE /api/v1/signage/players/:id
    if (singlePlayerMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singlePlayerMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.deletePlayer(req, mockRes);
    }
  }

  // --- API ROUTES: /api/v1/costs ---
  if (pathname.startsWith('/api/v1/costs')) {
    // 1. GET /api/v1/costs/summary
    if (pathname === '/api/v1/costs/summary' && method === 'GET') {
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return costController.getGlobalSummary(req, mockRes);
    }

    // 2. DELETE /api/v1/costs/:id
    const singleCostMatch = pathname.match(/^\/api\/v1\/costs\/([^\/]+)$/);
    if (singleCostMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singleCostMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return costController.delete(req, mockRes);
    }
  }


  // --- API ROUTES: /api/v1/tasks ---
  if (pathname.startsWith('/api/v1/tasks')) {
    // 0. GET /api/v1/tasks (listagem global com filtros: status, scope, project_id)
    if ((pathname === '/api/v1/tasks' || pathname === '/api/v1/tasks/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return taskController.getAllGlobal(req, mockRes);
    }

    // 1. PATCH /api/v1/tasks/:id/toggle
    const toggleMatch = pathname.match(/^\/api\/v1\/tasks\/([^\/]+)\/toggle$/);
    if (toggleMatch && (method === 'PATCH' || method === 'POST')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user', 'store_manager')) return;

      req.params = { id: toggleMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return taskController.toggle(req, mockRes);
    }

    // 2. PUT ou PATCH /api/v1/tasks/:id
    const singleTaskMatch = pathname.match(/^\/api\/v1\/tasks\/([^\/]+)$/);
    if (singleTaskMatch && (method === 'PUT' || method === 'PATCH')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user', 'store_manager')) return;

      req.params = { id: singleTaskMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await taskController.update(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 3. DELETE /api/v1/tasks/:id
    if (singleTaskMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singleTaskMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return taskController.delete(req, mockRes);
    }
  }

  // --- API ROUTES: /api/v1/config/parameters ---
  if (pathname.startsWith('/api/v1/config')) {
    const singleParamMatch = pathname.match(/^\/api\/v1\/config\/parameters\/([^\/]+)$/);

    // 1. GET /api/v1/config/parameters (obter parâmetros agrupados ou por categoria)
    if ((pathname === '/api/v1/config/parameters' || pathname === '/api/v1/config/parameters/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return configController.getParameters(req, mockRes);
    }

    // 2. POST /api/v1/config/parameters (criar novo parâmetro)
    if ((pathname === '/api/v1/config/parameters' || pathname === '/api/v1/config/parameters/') && method === 'POST') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await configController.createParameter(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 3. PUT ou PATCH /api/v1/config/parameters/:id (atualizar parâmetro)
    if (singleParamMatch && (method === 'PUT' || method === 'PATCH')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singleParamMatch[1] };
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await configController.updateParameter(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 4. DELETE /api/v1/config/parameters/:id (eliminar parâmetro)
    if (singleParamMatch && method === 'DELETE') {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;

      req.params = { id: singleParamMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return configController.deleteParameter(req, mockRes);
    }
  }

  // --- API ROUTES: /api/v1/database (Backup & Migração) ---
  if (pathname.startsWith('/api/v1/database')) {
    // 1. GET /api/v1/database/info
    if (pathname === '/api/v1/database/info' && (method === 'GET' || method === 'HEAD')) {
      if (!checkAuth(req, res, 'admin', 'multimedia_user')) return;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return databaseController.getInfo(req, mockRes);
    }

    // 2. GET /api/v1/database/backup
    if (pathname === '/api/v1/database/backup' && method === 'GET') {
      if (!checkAuth(req, res, 'admin')) return;
      return databaseController.backup(req, res);
    }

    // 3. POST /api/v1/database/restore
    if (pathname === '/api/v1/database/restore' && method === 'POST') {
      if (!checkAuth(req, res, 'admin')) return;
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', async () => {
        try {
          req.bodyBuffer = Buffer.concat(chunks);
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await databaseController.restore(req, mockRes);
        } catch (err) {
          sendJson(res, 500, { success: false, message: 'Erro ao processar restauro: ' + err.message });
        }
      });
      return;
    }
  }

  // --- API ROUTES: /api/v1/activities (Feed de Atividade Recente) ---
  if (pathname.startsWith('/api/v1/activities')) {
    if ((pathname === '/api/v1/activities' || pathname === '/api/v1/activities/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return activityController.getRecent(req, mockRes);
    }
    if ((pathname === '/api/v1/activities' || pathname === '/api/v1/activities/') && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
          await activityController.create(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }
  }

  // --- STATIC ASSETS ---
  if (pathname.startsWith('/uploads/') || pathname.startsWith('/public/uploads/')) {
    const relPath = pathname.replace(/^\/(public\/)?uploads\//, '');
    const safeFilename = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');

    // Procura primeiro em database/uploads (volume persistente Synology NAS), depois em public/uploads
    let filePath = path.join(__dirname, 'database/uploads', safeFilename);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'public/uploads', safeFilename);
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif'
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  if (pathname.startsWith('/css/') || pathname.startsWith('/public/css/')) {
    const filename = path.basename(pathname);
    const cssPath = path.join(__dirname, 'public/css', filename);
    if (fs.existsSync(cssPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      fs.createReadStream(cssPath).pipe(res);
      return;
    }
  }

  if (pathname.startsWith('/js/') || pathname.startsWith('/public/js/')) {
    const filename = path.basename(pathname);
    const jsPath = path.join(__dirname, 'public/js', filename);
    if (fs.existsSync(jsPath)) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      fs.createReadStream(jsPath).pipe(res);
      return;
    }
  }

  // --- WEB VIEWS ---
  if (pathname === '/' || pathname === '/dashboard' || pathname.endsWith('.html')) {
    const htmlPath = path.join(__dirname, 'src/views/pages/dashboard.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      fs.createReadStream(htmlPath).pipe(res);
      return;
    }
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Recurso não encontrado.');
});

server.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 RetailLaunchOS Ativo e Conectado à Base de Dados SQLite`);
  console.log(`🏢 Gabinete Multimédia • Fnac & Darty`);
  console.log(`🌐 Dashboard: http://localhost:${config.port}`);
  console.log(`📡 API Endpoints: http://localhost:${config.port}/api/v1/projects`);
  console.log(`======================================================\n`);
});
