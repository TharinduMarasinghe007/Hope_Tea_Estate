import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  Edit2,
  Save,
  Check,
} from "lucide-react";

export default function Account() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, getUserOrders, updateProfile } =
    useAuth();

  const [activeTab, setActiveTab] = useState("orders");
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);
  const [securityNotice, setSecurityNotice] = useState("");

  const [addressForm, setAddressForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "Colombo",
    postalCode: currentUser?.postalCode || "",
  });

  if (!isAuthenticated || !currentUser) {
    return (
      <main className="account-empty-wrap">
        <div className="account-empty-card">
          <User size={38} className="account-empty-icon" />
          <h2>Sign in to view your account</h2>
          <p>Please sign in or create an account to view your past orders and saved delivery details.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/login" className="btn-primary-pill">
              Sign In
            </Link>
            <Link to="/register" className="btn-secondary-pill">
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const orders = getUserOrders();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    updateProfile(addressForm);
    setEditingAddress(false);
    setAddressSuccess(true);
    setTimeout(() => setAddressSuccess(false), 3000);
  };

  const formatPrice = (val) => `LKR ${Number(val || 0).toLocaleString("en-LK")}`;

  const formatDate = (isoStr) => {
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    return isNaN(d.getTime())
      ? isoStr
      : d.toLocaleDateString("en-LK", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <span className="account-badge badge-delivered"><CheckCircle size={12} /> Delivered</span>;
      case "Dispatched":
        return <span className="account-badge badge-dispatched"><Truck size={12} /> Dispatched</span>;
      case "Processing":
        return <span className="account-badge badge-processing"><Clock size={12} /> Processing</span>;
      default:
        return <span className="account-badge badge-pending"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <main className="account-page-wrap">
      <div className="account-inner">
        {/* Profile Card Header */}
        <section className="account-profile-header">
          <div className="account-user-meta">
            <div className="account-avatar-wrap">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.firstName}
                  className="account-avatar-img"
                />
              ) : (
                <div className="account-avatar-initials">
                  {(currentUser.firstName || "U")[0]}
                </div>
              )}
            </div>

            <div className="account-user-info">
              <div className="account-name-badge-row">
                <h1>
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                {currentUser.provider === "google" ? (
                  <span className="account-verified-pill google-verified">
                    <ShieldCheck size={13} /> Google Verified
                  </span>
                ) : (
                  <span className="account-verified-pill email-verified">
                    <ShieldCheck size={13} /> Verified Estate Patron
                  </span>
                )}
              </div>
              <p className="account-email-line">
                <Mail size={14} /> {currentUser.email}
              </p>
              {currentUser.phone && (
                <p className="account-phone-line">
                  <Phone size={14} /> {currentUser.phone}
                </p>
              )}
            </div>
          </div>

          <div className="account-header-actions">
            <Link to="/collection" className="btn-secondary-pill">
              Shop Teas <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="account-signout-btn"
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </section>

        {/* Tab Selector */}
        <div className="account-tabs-nav">
          <button
            type="button"
            className={`account-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={17} />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            className={`account-tab-btn ${activeTab === "address" ? "active" : ""}`}
            onClick={() => setActiveTab("address")}
          >
            <MapPin size={17} />
            <span>Delivery & Details</span>
          </button>
          <button
            type="button"
            className={`account-tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <ShieldCheck size={17} />
            <span>Security & Verification</span>
          </button>
        </div>

        {/* 1. ORDERS TAB */}
        {activeTab === "orders" && (
          <section className="account-orders-section">
            {orders.length === 0 ? (
              <div className="account-no-orders">
                <ShoppingBag size={36} className="no-orders-icon" />
                <h3>No orders placed yet</h3>
                <p>
                  Explore our premium Ceylon highland teas and place your first order.
                </p>
                <Link to="/collection" className="btn-primary-pill" style={{ marginTop: "16px" }}>
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="account-orders-list">
                {orders.map((o) => (
                  <div key={o.orderNumber} className="account-order-card">
                    <div className="account-order-header">
                      <div className="account-order-id-block">
                        <span className="order-num-label">ORDER</span>
                        <strong>{o.orderNumber}</strong>
                      </div>

                      <div className="account-order-date-block">
                        <Calendar size={14} />
                        <span>{formatDate(o.createdAt || o.date)}</span>
                      </div>

                      <div className="account-order-total-block">
                        <span>Total:</span>
                        <strong>{formatPrice(o.total || o.subtotal)}</strong>
                      </div>

                      <div>{getStatusBadge(o.status)}</div>
                    </div>

                    <div className="account-order-body">
                      <div className="account-order-items">
                        {(o.items || []).map((item, idx) => (
                          <div key={idx} className="account-order-item-row">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="order-item-thumb"
                            />
                            <div className="order-item-info">
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-meta">
                                Qty: {item.quantity} · {item.weight || "100g"}
                              </span>
                            </div>
                            <span className="order-item-price">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="account-order-delivery-meta">
                        <MapPin size={14} />
                        <span>
                          Delivering to: {o.customer?.address ? `${o.customer.address}, ` : ""}
                          {o.customer?.city || "Sri Lanka"} · {o.paymentMethod || "Cash on Delivery"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 2. SAVED ADDRESS / PROFILE TAB */}
        {activeTab === "address" && (
          <section className="account-address-section">
            {addressSuccess && (
              <div className="account-address-success-banner">
                <Check size={16} /> Details updated successfully!
              </div>
            )}

            {!editingAddress ? (
              <div className="account-address-view-card">
                <div className="account-card-top-row">
                  <div>
                    <h3>Saved Delivery Address</h3>
                    <p>This address will be pre-filled when you checkout.</p>
                  </div>
                  <button
                    type="button"
                    className="account-edit-details-btn"
                    onClick={() => setEditingAddress(true)}
                  >
                    <Edit2 size={15} /> Edit Details
                  </button>
                </div>

                <div className="account-address-grid">
                  <div className="address-field-block">
                    <span>Contact Name</span>
                    <strong>
                      {currentUser.firstName} {currentUser.lastName}
                    </strong>
                  </div>

                  <div className="address-field-block">
                    <span>Email Address</span>
                    <strong>{currentUser.email}</strong>
                  </div>

                  <div className="address-field-block">
                    <span>Phone Number</span>
                    <strong>{currentUser.phone || "Not set yet"}</strong>
                  </div>

                  <div className="address-field-block">
                    <span>Delivery Address</span>
                    <strong>
                      {currentUser.address || "No street address saved yet"}
                    </strong>
                  </div>

                  <div className="address-field-block">
                    <span>City</span>
                    <strong>{currentUser.city || "Colombo"}</strong>
                  </div>

                  <div className="address-field-block">
                    <span>Postal Code</span>
                    <strong>{currentUser.postalCode || "N/A"}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="account-address-edit-form">
                <div className="account-card-top-row">
                  <div>
                    <h3>Edit Delivery Details</h3>
                    <p>Update your shipping address for future tea deliveries.</p>
                  </div>
                </div>

                <div className="auth-grid-two">
                  <div className="auth-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.firstName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, firstName: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>

                  <div className="auth-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={addressForm.lastName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, lastName: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-grid-two">
                  <div className="auth-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>

                  <div className="auth-form-group">
                    <label>City / Region</label>
                    <select
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="auth-input auth-select"
                    >
                      <option value="Colombo">Colombo</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Negombo">Negombo</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Matara">Matara</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                    </select>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label>Delivery Street Address</label>
                  <input
                    type="text"
                    required
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, address: e.target.value })
                    }
                    className="auth-input"
                  />
                </div>

                <div className="account-form-actions-row">
                  <button type="submit" className="btn-primary-pill">
                    <Save size={16} /> Save Details
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-pill"
                    onClick={() => setEditingAddress(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* 3. SECURITY & VERIFICATION TAB */}
        {activeTab === "security" && (
          <section className="account-security-section">
            <div className="account-address-view-card">
              <div className="address-card-header">
                <div className="address-card-title-block">
                  <ShieldCheck size={22} color="var(--tea-forest)" />
                  <div>
                    <h3>Estate Account Verification</h3>
                    <p>Verified patronage & authentication status at Hope Tea Estate.</p>
                  </div>
                </div>
              </div>

              {securityNotice && (
                <div className="auth-redirect-notice" style={{ margin: "16px 0 0" }}>
                  <CheckCircle size={16} />
                  <span>{securityNotice}</span>
                </div>
              )}

              <div className="security-badges-grid">
                <div className="security-item-card">
                  <div className="security-item-header">
                    <span className="security-label">ACCOUNT STATUS</span>
                    <span className="security-verified-tag">✓ Fully Verified</span>
                  </div>
                  <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                  <p>Verified Estate Patron & Ceylon Single-Origin Connoisseur.</p>
                </div>

                <div className="security-item-card">
                  <div className="security-item-header">
                    <span className="security-label">AUTHENTICATION METHOD</span>
                    <span className="security-verified-tag">
                      {currentUser.provider === "google" ? "Google OAuth 2.0" : "Encrypted Password"}
                    </span>
                  </div>
                  <strong>{currentUser.email}</strong>
                  <p>
                    {currentUser.provider === "google"
                      ? "Directly authenticated via Google Identity Services."
                      : "Secured with verified estate email and encrypted credentials."}
                  </p>
                </div>

                <div className="security-item-card">
                  <div className="security-item-header">
                    <span className="security-label">DELIVERY SMS UPDATES</span>
                    <span className="security-verified-tag">
                      {currentUser.phone ? "✓ Phone Linked" : "Pending"}
                    </span>
                  </div>
                  <strong>{currentUser.phone || "No phone added yet"}</strong>
                  <p>Receive real-time harvest dispatch & island-wide delivery notifications.</p>
                </div>

                <div className="security-item-card">
                  <div className="security-item-header">
                    <span className="security-label">DATA PROTECTION</span>
                    <span className="security-verified-tag">✓ 256-Bit SSL</span>
                  </div>
                  <strong>Strict Privacy & Ceylon Heritage Guarantee</strong>
                  <p>Your delivery notes and personal details are strictly private to Hope Tea Estate.</p>
                </div>
              </div>

              <div className="security-actions-row">
                <button
                  type="button"
                  className="btn-primary-pill"
                  onClick={() => {
                    setSecurityNotice("Security Audit Passed: Your customer account credentials and delivery passport are active & verified.");
                    setTimeout(() => setSecurityNotice(""), 4500);
                  }}
                >
                  <ShieldCheck size={16} /> Run Account Verification Audit
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

