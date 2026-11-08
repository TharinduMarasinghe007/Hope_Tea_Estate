import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { products } from "../Data/Products";

const categories = [
  "All Teas",
  "Black Tea",
  "Green Tea",
  "Specialty Tea",
  "Tea Gifts",
];

function Collection() {
  const [activeCategory, setActiveCategory] = useState("Black Tea");
  const [sortBy, setSortBy] = useState("popular");

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All Teas") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // "popular" defaults to natural catalog order

    return list;
  }, [activeCategory, sortBy]);

  return (
    <main className="collection-page-wrap">
      {/* 1. HERO BANNER */}
      <section className="collection-hero-banner">
        <div className="collection-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=1600"
            alt="Lush green tea leaves in highland morning sunlight"
            className="collection-hero-img"
          />
          <div className="collection-hero-overlay-gradient" />
        </div>

        <div className="collection-hero-text">
          <h1>Find your everyday cup.</h1>
          <p>A curated selection of premium Ceylon teas.</p>
        </div>
      </section>

      {/* 2. FILTER TABS & SORT ROW */}
      <section className="collection-controls-bar">
        <div className="collection-tabs-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`collection-tab-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="collection-sort-wrap">
          <span className="sort-label">Sort by:</span>
          <div className="sort-select-container">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Tea Name</option>
            </select>
            <ChevronDown size={14} className="sort-chevron" />
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID (4 columns) */}
      <section className="collection-grid-section">
        <div className="collection-products-grid">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="tea-product-card">
              <Link to={`/product/${product.id}`} className="tea-card-image-box">
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="tea-card-details">
                <Link to={`/product/${product.id}`}>
                  <h3 className="tea-card-title">{product.name}</h3>
                </Link>
                <span className="tea-card-type">{product.subType || product.category}</span>
                <span className="tea-card-price">
                  LKR {product.price.toLocaleString("en-LK")} —
                </span>

                <div className="tea-card-btn-wrap">
                  <Link
                    to={`/product/${product.id}`}
                    className="tea-card-view-btn"
                  >
                    View Tea <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Collection;
