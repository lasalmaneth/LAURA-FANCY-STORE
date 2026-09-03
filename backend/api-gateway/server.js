const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.GATEWAY_PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "laura_fancy_jwt_secret_key_2026";

const SERVICES = {
  auth: "http://localhost:8081",
  product: "http://localhost:8082",
  category: "http://localhost:8083",
};

// Enable CORS for frontend clients
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    credentials: true,
  })
);

// Serve static uploaded product images directly
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Request logger
app.use((req, res, next) => {
  console.log(`[API GATEWAY] [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    gateway: `http://localhost:${PORT}`,
    services: SERVICES,
  });
});

// JWT Verification Middleware for protected admin routes
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Admin authorization token required." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin privileges required." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

// ---------------- AUTH ROUTES ----------------
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: SERVICES.auth,
    changeOrigin: true,
  })
);

// ---------------- PROTECTED ADMIN ROUTES ----------------
app.use(
  "/api/admin/products",
  requireAdminAuth,
  createProxyMiddleware({
    target: `${SERVICES.product}/products`,
    changeOrigin: true,
  })
);

app.use(
  "/api/admin/stats",
  requireAdminAuth,
  createProxyMiddleware({
    target: `${SERVICES.product}/admin/stats`,
    changeOrigin: true,
  })
);

app.use(
  "/api/admin/categories",
  requireAdminAuth,
  createProxyMiddleware({
    target: `${SERVICES.category}/categories`,
    changeOrigin: true,
  })
);

// ---------------- PUBLIC CUSTOMER & READ ROUTES ----------------
app.use(
  "/api/products",
  createProxyMiddleware({
    target: `${SERVICES.product}/products`,
    changeOrigin: true,
  })
);

app.use(
  "/api/categories",
  createProxyMiddleware({
    target: `${SERVICES.category}/categories`,
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`🌐 [API GATEWAY] listening on http://localhost:${PORT}`);
  console.log(`   └─ Auth Service:     ${SERVICES.auth}`);
  console.log(`   └─ Product Service:  ${SERVICES.product}`);
  console.log(`   └─ Category Service: ${SERVICES.category}`);
});
