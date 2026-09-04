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

// Helper para responder JSON em servidor HTTP nativo
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // --- API ROUTES: /api/v1/projects ---
  if (pathname.startsWith('/api/v1/projects')) {
    // 1. GET /api/v1/projects/kpis
    if (pathname === '/api/v1/projects/kpis' && method === 'GET') {
      const mockRes = {
        status: (code) => ({ json: (data) => sendJson(res, code, data) })
      };
      return projectController.getDashboardMetrics(req, mockRes);
    }

    // 2. GET /api/v1/projects (listagem com query params)
    if ((pathname === '/api/v1/projects' || pathname === '/api/v1/projects/') && method === 'GET') {
      req.query = parsedUrl.query;
      const mockRes = {
        status: (code) => ({ json: (data) => sendJson(res, code, data) })
      };
      return projectController.getAll(req, mockRes);
    }

    // 3. POST /api/v1/projects (criação de nova loja)
    if ((pathname === '/api/v1/projects' || pathname === '/api/v1/projects/') && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          const mockRes = {
            status: (code) => ({ json: (data) => sendJson(res, code, data) })
          };
          await projectController.create(req, mockRes);
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'JSON Inválido: ' + err.message });
        }
      });
      return;
    }

    // 4. GET /api/v1/projects/:id
    const singleMatch = pathname.match(/^\/api\/v1\/projects\/([^\/]+)$/);
    if (singleMatch && method === 'GET') {
      req.params = { id: singleMatch[1] };
      const mockRes = {
        status: (code) => ({ json: (data) => sendJson(res, code, data) })
      };
      return projectController.getById(req, mockRes);
    }

    // 5. DELETE /api/v1/projects/:id
    if (singleMatch && method === 'DELETE') {
      req.params = { id: singleMatch[1] };
      const mockRes = {
        status: (code) => ({ json: (data) => sendJson(res, code, data) })
      };
      return projectController.delete(req, mockRes);
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
