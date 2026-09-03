const db = require("./db");
const bcrypt = require("bcryptjs");

function seed() {
  console.log("🌱 Seeding database...");

  // Seed Admin User
  const adminExists = db.prepare("SELECT * FROM admin_users WHERE email = ?").get("admin@laurafancystore.com");
  if (!adminExists) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("admin123", salt);
    db.prepare("INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
      "admin-01",
      "admin@laurafancystore.com",
      hash,
      "admin"
    );
    console.log("  👤 Seeded default admin user: admin@laurafancystore.com (password: admin123)");
  }

  // Seed Categories
  const categories = [
    { id: "cat-1", name: "Household & Living", slug: "household-living" },
    { id: "cat-2", name: "Electronics & Gadgets", slug: "electronics-gadgets" },
    { id: "cat-3", name: "Fashion & Accessories", slug: "fashion-accessories" },
    { id: "cat-4", name: "Home & Office", slug: "home-office" },
    { id: "cat-5", name: "Beauty & Care", slug: "beauty-care" },
  ];

  const insertCat = db.prepare(`
    INSERT OR REPLACE INTO categories (id, name, slug, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);

  for (const cat of categories) {
    insertCat.run(cat.id, cat.name, cat.slug);
  }
  console.log("  📂 Seeded 5 product categories.");

  // Seed Products
  const products = [
    {
      id: "1",
      name: "SAGE GREEN VACUUM FLASK SET",
      slug: "sage-green-vacuum-flask-set",
      description: "A complete set for all your hot or cold drinks. Keep them at temperature, wherever life takes you. Includes insulated vacuum bottle and matching travel cups.",
      short_description: "Your Sage Green Travel Companion. Complete hot & cold vacuum flask set.",
      price: 1200,
      category_id: "cat-1",
      product_code: "LFS-100",
      stock_status: "in_stock",
      featured: 1,
      active: 1,
      image: "/uploads/products/vacuum-flask-set.jpg",
    },
    {
      id: "2",
      name: "PREMIUM WEEKENDER TRAVEL BAG",
      slug: "premium-weekender-travel-bag",
      description: "Spacious and durable weekender bag designed for short trips and getaways. Features water-resistant canvas, premium leather accents, and multiple compartments.",
      short_description: "Spacious water-resistant canvas travel bag with leather accents.",
      price: 4500,
      category_id: "cat-3",
      product_code: "LFS-102",
      stock_status: "in_stock",
      featured: 1,
      active: 1,
      image: "/uploads/products/tote-01.jpg",
    },
    {
      id: "3",
      name: "MINIMALIST CANVAS EVERYDAY TOTE",
      slug: "minimalist-canvas-everyday-tote",
      description: "Heavyweight organic cotton canvas tote with interior zip pocket for laptop and daily essentials.",
      short_description: "Heavyweight organic cotton tote bag for daily errands and work.",
      price: 1500,
      category_id: "cat-3",
      product_code: "LFS-103",
      stock_status: "in_stock",
      featured: 1,
      active: 1,
      image: "/uploads/products/cloche-01.jpg",
    },
    {
      id: "4",
      name: "SMART AMBIENT DESK LAMP",
      slug: "smart-ambient-desk-lamp",
      description: "Touch-controlled LED lamp with adjustable brightness, color temperature, and wireless charging pad base.",
      short_description: "Touch LED desk lamp with adjustable brightness and wireless phone charger.",
      price: 4900,
      category_id: "cat-4",
      product_code: "LFS-104",
      stock_status: "in_stock",
      featured: 0,
      active: 1,
      image: "/uploads/products/candle-01.jpg",
    },
    {
      id: "5",
      name: "ORGANIC SKINCARE HYDRATION SET",
      slug: "organic-skincare-hydration-set",
      description: "Gentle daily facial cleanser, hydrating serum, and lightweight moisturizer for healthy daily skin care.",
      short_description: "3-piece organic daily skincare hydration set.",
      price: 4200,
      category_id: "cat-5",
      product_code: "LFS-105",
      stock_status: "in_stock",
      featured: 0,
      active: 1,
      image: "/uploads/products/mist-01.jpg",
    },
    {
      id: "6",
      name: "HANDCRAFTED CERAMIC MUG",
      slug: "handcrafted-ceramic-mug",
      description: "Artisan crafted stoneware mug with natural matte speckle glaze. Ergonomic handle and heat retaining design.",
      short_description: "Artisan crafted stoneware mug with natural matte glaze.",
      price: 2150,
      category_id: "cat-1",
      product_code: "LFS-106",
      stock_status: "in_stock",
      featured: 0,
      active: 1,
      image: "/uploads/products/vacuum-flask-set.jpg",
    },
  ];

  const insertProd = db.prepare(`
    INSERT OR REPLACE INTO products (id, name, slug, description, short_description, price, category_id, product_code, stock_status, featured, active, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const insertImg = db.prepare(`
    INSERT OR REPLACE INTO product_images (id, product_id, image_url, storage_path, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const prod of products) {
    insertProd.run(
      prod.id,
      prod.name,
      prod.slug,
      prod.description,
      prod.short_description,
      prod.price,
      prod.category_id,
      prod.product_code,
      prod.stock_status,
      prod.featured,
      prod.active
    );

    if (prod.image) {
      insertImg.run(`img-${prod.id}`, prod.id, prod.image, prod.image, 1);
    }
  }

  console.log(`  📦 Seeded ${products.length} products with images.`);
  console.log("✅ Database seeding complete!");
}

seed();
