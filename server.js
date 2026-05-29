// import { createServer } from "node:http";

// const server = createServer((request, response) => {
//   response.write("Hello world");

//   return response.end();
// });

// // localhost:3333
// server.listen(3333);

// -----------------------------------------------------------------------

import { fastify } from "fastify";
// import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

// POST http://localhost:3333/videos
server.post("/videos", async (req, res) => {
  const { title, description, duration } = req.body;

  await database.create({
    title,
    description,
    duration,
  });

  return res.status(201).send();
});

// GET http://localhost:3333/videos
server.get("/videos", async (req) => {
  const search = req.query.search;

  const videos = await database.list(search);

  return videos;
});

// Route Parameter
// PUT http://localhost:3333/videos/1
server.put("/videos/:id", async (req, res) => {
  const videoId = req.params.id;
  const { title, description, duration } = req.body;

  await database.update(videoId, {
    title,
    description,
    duration,
  });

  return res.status(204).send();
});

// DELETE http://localhost:3333/videos/1
server.delete("/videos/:id", async (req, res) => {
  const videoId = req.params.id;

  await database.delete(videoId);

  return res.status(204).send();
});

server.listen({
  port: process.env.PORT ?? 3333,
});
