// initialize tasks object
let tasks = {};

// respondJSON function writes the JSON object that will give a message or tasks to the user
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

// respondJSONMeta is for HEAD requests
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

// getTasks function gets all of the tasks inside the response JSON object
const getTasks = (request, response) => {
  const responseJSON = {
    tasks,
  };

  respondJSON(request, response, 200, responseJSON);
};

// getTasksMeta is for HEAD requests
const getTasksMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

// addTask function is used for creating a new task and also updating the task
const addTask = (request, response, body) => {
  const responseJSON = {
    message: 'Title and date are both required.',
  };

  // if there is no title or date, set status code to 400 bad request and send message
  if (!body.title || !body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  // if the title exists, allow user to create or update task
  if (tasks[body.title]) {
    responseCode = 204;
  } else {
    tasks[body.title] = {};
    tasks[body.title].title = body.title;
  }

  tasks[body.title].date = body.date;
  tasks[body.title].time = body.time;
  tasks[body.title].description = body.description;
  tasks[body.title].priority = body.priority;

  // send 201 created message
  if (responseCode === 201) {
    responseJSON.message = 'DueDate created successfully.';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// deleteTask function clears the tasks object
const deleteTask = (request, response) => {
  tasks = {};

  const responseJSON = {
    tasks,
  };

  // The following commented code works properly
  // but npm test said that it was an error (using a for...in loop)
  //  for (const task in tasks) {
  //    delete tasks[task];
  //  }

  // returns tasks which is empty
  return respondJSON(request, response, 200, responseJSON);
};

// notFound function is called when the url or page
// trying to be accessed is not found or doesn't exist
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// notFoundMeta is for HEAD requests
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// export getTasks, getTasksMeta, addTask, deleteTask, notFound and notFoundMeta
module.exports = {
  getTasks,
  getTasksMeta,
  addTask,
  deleteTask,
  notFound,
  notFoundMeta,
};
