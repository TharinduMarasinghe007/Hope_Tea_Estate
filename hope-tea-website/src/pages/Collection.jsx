import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Search, Sparkles, ShoppingBag, Check } from "lucide-react";
import { products } from "../Data/Products";
import TeaSommelier from "../components/experience/TeaSommelier";

const categories = [
  "All Teas",
  "Black Tea",
  "Green Tea",
  "Specialty Tea",
  "Tea Gifts",
];

function Collection() {
  const [activeCategory, setActiveCategory] = useState("All Teas");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSommelier, setShowSommelier] = useState(false);
  const [addedId, setAddedId] = useState(null);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const currentCart = JSON.parse(localStorage.getItem("hopeTeaCart") || "[]");
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const cartItemId = `${product.id}-100g`;

      const existing = safeCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        existing.quantity = Number(existing.quantity || 1) + 1;
      } else {
        safeCart.push({
          cartItemId,
          id: product.id,
          name: `${product.name} (100g)`,
          price: product.price,
          image: product.image,
          weight: "100g",
          quantity: 1,
        });
      }

      localStorage.setItem("hopeTeaCart", JSON.stringify(safeCart));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("tea-cart-added", {
          detail: {
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        })
      );

      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All Teas") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subType && p.subType.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tastingNotes && p.tastingNotes.some((n) => n.toLowerCase().includes(q)))
      );
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [activeCategory, sortBy, searchQuery]);

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

      {/* 2. FILTER TABS & SEARCH / SORT ROW */}
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
          <button
            type="button"
            className={`collection-tab-pill sommelier-pill ${showSommelier ? "active" : ""}`}
            onClick={() => setShowSommelier(!showSommelier)}
          >
            <Sparkles size={13} />
            <span>{showSommelier ? "Close Sommelier" : "Tea Sommelier"}</span>
          </button>
        </div>

        <div className="collection-search-sort-group">
          <div className="collection-search-box">
            <Search size={15} className="search-box-icon" />
            <input
              type="text"
              placeholder="Search by name, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search teas"
            />
          </div>

          <div className="collection-sort-wrap">
            <span className="sort-label">Sort:</span>
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
        </div>
      </section>

      {/* Optional Embedded Tea Sommelier */}
      {showSommelier && (
        <section className="collection-sommelier-embed">
          <TeaSommelier onSelectTea={() => setShowSommelier(false)} />
        </section>
      )}

      {/* 3. PRODUCT GRID (4 columns) */}
      <section className="collection-grid-section">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="collection-no-results">
            <h3>No teas matched your search</h3>
            <p>Try resetting the category filter or searching for another flavor note.</p>
            <button
              type="button"
              className="btn-secondary-pill"
              onClick={() => {
                setActiveCategory("All Teas");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="collection-products-grid">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="tea-product-card">
                <Link to={`/product/${product.id}`} className="tea-card-image-box">
                  <img src={product.image} alt={product.name} />
                  {product.tag && (
                    <span className="tea-card-badge">{product.tag}</span>
                  )}
                </Link>

                <div className="tea-card-details">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="tea-card-title">{product.name}</h3>
                  </Link>
                  <span className="tea-card-type">{product.subType || product.category}</span>

                  {product.tastingNotes && product.tastingNotes[0] && (
                    <span className="tea-card-note-pill">
                      🍃 {product.tastingNotes[0]}
                    </span>
                  )}

                  <span className="tea-card-price">
                    LKR {product.price.toLocaleString("en-LK")} —
                  </span>

                  <div className="tea-card-btn-wrap">
                    <button
                      type="button"
                      className={`tea-card-quick-add-btn ${addedId === product.id ? "added" : ""}`}
                      onClick={(e) => handleQuickAdd(e, product)}
                      title="Quick Add 100g to Bag"
                    >
                      {addedId === product.id ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} /> Quick Add
                        </>
                      )}
                    </button>

                    <Link
                      to={`/product/${product.id}`}
                      className="tea-card-view-btn"
                    >
                      Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Collection;
