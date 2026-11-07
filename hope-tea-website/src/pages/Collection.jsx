
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Plus } from "lucide-react";
import { products } from "../data/products";

const categories = [
  "All Teas",
  "Black Tea",
  "Green Tea",
  "Specialty Tea",
  "Gift Collection",
];

function Collection() {
  const [activeCategory, setActiveCategory] = useState("All Teas");
  const [addedProducts, setAddedProducts] = useState([]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Teas") return products;

    return products.filter(
      (product) => product.category === activeCategory
    );
  }, [activeCategory]);

  const handleAddToCart = (id) => {
    setAddedProducts((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  return (
    <main className="tea-collection">

      {/* HERO */}
      <section className="collection-hero">
        <div className="collection-hero-image" />

        <div className="collection-hero-content">
          <span>THE HOPE TEA COLLECTION</span>

          <h1>
            Discover the art
            <br />
            of <i>good tea.</i>
          </h1>

          <p>
            Explore a collection inspired by the character,
            heritage and natural beauty of Ceylon tea.
          </p>

          <a href="#collection-products" className="collection-hero-link">
            EXPLORE THE COLLECTION
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="collection-hero-caption">
          A LITTLE PEACE IN EVERY CUP
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="collection-intro">
        <span>THE COLLECTION</span>

        <h2>
          Find your perfect
          <br />
          <i>cup of tea.</i>
        </h2>

        <p>
          From familiar classics to distinctive tea experiences,
          discover the collection and find a moment worth enjoying.
        </p>
      </section>

      {/* PRODUCTS */}
      <section id="collection-products" className="collection-products">

        <div className="collection-products-heading">
          <div>
            <span>EXPLORE OUR RANGE</span>
            <h2>Our Tea Selection</h2>
          </div>

          <p>
            {filteredProducts.length} products
          </p>
        </div>

        {/* FILTERS */}
        <div className="collection-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="collection-grid">
          {filteredProducts.map((product) => {
            const isAdded = addedProducts.includes(product.id);

            return (
              <article className="collection-product-card" key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="collection-product-image"
                >
                  <img src={product.image} alt={product.name} />
                  <span className="collection-product-tag">
                    {product.tag}
                  </span>
                </Link>

                <div className="collection-product-info">
                  <span className="collection-product-category">
                    {product.category}
                  </span>

                  <Link
                    to={`/product/${product.id}`}
                    className="collection-product-name"
                  >
                    {product.name}
                  </Link>

                  <p>{product.description}</p>

                  <div className="collection-product-bottom">
                    <div>
                      <strong>
                        LKR {product.price.toLocaleString("en-LK")}
                      </strong>
                      <small>{product.weight}</small>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product.id)}
                      className={isAdded ? "added" : ""}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isAdded ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                  </div>

                  {isAdded && (
                    <span className="collection-added-message">
                      Added to your selection
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <p className="collection-empty">
            No products are available in this category yet.
          </p>
        )}
      </section>

      {/* TEA EXPERIENCE */}
      <section className="collection-experience">
        <div className="collection-experience-image" />

        <div className="collection-experience-content">
          <span>BEYOND THE CUP</span>
          <h2>
            Every cup has
            <br />
            a <i>journey.</i>
          </h2>

          <p>
            Discover the journey behind tea, from the
            landscapes of the estate to the moment it
            reaches your cup.
          </p>

          <Link to="/journey">
            DISCOVER THE TEA JOURNEY
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* CLOSING */}
      <section className="collection-closing">
        <span>HOPE TEA ESTATE · HEWAHETA</span>
        <h2>A little peace in every cup.</h2>
        <p>Discover the experience of Ceylon tea.</p>
      </section>

    </main>
  );
}

export default Collection;
