
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Leaf,
  ShieldCheck,
} from "lucide-react";

const CART_KEY = "hopeTeaCart";

function readCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function Cart() {
  const [cart, setCart] = useState(readCart);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Number(item.quantity) + change),
            }
          : item
      );

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const formatPrice = (price) =>
    `LKR ${Number(price).toLocaleString("en-LK")}`;

  return (
    <main className="cart-page">

      <section className="cart-hero">
        <span>HOPE TEA ESTATE · HEWAHETA</span>
        <h1>Your Shopping <i>Bag.</i></h1>
        <p>A little peace is just a few steps away.</p>
      </section>

      <div className="cart-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Shopping Cart</span>
      </div>

      {cart.length === 0 ? (
        <section className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={34} />
          </div>

          <span>YOUR CART IS WAITING</span>
          <h2>Nothing here just yet.</h2>

          <p>
            Explore our collection and discover a tea
            that makes your everyday moments special.
          </p>

          <Link to="/collection" className="cart-primary-button">
            EXPLORE OUR TEAS <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className="cart-content">

          <div className="cart-items-section">
            <div className="cart-section-heading">
              <div>
                <span>YOUR SELECTION</span>
                <h2>Shopping Cart</h2>
              </div>

              <span className="cart-item-count">
                {cart.reduce(
                  (total, item) => total + Number(item.quantity),
                  0
                )}{" "}
                items
              </span>
            </div>

            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-image"
                  >
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-item-details">
                    <span>{item.weight}</span>

                    <Link to={`/product/${item.id}`}>
                      <h3>{item.name}</h3>
                    </Link>

                    <p>{formatPrice(item.price)}</p>

                    <div className="cart-item-actions">
                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={Number(item.quantity) <= 1}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <strong className="cart-item-total">
                    {formatPrice(
                      Number(item.price) * Number(item.quantity)
                    )}
                  </strong>
                </article>
              ))}
            </div>

            <Link to="/collection" className="cart-continue-link">
              <ArrowLeft size={16} />
              Continue shopping
            </Link>
          </div>

          <aside className="cart-summary">
            <span>ORDER SUMMARY</span>
            <h2>Your order.</h2>

            <div className="cart-summary-line">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="cart-summary-line">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Estimated total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <p className="cart-summary-note">
              Delivery charges, if applicable, will be
              confirmed during checkout.
            </p>

            <Link to="/checkout" className="cart-checkout-button">
              PROCEED TO CHECKOUT
              <ArrowRight size={17} />
            </Link>

            <div className="cart-secure-note">
              <ShieldCheck size={18} />
              <span>Secure checkout experience</span>
            </div>

            <div className="cart-summary-footer">
              <Leaf size={17} />
              <p>A little peace in every cup.</p>
            </div>
          </aside>

        </section>
      )}

      <section className="cart-closing">
        <span>FROM THE GARDENS OF HEWAHETA</span>
        <h2>Thank you for choosing Hope.</h2>
      </section>

    </main>
  );
}

export default Cart;
