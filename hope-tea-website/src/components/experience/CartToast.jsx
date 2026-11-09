import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, X, CheckCircle2 } from "lucide-react";

export default function CartToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleCartAdded = (e) => {
      if (e.detail) {
        setToast(e.detail);
      }
    };

    window.addEventListener("tea-cart-added", handleCartAdded);
    return () => window.removeEventListener("tea-cart-added", handleCartAdded);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <aside
      className="modern-cart-toast-wrap"
      role="status"
      aria-live="polite"
      aria-label="Cart notification"
    >
      <div className="modern-cart-toast-card">
        <div className="toast-left-media">
          {toast.image ? (
            <img src={toast.image} alt={toast.name} className="toast-product-thumb" />
          ) : (
            <div className="toast-icon-placeholder">
              <ShoppingBag size={20} />
            </div>
          )}
        </div>

        <div className="toast-center-info">
          <div className="toast-badge-line">
            <CheckCircle2 size={13} className="toast-check-icon" />
            <span>Added to your Tea Bag</span>
          </div>
          <strong className="toast-item-title">{toast.name}</strong>
          <span className="toast-item-price">
            LKR {Number(toast.price || 0).toLocaleString("en-LK")} · Qty: {toast.quantity || 1}
          </span>
        </div>

        <div className="toast-right-actions">
          <Link
            to="/cart"
            className="toast-view-cart-btn"
            onClick={() => setToast(null)}
          >
            View Bag <ArrowRight size={13} />
          </Link>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

