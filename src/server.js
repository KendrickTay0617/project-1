const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// port being accessed is port 3000
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// urlStruct holds all the urls and functions associated with each of them
const urlStruct = {
  // GET requests
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getStyle,
    '/getTasks': jsonHandler.getTasks,
    '/addTask': jsonHandler.addTask,
    notFound: jsonHandler.notFound,
  },
  // HEAD requests
  HEAD: {
    '/getTasks': jsonHandler.getTasksMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  // DELETE requests
  DELETE: {
    '/deleteTask': jsonHandler.deleteTask,
  },
};

// handlePost function for POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addTask') {
    const body = [];

    // throw bad request if upload stream error
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    // add data from upload to byte array
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // end of upload stream
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addTask(request, response, bodyParams);
    });
  }
};

// onRequest function parses url into individual parts and returns object from url parts by name
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // if method is POST, call handlePost
  // else call GET/HEAD/DELETE based on what the method and pathname is
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
