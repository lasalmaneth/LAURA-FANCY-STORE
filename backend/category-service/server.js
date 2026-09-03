const express = require("express");
const cors = require("cors");
const db = require("../database/db");

const app = express();
const PORT = process.env.CATEGORY_PORT || 8083;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "category-service", port: PORT });
});

const router = express.Router();

// GET all categories
router.get("/categories", (req, res) => {
  try {
    const categories = db.prepare("SELECT * FROM categories ORDER BY name ASC").all();
    res.json(categories);
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET category by ID or Slug
router.get("/categories/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const category = db
      .prepare("SELECT * FROM categories WHERE id = ? OR slug = ?")
      .get(idOrSlug, idOrSlug);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error("Fetch category error:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// POST create category
router.post("/categories", (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = "cat-" + Date.now();

    db.prepare(`
      INSERT INTO categories (id, name, slug)
      VALUES (?, ?, ?)
    `).run(id, name, catSlug);

    const created = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Failed to create category: " + err.message });
  }
});

// PUT update category
router.put("/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existing = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedName = name || existing.name;
    const updatedSlug = slug || existing.slug;

    db.prepare(`
      UPDATE categories
      SET name = ?, slug = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(updatedName, updatedSlug, id);

    const updated = db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE category
router.delete("/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

app.use("/", router);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🏷️  [CATEGORY SERVICE] running on http://localhost:${PORT}`);
});
