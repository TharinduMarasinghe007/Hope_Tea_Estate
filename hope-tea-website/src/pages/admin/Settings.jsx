import { useState } from "react";
import {
  Save,
  CheckCircle,
  Truck,
  Store,
  Shield,
} from "lucide-react";
import { getStoredSettings, saveStoredSettings } from "../../Data/adminStorage";

function Settings() {
  const [settings, setSettings] = useState(getStoredSettings);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">CONFIGURATION & PREFERENCES</span>
          <h1>Store Settings</h1>
          <p>Configure estate contact information, delivery rules, and operations.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={handleSubmit}
          style={{ background: "#26422d", color: "white" }}
        >
          <Save size={16} />
          Save Configuration
        </button>
      </div>

      {savedMessage && (
        <div
          style={{
            padding: "14px 20px",
            background: "#eaf3e9",
            color: "#355e3b",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "500",
          }}
        >
          <CheckCircle size={18} />
          Settings updated successfully! Changes are applied across the store.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {/* Estate Profile */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Estate Information</h3>
              <p>Official estate contact and branding details</p>
            </div>
            <Store size={20} color="#8a9987" />
          </div>

          <div className="admin-form-row" style={{ marginTop: "15px" }}>
            <div className="admin-form-group">
              <label>Estate Brand Name</label>
              <input
                type="text"
                value={settings.estateName}
                onChange={(e) => handleChange("estateName", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Subtitle / Region Tag</label>
              <input
                type="text"
                value={settings.estateSubtitle}
                onChange={(e) => handleChange("estateSubtitle", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Customer Support Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Estate Telephone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Registered Estate Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </section>

        {/* Shipping & Delivery */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Delivery & Checkout Rules</h3>
              <p>Delivery rates and island-wide shipping thresholds</p>
            </div>
            <Truck size={20} color="#8a9987" />
          </div>

          <div className="admin-form-row" style={{ marginTop: "15px" }}>
            <div className="admin-form-group">
              <label>Standard Delivery Rate (LKR)</label>
              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) => handleChange("deliveryFee", Number(e.target.value))}
              />
            </div>

            <div className="admin-form-group">
              <label>Free Delivery Threshold (LKR)</label>
              <input
                type="number"
                min="0"
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  handleChange("freeDeliveryThreshold", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => handleChange("codEnabled", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <span>Enable Cash on Delivery (COD) as primary payment option</span>
            </label>
          </div>
        </section>

        {/* Store Operations */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Store Operational Status</h3>
              <p>Control availability of online ordering</p>
            </div>
            <Shield size={20} color="#8a9987" />
          </div>

          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.storeOpen}
                onChange={(e) => handleChange("storeOpen", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <span><strong>Accepting Customer Orders</strong> (Store is active and open for tea orders)</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={settings.orderNotifications}
                onChange={(e) => handleChange("orderNotifications", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <span>Send browser notification alerts when a new order arrives</span>
            </label>
          </div>
        </section>
      </form>
    </div>
  );
}

export default Settings;
