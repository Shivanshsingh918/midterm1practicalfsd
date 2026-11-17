const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let products = [
  { id: 301, name: "Wireless Mouse", category: "Electronics", price: 799, quantity: 25, inStock: true },
  { id: 302, name: "Notebook", category: "Stationery", price: 60, quantity: 100, inStock: true },
  { id: 303, name: "USB Keyboard", category: "Electronics", price: 999, quantity: 0, inStock: false },
];
let nextId = 304;

function isValid(b) {
  return (
    b &&
    typeof b.name === "string" && b.name.trim() !== "" &&
    typeof b.category === "string" && b.category.trim() !== "" &&
    typeof b.price === "number" &&
    typeof b.quantity === "number" &&
    typeof b.inStock === "boolean"
  );
}

// 1. GET all
app.get("/api/products", (req, res) => {
  res.status(200).json(products);
});

// 6. Filter (/:id se PEHLE hona zaroori hai)
app.get("/api/products/filter", (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.status(400).json({ message: "category query required" });
  }
  const result = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].category.toLowerCase() === category.toLowerCase()) {
      result.push(products[i]);
    }
  }
  res.status(200).json(result);
});

// 3. GET by id
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(p);
});

// 2. POST
app.post("/api/products", (req, res) => {
  if (!isValid(req.body)) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const { name, category, price, quantity, inStock } = req.body;
  const newProduct = { id: nextId++, name, category, price, quantity, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 4. PUT
app.put("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((x) => x.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  if (!isValid(req.body)) return res.status(400).json({ message: "Invalid input" });
  const { name, category, price, quantity, inStock } = req.body;
  products[index] = { id, name, category, price, quantity, inStock };
  res.status(200).json(products[index]);
});

// 5. DELETE
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((x) => x.id === id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products.splice(index, 1);
  res.status(200).json({ message: "Product deleted successfully" });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});