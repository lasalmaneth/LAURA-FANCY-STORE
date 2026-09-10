import React, { useState, useEffect } from "react";
import { api, auth, API_BASE } from "./api";

const resolveImageUrl = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop";
  const url = typeof img === "string" ? img : img?.image_url || img?.image;
  if (!url) return "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = (API_BASE || "").replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};
import {
  LayoutDashboard,
  Package,
  FolderTree,
  PlusCircle,
  LogOut,
  Boxes,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Megaphone,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Mail,
  Users,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(auth.getUser());

  // Data states
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0, categoriesCount: 0 });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modals & Forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category_id: "",
    product_code: "",
    priority_order: 1,
    original_price: "",
    discount_percentage: 0,
    stock_status: "in_stock",
    featured: false,
    active: true,
    short_description: "",
    description: "",
    imageFile: null,
  });

  const [notice, setNotice] = useState({
    notice_text: "Buy 3500 or more and get Free Delivery !!! .... hurry up limited time only ....",
    badge_text: "LIMITED TIME ONLY",
    is_active: true,
    min_order_amount: 3500,
    discount_percentage: 0,
  });
  const [noticeSaving, setNoticeSaving] = useState(false);

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  // Admin Team state
  const [adminUsers, setAdminUsers] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: "", password: "", showPassword: false });
  const [adminSaving, setAdminSaving] = useState(false);

  // Login form & 2FA state
  const [loginStep, setLoginStep] = useState("credentials"); // "credentials" | "otp"
  const [loginForm, setLoginForm] = useState({ email: "lasaljayasinghe331@gmail.com", password: "" });
  const [loginError, setLoginError] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const fetchAdminUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      if (Array.isArray(data)) {
        setAdminUsers(data);
      }
    } catch (err) {
      console.error("Failed to load admin users:", err);
    }
  };

  const loadAllData = async () => {
    if (!auth.isAuthenticated()) return;
    setLoading(true);
    try {
      const [statsData, prodsData, catsData, noticeData, adminData] = await Promise.all([
        api.getStats().catch(() => ({ total: 0, inStock: 0, outOfStock: 0, categoriesCount: 0 })),
        api.getProducts().catch(() => []),
        api.getCategories().catch(() => []),
        api.getNotice().catch(() => null),
        api.getAdminUsers().catch(() => []),
      ]);
      if (statsData) setStats(statsData);
      if (prodsData) setProducts(prodsData);
      if (catsData) setCategories(catsData);
      if (noticeData) setNotice(noticeData);
      if (adminData && Array.isArray(adminData)) setAdminUsers(adminData);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Automatically refresh admin users when switching to the Admin Team tab
  useEffect(() => {
    if (activeTab === "admins" && isAuthenticated) {
      fetchAdminUsers();
    }
  }, [activeTab, isAuthenticated]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (loginStep === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginStep, otpTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setResendSuccess("");
    setIsSubmitting(true);
    try {
      const res = await api.login(loginForm.email, loginForm.password);
      if (res.requireOtp) {
        setTempToken(res.tempToken);
        setOtpEmail(res.email);
        setOtp(""); // always empty for manual entry from email
        setLoginStep("otp");
        setOtpTimer(60);
      } else if (res.token) {
        setIsAuthenticated(true);
        setUser(res.user);
      }
    } catch (err) {
      setLoginError(err.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setLoginError("Please enter the complete 6-digit verification code.");
      return;
    }
    setLoginError("");
    setResendSuccess("");
    setIsSubmitting(true);
    try {
      const res = await api.verifyOtp(tempToken, otp);
      if (res.success && res.token) {
        setIsAuthenticated(true);
        setUser(res.user);
      }
    } catch (err) {
      setLoginError(err.message || "Invalid or expired verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0 || isSubmitting) return;
    setLoginError("");
    setResendSuccess("");
    setIsSubmitting(true);
    try {
      const res = await api.resendOtp(tempToken);
      setOtpTimer(60);
      setOtp(""); // keep input empty for manual entry
      setResendSuccess(res.message || "A new 6-digit verification code has been dispatched to your email.");
    } catch (err) {
      setLoginError(err.message || "Failed to resend verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.email || !adminForm.password) {
      setFeedback({ type: "error", message: "Please provide both email and password." });
      return;
    }
    if (adminForm.password.length < 6) {
      setFeedback({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }
    setAdminSaving(true);
    try {
      const res = await api.createAdminUser({
        email: adminForm.email.trim(),
        password: adminForm.password,
        role: "admin",
      });
      setFeedback({ type: "success", message: res.message || `Admin account created for ${adminForm.email}!` });
      setShowAdminModal(false);
      setAdminForm({ email: "", password: "", showPassword: false });
      fetchAdminUsers();
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to create admin account" });
      fetchAdminUsers();
    } finally {
      setAdminSaving(false);
    }
  };

  const handleDeleteAdmin = async (id, email) => {
    if (!window.confirm(`Are you sure you want to revoke admin access for ${email}?`)) return;
    try {
      await api.deleteAdminUser(id);
      setFeedback({ type: "success", message: `Admin access revoked for ${email}.` });
      const updatedAdmins = await api.getAdminUsers();
      setAdminUsers(updatedAdmins);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to revoke admin access" });
    }
  };

  const [imageSlots, setImageSlots] = useState([
    { slot: 1, file: null, preview: null, existingUrl: null, cleared: false },
    { slot: 2, file: null, preview: null, existingUrl: null, cleared: false },
    { slot: 3, file: null, preview: null, existingUrl: null, cleared: false },
    { slot: 4, file: null, preview: null, existingUrl: null, cleared: false },
  ]);

  const handleSlotFileChange = (slotNum, file) => {
    if (!file) return;
    setImageSlots((prev) =>
      prev.map((s) =>
        s.slot === slotNum
          ? { ...s, file, preview: URL.createObjectURL(file), cleared: false }
          : s
      )
    );
  };

  const handleSlotRemove = (slotNum) => {
    setImageSlots((prev) =>
      prev.map((s) =>
        s.slot === slotNum
          ? { ...s, file: null, preview: null, existingUrl: null, cleared: true }
          : s
      )
    );
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      original_price: "",
      discount_percentage: 0,
      category_id: categories[0]?.id || "",
      product_code: "",
      priority_order: products.length + 1,
      stock_status: "in_stock",
      featured: false,
      active: true,
      short_description: "",
      description: "",
    });
    setImageSlots([
      { slot: 1, file: null, preview: null, existingUrl: null, cleared: false },
      { slot: 2, file: null, preview: null, existingUrl: null, cleared: false },
      { slot: 3, file: null, preview: null, existingUrl: null, cleared: false },
      { slot: 4, file: null, preview: null, existingUrl: null, cleared: false },
    ]);
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      original_price: prod.original_price || "",
      discount_percentage: prod.discount_percentage || 0,
      category_id: prod.category_id || "",
      product_code: prod.product_code || "",
      priority_order: prod.priority_order !== undefined ? prod.priority_order : 0,
      stock_status: prod.stock_status || "in_stock",
      featured: prod.featured || false,
      active: prod.active !== undefined ? prod.active : true,
      short_description: prod.short_description || "",
      description: prod.description || "",
    });

    const slots = [1, 2, 3, 4].map((slotNum) => {
      const found = prod.images?.find((img) => img.sort_order === slotNum) || prod.images?.[slotNum - 1];
      return {
        slot: slotNum,
        file: null,
        preview: found ? resolveImageUrl(found.image_url) : null,
        existingUrl: found ? found.image_url : null,
        cleared: false,
      };
    });
    setImageSlots(slots);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("original_price", productForm.original_price || "");
    formData.append("discount_percentage", productForm.discount_percentage || 0);
    formData.append("category_id", productForm.category_id);
    formData.append("product_code", productForm.product_code);
    formData.append("priority_order", productForm.priority_order !== undefined ? productForm.priority_order : 0);
    formData.append("stock_status", productForm.stock_status);
    formData.append("featured", productForm.featured);
    formData.append("active", productForm.active);
    formData.append("short_description", productForm.short_description);
    formData.append("description", productForm.description);
    if (editingProduct?.slug) {
      formData.append("slug", editingProduct.slug);
    } else if (productForm.name) {
      formData.append("slug", productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    }

    imageSlots.forEach((s) => {
      if (s.file) {
        formData.append(`image_${s.slot}`, s.file);
      } else if (s.cleared) {
        formData.append(`clear_image_${s.slot}`, "true");
      } else if (s.existingUrl) {
        formData.append(`existing_image_${s.slot}`, s.existingUrl);
      }
    });

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
        setFeedback({ type: "success", message: `Updated product "${productForm.name}" successfully!` });
      } else {
        await api.createProduct(formData);
        setFeedback({ type: "success", message: `Created product "${productForm.name}" successfully!` });
      }
      setShowProductModal(false);
      loadAllData();
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setFeedback({ type: "success", message: `Deleted product "${name}".` });
      loadAllData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    try {
      await api.createCategory(categoryForm);
      setCategoryForm({ name: "", slug: "" });
      setFeedback({ type: "success", message: `Category added!` });
      loadAllData();
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.deleteCategory(id);
      setFeedback({ type: "success", message: "Category deleted." });
      loadAllData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleQuickPriceUpdate = async (id, newPrice) => {
    const formData = new FormData();
    formData.append("price", newPrice);
    try {
      await api.updateProduct(id, formData);
      setFeedback({ type: "success", message: `Price updated to Rs. ${newPrice}!` });
      loadAllData();
    } catch (err) {
      alert("Price update failed: " + err.message);
    }
  };

  const handleQuickStockToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "in_stock" ? "out_of_stock" : "in_stock";
    const formData = new FormData();
    formData.append("stock_status", newStatus);
    try {
      await api.updateProduct(id, formData);
      loadAllData();
    } catch (err) {
      alert("Stock update failed: " + err.message);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setNoticeSaving(true);
    try {
      const updated = await api.updateNotice(notice);
      setNotice(updated);
      setFeedback({ type: "success", message: "Store notice and settings updated successfully!" });
    } catch (err) {
      alert("Error saving notice: " + err.message);
    } finally {
      setNoticeSaving(false);
    }
  };

  // ---------------- LOGIN VIEW (WITH 2FA OTP) ----------------
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>🛍️</span>
            <div>
              <h1 className="login-title">LAURA FANCY STORE</h1>
              <span className="sidebar-badge">ADMIN ACCESS</span>
            </div>
          </div>

          {loginStep === "credentials" ? (
            <>
              <p className="login-subtitle">
                Enter your administrator credentials to access the central inventory management portal.
              </p>

              {loginError && (
                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                >
                  {isSubmitting ? "Authenticating..." : "Sign In with Email OTP →"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  marginBottom: "12px",
                  border: "1px solid #bbf7d0"
                }}>
                  <ShieldCheck size={26} />
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>Two-Factor Authentication</h2>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
                  A 6-digit verification code was sent to <br />
                  <strong style={{ color: "#0f172a" }}>{otpEmail || loginForm.email}</strong>
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>
                  Please check your Gmail inbox and enter the code below to complete sign in.
                </p>
              </div>

              {loginError && (
                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                  {loginError}
                </div>
              )}

              {resendSuccess && (
                <div style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                  {resendSuccess}
                </div>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label className="form-label" style={{ textAlign: "center", display: "block" }}>Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="form-input"
                    style={{
                      textAlign: "center",
                      letterSpacing: "10px",
                      fontSize: "26px",
                      fontWeight: "700",
                      fontFamily: "monospace",
                      padding: "12px 16px",
                      borderRadius: "10px",
                    }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="••••••"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || otp.length !== 6}
                  style={{ width: "100%", justifyContent: "center", padding: "12px", marginBottom: "16px" }}
                >
                  {isSubmitting ? "Verifying Code..." : "Verify & Enter Admin Console →"}
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                  <button
                    type="button"
                    onClick={() => { setLoginStep("credentials"); setLoginError(""); setResendSuccess(""); }}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", padding: 0 }}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpTimer > 0 || isSubmitting}
                    style={{
                      background: "none",
                      border: "none",
                      color: otpTimer > 0 ? "#94a3b8" : "#2563eb",
                      fontWeight: "600",
                      cursor: otpTimer > 0 ? "not-allowed" : "pointer",
                      padding: 0
                    }}
                  >
                    {otpTimer > 0 ? `Resend code in ${otpTimer}s` : "Resend Code"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------------- ADMIN DASHBOARD VIEW ----------------
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div>
            <h2>LAURA FANCY STORE</h2>
            <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
              <span className="sidebar-badge">ADMIN PORTAL</span>
              <span style={{ fontSize: "10px", color: "#94a3b8" }}>v2.0 MSA</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} />
            Products ({products.length})
          </button>
          <button
            className={`nav-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <FolderTree size={18} />
            Categories ({categories.length})
          </button>
          <button
            className={`nav-item ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            <Boxes size={18} />
            Inventory Control
          </button>
          <button
            className={`nav-item ${activeTab === "notices" ? "active" : ""}`}
            onClick={() => setActiveTab("notices")}
          >
            <Megaphone size={18} />
            Store Notice & Promos
          </button>
          <button
            className={`nav-item ${activeTab === "admins" ? "active" : ""}`}
            onClick={() => setActiveTab("admins")}
          >
            <Users size={18} />
            Admin Team ({adminUsers.length})
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <span style={{ color: "#f8fafc", fontWeight: "600" }}>{user?.email}</span>
            <span style={{ color: "#38bdf8", fontSize: "11px" }}>{user?.role}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <h1 className="topbar-title">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "products" && "Product Catalog Management"}
            {activeTab === "categories" && "Store Category Management"}
            {activeTab === "inventory" && "Fast Inventory & Price Control"}
            {activeTab === "notices" && "Store Notice & Promotional Announcements"}
          </h1>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button className="btn btn-secondary" onClick={loadAllData} title="Refresh Data">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="btn btn-primary" onClick={openAddProduct}>
              <PlusCircle size={16} />
              Add Product
            </button>
          </div>
        </header>

        {/* Feedback alert */}
        {feedback && (
          <div
            style={{
              margin: "16px 32px 0",
              padding: "12px 16px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: feedback.type === "success" ? "#dcfce7" : "#fee2e2",
              color: feedback.type === "success" ? "#166534" : "#991b1b",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            <span>{feedback.message}</span>
            <button
              onClick={() => setFeedback(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              ×
            </button>
          </div>
        )}

        <div className="admin-content">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span>Total Products</span>
                    <Package size={18} color="#2563eb" />
                  </div>
                  <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span>In Stock</span>
                    <CheckCircle size={18} color="#10b981" />
                  </div>
                  <div className="stat-value">{stats.inStock}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span>Out of Stock</span>
                    <AlertCircle size={18} color="#ef4444" />
                  </div>
                  <div className="stat-value">{stats.outOfStock}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span>Active Categories</span>
                    <FolderTree size={18} color="#f59e0b" />
                  </div>
                  <div className="stat-value">{stats.categoriesCount}</div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <h3>Recent Store Inventory</h3>
                  <button className="btn btn-secondary" onClick={() => setActiveTab("products")}>
                    View All Products →
                  </button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Product Name</th>
                      <th>Priority</th>
                      <th>Code</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={resolveImageUrl(p.images?.[0] || p.image)}
                            alt={p.name}
                            className="prod-thumb"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop";
                            }}
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: "#f1f5f9",
                              color: "#0f172a",
                              fontWeight: "800",
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              border: "1px solid #cbd5e1",
                              padding: "2px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            #{p.priority_order || "—"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{p.product_code}</span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
                            Rs. {p.price.toLocaleString("en-US")}
                          </span>
                        </td>
                        <td>{p.categories?.name || p.category?.name || categories.find((c) => c.id === p.category_id)?.name || "—"}</td>
                        <td>
                          <span className={`badge ${p.stock_status === "in_stock" ? "badge-success" : "badge-danger"}`}>
                            {p.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td>
                          <button className="btn-edit-sm" onClick={() => openEditProduct(p)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 2: ALL PRODUCTS */}
          {activeTab === "products" && (
            <div className="table-card">
              <div className="table-header">
                <h3>All Store Products ({products.length})</h3>
                <button className="btn btn-primary" onClick={openAddProduct}>
                  <PlusCircle size={14} />
                  Add New Product
                </button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Priority</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={resolveImageUrl(p.images?.[0] || p.image)}
                          alt={p.name}
                          className="prod-thumb"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop";
                          }}
                        />
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.short_description?.slice(0, 50)}...</p>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: "#f1f5f9",
                            color: "#0f172a",
                            fontWeight: "800",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            border: "1px solid #cbd5e1",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            display: "inline-block",
                          }}
                          title="Frontend display priority order"
                        >
                          #{p.priority_order || "—"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{p.product_code}</span>
                      </td>
                      <td>{p.categories?.name || p.category?.name || categories.find((c) => c.id === p.category_id)?.name || "Uncategorized"}</td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
                          Rs. {p.price.toLocaleString("en-US")}
                        </span>
                        {p.original_price && p.original_price > p.price && (
                          <div style={{ display: "flex", gap: "4px", alignItems: "center", marginTop: "2px" }}>
                            <del style={{ fontSize: "11px", color: "#94a3b8" }}>
                              Rs. {p.original_price.toLocaleString("en-US")}
                            </del>
                            <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: "700" }}>
                              -{p.discount_percentage || Math.round(((p.original_price - p.price) / p.original_price) * 100)}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        {p.featured ? (
                          <span className="badge badge-info">Featured</span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>No</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${p.stock_status === "in_stock" ? "badge-success" : "badge-danger"}`}>
                          {p.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button className="btn-edit-sm" onClick={() => openEditProduct(p)}>
                            Edit
                          </button>
                          <button className="btn-danger-sm" onClick={() => handleDeleteProduct(p.id, p.name)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
              <div className="table-card">
                <div className="table-header">
                  <h3>All Categories ({categories.length})</h3>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{c.slug}</span>
                        </td>
                        <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "Default"}</td>
                        <td>
                          <button className="btn-danger-sm" onClick={() => handleDeleteCategory(c.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-card" style={{ height: "fit-content" }}>
                <div className="table-header">
                  <h3>Add New Category</h3>
                </div>
                <form onSubmit={handleCreateCategory} style={{ padding: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Wellness & Spa"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. wellness-spa"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Create Category
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY / QUICK PRICE EDIT */}
          {activeTab === "inventory" && (
            <div className="table-card">
              <div className="table-header">
                <h3>Live Price & Stock Adjustments</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Changes take effect immediately on Customer Storefront
                </span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Current Price (LKR)</th>
                    <th>Quick Edit Price</th>
                    <th>Stock Status</th>
                    <th>Toggle Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{p.product_code}</span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", fontSize: "14px" }}>
                          Rs. {p.price.toLocaleString("en-US")}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="number"
                            defaultValue={p.price}
                            id={`price-input-${p.id}`}
                            className="form-input"
                            style={{ width: "110px", padding: "6px 8px" }}
                          />
                          <button
                            className="btn btn-secondary"
                            style={{ padding: "6px 10px", fontSize: "11px" }}
                            onClick={() => {
                              const val = document.getElementById(`price-input-${p.id}`).value;
                              handleQuickPriceUpdate(p.id, val);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${p.stock_status === "in_stock" ? "badge-success" : "badge-danger"}`}>
                          {p.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={p.stock_status === "in_stock" ? "btn-danger-sm" : "btn-edit-sm"}
                          onClick={() => handleQuickStockToggle(p.id, p.stock_status)}
                        >
                          {p.stock_status === "in_stock" ? "Mark Out of Stock" : "Mark In Stock"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* TAB 5: NOTICES */}
          {activeTab === "notices" && (
            <div className="table-card" style={{ maxWidth: "800px" }}>
              <div className="table-header">
                <h3>Store Notice & Promotional Settings</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  This notice appears at the top of the customer storefront.
                </span>
              </div>
              <form onSubmit={handleNoticeSubmit} style={{ padding: "24px" }}>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={notice.is_active}
                      onChange={(e) => setNotice({ ...notice, is_active: e.target.checked })}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>Enable Global Store Notice Bar</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Main Notice Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={notice.notice_text}
                    onChange={(e) => setNotice({ ...notice, notice_text: e.target.value })}
                    placeholder="e.g., Buy 3500 or more and get Free Delivery !!!"
                    required
                  />
                  <small style={{ color: "#64748b", marginTop: "4px", display: "block" }}>The primary message shown to customers.</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Badge/Highlight Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={notice.badge_text}
                      onChange={(e) => setNotice({ ...notice, badge_text: e.target.value })}
                      placeholder="e.g., LIMITED TIME ONLY"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Minimum Order Amount (LKR) [Optional Context]</label>
                    <input
                      type="number"
                      className="form-input"
                      value={notice.min_order_amount}
                      onChange={(e) => setNotice({ ...notice, min_order_amount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Global Discount % [Optional Context]</label>
                    <input
                      type="number"
                      className="form-input"
                      value={notice.discount_percentage}
                      onChange={(e) => setNotice({ ...notice, discount_percentage: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ marginTop: "20px" }}
                  disabled={noticeSaving}
                >
                  {noticeSaving ? "Saving..." : "Save Notice Settings"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: ADMIN TEAM */}
          {activeTab === "admins" && (
            <div className="table-card">
              <div className="table-header">
                <div>
                  <h3>Authorized Administrators</h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Team members who have full access to this inventory and store management dashboard.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={fetchAdminUsers}
                    title="Refresh administrator list"
                    type="button"
                  >
                    <RefreshCw size={16} /> Refresh
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setAdminForm({ email: "", password: "", showPassword: false });
                      setShowAdminModal(true);
                    }}
                    type="button"
                  >
                    <UserPlus size={16} /> Add Administrator
                  </button>
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Date Added</th>
                    <th>Security Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((adm) => {
                    const isCurrentUser = user && (adm.id === user.id || adm.email?.toLowerCase() === user.email?.toLowerCase());
                    return (
                      <tr key={adm.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <strong>{adm.email}</strong>
                            {isCurrentUser && (
                              <span style={{ fontSize: "10px", background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold" }}>
                                Current User
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="sidebar-badge" style={{ textTransform: "uppercase" }}>
                            {adm.role || "Admin"}
                          </span>
                        </td>
                        <td>
                          {adm.created_at ? new Date(adm.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Default"}
                        </td>
                        <td>
                          <span className="badge badge-success">2FA Enabled</span>
                        </td>
                        <td>
                          {isCurrentUser ? (
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                              Active Session
                            </span>
                          ) : (
                            <button
                              className="btn-danger-sm"
                              onClick={() => handleDeleteAdmin(adm.id, adm.email)}
                            >
                              Revoke Access
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {adminUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                        No additional administrators found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ---------------- PRODUCT ADD / EDIT MODAL ---------------- */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}</h3>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price (LKR) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Regular / Original Price (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 1500 (optional)"
                      value={productForm.original_price}
                      onChange={(e) => {
                        const orig = e.target.value;
                        const sell = parseFloat(productForm.price);
                        let discount = productForm.discount_percentage;
                        if (orig && sell && parseFloat(orig) > sell) {
                          discount = Math.round(((parseFloat(orig) - sell) / parseFloat(orig)) * 100);
                        }
                        setProductForm({ ...productForm, original_price: orig, discount_percentage: discount });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount (% OFF)</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="form-input"
                      placeholder="e.g. 20"
                      value={productForm.discount_percentage}
                      onChange={(e) => setProductForm({ ...productForm, discount_percentage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. LFS-101"
                      value={productForm.product_code}
                      onChange={(e) => setProductForm({ ...productForm, product_code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority Order (Frontend)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      placeholder="e.g. 1, 2, 3..."
                      value={productForm.priority_order}
                      onChange={(e) => setProductForm({ ...productForm, priority_order: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Status</label>
                    <select
                      className="form-select"
                      value={productForm.stock_status}
                      onChange={(e) => setProductForm({ ...productForm, stock_status: e.target.value })}
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="form-row" style={{ marginBottom: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    />
                    Feature on Customer Homepage
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={productForm.active}
                      onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                    />
                    Active / Visible in Store
                  </label>
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Product Images (Up to 4 Images)
                    </label>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
                      ✦ Image 1 is the first default showing image
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                    {imageSlots.map((slotItem) => (
                      <div
                        key={slotItem.slot}
                        style={{
                          border: slotItem.slot === 1 ? "2px solid #2563eb" : "1px solid var(--border-color)",
                          borderRadius: "10px",
                          padding: "10px",
                          background: "#f8fafc",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            marginBottom: "6px",
                            color: slotItem.slot === 1 ? "#2563eb" : "var(--text-main)",
                          }}
                        >
                          {slotItem.slot === 1 ? "★ Image 1 (Default)" : `Image ${slotItem.slot}`}
                        </div>

                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "1",
                            borderRadius: "6px",
                            border: "1px dashed var(--border-color)",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            marginBottom: "8px",
                            position: "relative",
                          }}
                        >
                          {slotItem.preview ? (
                            <img
                              src={slotItem.preview}
                              alt={`Slot ${slotItem.slot}`}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                          ) : (
                            <span style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", padding: "4px" }}>
                              Empty
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "4px", width: "100%" }}>
                          <label
                            style={{
                              flex: 1,
                              padding: "4px 6px",
                              background: "#2563eb",
                              color: "#fff",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: "600",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            {slotItem.preview ? "Change" : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleSlotFileChange(slotItem.slot, e.target.files[0])}
                            />
                          </label>

                          {slotItem.preview && (
                            <button
                              type="button"
                              onClick={() => handleSlotRemove(slotItem.slot)}
                              style={{
                                padding: "4px 6px",
                                background: "#fee2e2",
                                color: "#b91c1c",
                                border: "1px solid #fca5a5",
                                borderRadius: "4px",
                                fontSize: "10px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={productForm.short_description}
                    onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- ADD ADMIN MODAL ---------------- */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h3>Add New Administrator</h3>
              <button
                className="modal-close"
                onClick={() => setShowAdminModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div style={{ padding: "24px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: 0, marginBottom: "20px", lineHeight: "1.5" }}>
                  Enter the email address and initial password for the new admin. Once added, they can log in to this exact dashboard and will receive 2FA security OTPs directly to their email.
                </p>

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">Administrator Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. colleague@gmail.com"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">Initial Password * (min 6 characters)</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type={adminForm.showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Enter secure password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                      minLength={6}
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setAdminForm({ ...adminForm, showPassword: !adminForm.showPassword })}
                      style={{
                        position: "absolute",
                        right: "10px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {adminForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Role & Privileges</label>
                  <input
                    type="text"
                    className="form-input"
                    value="Full Admin Access (Catalog, Inventory, Orders, Settings)"
                    disabled
                    style={{ background: "#f1f5f9", color: "#64748b", cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAdminModal(false)}
                  disabled={adminSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={adminSaving}
                >
                  {adminSaving ? "Creating Admin..." : "Add Administrator →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
