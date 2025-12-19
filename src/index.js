const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Todo } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todos";

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  app.get("/todos", async (_req, res) => {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  });

  app.post("/todos", async (req, res) => {
    const { title, completed } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const todo = await Todo.create({ title, completed: !!completed });
    res.status(201).json(todo);
  });

  app.get("/todos/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "not found" });
    res.json(todo);
  });

  app.put("/todos/:id", async (req, res) => {
    const { title, completed } = req.body || {};
    const update = {};
    if (title !== undefined) update.title = title;
    if (completed !== undefined) update.completed = !!completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!todo) return res.status(404).json({ error: "not found" });
    res.json(todo);
  });

  app.delete("/todos/:id", async (req, res) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  });

  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
