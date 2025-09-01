const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3030;
const buildDir = path.join(__dirname, 'build');

const server = http.createServer((req, res) => {
  let filePath;
  
  // Serve the simple version for now
  if (req.url === '/' || req.url.startsWith('/#')) {
    filePath = path.join(__dirname, 'simple-index.html');
  } else {
    filePath = path.join(buildDir, req.url);
    // If the file doesn't exist, serve simple-index.html for React Router
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, 'simple-index.html');
    }
  }
  
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
  }[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});