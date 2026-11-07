
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Leaf,
  Clock,
  Thermometer,
} from "lucide-react";

import { products } from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="product-not-found">
        <span>HOPE TEA ESTATE</span>
        <h1>Product not found.</h1>
        <p>The tea you're looking for may no longer be available.</p>
        <Link to="/collection">
          <ArrowLeft size={17} /> Back to Collection
        </Link>
      </main>
    );
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 3);

  const addToCart = () => {
    const currentCart = JSON.parse(
      localStorage.getItem("hopeTeaCart") || "[]"
    );

    const existingItem = currentCart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        weight: product.weight,
        quantity,
      });
    }

    localStorage.setItem(
      "hopeTeaCart",
      JSON.stringify(currentCart)
    );

    setAdded(true);
  };

  return (
    <main className="product-details-page">

      {/* BREADCRUMB */}
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collection">Tea Collection</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* PRODUCT SECTION */}
      <section className="product-main">

        <div className="product-gallery">
          <div className="product-main-image">
            <img src={product.image} alt={product.name} />
            <span>{product.tag}</span>
          </div>

          <p className="product-image-caption">
            HOPE TEA ESTATE · HEWAHETA
          </p>
        </div>

        <div className="product-information">

          <span className="product-eyebrow">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="product-description">
            {product.longDescription}
          </p>

          <div className="product-price">
            LKR {(product.price * quantity).toLocaleString("en-LK")}
          </div>

          <p className="product-weight">
            {product.weight} · Product of Sri Lanka
          </p>

          <div className="product-divider" />

          {/* QUANTITY */}
          <div className="product-quantity-section">
            <span>QUANTITY</span>

            <div className="product-quantity-control">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <strong>{quantity}</strong>

              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => current + 1)
                }
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            type="button"
            className={`product-add-button ${added ? "added" : ""}`}
            onClick={addToCart}
          >
            {added ? <Check size={19} /> : <ShoppingBag size={19} />}
            {added ? "ADDED TO CART" : "ADD TO CART"}
          </button>

          {added && (
            <Link to="/cart" className="product-cart-link">
              View your shopping cart <ArrowRight size={16} />
            </Link>
          )}

          <div className="product-divider" />

          {/* PRODUCT HIGHLIGHTS */}
          <div className="product-highlights">
            <div>
              <Leaf size={19} />
              <span>Tea selection</span>
            </div>

            <div>
              <Clock size={19} />
              <span>{product.brewingTime}</span>
            </div>

            <div>
              <Thermometer size={19} />
              <span>{product.waterTemperature}</span>
            </div>
          </div>

        </div>
      </section>

      {/* TASTING NOTES */}
      <section className="product-tasting">
        <div>
          <span>DISCOVER THE CHARACTER</span>
          <h2>A closer look at your <i>tea.</i></h2>
        </div>

        <div className="product-tasting-notes">
          {product.tastingNotes.map((note) => (
            <div key={note}>
              <Leaf size={18} />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="product-related">
          <div className="product-related-heading">
            <div>
              <span>EXPLORE MORE</span>
              <h2>You may also enjoy</h2>
            </div>

            <Link to="/collection">
              View all teas <ArrowRight size={17} />
            </Link>
          </div>

          <div className="product-related-grid">
            {relatedProducts.map((item) => (
              <Link
                to={`/product/${item.id}`}
                className="product-related-card"
                key={item.id}
              >
                <div>
                  <img src={item.image} alt={item.name} />
                </div>

                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <strong>
                  LKR {item.price.toLocaleString("en-LK")}
                </strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CLOSING */}
      <section className="product-closing">
        <span>HOPE TEA ESTATE · HEWAHETA</span>
        <h2>A little peace in every cup.</h2>
      </section>

    </main>
  );
}

export default ProductDetails;
