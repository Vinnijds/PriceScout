import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Backend ligado!");
});

app.listen(4000, () => console.log("Servidor rodando na porta 4000"));

import "./backend/src/workers/scheduler.js";

