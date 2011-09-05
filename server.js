var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , url = require('url');

var serveStatic = function(filename, request, response) {
  fs.readFile(filename, 'binary', function(err, file) {
    if (err) {
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.write(err + '\n');
      response.end();
      return;
    }

    response.writeHead(200);
    response.write(file, 'binary');
    response.end();
  });
};

var server = http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname
    , filename = path.join('./', uri);

  path.exists(filename, function(exists) {
    if (exists && uri != '/') {
      serveStatic(filename, req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  });
});

server.listen(3000);
console.log('Server listening on 3000');