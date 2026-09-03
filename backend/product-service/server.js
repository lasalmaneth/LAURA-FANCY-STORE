const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../database/db");

const app = express();
const PORT = process.env.PRODUCT_PORT || 8082;

// Configure Multer storage for uploads
const uploadDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `prod-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB total
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to format product with category & sorted images
function formatProduct(p) {
  if (!p) return null;
  const images = db
    .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC")
    .all(p.id);

  let category = null;
  if (p.category_id) {
    category = db.prepare("SELECT id, name, slug FROM categories WHERE id = ?").get(p.category_id);
  }

  // 1st image is the primary showing image default
  const mainImageUrl = images.length > 0 ? images[0].image_url : "/assets/images/vacuum-flask-set.jpg";

  return {
    ...p,
    price: Number(p.price),
    featured: Boolean(p.featured),
    active: Boolean(p.active),
    imageUrl: mainImageUrl,
    images: images.map((img) => ({
      id: img.id,
      product_id: img.product_id,
      image_url: img.image_url,
      storage_path: img.storage_path,
      sort_order: img.sort_order,
    })),
    category,
  };
}

// Helper to sync up to 4 images for a product
function syncProductImages(productId, files = [], body = {}) {
  // Map files by slot
  const filesBySlot = {};
  files.forEach((f, idx) => {
    if (f.fieldname === "image_1" || f.fieldname === "image") filesBySlot[1] = f;
    else if (f.fieldname === "image_2") filesBySlot[2] = f;
    else if (f.fieldname === "image_3") filesBySlot[3] = f;
    else if (f.fieldname === "image_4") filesBySlot[4] = f;
    else if (f.fieldname === "images") {
      const slotNum = idx + 1;
      if (slotNum <= 4) filesBySlot[slotNum] = f;
    }
  });

  // Check existing images currently in database
  const currentImages = db
    .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC")
    .all(productId);
  const currentMap = {};
  currentImages.forEach((img) => {
    currentMap[img.sort_order] = img;
  });

  // Loop through 4 potential image slots
  for (let slot = 1; slot <= 4; slot++) {
    const fileForSlot = filesBySlot[slot];
    const existingUrl = body[`existing_image_${slot}`] || body[`imageUrl_${slot}`];
    const clearSlot = body[`clear_image_${slot}`] === "true" || body[`clear_image_${slot}`] === true;

    if (clearSlot) {
      db.prepare("DELETE FROM product_images WHERE product_id = ? AND sort_order = ?").run(productId, slot);
      continue;
    }

    let finalUrl = null;
    if (fileForSlot) {
      finalUrl = `/uploads/products/${fileForSlot.filename}`;
    } else if (existingUrl) {
      finalUrl = existingUrl;
    } else if (slot === 1 && currentMap[1]) {
      finalUrl = currentMap[1].image_url;
    } else if (currentMap[slot] && !body[`slot_${slot}_modified`]) {
      // Keep untouched slot if not explicitly modified
      finalUrl = currentMap[slot].image_url;
    }

    if (finalUrl) {
      // Upsert product image for this slot
      db.prepare(`
        INSERT INTO product_images (id, product_id, image_url, storage_path, sort_order)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          image_url = excluded.image_url,
          storage_path = excluded.storage_path,
          sort_order = excluded.sort_order
      `).run(`img-${productId}-${slot}`, productId, finalUrl, finalUrl, slot);
    }
  }

  // Ensure at least 1 default placeholder image if all slots were empty
  const totalImgs = db.prepare("SELECT COUNT(*) as count FROM product_images WHERE product_id = ?").get(productId).count;
  if (totalImgs === 0) {
    const fallback = body.imageUrl || "/assets/images/vacuum-flask-set.jpg";
    db.prepare(`
      INSERT INTO product_images (id, product_id, image_url, storage_path, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(`img-${productId}-1`, productId, fallback, fallback, 1);
  }
}

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "product-service", port: PORT });
});

const router = express.Router();

// Admin Stats
router.get("/admin/stats", (req, res) => {
  try {
    const total = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
    const inStock = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_status = 'in_stock'").get().count;
    const outOfStock = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_status != 'in_stock'").get().count;
    const categoriesCount = db.prepare("SELECT COUNT(*) as count FROM categories").get().count;
    res.json({ total, inStock, outOfStock, categoriesCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET Featured Products
router.get("/products/featured", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM products WHERE active = 1 AND featured = 1 ORDER BY updated_at DESC LIMIT 6")
      .all();
    const products = rows.map(formatProduct);
    res.json(products);
  } catch (err) {
    console.error("Fetch featured products error:", err);
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

// GET all products with optional filters
router.get("/products", (req, res) => {
  try {
    const { category, search, active, sort } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (active !== undefined) {
      query += " AND active = ?";
      params.push(active === "true" || active === "1" ? 1 : 0);
    }

    if (category) {
      const cat = db.prepare("SELECT id FROM categories WHERE slug = ? OR id = ?").get(category, category);
      if (cat) {
        query += " AND category_id = ?";
        params.push(cat.id);
      }
    }

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ? OR product_code LIKE ?)";
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    if (sort === "price-asc") {
      query += " ORDER BY price ASC";
    } else if (sort === "price-desc") {
      query += " ORDER BY price DESC";
    } else {
      query += " ORDER BY updated_at DESC";
    }

    const rows = db.prepare(query).all(...params);
    const products = rows.map(formatProduct);
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product by ID or Slug
router.get("/products/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const row = db
      .prepare("SELECT * FROM products WHERE id = ? OR slug = ?")
      .get(idOrSlug, idOrSlug);
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(formatProduct(row));
  } catch (err) {
    console.error("Fetch product error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST Create Product (accepts up to 4 images)
router.post("/products", upload.any(), (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      short_description,
      price,
      category_id,
      product_code,
      stock_status,
      featured,
      active,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and Price are required" });
    }

    const id = Date.now().toString();
    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + `-${Math.floor(Math.random() * 1000)}`;
    const code = product_code || `LFS-${Math.floor(100 + Math.random() * 900)}`;

    db.prepare(`
      INSERT INTO products (
        id, name, slug, description, short_description, price,
        category_id, product_code, stock_status, featured, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      productSlug,
      description || "",
      short_description || "",
      parseFloat(price),
      category_id || null,
      code,
      stock_status || "in_stock",
      featured === "true" || featured === true || featured === 1 ? 1 : 0,
      active === "false" || active === false || active === 0 ? 0 : 1
    );

    // Sync up to 4 images
    syncProductImages(id, req.files, req.body);

    const created = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    res.status(201).json(formatProduct(created));
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product: " + err.message });
  }
});

// PUT Update Product (accepts up to 4 images)
router.put("/products/:id", upload.any(), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    const {
      name,
      description,
      short_description,
      price,
      category_id,
      product_code,
      stock_status,
      featured,
      active,
    } = req.body;

    const updatedName = name !== undefined ? name : existing.name;
    const updatedDesc = description !== undefined ? description : existing.description;
    const updatedShortDesc = short_description !== undefined ? short_description : existing.short_description;
    const updatedPrice = price !== undefined ? parseFloat(price) : existing.price;
    const updatedCatId = category_id !== undefined ? category_id : existing.category_id;
    const updatedCode = product_code !== undefined ? product_code : existing.product_code;
    const updatedStock = stock_status !== undefined ? stock_status : existing.stock_status;
    const updatedFeatured =
      featured !== undefined ? (featured === "true" || featured === true || featured === 1 ? 1 : 0) : existing.featured;
    const updatedActive =
      active !== undefined ? (active === "false" || active === false || active === 0 ? 0 : 1) : existing.active;

    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, short_description = ?, price = ?,
          category_id = ?, product_code = ?, stock_status = ?,
          featured = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      updatedName,
      updatedDesc,
      updatedShortDesc,
      updatedPrice,
      updatedCatId,
      updatedCode,
      updatedStock,
      updatedFeatured,
      updatedActive,
      id
    );

    // Sync up to 4 images if files were uploaded or modified
    if ((req.files && req.files.length > 0) || req.body.existing_image_1 || req.body.clear_image_1 !== undefined || req.body.clear_image_2 !== undefined || req.body.clear_image_3 !== undefined || req.body.clear_image_4 !== undefined) {
      syncProductImages(id, req.files, req.body);
    }

    const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    res.json(formatProduct(updated));
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product: " + err.message });
  }
});

// DELETE Product
router.delete("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM product_images WHERE product_id = ?").run(id);
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Mount router on both root and /api for flexible proxy routing
app.use("/", router);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`📦 [PRODUCT SERVICE] running on http://localhost:${PORT}`);
});
