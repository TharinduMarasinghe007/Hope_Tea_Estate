import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Leaf,
  Sprout,
  ShieldCheck,
  Check,
  Award,
  Sparkles,
} from "lucide-react";
import { products } from "../Data/Products";
import SteepingTimer from "../components/experience/SteepingTimer";

const packSizes = ["50g", "100g", "250g"];
const tabs = ["Tasting Notes", "Ingredients", "Brewing Guide", "Origin"];

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id)) || products[0];

  const [packSize, setPackSize] = useState("100g");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Tasting Notes");
  const [added, setAdded] = useState(false);

  // Price adjustment based on pack size
  const multiplier = packSize === "50g" ? 0.6 : packSize === "250g" ? 2.2 : 1;
  const currentPrice = Math.round(product.price * multiplier);

  const handleAddToCart = () => {
    try {
      const currentCart = JSON.parse(
        localStorage.getItem("hopeTeaCart") || "[]"
      );
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const cartItemId = `${product.id}-${packSize}`;

      const existing = safeCart.find((item) => item.cartItemId === cartItemId);

      if (existing) {
        existing.quantity = Number(existing.quantity || 1) + quantity;
      } else {
        safeCart.push({
          cartItemId,
          id: product.id,
          name: `${product.name} (${packSize})`,
          price: currentPrice,
          image: product.image,
          weight: packSize,
          quantity,
        });
      }

      localStorage.setItem("hopeTeaCart", JSON.stringify(safeCart));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("tea-cart-added", {
          detail: {
            name: `${product.name} (${packSize})`,
            price: currentPrice,
            image: product.image,
            quantity,
          },
        })
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error("Failed adding to cart", err);
    }
  };

  return (
    <main className="product-detail-page">
      {/* Back Link */}
      <div className="product-back-bar">
        <Link to="/collection" className="product-back-link">
          <ArrowLeft size={16} /> Back to Collection
        </Link>
      </div>

      {/* 1. TOP SPLIT PRODUCT SECTION */}
      <section className="product-hero-layout">
        {/* Left: Product Image Showcase */}
        <div className="product-visual-column">
          <div className="product-large-image-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-main-showcase-img"
            />
            {product.tag && (
              <span className="product-corner-badge">{product.tag}</span>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Info */}
        <div className="product-info-column">
          <h1 className="product-display-title">
            {product.name} <br />
            <span>{product.subType || product.category}</span>
          </h1>

          <p className="product-display-desc">{product.description}</p>

          <div className="product-display-price">
            LKR {currentPrice.toLocaleString("en-LK")} —
          </div>

          {/* Pack Size Selector */}
          <div className="product-pack-size-row">
            <label className="product-option-label">Pack Size:</label>
            <div className="pack-size-pills">
              {packSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`pack-size-pill ${packSize === size ? "active" : ""}`}
                  onClick={() => setPackSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="product-purchase-row">
            <div className="product-qty-stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              className={`product-add-to-cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="product-trust-badges-row">
            <div className="trust-badge-item">
              <Leaf size={16} />
              <span>Premium Quality</span>
            </div>
            <div className="trust-badge-item">
              <Sprout size={16} />
              <span>Naturally Grown</span>
            </div>
            <div className="trust-badge-item">
              <ShieldCheck size={16} />
              <span>Ceylon Tea</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TABS SECTION (Below) */}
      <section className="product-tabs-section">
        <div className="product-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`product-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="product-tab-content-grid">
          <div className="tab-text-side">
            {activeTab === "Tasting Notes" && (
              <div>
                <p className="tab-main-paragraph">
                  {product.longDescription ||
                    "A rich, well-balanced tea with a smooth flavour and a refreshing aroma."}
                </p>

                <div className="tab-flavor-metrics">
                  <span className="metrics-eyebrow">SOMMELIER PALATE PROFILE</span>
                  <div className="flavor-bar-group">
                    <div className="f-bar-row">
                      <span>Body & Depth</span>
                      <div className="f-track">
                        <div className="f-fill" style={{ width: product.category === "Green Tea" ? "55%" : "88%" }} />
                      </div>
                    </div>
                    <div className="f-bar-row">
                      <span>Aroma Intensity</span>
                      <div className="f-track">
                        <div className="f-fill" style={{ width: "92%" }} />
                      </div>
                    </div>
                    <div className="f-bar-row">
                      <span>Briskness</span>
                      <div className="f-track">
                        <div className="f-fill" style={{ width: product.category === "Green Tea" ? "70%" : "84%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <ul className="tab-bullet-list">
                  {(product.tastingNotes || []).map((note) => (
                    <li key={note}>
                      <span className="bullet-dot" /> {note}
                    </li>
                  ))}
                </ul>

                <div className="tea-food-pairing-box">
                  <Sparkles size={14} />
                  <span>
                    <strong>Recommended Food Pairing:</strong> Fresh Ceylon cinnamon pastries, shortbread, or artisanal highland wild honey.
                  </span>
                </div>
              </div>
            )}

            {activeTab === "Ingredients" && (
              <div>
                <p className="tab-main-paragraph">
                  {product.ingredients ||
                    "100% Pure Ceylon Single-Estate Black Tea Leaves. Free of artificial additives, preservatives, and synthetics."}
                </p>
                <p className="tab-sub-text">
                  Grown on the mist-covered mountain slopes of Hewaheta, Sri Lanka, and hand-processed in accordance with classic Ceylon tea standards.
                </p>
                <div className="estate-pure-seal">
                  <Award size={16} />
                  <span>Guaranteed Single-Origin · Hewaheta Upper Division</span>
                </div>
              </div>
            )}

            {activeTab === "Brewing Guide" && (
              <div>
                <SteepingTimer
                  teaName={product.name}
                  defaultMinutes={product.category === "Green Tea" ? 2 : 3}
                  temperature={product.category === "Green Tea" ? "80°C" : "95°C"}
                  leafRatio="2.5g (approx. 1 heaping tsp) / 220ml"
                />
              </div>
            )}

            {activeTab === "Origin" && (
              <div>
                <p className="tab-main-paragraph">
                  <strong>Estate Region:</strong> {product.origin || "Hewaheta Upper Division, Central Province, Sri Lanka."}
                </p>
                <p className="tab-sub-text">
                  Situated over 1,200m above sea level in the picturesque highlands near Kandy. Our volcanic mountain soil and high-altitude diurnal temperature shifts give Hope teas their distinct complexity and golden rim.
                </p>
              </div>
            )}
          </div>

          <div className="tab-visual-side">
            <div className="tab-cup-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=800"
                alt="Brewed cup of golden Ceylon tea on wooden saucer"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
