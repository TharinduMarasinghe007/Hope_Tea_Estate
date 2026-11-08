import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Coffee, Mountain } from "lucide-react";
import { products } from "../Data/Products";

function Home() {
  // Take first 4 items for the collection preview in Panel 1
  const featuredTeas = products.slice(0, 4);

  return (
    <main className="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="home-hero-section">
        <div className="home-hero-grid">
          <div className="home-hero-text">
            <h1 className="home-hero-title">
              A taste of <br />
              the quiet highlands.
            </h1>
            <p className="home-hero-subtitle">
              Premium Ceylon tea from Hope Tea Estate.
            </p>

            <div className="home-hero-actions">
              <Link to="/collection" className="btn-primary-pill">
                Explore Our Teas <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary-pill">
                Discover Our Estate
              </Link>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="hero-scenic-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=85&w=1200"
                alt="Hope Tea Estate Highlands in Hewaheta"
                className="hero-scenic-img"
              />
              <div className="hero-teacup-float">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=600"
                  alt="Freshly brewed warm cup of Ceylon tea"
                  className="hero-teacup-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE VALUE PROPOSITION CARDS */}
      <section className="home-value-strip">
        <div className="value-cards-grid">
          <div className="value-card">
            <div className="value-card-icon">
              <Leaf size={24} />
            </div>
            <h3>Rooted in Hewaheta</h3>
            <p>Our tea grows in the heart of Sri Lanka.</p>
          </div>

          <div className="value-card">
            <div className="value-card-icon">
              <Coffee size={24} />
            </div>
            <h3>Carefully crafted tea</h3>
            <p>With nature's finest care.</p>
          </div>

          <div className="value-card">
            <div className="value-card-icon">
              <Mountain size={24} />
            </div>
            <h3>From our gardens</h3>
            <p>to your cup.</p>
          </div>
        </div>
      </section>

      {/* 3. OUR TEA COLLECTION PREVIEW */}
      <section className="home-collection-preview">
        <div className="section-title-wrap">
          <h2>Our Tea Collection</h2>
          <p>Discover a range of premium teas, nurtured in our estates.</p>
        </div>

        <div className="featured-products-grid">
          {featuredTeas.map((tea) => (
            <Link
              to={`/product/${tea.id}`}
              key={tea.id}
              className="featured-tea-card"
            >
              <div className="featured-tea-img-wrap">
                <img src={tea.image} alt={tea.name} />
              </div>
              <div className="featured-tea-info">
                <h3>{tea.name}</h3>
                <span className="featured-tea-cat">{tea.subType || tea.category}</span>
                <span className="featured-tea-price">
                  LKR {tea.price.toLocaleString("en-LK")}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="collection-browse-btn-row">
          <Link to="/collection" className="btn-primary-pill">
            Browse Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 4. BOTTOM BANNER */}
      <section className="home-bottom-quote-banner">
        <div className="quote-banner-overlay" />
        <div className="quote-banner-content">
          <h2>
            More than tea... <br />
            <i>It's a feeling.</i>
          </h2>
        </div>
      </section>
    </main>
  );
}

export default Home;
