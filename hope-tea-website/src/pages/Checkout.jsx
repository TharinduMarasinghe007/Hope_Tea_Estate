import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import {
  getStoredSettings,
  getStoredPromotions,
  saveStoredPromotions,
  saveStoredOrders,
  getStoredOrders,
} from "../Data/adminStorage";

const CART_KEY = "hopeTeaCart";

function Checkout() {
  const { currentUser, isAuthenticated, login, register, logout } = useAuth();
  const [settings] = useState(getStoredSettings);
  const [promotions] = useState(getStoredPromotions);

  // Inline checkout sign-in state
  const [authTab, setAuthTab] = useState("signin"); // "signin" | "register"
  const [inlineEmail, setInlineEmail] = useState("");
  const [inlinePassword, setInlinePassword] = useState("");
  const [inlineFirstName, setInlineFirstName] = useState("");
  const [inlineLastName, setInlineLastName] = useState("");
  const [inlinePhone, setInlinePhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(() => ({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "Colombo",
    postalCode: currentUser?.postalCode || "",
    notes: "",
  }));

  const handleAuthSuccess = (user) => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName || "",
        lastName: user.lastName || prev.lastName || "",
        email: user.email || prev.email || "",
        phone: user.phone || prev.phone || "",
        address: user.address || prev.address || "",
        city: user.city || prev.city || "Colombo",
        postalCode: user.postalCode || prev.postalCode || "",
      }));
    }
  };

  // Keep form in sync if account changes
  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        setForm((curr) => ({
          ...curr,
          firstName: currentUser.firstName || curr.firstName || "",
          lastName: currentUser.lastName || curr.lastName || "",
          email: currentUser.email || curr.email || "",
          phone: currentUser.phone || curr.phone || "",
          address: currentUser.address || curr.address || "",
          city: currentUser.city || curr.city || "Colombo",
          postalCode: currentUser.postalCode || curr.postalCode || "",
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleInlineSignIn = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError("");
    if (!inlineEmail.trim() || !inlinePassword) {
      setAuthError("Please enter your email and password.");
      return;
    }
    setAuthLoading(true);
    setTimeout(() => {
      const res = login(inlineEmail, inlinePassword);
      setAuthLoading(false);
      if (!res.success) {
        setAuthError(res.error || "Failed to sign in. Please verify your credentials.");
      } else {
        handleAuthSuccess(res.user);
      }
    }, 200);
  };

  const handleQuickDemoFill = (demoEmail, demoPass) => {
    setInlineEmail(demoEmail);
    setInlinePassword(demoPass);
    setAuthError("");
    setAuthLoading(true);
    setTimeout(() => {
      const res = login(demoEmail, demoPass);
      setAuthLoading(false);
      if (res.success) {
        handleAuthSuccess(res.user);
      }
    }, 200);
  };

  const handleInlineRegister = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError("");
    if (!inlineFirstName.trim()) {
      setAuthError("Please provide your first name.");
      return;
    }
    if (!inlineEmail.trim()) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (!inlinePassword || inlinePassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      const res = register({
        firstName: inlineFirstName,
        lastName: inlineLastName,
        email: inlineEmail,
        phone: inlinePhone,
        address: form.address,
        city: form.city,
        password: inlinePassword,
      });
      setAuthLoading(false);
      if (!res.success) {
        setAuthError(res.error || "Failed to create account.");
      } else {
        handleAuthSuccess(res.user);
      }
    }, 250);
  };

  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState({ text: "", isError: false });

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    );
  }, [cart]);

  // Delivery calculation from store settings
  const freeThreshold = Number(settings.freeDeliveryThreshold || 5000);
  const standardFee = Number(settings.deliveryFee || 350);
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : standardFee;

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === "percentage") {
      return Math.round((subtotal * appliedPromo.discountValue) / 100);
    }
    return Math.min(subtotal, appliedPromo.discountValue);
  }, [subtotal, appliedPromo]);

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoMessage({ text: "", isError: false });

    if (!promoCodeInput.trim()) {
      setPromoMessage({ text: "Please enter a voucher code.", isError: true });
      return;
    }

    const clean = promoCodeInput.trim().toUpperCase();
    const match = promotions.find(
      (p) => p.code.toUpperCase() === clean && p.active
    );

    if (!match) {
      setPromoMessage({
        text: "Invalid or expired promotion code.",
        isError: true,
      });
      return;
    }

    if (subtotal < Number(match.minOrderAmount || 0)) {
      setPromoMessage({
        text: `This code requires a minimum order of ${formatPrice(match.minOrderAmount)}.`,
        isError: true,
      });
      return;
    }

    setAppliedPromo(match);
    setPromoMessage({
      text: `Code applied: ${match.description}!`,
      isError: false,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!form.address.trim()) newErrors.address = "Delivery address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      const gate = document.querySelector(".checkout-auth-gate-card");
      if (gate) {
        gate.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = gate.querySelector("input");
        if (input) input.focus();
      }
      return;
    }

    if (!validateForm()) return;
    if (cart.length === 0) return;

    const orderNumber = `HOPE-${Date.now().toString().slice(-8)}`;

    const newOrder = {
      orderNumber,
      userId: currentUser?.id || null,
      customer: {
        ...form,
        email: currentUser?.email || form.email,
      },
      items: [...cart],
      subtotal,
      delivery: deliveryFee,
      discount: discountAmount,
      promoCode: appliedPromo ? appliedPromo.code : null,
      total: finalTotal,
      status: "Pending",
      paymentMethod: "Cash on Delivery",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders = getStoredOrders();
      saveStoredOrders([...existingOrders, newOrder]);

      // If promo used, increment redemption count
      if (appliedPromo) {
        const updatedPromos = promotions.map((p) =>
          p.id === appliedPromo.id
            ? { ...p, usesCount: Number(p.usesCount || 0) + 1 }
            : p
        );
        saveStoredPromotions(updatedPromos);
      }

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("storage"));
      setCart([]);
      setOrder(newOrder);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("Unable to save your order in this browser. Please try again.");
    }
  };

  if (order) {
    return (
      <main className="checkout-page">
        <section className="checkout-success">
          <div className="checkout-success-icon">
            <CheckCircle size={42} />
          </div>

          <span>THANK YOU FOR CHOOSING HOPE</span>
          <h1>Your order is placed.</h1>

          <p>
            We have recorded your order <strong>{order.orderNumber}</strong>.
            A tea care specialist will verify your delivery details before dispatching from our Hewaheta estate.
          </p>

          <div className="checkout-success-box">
            <div>
              <span>ORDER REFERENCE</span>
              <strong>{order.orderNumber}</strong>
            </div>

            <div>
              <span>PAYMENT METHOD</span>
              <strong>{order.paymentMethod}</strong>
            </div>

            <div>
              <span>ORDER TOTAL</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>

            <div>
              <span>DELIVERY TO</span>
              <strong>{order.customer.city}, Sri Lanka</strong>
            </div>
          </div>

          <div style={{ marginTop: "30px", display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/collection" className="checkout-primary-button">
              Explore more tea <ArrowRight size={17} />
            </Link>
            <Link to="/admin/orders" className="btn-secondary-pill">
              View in Sales Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <div className="checkout-empty-icon">
            <ShoppingBag size={38} />
          </div>

          <span>YOUR BAG IS EMPTY</span>
          <h1>Ready for tea?</h1>

          <p>
            Please add some Ceylon tea to your shopping bag before proceeding to checkout.
          </p>

          <Link to="/collection" className="checkout-primary-button">
            Browse our teas <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-hero">
        <span>HOPE TEA ESTATE · HEWAHETA</span>
        <h1>Complete your <i>order.</i></h1>
        <p>A little peace in every cup, delivered directly to your doorstep.</p>
      </section>

      <div className="checkout-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/cart">Cart</Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <form onSubmit={placeOrder} className="checkout-layout">
        <section className="checkout-form-section">
          {/* Account Authentication Gate */}
          {!isAuthenticated ? (
            <div className="checkout-auth-gate-card">
              <div className="checkout-gate-header">
                <div className="checkout-gate-icon">
                  <User size={22} />
                </div>
                <div>
                  <span className="checkout-gate-eyebrow">ESTATE ACCOUNT REQUIRED</span>
                  <h3>Please Sign In or Register to Place Order</h3>
                </div>
              </div>

              <p className="checkout-gate-desc">
                Hope Tea Estate requires customer authentication to confirm your delivery details, track your highland tea batch, and issue verified order receipts.
              </p>

              {/* 1. Google 1-Click Sign In */}
              <div className="checkout-gate-social-row">
                <GoogleSignInButton
                  text="One-Click Sign In with Google"
                  onSuccess={handleAuthSuccess}
                />
              </div>

              <div className="checkout-gate-divider">
                <span>or sign in / register with email</span>
              </div>

              {/* Tab Selector: Sign In vs Register */}
              <div className="checkout-gate-tabs">
                <button
                  type="button"
                  className={`gate-tab-btn ${authTab === "signin" ? "active" : ""}`}
                  onClick={() => {
                    setAuthTab("signin");
                    setAuthError("");
                  }}
                >
                  Sign In to Existing Account
                </button>
                <button
                  type="button"
                  className={`gate-tab-btn ${authTab === "register" ? "active" : ""}`}
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError("");
                  }}
                >
                  Create New Account
                </button>
              </div>

              {authError && (
                <div className="checkout-auth-error-alert" role="alert">
                  <AlertCircle size={15} />
                  <span>{authError}</span>
                </div>
              )}

              {authTab === "signin" ? (
                <div className="checkout-inline-form-block">
                  <div className="checkout-inline-inputs-row">
                    <div className="checkout-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="amelia.f@gmail.com"
                        value={inlineEmail}
                        onChange={(e) => setInlineEmail(e.target.value)}
                        className="checkout-auth-input"
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={inlinePassword}
                        onChange={(e) => setInlinePassword(e.target.value)}
                        className="checkout-auth-input"
                      />
                    </div>
                  </div>

                  <div className="checkout-inline-actions">
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={handleInlineSignIn}
                      className="btn-primary-pill checkout-inline-submit-btn"
                    >
                      {authLoading ? "Signing in..." : "Sign In & Continue"}
                      <ArrowRight size={15} />
                    </button>
                  </div>

                  {/* 1-Click Quick Demo Accounts Strip */}
                  <div className="checkout-quick-demo-strip">
                    <span className="quick-demo-label">1-Click Test Sign-In:</span>
                    <div className="quick-demo-pills">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoFill("amelia.f@gmail.com", "password123")}
                        className="quick-demo-pill"
                        title="Click to sign in instantly as Amelia Fernando"
                      >
                        ⚡ Amelia F. (Colombo)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoFill("daniel.p@outlook.com", "password123")}
                        className="quick-demo-pill"
                        title="Click to sign in instantly as Daniel Perera"
                      >
                        ⚡ Daniel P. (Kandy)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="checkout-inline-form-block">
                  <div className="checkout-inline-inputs-row">
                    <div className="checkout-field">
                      <label>First Name *</label>
                      <input
                        type="text"
                        placeholder="Kasun"
                        value={inlineFirstName}
                        onChange={(e) => setInlineFirstName(e.target.value)}
                        className="checkout-auth-input"
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Last Name</label>
                      <input
                        type="text"
                        placeholder="Mendis"
                        value={inlineLastName}
                        onChange={(e) => setInlineLastName(e.target.value)}
                        className="checkout-auth-input"
                      />
                    </div>
                  </div>

                  <div className="checkout-inline-inputs-row">
                    <div className="checkout-field">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        placeholder="kasun@example.com"
                        value={inlineEmail}
                        onChange={(e) => setInlineEmail(e.target.value)}
                        className="checkout-auth-input"
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+94 77 123 4567"
                        value={inlinePhone}
                        onChange={(e) => setInlinePhone(e.target.value)}
                        className="checkout-auth-input"
                      />
                    </div>
                  </div>

                  <div className="checkout-field" style={{ marginBottom: "14px" }}>
                    <label>Password (min. 6 characters) *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={inlinePassword}
                      onChange={(e) => setInlinePassword(e.target.value)}
                      className="checkout-auth-input"
                    />
                  </div>

                  <div className="checkout-inline-actions">
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={handleInlineRegister}
                      className="btn-primary-pill checkout-inline-submit-btn"
                    >
                      {authLoading ? "Creating account..." : "Register & Continue"}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="checkout-signed-in-card">
              <div className="signed-in-user-flex">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.firstName}
                    className="signed-in-avatar-img"
                  />
                ) : (
                  <span className="signed-in-avatar-badge">
                    {(currentUser?.firstName || "U")[0]}
                  </span>
                )}
                <div>
                  <span className="signed-in-tag">
                    <ShieldCheck size={13} /> VERIFIED ESTATE PATRON · {currentUser?.provider === "google" ? "GOOGLE AUTHENTICATED" : "CONFIRMED ACCOUNT"}
                  </span>
                  <strong>
                    {currentUser?.firstName} {currentUser?.lastName} (
                    {currentUser?.email})
                  </strong>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="checkout-switch-btn"
                title="Switch Account"
              >
                Switch Account
              </button>
            </div>
          )}

          {/* Contact Details */}
          <div className="checkout-group">
            <div className="checkout-heading">
              <MapPin size={21} />
              <div>
                <span>YOUR DETAILS</span>
                <h2>Customer Information</h2>
              </div>
            </div>

            <div className="checkout-fields">
              <div className="checkout-field">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Amelia"
                  className={errors.firstName ? "has-error" : ""}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="checkout-field">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Fernando"
                  className={errors.lastName ? "has-error" : ""}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>

              <div className="checkout-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="amelia@example.com"
                  className={errors.email ? "has-error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="checkout-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  className={errors.phone ? "has-error" : ""}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="checkout-group">
            <div className="checkout-heading">
              <MapPin size={21} />
              <div>
                <span>DELIVERY DESTINATION</span>
                <h2>Where should we send your tea?</h2>
              </div>
            </div>

            <div className="checkout-fields">
              <div className="checkout-field full-width">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Apartment, suite, street number"
                  className={errors.address ? "has-error" : ""}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div className="checkout-field">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Colombo, Kandy, Galle"
                  className={errors.city ? "has-error" : ""}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>

              <div className="checkout-field">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 00300"
                />
              </div>

              <div className="checkout-field full-width">
                <label>Order & Delivery Notes</label>
                <textarea
                  name="notes"
                  placeholder="Any special handling or gate instructions?"
                  rows="3"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-payment">
            <div className="checkout-heading">
              <ShieldCheck size={21} />
              <div>
                <span>PAYMENT METHOD</span>
                <h2>How would you like to pay?</h2>
              </div>
            </div>

            <label className="checkout-payment-option">
              <input type="radio" checked readOnly />
              <span>
                <strong>Cash on Delivery (COD)</strong>
                <small>Pay cash securely when your package arrives.</small>
              </span>
            </label>

            <p className="checkout-payment-note">
              Demonstration note: Card payments and digital gateways will be connected during Phase 3 Java Spring Boot integration.
            </p>
          </div>
        </section>

        {/* Order Summary Sidebar */}
        <aside className="checkout-summary">
          <span>YOUR SELECTION</span>
          <h2>Order Summary</h2>

          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div className="checkout-summary-item" key={item.cartItemId || item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.weight} · Qty: {item.quantity}</span>
                </div>
                <strong>
                  {formatPrice(Number(item.price) * Number(item.quantity))}
                </strong>
              </div>
            ))}
          </div>

          {/* Voucher Code Box */}
          <div style={{ margin: "20px 0", padding: "14px", background: "#f2eee3", borderRadius: "10px", border: "1px solid #ded6c5" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#546858", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
              HAVE A VOUCHER CODE?
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="e.g. WELCOME10"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  borderRadius: "6px",
                  border: "1px solid #d5cebf",
                }}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                style={{
                  background: "#1e3b26",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
            {promoMessage.text && (
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  marginTop: "6px",
                  color: promoMessage.isError ? "#b85d19" : "#2d5438",
                  fontWeight: "600",
                }}
              >
                {promoMessage.text}
              </span>
            )}
          </div>

          {/* Pricing breakdown */}
          <div className="checkout-summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          {appliedPromo && (
            <div className="checkout-summary-line" style={{ color: "#2d5438" }}>
              <span>Voucher Discount ({appliedPromo.code})</span>
              <strong>-{formatPrice(discountAmount)}</strong>
            </div>
          )}

          <div className="checkout-summary-line">
            <span>Island-wide Delivery</span>
            <strong>{isFreeDelivery ? "FREE" : formatPrice(deliveryFee)}</strong>
          </div>

          <div className="checkout-summary-total">
            <span>Total to Pay</span>
            <strong>{formatPrice(finalTotal)}</strong>
          </div>

          {isFreeDelivery ? (
            <p className="checkout-delivery-note" style={{ color: "#2d5438", fontWeight: "500" }}>
              ✓ You unlocked Free Island-wide Delivery on orders over {formatPrice(freeThreshold)}.
            </p>
          ) : (
            <p className="checkout-delivery-note">
              Add {formatPrice(freeThreshold - subtotal)} more to qualify for Free Delivery.
            </p>
          )}

          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                const gate = document.querySelector(".checkout-auth-gate-card");
                if (gate) {
                  gate.scrollIntoView({ behavior: "smooth", block: "center" });
                  const input = gate.querySelector("input");
                  if (input) input.focus();
                }
              }}
              className="checkout-place-button checkout-auth-req-btn"
            >
              SIGN IN TO CONFIRM ORDER <ArrowRight size={17} />
            </button>
          ) : (
            <button type="submit" className="checkout-place-button">
              CONFIRM ORDER <ArrowRight size={17} />
            </button>
          )}

          <Link to="/cart" className="checkout-back-link">
            <ArrowLeft size={15} /> Return to shopping bag
          </Link>
        </aside>
      </form>

      <section className="checkout-closing">
        <span>HOPE TEA ESTATE · HEWAHETA</span>
        <h2>A little peace in every cup.</h2>
      </section>
    </main>
  );
}

export default Checkout;
