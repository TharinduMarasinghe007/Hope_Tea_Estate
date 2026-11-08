import { useState, useMemo } from "react";
import {
  Boxes,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import { getStoredInventory, saveStoredInventory } from "../../Data/adminStorage";

function Inventory() {
  const [inventory, setInventory] = useState(getStoredInventory);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(10);
  const [adjustReason, setAdjustReason] = useState("Harvest restock");

  const filtered = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.originField.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [inventory, search]);

  const totalStock = inventory.reduce((sum, item) => sum + Number(item.stockUnits || 0), 0);
  const lowCount = inventory.filter((item) => item.stockUnits <= item.thresholdUnits).length;

  const handleAdjust = (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    const updated = inventory.map((item) => {
      if (item.id === selectedBatch.id) {
        const newStock = Math.max(0, item.stockUnits + Number(adjustAmount));
        return {
          ...item,
          stockUnits: newStock,
          status: newStock <= item.thresholdUnits ? "Low Stock" : "Normal",
        };
      }
      return item;
    });

    setInventory(updated);
    saveStoredInventory(updated);
    setSelectedBatch(null);
  };

  return (
    <div className="admin-inventory-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">HEWAHETA HARVEST & PACKAGING</span>
          <h1>Sales Inventory</h1>
          <p>Monitor tea harvest batches, warehouse reserves, and threshold alerts.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="admin-order-stats">
        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Total Units in Reserve</span>
            <Boxes size={19} />
          </div>
          <strong>{totalStock} units</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Tracked Batches</span>
            <Sparkles size={19} />
          </div>
          <strong>{inventory.length}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Low Reserve Warnings</span>
            <AlertTriangle size={19} color="#d5a24f" />
          </div>
          <strong style={{ color: lowCount > 0 ? "#b85d19" : "inherit" }}>
            {lowCount}
          </strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Harvest Season</span>
            <Clock size={19} />
          </div>
          <strong>Oct - Nov 2026</strong>
        </div>
      </div>

      {/* Table Section */}
      <section className="admin-orders-table-section">
        <div className="admin-orders-table-heading">
          <div>
            <span>WAREHOUSE RESERVE</span>
            <h2>Tea Batches</h2>
          </div>
          <span className="admin-order-total">{filtered.length} Batches</span>
        </div>

        <div className="admin-order-toolbar">
          <div className="admin-order-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by batch ID, tea name, or estate division..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>BATCH ID</th>
                <th>TEA VARIETY</th>
                <th>GARDEN DIVISION</th>
                <th>HARVEST</th>
                <th>WEIGHT</th>
                <th>UNITS IN STOCK</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => {
                const isLow = item.stockUnits <= item.thresholdUnits;

                return (
                  <tr key={item.id}>
                    <td>
                      <code className="admin-batch-code">{item.id}</code>
                    </td>
                    <td>
                      <strong>{item.productName}</strong>
                    </td>
                    <td>
                      <span className="admin-field-location">
                        <MapPin size={13} /> {item.originField}
                      </span>
                    </td>
                    <td>{item.harvestDate}</td>
                    <td>{item.packageWeight}</td>
                    <td>
                      <strong>{item.stockUnits}</strong>
                    </td>
                    <td>
                      <span className={`order-status ${isLow ? "pending" : "delivered"}`}>
                        {isLow ? "Low Stock" : "Sufficient"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-adjust-btn"
                        onClick={() => {
                          setSelectedBatch(item);
                          setAdjustAmount(10);
                        }}
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Adjust Modal */}
      {selectedBatch && (
        <div className="admin-order-modal-backdrop" onClick={() => setSelectedBatch(null)}>
          <div className="admin-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span>BATCH STOCK ADJUSTMENT</span>
                <h2>{selectedBatch.productName}</h2>
              </div>
              <button type="button" onClick={() => setSelectedBatch(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdjust} className="admin-modal-form">
              <p style={{ margin: "0 0 15px", color: "#667868", fontSize: "13px" }}>
                Current reserve: <strong>{selectedBatch.stockUnits} units</strong>. Add or deduct quantity based on factory intake or store dispatches.
              </p>

              <div className="admin-form-group">
                <label>Quantity to Add or Deduct (Use negative for deduction)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => setAdjustAmount((a) => a - 10)}
                  >
                    <Minus size={15} />
                  </button>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    style={{ textAlign: "center", fontWeight: "600", fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => setAdjustAmount((a) => a + 10)}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Reason / Audit Note</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                >
                  <option value="Harvest restock">Harvest restock from Hewaheta factory</option>
                  <option value="Retail packaging batch">Retail packaging batch complete</option>
                  <option value="Packaging damage or loss">Packaging damage or loss</option>
                  <option value="Inventory audit adjustment">Inventory audit adjustment</option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setSelectedBatch(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
