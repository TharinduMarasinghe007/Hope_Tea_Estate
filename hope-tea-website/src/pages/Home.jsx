import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Mountain,
  Sprout,
  Sun,
} from "lucide-react";

function Home() {
  const products = [
    {
      name: "Ceylon Black Tea",
      category: "CLASSIC COLLECTION",
      description: "A rich and refreshing traditional Ceylon tea.",
      image:
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800",
    },
    {
      name: "Pure Green Tea",
      category: "NATURAL COLLECTION",
      description: "A delicate tea with a light and refreshing character.",
      image:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
    },
    {
      name: "Premium Tea Selection",
      category: "SIGNATURE COLLECTION",
      description: "A carefully presented selection of fine Ceylon tea.",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800",
    },
  ];

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">
            THE BEAUTY OF CEYLON TEA
          </span>

          <h1>
            A little peace
            <br />
            in every cup.
          </h1>

          <p>
            Discover the natural beauty, heritage and timeless
            character of tea from Hope Tea Estate.
          </p>

          <div className="hero-buttons">
            <Link to="/collection" className="button button-light">
              Explore Our Tea <ArrowRight size={18} />
            </Link>

            <Link to="/about" className="hero-text-link">
              Discover Our Estate
            </Link>
          </div>
        </div>

        <div className="hero-bottom">
          <span>HEWAHETA · SRI LANKA</span>
          <span>ROOTED IN NATURE. CRAFTED WITH CARE.</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="intro-section section-padding">
        <div className="intro-image">
          <img
            src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1000"
            alt="A warm cup of tea"
          />
          <div className="image-caption">
            A moment to slow down.
          </div>
        </div>

        <div className="intro-content">
          <span className="eyebrow">WELCOME TO HOPE TEA ESTATE</span>

          <h2>
            Where nature
            <br />
            meets tradition.
          </h2>

          <p>
            Surrounded by the natural beauty of Sri Lanka's
            hill country, Hope Tea Estate represents a connection
            between the land, its people and the timeless tradition
            of Ceylon tea.
          </p>

          <p>
            Every cup tells a story of nature, dedication and
            the journey from the garden to your hands.
          </p>

          <Link to="/about" className="text-link">
            Discover Our Story <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="collection-section section-padding">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A TASTE OF CEYLON</span>
            <h2>Our Tea Collection</h2>
          </div>

          <Link to="/collection" className="text-link">
            View All Collection <ArrowRight size={18} />
          </Link>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <Link to="/collection" className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="product-explore">
                  Explore <ArrowRight size={16} />
                </span>
              </Link>

              <div className="product-info">
                <span className="eyebrow">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TEA JOURNEY */}
      <section className="journey-section">
        <div className="journey-image"></div>

        <div className="journey-content">
          <span className="eyebrow">FROM GARDEN TO CUP</span>
          <h2>
            Nature's journey,
            <br />
            in every leaf.
          </h2>

          <p>
            Behind every cup is a journey shaped by the land,
            careful cultivation and the dedication of the people
            who bring Ceylon tea to life.
          </p>

          <Link to="/journey" className="button button-light">
            Explore The Journey <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section section-padding">
        <div className="values-heading">
          <span className="eyebrow">WHAT WE STAND FOR</span>
          <h2>Rooted in Nature.</h2>
          <p>
            A commitment to the land, the people and the traditions
            that make Ceylon tea special.
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <Mountain />
            <h3>Our Heritage</h3>
            <p>
              Inspired by the rich tradition and character
              of Sri Lankan tea.
            </p>
          </div>

          <div className="value-card">
            <Sprout />
            <h3>Our Nature</h3>
            <p>
              Celebrating the natural environment that
              makes every tea-growing region unique.
            </p>
          </div>

          <div className="value-card">
            <Leaf />
            <h3>Our People</h3>
            <p>
              Recognising the dedication and care behind
              every stage of the tea journey.
            </p>
          </div>

          <div className="value-card">
            <Sun />
            <h3>Our Future</h3>
            <p>
              Looking towards a more connected and
              sustainable future for the estate.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="closing-section">
        <span className="eyebrow">EXPERIENCE HOPE TEA ESTATE</span>
        <h2>Discover the taste of Ceylon.</h2>
        <Link to="/collection" className="button button-light">
          Explore Our Collection <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default Home;