const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories ); 
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title, 
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const findIndex = repositories.findIndex(repository => repository.id === id);

  if( findIndex < 0 ) {
    return response.status(400).json({ err: 'Cannot find this repository' });
  } 

  const oldProject = repositories[findIndex];

  const updateRepository = {
    ...oldProject,
    title,
    url,
    techs,
  }

  repositories[findIndex] = updateRepository;

  return response.status(200).json(updateRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const findIndex = repositories.findIndex(repository => repository.id === id);

  if(findIndex < 0) {
    return response.status(400).json({err : 'Repository not found'});
  }
 
  repositories.splice(findIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { likes } = request.body; 

  const findIndex = repositories.findIndex(repository => repository.id === id);

  if (findIndex < 0) {
    return response.status(400).json({ err: "Cannot find this repository"});
  } 

  const oldProject = repositories[findIndex];

  const updatedRepository = {
    ...oldProject,
    likes: oldProject.likes + 1,
  }

  repositories[findIndex] = updatedRepository;

  return response.status(200).json(updatedRepository);
});

module.exports = app;
