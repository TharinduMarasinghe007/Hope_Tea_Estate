
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  ShoppingBag,
  MapPin,
} from "lucide-react";

const CART_KEY = "hopeTeaCart";
const ORDERS_KEY = "hopeTeaOrders";

function Checkout() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

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

    if (!validateForm()) return;

    if (cart.length === 0) return;

    const orderNumber = `HOPE-${Date.now().toString().slice(-8)}`;

    const newOrder = {
      orderNumber,
      customer: { ...form },
      items: [...cart],
      subtotal,
      delivery: 0,
      total: subtotal,
      status: "Pending",
      paymentMethod: "Cash on Delivery",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      );

      const safeOrders = Array.isArray(existingOrders)
        ? existingOrders
        : [];

      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([...safeOrders, newOrder])
      );

      localStorage.removeItem(CART_KEY);
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
          <h1>Your order is <i>confirmed.</i></h1>

          <p>
            Your order has been recorded successfully.
            Thank you for bringing a little Hope into your day.
          </p>

          <div className="checkout-order-number">
            <span>YOUR ORDER REFERENCE</span>
            <strong>{order.orderNumber}</strong>
          </div>

          <div className="checkout-success-summary">
            <div>
              <span>Order total</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            <div>
              <span>Payment method</span>
              <strong>Cash on Delivery</strong>
            </div>
            <div>
              <span>Order status</span>
              <strong>Pending</strong>
            </div>
          </div>

          <Link to="/collection" className="checkout-primary-button">
            CONTINUE EXPLORING <ArrowRight size={17} />
          </Link>

          <Link to="/" className="checkout-home-link">
            Return to homepage
          </Link>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <ShoppingBag size={42} />
          <h1>Your bag is empty.</h1>
          <p>Add some tea to your shopping bag before checking out.</p>
          <Link to="/collection" className="checkout-primary-button">
            EXPLORE OUR TEAS <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  const fields = [
    { name: "firstName", label: "First Name", placeholder: "Your first name" },
    { name: "lastName", label: "Last Name", placeholder: "Your last name" },
    { name: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
    { name: "phone", label: "Phone Number", placeholder: "+94 7X XXX XXXX" },
    { name: "address", label: "Delivery Address", placeholder: "House number, street name", full: true },
    { name: "city", label: "City / Town", placeholder: "Your city" },
    { name: "postalCode", label: "Postal Code (Optional)", placeholder: "Postal code" },
  ];

  return (
    <main className="checkout-page">

      <section className="checkout-hero">
        <span>HOPE TEA ESTATE · HEWAHETA</span>
        <h1>Almost <i>yours.</i></h1>
        <p>Complete your details and let us prepare your order.</p>
      </section>

      <div className="checkout-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/cart">Shopping Cart</Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <form className="checkout-layout" onSubmit={placeOrder} noValidate>

        <section className="checkout-form-section">
          <div className="checkout-heading">
            <MapPin size={21} />
            <div>
              <span>DELIVERY INFORMATION</span>
              <h2>Where should we send it?</h2>
            </div>
          </div>

          <div className="checkout-fields">
            {fields.map((field) => (
              <div
                className={`checkout-field ${field.full ? "full-width" : ""}`}
                key={field.name}
              >
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={errors[field.name] ? "input-error" : ""}
                />
                {errors[field.name] && (
                  <small>{errors[field.name]}</small>
                )}
              </div>
            ))}

            <div className="checkout-field full-width">
              <label htmlFor="notes">Order Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any additional delivery instructions?"
                rows="3"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

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
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives.</small>
              </span>
            </label>

            <p className="checkout-payment-note">
              Online payment integration can be added when
              the backend and payment gateway are implemented.
            </p>
          </div>
        </section>

        <aside className="checkout-summary">
          <span>YOUR SELECTION</span>
          <h2>Order Summary</h2>

          <div className="checkout-summary-items">
            {cart.map((item) => (
              <div className="checkout-summary-item" key={item.id}>
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

          <div className="checkout-summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="checkout-summary-line">
            <span>Delivery</span>
            <span>To be confirmed</span>
          </div>

          <div className="checkout-summary-total">
            <span>Order total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <p className="checkout-delivery-note">
            The displayed total excludes any delivery charge.
            Final delivery arrangements must be confirmed.
          </p>

          <button type="submit" className="checkout-place-button">
            PLACE MY ORDER <ArrowRight size={17} />
          </button>

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
