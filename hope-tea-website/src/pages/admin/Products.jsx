import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  Leaf,
} from "lucide-react";
import { getStoredProducts, saveStoredProducts } from "../../Data/adminStorage";

const categories = [
  "All Teas",
  "Black Tea",
  "Green Tea",
  "Specialty Tea",
  "Gift Collection",
];

function formatPrice(val) {
  return `LKR ${Number(val || 0).toLocaleString("en-LK")}`;
}

function Products() {
  const [products, setProducts] = useState(getStoredProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Teas");
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered product catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "All Teas" || p.category === category;
      return matchesSearch && matchesCat;
    });
  }, [products, search, category]);

  // Quick stats
  const totalCount = products.length;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 30).length;
  const activeCount = products.filter((p) => p.active !== false).length;
  const avgPrice = Math.round(
    products.reduce((acc, p) => acc + Number(p.price || 0), 0) / (totalCount || 1)
  );

  const openNewModal = () => {
    setEditingProduct({
      id: Date.now(),
      name: "",
      category: "Black Tea",
      price: 1500,
      weight: "100g",
      stock: 50,
      tag: "NEW",
      description: "",
      image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=85&w=900",
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) return;

    let updated;
    const exists = products.some((p) => p.id === editingProduct.id);
    if (exists) {
      updated = products.map((p) =>
        p.id === editingProduct.id ? editingProduct : p
      );
    } else {
      updated = [editingProduct, ...products];
    }

    setProducts(updated);
    saveStoredProducts(updated);
    setIsModalOpen(false);
  };

  const toggleActive = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, active: p.active === false ? true : false } : p
    );
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to remove this tea from the catalogue?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  return (
    <div className="admin-products-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">ESTATE INVENTORY & CATALOG</span>
          <h1>Tea Products</h1>
          <p>Manage Ceylon tea items, prices, descriptions, and active store listings.</p>
        </div>

        <button type="button" className="admin-refresh-button" onClick={openNewModal}>
          <Plus size={16} />
          Add New Tea
        </button>
      </div>

      {/* Stats row */}
      <div className="admin-order-stats">
        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Total Catalog Items</span>
            <Package size={19} />
          </div>
          <strong>{totalCount}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Active on Storefront</span>
            <CheckCircle size={19} />
          </div>
          <strong>{activeCount}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Low Stock Alert</span>
            <AlertTriangle size={19} color="#d5a24f" />
          </div>
          <strong style={{ color: lowStockCount > 0 ? "#b85d19" : "inherit" }}>
            {lowStockCount}
          </strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Average Price</span>
            <Leaf size={19} />
          </div>
          <strong>{formatPrice(avgPrice)}</strong>
        </div>
      </div>

      {/* Table Section */}
      <section className="admin-orders-table-section">
        <div className="admin-orders-table-heading">
          <div>
            <span>STORE PRODUCTS</span>
            <h2>Product List</h2>
          </div>
          <span className="admin-order-total">{filteredProducts.length} Teas</span>
        </div>

        {/* Toolbar */}
        <div className="admin-order-toolbar">
          <div className="admin-order-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by tea name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>WEIGHT</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const isLow = (product.stock || 0) < 30;
                const isActive = product.active !== false;

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-prod-cell">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="admin-prod-thumb"
                        />
                        <div>
                          <strong>{product.name}</strong>
                          {product.tag && (
                            <span className="admin-prod-tag">{product.tag}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <strong>{formatPrice(product.price)}</strong>
                    </td>
                    <td>{product.weight}</td>
                    <td>
                      <span className={`admin-stock-badge ${isLow ? "low" : "ok"}`}>
                        {product.stock || 0} units
                      </span>
                    </td>
                    <td>
                      <span className={`order-status ${isActive ? "delivered" : "cancelled"}`}>
                        {isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title={isActive ? "Hide from store" : "Make visible"}
                          onClick={() => toggleActive(product.id)}
                        >
                          {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit product"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn danger"
                          title="Delete product"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit/Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="admin-order-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="admin-order-modal"
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <span>HOPE TEA CATALOG</span>
                <h2>{products.some((p) => p.id === editingProduct.id) ? "Edit Tea Item" : "New Tea Item"}</h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Tea Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="e.g. Broken Orange Pekoe"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                  >
                    <option value="Black Tea">Black Tea</option>
                    <option value="Green Tea">Green Tea</option>
                    <option value="Specialty Tea">Specialty Tea</option>
                    <option value="Gift Collection">Gift Collection</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Price (LKR)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Package Weight</label>
                  <input
                    type="text"
                    value={editingProduct.weight}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, weight: e.target.value })
                    }
                    placeholder="100g, 250g, Gift set"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Badge Tag</label>
                <input
                  type="text"
                  value={editingProduct.tag || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, tag: e.target.value.toUpperCase() })
                  }
                  placeholder="CLASSIC, SIGNATURE, MORNING, etc."
                />
              </div>

              <div className="admin-form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Aromatic notes, harvesting details, brewing suggestions..."
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

