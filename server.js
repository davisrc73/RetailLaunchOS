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

// Helper para responder JSON em servidor HTTP nativo
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
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

    // 3. POST /api/v1/projects (criação de nova loja)
    if ((pathname === '/api/v1/projects' || pathname === '/api/v1/projects/') && method === 'POST') {
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

    // 11. GET /api/v1/projects/:id
    const singleMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)$/);
    if (singleMatch && method === 'GET') {
      req.params = { id: singleMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return projectController.getById(req, mockRes);
    }

    // 12. DELETE /api/v1/projects/:id
    if (singleMatch && method === 'DELETE') {
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

    // 6. DELETE /api/v1/signage/playlists/:id
    if (singlePlaylistMatch && method === 'DELETE') {
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
      req.params = { id: playerPingMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return signageController.pingPlayer(req, mockRes);
    }

    // 10. PATCH ou PUT /api/v1/signage/players/:id
    const singlePlayerMatch = pathname.match(/^\/api\/v1\/signage\/players\/([^\/]+)$/);
    if (singlePlayerMatch && (method === 'PATCH' || method === 'PUT')) {
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
      req.params = { id: singleCostMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return costController.delete(req, mockRes);
    }
  }


  // --- API ROUTES: /api/v1/tasks ---
  if (pathname.startsWith('/api/v1/tasks')) {
    // 1. PATCH /api/v1/tasks/:id/toggle
    const toggleMatch = pathname.match(/^\/api\/v1\/tasks\/([^\/]+)\/toggle$/);
    if (toggleMatch && (method === 'PATCH' || method === 'POST')) {
      req.params = { id: toggleMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return taskController.toggle(req, mockRes);
    }

    // 2. PUT ou PATCH /api/v1/tasks/:id
    const singleTaskMatch = pathname.match(/^\/api\/v1\/tasks\/([^\/]+)$/);
    if (singleTaskMatch && (method === 'PUT' || method === 'PATCH')) {
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
      req.params = { id: singleTaskMatch[1] };
      const mockRes = { status: (code) => ({ json: (data) => sendJson(res, code, data) }) };
      return taskController.delete(req, mockRes);
    }
  }


  // --- STATIC ASSETS ---
  if (pathname.startsWith('/css/') || pathname.startsWith('/public/css/')) {
    const filename = path.basename(pathname);
    const cssPath = path.join(__dirname, 'public/css', filename);
    if (fs.existsSync(cssPath)) {
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      fs.createReadStream(cssPath).pipe(res);
      return;
    }
  }

  if (pathname.startsWith('/js/') || pathname.startsWith('/public/js/')) {
    const filename = path.basename(pathname);
    const jsPath = path.join(__dirname, 'public/js', filename);
    if (fs.existsSync(jsPath)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      fs.createReadStream(jsPath).pipe(res);
      return;
    }
  }

  // --- WEB VIEWS ---
  if (pathname === '/' || pathname === '/dashboard' || pathname.endsWith('.html')) {
    const htmlPath = path.join(__dirname, 'src/views/pages/dashboard.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
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
