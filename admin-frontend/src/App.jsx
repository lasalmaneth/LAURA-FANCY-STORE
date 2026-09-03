import React, { useState, useEffect } from "react";
import { api, auth } from "./api";
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
    stock_status: "in_stock",
    featured: false,
    active: true,
    short_description: "",
    description: "",
    imageFile: null,
  });

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "admin@laurafancystore.com", password: "admin123" });
  const [loginError, setLoginError] = useState("");

  const loadAllData = async () => {
    if (!auth.isAuthenticated()) return;
    setLoading(true);
    try {
      const [statsData, prodsData, catsData] = await Promise.all([
        api.getStats().catch(() => ({ total: 0, inStock: 0, outOfStock: 0, categoriesCount: 0 })),
        api.getProducts(),
        api.getCategories(),
      ]);
      setStats(statsData);
      setProducts(prodsData);
      setCategories(catsData);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await api.login(loginForm.email, loginForm.password);
      setIsAuthenticated(true);
      setUser(res.user);
    } catch (err) {
      setLoginError(err.message || "Failed to log in");
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUser(null);
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
      category_id: categories[0]?.id || "",
      product_code: "",
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
      category_id: prod.category_id || "",
      product_code: prod.product_code || "",
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
        preview: found
          ? found.image_url.startsWith("http")
            ? found.image_url
            : `http://localhost:8080${found.image_url}`
          : null,
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
    formData.append("category_id", productForm.category_id);
    formData.append("product_code", productForm.product_code);
    formData.append("stock_status", productForm.stock_status);
    formData.append("featured", productForm.featured);
    formData.append("active", productForm.active);
    formData.append("short_description", productForm.short_description);
    formData.append("description", productForm.description);

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

  // ---------------- LOGIN VIEW ----------------
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
          <p className="login-subtitle">Enter your administrator credentials to access the central inventory management portal.</p>

          {loginError && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
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
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
              Sign In to Admin Portal
            </button>
          </form>
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
                            src={p.images?.[0]?.image_url ? `http://localhost:8080${p.images[0].image_url}` : "/placeholder.png"}
                            alt={p.name}
                            className="prod-thumb"
                            onError={(e) => {
                              e.target.src = "http://localhost:8080/uploads/products/vacuum-flask-set.jpg";
                            }}
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{p.product_code}</span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
                            Rs. {p.price.toLocaleString("en-US")}
                          </span>
                        </td>
                        <td>{p.category?.name || "—"}</td>
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
                          src={p.images?.[0]?.image_url ? `http://localhost:8080${p.images[0].image_url}` : "/placeholder.png"}
                          alt={p.name}
                          className="prod-thumb"
                          onError={(e) => {
                            e.target.src = "http://localhost:8080/uploads/products/vacuum-flask-set.jpg";
                          }}
                        />
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.short_description?.slice(0, 50)}...</p>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{p.product_code}</span>
                      </td>
                      <td>{p.category?.name || "Uncategorized"}</td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
                          Rs. {p.price.toLocaleString("en-US")}
                        </span>
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
                    <label className="form-label">Price (LKR) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
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
    </div>
  );
}
