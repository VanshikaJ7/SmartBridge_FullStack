const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/welcome", (req, res) => {
  res.json({ message: "Welcome to Express!" });
});

const users = [];

app.get("/users", (req, res) => res.json(users));

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const id = users.length + 1;
  users.push({ id, name, email });
  res
    .status(201)
    .json({ message: "User added successfully", user: { id, name, email } });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users.find((u) => u.id === parseInt(id));
  if (user) {
    user.name = name;
    user.email = email;
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index !== -1) {
    users.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));