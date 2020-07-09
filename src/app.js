const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: likes ? likes : 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id === id;
  });

  if (repositoryIndex > 0) {
    repositories[repositoryIndex].title = title
      ? title
      : repositories[repositoryIndex].title;
    repositories[repositoryIndex].url = url
      ? url
      : repositories[repositoryIndex].url;
    repositories[repositoryIndex].techs = techs
      ? techs
      : repositories[repositoryIndex].techs;

    return response.json(repositories[repositoryIndex]);
  } else {
    return response.status(400).json("repository not found");
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id === id;
  });

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
    return response.status(204).json();
  } else {
    return response.status(400).json();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id === id;
  });
  //TODO: Passar nos testes
  if (repositoryIndex >= 0) {
    repositories[repositoryIndex].likes++;
    return response.status(200).json({
      likes: repositories[repositoryIndex].likes,
    });
  } else {
    return response.status(400).json({ error: "repository not found" });
  }
});

module.exports = app;
