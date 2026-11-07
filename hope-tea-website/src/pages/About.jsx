
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Leaf, Mountain, Users } from "lucide-react";

function About() {
  return (
    <main className="estate-about">

      {/* HERO */}
      <section className="estate-about-hero">
        <div className="estate-about-hero-image" />

        <div className="estate-about-hero-content">
          <span>THE STORY OF HOPE TEA ESTATE</span>

          <h1>
            Where nature
            <br />
            becomes <i>tradition.</i>
          </h1>

          <p>
            A story shaped by the landscapes of Hewaheta
            and the timeless character of Ceylon tea.
          </p>

          <a href="#estate-story" className="estate-about-scroll">
            EXPLORE OUR STORY <ArrowDown size={16} />
          </a>
        </div>

        <div className="estate-about-hero-caption">
          HEWAHETA · SRI LANKA
        </div>
      </section>


      {/* INTRODUCTION */}
      <section id="estate-story" className="estate-about-story">

        <div className="estate-about-story-label">
          <span>01 / OUR STORY</span>
        </div>

        <div className="estate-about-story-grid">

          <div className="estate-about-story-image">
            <img
              src="https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=85&w=1200"
              alt="Green tea plantation landscape"
            />

            <div className="estate-about-image-caption">
              THE GREEN LANDSCAPES OF HEWAHETA
            </div>
          </div>

          <div className="estate-about-story-text">
            <span className="estate-about-kicker">
              MORE THAN JUST TEA
            </span>

            <h2>
              A place with
              <br />
              a story to <i>share.</i>
            </h2>

            <p>
              Set amidst the green surroundings of Hewaheta,
              Hope Tea Estate is connected to the landscape,
              people and processes that shape the experience
              of Ceylon tea.
            </p>

            <p>
              Every stage of tea production is part of a
              larger journey. From the tea gardens to the
              finished product, it is a journey worth
              discovering.
            </p>

            <div className="estate-about-signature">
              <span>HOPE TEA ESTATE</span>
              <small>HEWAHETA, SRI LANKA</small>
            </div>
          </div>

        </div>
      </section>


      {/* LANDSCAPE */}
      <section className="estate-about-landscape">

        <div className="estate-about-landscape-image" />

        <div className="estate-about-landscape-content">
          <span>02 / OUR SURROUNDINGS</span>

          <h2>
            Inspired by
            <br />
            the <i>highlands.</i>
          </h2>

          <p>
            The character of tea begins long before it reaches
            the cup. The landscape, climate and environment
            are all part of the story.
          </p>

          <div className="estate-about-location">
            <Mountain size={19} />
            <span>HEWAHETA · CENTRAL HIGHLANDS · SRI LANKA</span>
          </div>
        </div>

      </section>


      {/* VALUES */}
      <section className="estate-about-values">

        <div className="estate-about-values-heading">
          <div>
            <span>03 / WHAT MATTERS</span>
            <h2>
              The things that
              <br />
              <i>define us.</i>
            </h2>
          </div>

          <p>
            A closer look at the elements that make the
            Hope Tea Estate story meaningful.
          </p>
        </div>

        <div className="estate-about-value-grid">

          <article className="estate-about-value-card">
            <div className="estate-about-value-number">01</div>
            <Leaf size={29} strokeWidth={1.3} />
            <h3>Our Environment</h3>
            <p>
              Appreciating the natural surroundings that
              form an essential part of tea cultivation.
            </p>
          </article>

          <article className="estate-about-value-card">
            <div className="estate-about-value-number">02</div>
            <Mountain size={29} strokeWidth={1.3} />
            <h3>Our Craft</h3>
            <p>
              Understanding the care and processes involved
              in transforming fresh tea leaves into tea.
            </p>
          </article>

          <article className="estate-about-value-card">
            <div className="estate-about-value-number">03</div>
            <Users size={29} strokeWidth={1.3} />
            <h3>Our People</h3>
            <p>
              Recognising the people whose knowledge,
              dedication and work contribute to the journey.
            </p>
          </article>

        </div>
      </section>


      {/* CLOSING */}
      <section className="estate-about-closing">
        <div className="estate-about-closing-image" />

        <div className="estate-about-closing-content">
          <span>DISCOVER THE WORLD OF HOPE</span>

          <h2>
            A little peace
            <br />
            in <i>every cup.</i>
          </h2>

          <p>
            Explore the tea collection and discover
            what Hope Tea Estate has to offer.
          </p>

          <Link to="/collection">
            EXPLORE OUR TEA COLLECTION
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </main>
  );
}

export default About;
