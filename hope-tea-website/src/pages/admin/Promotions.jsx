import { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Percent,
  Search,
  CheckCircle,
  X,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  getStoredPromotions,
  saveStoredPromotions,
} from "../../Data/adminStorage";

function formatPrice(val) {
  return `LKR ${Number(val || 0).toLocaleString("en-LK")}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "Ongoing";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Promotions() {
  const [promotions, setPromotions] = useState(getStoredPromotions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // 'All', 'Active', 'Inactive'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const filtered = useMemo(() => {
    return promotions.filter((p) => {
      const matchesSearch =
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && p.active) ||
        (filter === "Inactive" && !p.active);
      return matchesSearch && matchesFilter;
    });
  }, [promotions, search, filter]);

  // Summary Metrics
  const activeCount = promotions.filter((p) => p.active).length;
  const totalUses = promotions.reduce((sum, p) => sum + Number(p.usesCount || 0), 0);

  const openNewModal = () => {
    setEditingPromo({
      id: `PROMO-${Date.now().toString().slice(-4)}`,
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 2000,
      validUntil: "2026-12-31",
      active: true,
      usesCount: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPromo({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingPromo.code.trim()) return;

    const codeClean = editingPromo.code.trim().toUpperCase();
    let updated;
    const exists = promotions.some((p) => p.id === editingPromo.id);

    if (exists) {
      updated = promotions.map((p) =>
        p.id === editingPromo.id ? { ...editingPromo, code: codeClean } : p
      );
    } else {
      updated = [{ ...editingPromo, code: codeClean }, ...promotions];
    }

    setPromotions(updated);
    saveStoredPromotions(updated);
    setIsModalOpen(false);
  };

  const toggleStatus = (id) => {
    const updated = promotions.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    setPromotions(updated);
    saveStoredPromotions(updated);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this promotion code?")) return;
    const updated = promotions.filter((p) => p.id !== id);
    setPromotions(updated);
    saveStoredPromotions(updated);
  };

  return (
    <div className="admin-promotions-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">MARKETING & DISCOUNTS</span>
          <h1>Promotions & Vouchers</h1>
          <p>
            Create and track promotional discount vouchers for the online tea store.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={openNewModal}
          style={{ background: "#26422d", color: "#ffffff" }}
        >
          <Plus size={16} />
          Create Promotion
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-order-stats">
        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Active Campaigns</span>
            <Tag size={19} color="#719b75" />
          </div>
          <strong>{activeCount}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Total Redemptions</span>
            <Sparkles size={19} color="#c49646" />
          </div>
          <strong>{totalUses} orders</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Total Vouchers</span>
            <Percent size={19} />
          </div>
          <strong>{promotions.length}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Primary Offer</span>
            <CheckCircle size={19} />
          </div>
          <strong style={{ fontSize: "16px", color: "#243c2d" }}>
            {promotions[0]?.code || "NONE"}
          </strong>
        </div>
      </div>

      {/* Table Section */}
      <section className="admin-orders-table-section">
        <div className="admin-orders-table-heading">
          <div>
            <span>STORE DISCOUNT CODES</span>
            <h2>Active & Scheduled Vouchers</h2>
          </div>
          <span className="admin-order-total">{filtered.length} Vouchers</span>
        </div>

        {/* Toolbar */}
        <div className="admin-order-toolbar">
          <div className="admin-order-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by promo code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter promotions by status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive / Paused</option>
          </select>
        </div>

        {/* Table */}
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>CODE</th>
                <th>DESCRIPTION</th>
                <th>DISCOUNT VALUE</th>
                <th>MIN. PURCHASE</th>
                <th>VALID UNTIL</th>
                <th>USES</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((promo) => {
                const isPct = promo.discountType === "percentage";

                return (
                  <tr key={promo.id}>
                    <td>
                      <code className="admin-batch-code" style={{ fontWeight: "700", letterSpacing: "1px", background: "#f5f0e3", color: "#6a5223" }}>
                        {promo.code}
                      </code>
                    </td>
                    <td>{promo.description}</td>
                    <td>
                      <strong style={{ color: "#243c2d" }}>
                        {isPct ? `${promo.discountValue}% OFF` : `${formatPrice(promo.discountValue)} FLAT`}
                      </strong>
                    </td>
                    <td>{formatPrice(promo.minOrderAmount)}</td>
                    <td>
                      <span className="admin-field-location">
                        <Calendar size={13} /> {formatDate(promo.validUntil)}
                      </span>
                    </td>
                    <td>
                      <strong>{promo.usesCount || 0}</strong> uses
                    </td>
                    <td>
                      <span className={`order-status ${promo.active ? "delivered" : "cancelled"}`}>
                        {promo.active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title={promo.active ? "Pause promotion" : "Activate promotion"}
                          onClick={() => toggleStatus(promo.id)}
                        >
                          {promo.active ? (
                            <ToggleRight size={18} color="#2d5438" />
                          ) : (
                            <ToggleLeft size={18} color="#8a9987" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit promotion"
                          onClick={() => openEditModal(promo)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn danger"
                          title="Delete promotion"
                          onClick={() => handleDelete(promo.id)}
                        >
                          <Trash2 size={15} />
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

      {/* Edit / Create Modal */}
      {isModalOpen && editingPromo && (
        <div
          className="admin-order-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="admin-order-modal"
            style={{ maxWidth: "580px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <span>ESTATE PROMOTIONS</span>
                <h2>{promotions.some((p) => p.id === editingPromo.id) ? "Edit Promotion" : "New Promotion"}</h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Promo Code (Uppercase letters & numbers)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HARVEST2026"
                  value={editingPromo.code}
                  onChange={(e) =>
                    setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase() })
                  }
                  style={{ textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700" }}
                />
              </div>

              <div className="admin-form-group">
                <label>Offer Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% off orders over LKR 4,000"
                  value={editingPromo.description}
                  onChange={(e) =>
                    setEditingPromo({ ...editingPromo, description: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Discount Type</label>
                  <select
                    value={editingPromo.discountType}
                    onChange={(e) =>
                      setEditingPromo({ ...editingPromo, discountType: e.target.value })
                    }
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount (LKR)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingPromo.discountValue}
                    onChange={(e) =>
                      setEditingPromo({
                        ...editingPromo,
                        discountValue: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Minimum Order Amount (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPromo.minOrderAmount}
                    onChange={(e) =>
                      setEditingPromo({
                        ...editingPromo,
                        minOrderAmount: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Valid Until Date</label>
                  <input
                    type="date"
                    value={editingPromo.validUntil}
                    onChange={(e) =>
                      setEditingPromo({ ...editingPromo, validUntil: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={editingPromo.active}
                    onChange={(e) =>
                      setEditingPromo({ ...editingPromo, active: e.target.checked })
                    }
                    style={{ width: "18px", height: "18px" }}
                  />
                  <span>Activate voucher for customer checkout immediately</span>
                </label>
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
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;

