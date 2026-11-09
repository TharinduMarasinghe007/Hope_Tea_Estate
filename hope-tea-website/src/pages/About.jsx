import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function About() {
  return (
    <main className="estate-about-page">
      {/* 1. HERO BANNER */}
      <section className="estate-hero-section">
        <div className="estate-hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=85&w=1600"
            alt="Loose-leaf teas prepared for a traditional tea service"
            className="estate-hero-img"
          />
          <div className="estate-hero-curve-mask" />
        </div>

        <div className="estate-hero-content">
          <h1>Our place in the highlands</h1>
          <p>Where nature nurtures every leaf.</p>
        </div>
      </section>

      {/* 2. THREE STORY SECTIONS */}
      <section className="estate-story-container">
        {/* Story 1: The Heart of Hewaheta */}
        <div className="estate-story-block">
          <div className="story-text-column">
            <h2>The Heart of Hewaheta</h2>
            <p>
              Nestled in the serene highlands, Hope Tea Estate is part of Sri Lanka's proud tea heritage, surrounded by lush greenery and cool mountain air.
            </p>
            <p className="story-sub-detail">
              At an elevation of over 1,200 meters, our tea bushes receive the optimal balance of gentle monsoonal rains and golden sunshine, giving our leaves their celebrated golden hue and crisp aroma.
            </p>
          </div>

          <div className="story-image-column">
            <div className="story-rounded-image">
              <img
                src="https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=85&w=900"
                alt="Green mountain ridges and misty tea terraces of Hewaheta"
              />
            </div>
          </div>
        </div>

        {/* Story 2: People, Passion and Purpose (Reversed) */}
        <div className="estate-story-block reverse">
          <div className="story-image-column">
            <div className="story-rounded-image">
              <img
                src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=85&w=900"
                alt="Tea plucker hand-picking two tender tea leaves and a bud"
              />
            </div>
          </div>

          <div className="story-text-column">
            <h2>People, Passion and Purpose</h2>
            <p>
              Our team's dedication ensures every leaf is handled with care, from the garden to the factory.
            </p>
            <p className="story-sub-detail">
              We empower generational tea-growing families whose wisdom and deft hands select only the tender topmost shoots—the celebrated “two leaves and a bud”—ensuring unmatched purity and character.
            </p>
          </div>
        </div>

        {/* Story 3: A Legacy of Ceylon Tea */}
        <div className="estate-story-block">
          <div className="story-text-column">
            <h2>A Legacy of Ceylon Tea</h2>
            <p>
              With a deep-rooted connection to Sri Lanka's tea tradition, Hope Tea Estate continues to uphold the values of quality and sustainability.
            </p>
            <p className="story-sub-detail">
              From organic soil enrichment to eco-friendly drying and solar-assisted factory processes, we cultivate tea with reverence for the future of our island and communities.
            </p>
            <div style={{ marginTop: "24px" }}>
              <Link to="/journey" className="btn-primary-pill">
                Explore Tea Journey <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="story-image-column">
            <div className="story-rounded-image">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=900"
                alt="Historic Hope Tea Estate factory and heritage architecture"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
