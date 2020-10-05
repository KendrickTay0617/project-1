const fs = require('fs');

// reference client.html and styles.css
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// getIndex function gets the index page (client.html) to the server
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// getStyle function gets the styles (styles.css) to the server
const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

// export getIndex and getStyle functions
module.exports = {
  getIndex,
  getStyle,
};
