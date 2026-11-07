
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Leaf,
  Sun,
  Package,
  Coffee,
} from "lucide-react";

const journeyStages = [
  {
    number: "01",
    title: "The Tea Gardens",
    subtitle: "WHERE EVERY CUP BEGINS",
    description:
      "Every tea journey begins with the land. The natural landscape, fresh air and carefully nurtured tea bushes form the foundation of a memorable cup.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=85&w=1200",
    icon: Leaf,
  },
  {
    number: "02",
    title: "The Art of Plucking",
    subtitle: "A CAREFUL SELECTION",
    description:
      "Tea leaves are selected with care. The choice of leaves plays an important role in the character, aroma and quality of the final tea.",
    image:
      "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=85&w=1200",
    icon: Sun,
  },
  {
    number: "03",
    title: "The Making of Tea",
    subtitle: "CRAFT AND TRADITION",
    description:
      "Tea processing transforms freshly harvested leaves into the tea we enjoy. Different processing methods help create the distinctive character of different tea varieties.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=1200",
    icon: Coffee,
  },
  {
    number: "04",
    title: "Preparing for You",
    subtitle: "READY TO BE ENJOYED",
    description:
      "Once processed and prepared, tea is packaged to help preserve its character until it reaches the people who enjoy it.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=85&w=1200",
    icon: Package,
  },
];

function TeaJourney() {
  return (
    <main className="tea-journey">

      {/* HERO */}
      <section className="journey-hero">
        <div className="journey-hero-image" />

        <div className="journey-hero-overlay" />

        <div className="journey-hero-content">
          <span>THE STORY BEHIND EVERY CUP</span>

          <h1>
            From garden
            <br />
            <i>to your cup.</i>
          </h1>

          <p>
            Every cup has a story. Discover the journey,
            care and craft behind the world of Ceylon tea.
          </p>

          <a href="#journey-story" className="journey-hero-button">
            DISCOVER THE JOURNEY
            <ArrowDown size={17} />
          </a>
        </div>

        <div className="journey-hero-bottom">
          <span>HOPE TEA ESTATE · HEWAHETA</span>
          <span>A LITTLE PEACE IN EVERY CUP</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section id="journey-story" className="journey-intro">
        <span>MORE THAN JUST TEA</span>

        <h2>
          A journey shaped by
          <br />
          <i>nature and care.</i>
        </h2>

        <p>
          Behind every cup of tea is a journey that begins
          in the garden and continues through a series of
          carefully managed processes. Explore the journey
          that brings tea from the landscape to your home.
        </p>
      </section>

      {/* JOURNEY STAGES */}
      <section className="journey-stages">

        <div className="journey-stages-heading">
          <span>THE PROCESS</span>
          <h2>Four moments. <i>One journey.</i></h2>
        </div>

        {journeyStages.map((stage, index) => {
          const Icon = stage.icon;
          const reverse = index % 2 !== 0;

          return (
            <article
              className={`journey-stage ${reverse ? "reverse" : ""}`}
              key={stage.number}
            >
              <div className="journey-stage-image">
                <img src={stage.image} alt={stage.title} />

                <span className="journey-stage-number">
                  {stage.number}
                </span>
              </div>

              <div className="journey-stage-content">
                <div className="journey-stage-icon">
                  <Icon size={23} />
                </div>

                <span>{stage.subtitle}</span>

                <h3>{stage.title}</h3>

                <p>{stage.description}</p>

                <div className="journey-stage-line" />
              </div>
            </article>
          );
        })}

      </section>

      {/* QUOTE / BREAK */}
      <section className="journey-quote">
        <div className="journey-quote-image" />

        <div className="journey-quote-content">
          <span>THE BEAUTY OF CEYLON TEA</span>

          <h2>
            Nature gives it
            <br />
            its <i>character.</i>
          </h2>

          <p>
            From the first leaf to the final brew,
            every stage contributes to the experience
            of a good cup of tea.
          </p>
        </div>
      </section>

      {/* GARDEN TO CUP */}
      <section className="journey-ending">
        <div className="journey-ending-content">
          <Leaf size={30} />

          <span>THE HOPE TEA EXPERIENCE</span>

          <h2>
            And finally,
            <br />
            <i>a moment for you.</i>
          </h2>

          <p>
            Take a breath, prepare your favourite tea
            and enjoy a little moment of peace.
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

export default TeaJourney;
