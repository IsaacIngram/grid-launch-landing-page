const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

function sendFile(res, filepath, contentType){
  fs.readFile(filepath, (err, data) => {
    if(err){
      res.statusCode = 500;
      res.end('Server error');
      return;
    }
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Provide a small JSON config endpoint so the client can read runtime env vars
  if (req.url === '/config') {
    const cfg = { submitEndpoint: process.env.SUBMIT_ENDPOINT || null };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cfg));
    return;
  }
  let reqPath = req.url.split('?')[0];
  if(reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(publicDir, decodeURIComponent(reqPath));

  // Basic security: don't allow paths outside public
  if(!filePath.startsWith(publicDir)){
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const map = {'.html':'text/html','.css':'text/css','.js':'application/javascript'};
  const contentType = map[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if(err || !stats.isFile()){
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    sendFile(res, filePath, contentType);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
