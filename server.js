// ==============================================================================
// RetailLaunchOS - Servidor Principal de Aplicação
// Gabinete Multimédia | Aberturas de Lojas Fnac & Darty
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./config/app');

// Tentativa de utilizar Express caso esteja instalado, caso contrário usa HTTP nativo
let useExpress = false;
let app;

try {
  const express = require('express');
  app = express();
  useExpress = true;
} catch (e) {
  useExpress = false;
}

if (useExpress) {
  const express = require('express');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ficheiros estáticos
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/css', express.static(path.join(__dirname, 'public/css')));
  app.use('/js', express.static(path.join(__dirname, 'public/js')));

  // Rotas da Aplicação
  const webRoutes = require('./src/routes/web/dashboard');
  const apiProjectRoutes = require('./src/routes/api/projects');

  app.use('/', webRoutes);
  app.use('/api/v1/projects', apiProjectRoutes);

  app.listen(config.port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 RetailLaunchOS em execução (Express)`);
    console.log(`🏢 Gabinete Multimédia • Fnac & Darty`);
    console.log(`🌐 Dashboard: http://localhost:${config.port}`);
    console.log(`📡 API Endpoints: http://localhost:${config.port}/api/v1/projects`);
    console.log(`======================================================\n`);
  });

} else {
  // Servidor Nativo HTTP Zero-Dependency para arranque imediato
  const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];

    // API Mock Endpoint
    if (url === '/api/v1/projects' || url === '/api/v1/projects/') {
      const Project = require('./src/models/Project');
      Project.findAll().then(data => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, count: data.length, data }));
      });
      return;
    }

    if (url === '/api/v1/projects/kpis') {
      const Project = require('./src/models/Project');
      Project.getKpis().then(data => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, data }));
      });
      return;
    }

    // Servir CSS
    if (url.startsWith('/css/') || url.startsWith('/public/css/')) {
      const cssPath = path.join(__dirname, 'public/css', path.basename(url));
      if (fs.existsSync(cssPath)) {
        res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
        fs.createReadStream(cssPath).pipe(res);
        return;
      }
    }

    // Servir Dashboard HTML
    if (url === '/' || url === '/dashboard' || url.endsWith('.html')) {
      const htmlPath = path.join(__dirname, 'src/views/pages/dashboard.html');
      if (fs.existsSync(htmlPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(htmlPath).pipe(res);
        return;
      }
    }

    // Fallback 404
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Página ou recurso não encontrado.');
  });

  server.listen(config.port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 RetailLaunchOS em execução (Servidor Nativo HTTP)`);
    console.log(`🏢 Gabinete Multimédia • Fnac & Darty`);
    console.log(`🌐 Dashboard: http://localhost:${config.port}`);
    console.log(`📡 API Endpoints: http://localhost:${config.port}/api/v1/projects`);
    console.log(`======================================================\n`);
  });
}
