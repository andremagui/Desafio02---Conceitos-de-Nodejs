const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = { id: uuid(), title, url, techs, likes : 0 };

  repositories.push(project);

  return response.json(project);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
	const { title, url, techs } = request.body;

	let project = repositories.find(project => project.id === id);

	if(!project) {
		return response.status(400).json({error: 'Project not found.'});
	}
	
	project = {...project, title, url, techs }

  const projectIndex = repositories.findIndex(project => project.id === id);

  repositories[projectIndex] = project;

	return response.json(project); 
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

	const repoIndex = repositories.findIndex(repo => repo.id === id);

	if(repoIndex < 0) {
		return response.status(400).json({error: 'Repository not found.'});
  }
  
  repositories.splice(repoIndex, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const project = repositories.find(project => project.id === id);

	if(!project) {
		return response.status(400).json({error: 'Repository not found.'});
  }
  
  project.likes += 1

  return response.json(project);
});

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

module.exports = app;
