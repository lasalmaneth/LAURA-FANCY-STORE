const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const app = express();
const PORT = process.env.AUTH_PORT || 8081;
const JWT_SECRET = process.env.JWT_SECRET || "laura_fancy_jwt_secret_key_2026";

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "auth-service", port: PORT });
});

const router = express.Router();

// Admin Login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify Token
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Invalid or expired token" });
  }
});

app.use("/", router);
app.use("/auth", router);
app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`🔐 [AUTH SERVICE] running on http://localhost:${PORT}`);
});
