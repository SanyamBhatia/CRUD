const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Model
const Item = require("./models/Item");

// Routes
app.get("/", async (req, res) => {
  const items = await Item.find();
  res.render("index", { items });
});

app.get("/items/new", (req, res) => {
  res.render("create");
});

app.post("/items", async (req, res) => {
  await Item.create({ name: req.body.name, description: req.body.description });
  res.redirect("/");
});

app.get("/items/:id/edit", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render("edit", { item });
});

app.put("/items/:id", async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
  });
  res.redirect("/");
});

app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
