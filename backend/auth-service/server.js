require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database/db");
const { sendAdminOtpEmail } = require("./mailer");

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

// 1. Admin Login (Step 1: Check password & dispatch OTP)
router.post("/login", async (req, res) => {
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

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const tempToken = jwt.sign(
      { id: user.id, email: user.email, type: "otp_pending" },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    const otpId = "otp_" + Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store in database
    db.prepare(`
      INSERT INTO admin_otps (id, email, otp_code, temp_token, expires_at, used)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(otpId, user.email, otp, tempToken, expiresAt);

    // Dispatch email
    const emailResult = await sendAdminOtpEmail(user.email, otp);

    if (!emailResult.sent) {
      return res.status(500).json({
        error: `Failed to send email to ${user.email}: ${emailResult.error || "Email service not configured"}. Please check email API configuration.`,
      });
    }

    const message = emailResult.redirectedToOwner
      ? `Verification code dispatched to owner ${emailResult.ownerEmail} (Resend Sandbox). Please enter the 6-digit OTP code below.`
      : `A 6-digit verification code was sent to ${user.email}`;

    res.json({
      success: true,
      requireOtp: true,
      tempToken,
      email: user.email,
      message,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Verify OTP (Step 2: Validate 6-digit OTP code & issue full JWT)
router.post("/verify-otp", (req, res) => {
  try {
    const { tempToken, otp } = req.body;
    if (!tempToken || !otp) {
      return res.status(400).json({ error: "Temporary token and OTP code are required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }

    if (decoded.type !== "otp_pending") {
      return res.status(400).json({ error: "Invalid verification session." });
    }

    // Look up active unused OTP
    const record = db.prepare(`
      SELECT * FROM admin_otps 
      WHERE email = ? AND temp_token = ? AND used = 0
      ORDER BY created_at DESC LIMIT 1
    `).get(decoded.email, tempToken);

    if (!record) {
      return res.status(400).json({ error: "No active verification code found. Please request a new code." });
    }

    // Check expiry
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: "Verification code has expired. Please request a new code." });
    }

    // Check code
    if (record.otp_code.trim() !== otp.toString().trim()) {
      return res.status(400).json({ error: "Incorrect verification code. Please check and try again." });
    }

    // Mark OTP as used
    db.prepare("UPDATE admin_otps SET used = 1 WHERE id = ?").run(record.id);

    // Get user details
    const user = db.prepare("SELECT id, email, role FROM admin_users WHERE email = ?").get(decoded.email);
    if (!user) {
      return res.status(404).json({ error: "Admin user not found." });
    }

    // Generate Full Admin JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log(`🎉 [ADMIN 2FA SUCCESS] Admin ${user.email} successfully logged in with OTP.`);

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
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { tempToken } = req.body;
    if (!tempToken) {
      return res.status(400).json({ error: "Temporary token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = "otp_" + Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO admin_otps (id, email, otp_code, temp_token, expires_at, used)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(otpId, decoded.email, otp, tempToken, expiresAt);

    const emailResult = await sendAdminOtpEmail(decoded.email, otp);

    if (!emailResult.sent) {
      return res.status(500).json({
        error: `Failed to send email to ${decoded.email}: ${emailResult.error || "Email service not configured"}.`,
      });
    }

    const message = emailResult.redirectedToOwner
      ? `A new verification code was dispatched to owner ${emailResult.ownerEmail} (Resend Sandbox).`
      : `A new verification code was sent to ${decoded.email}`;

    res.json({
      success: true,
      message,
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
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

// Middleware to verify admin token
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Token required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

// 4. List all admin users
router.get("/admin/users", requireAdmin, (req, res) => {
  try {
    const users = db.prepare("SELECT id, email, role, created_at FROM admin_users ORDER BY created_at ASC").all();
    res.json(users);
  } catch (err) {
    console.error("List admin users error:", err);
    res.status(500).json({ error: "Failed to fetch admin users" });
  }
});

// 5. Create a new admin user
router.post("/admin/users", requireAdmin, (req, res) => {
  try {
    const { email, password, role = "admin" } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const existing = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: `An admin account with email "${cleanEmail}" already exists.` });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newId = "admin_" + Date.now();

    db.prepare("INSERT INTO admin_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
      newId,
      cleanEmail,
      hash,
      role
    );

    console.log(`👤 [NEW ADMIN CREATED] ${cleanEmail} created by ${req.user.email}`);

    const createdUser = db.prepare("SELECT id, email, role, created_at FROM admin_users WHERE id = ?").get(newId);
    res.status(201).json({
      success: true,
      message: `Admin account for ${cleanEmail} created successfully.`,
      user: createdUser,
    });
  } catch (err) {
    console.error("Create admin user error:", err);
    res.status(500).json({ error: "Failed to create admin user" });
  }
});

// 6. Delete an admin user
router.delete("/admin/users/:id", requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id);
    if (!targetUser) {
      return res.status(404).json({ error: "Admin user not found." });
    }

    if (req.user.id === id || req.user.email.toLowerCase() === targetUser.email.toLowerCase()) {
      return res.status(400).json({ error: "You cannot delete your own admin account while logged in." });
    }

    const totalAdmins = db.prepare("SELECT COUNT(*) as count FROM admin_users").get();
    if (totalAdmins.count <= 1) {
      return res.status(400).json({ error: "Cannot delete the sole remaining administrator account." });
    }

    db.prepare("DELETE FROM admin_users WHERE id = ?").run(id);
    console.log(`🗑️ [ADMIN DELETED] ${targetUser.email} deleted by ${req.user.email}`);

    res.json({ success: true, message: `Admin account ${targetUser.email} deleted.` });
  } catch (err) {
    console.error("Delete admin user error:", err);
    res.status(500).json({ error: "Failed to delete admin user" });
  }
});

app.use("/", router);
app.use("/auth", router);
app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`🔐 [AUTH SERVICE] running on http://localhost:${PORT}`);
});
