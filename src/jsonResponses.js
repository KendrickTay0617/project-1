const tasks = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

const getTasks = (request, response) => {
  const responseJSON = {
    tasks,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getTasksMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const addTask = (request, response, body) => {
  const responseJSON = {
    message: 'Task name and date are both required.',
  };

  if (!body.name || !body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (tasks[body.name]) {
    responseCode = 204;
  } else {
    tasks[body.name] = {};
    tasks[body.name].name = body.name;
  }

  tasks[body.name].date = body.date;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getTasks,
  getTasksMeta,
  addTask,
  notFound,
  notFoundMeta,
};
