import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, QrCode, CheckCircle2 } from "lucide-react";

const processSteps = [
  {
    id: 1,
    title: "Tea Gardens",
    subtitle: "Nurtured in nature",
    description:
      "Every tea journey begins in the volcanic highland soil of Hewaheta. The fresh mountain air and morning mist nurture the tea bushes to peak vitality.",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=85&w=600",
  },
  {
    id: 2,
    title: "Leaf Plucking",
    subtitle: "Two leaves & a bud",
    description:
      "Skilled estate pluckers hand-select only the tender topmost shoots at dawn, ensuring unmatched freshness, aroma, and delicate polyphenol balance.",
    image:
      "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=85&w=600",
  },
  {
    id: 3,
    title: "Processing",
    subtitle: "Withering & rolling",
    description:
      "Fresh leaves are carefully withered to reduce moisture, then gently rolled using artisanal methods that release the essential oils and initiate oxidation.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=600",
  },
  {
    id: 4,
    title: "Grading",
    subtitle: "Sifting by leaf size",
    description:
      "After precise kiln firing, the tea is sorted by leaf particle size—from unbroken Whole Leaf to Broken Orange Pekoe (BOP) and fine fannings.",
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=85&w=600",
  },
  {
    id: 5,
    title: "Packing",
    subtitle: "Sealed for freshness",
    description:
      "Sealed in moisture-proof foil pouches and tin canisters at the estate to lock in the highland terroir until you steep your first cup.",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=85&w=600",
  },
];

function TeaJourney() {
  const [selectedStep, setSelectedStep] = useState(processSteps[0]);

  return (
    <main className="journey-page-wrap">
      {/* 1. HERO BANNER */}
      <section className="journey-hero-banner">
        <div className="journey-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=1600"
            alt="Sun-kissed Ceylon tea plantation in Hewaheta"
            className="journey-hero-img"
          />
          <div className="journey-hero-overlay" />
        </div>

        <div className="journey-hero-text">
          <h1>Every leaf has a journey</h1>
          <p>From our gardens to your cup, with care at every step.</p>
        </div>
      </section>

      {/* 2. 5-STEP CIRCULAR PROCESS FLOW */}
      <section className="journey-steps-section">
        <div className="steps-flow-container">
          {processSteps.map((step, index) => (
            <div key={step.id} className="step-item-wrapper">
              <button
                type="button"
                className={`step-circle-btn ${selectedStep.id === step.id ? "active" : ""}`}
                onClick={() => setSelectedStep(step)}
                aria-label={`Select step ${step.id}: ${step.title}`}
              >
                <div className="step-circle-img-wrap">
                  <img src={step.image} alt={step.title} />
                </div>
              </button>

              <span className="step-circle-label">{step.title}</span>

              {index < processSteps.length - 1 && (
                <div className="step-arrow-connector">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Step Detail Card */}
        <div className="selected-step-detail-card">
          <div className="step-detail-badge">
            <CheckCircle2 size={16} />
            <span>Step 0{selectedStep.id} · {selectedStep.subtitle}</span>
          </div>
          <h2>{selectedStep.title}</h2>
          <p>{selectedStep.description}</p>
        </div>
      </section>

      {/* 3. "TRACE THE JOURNEY" QR CARD & CUP FEATURE */}
      <section className="journey-trace-feature-section">
        <div className="trace-feature-grid">
          {/* Left: QR Card */}
          <div className="trace-qr-card">
            <div className="trace-qr-graphic">
              <QrCode size={56} color="#1e3b26" />
            </div>

            <div className="trace-qr-info">
              <h3>Trace the Journey</h3>
              <p>
                A proposed future feature to view the journey of your tea batch—from plucking date to packing.
              </p>

              <Link to="/about" className="btn-primary-pill trace-btn">
                Learn More <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right: Rich Teacup Visual */}
          <div className="trace-visual-card">
            <div className="trace-cup-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=900"
                alt="Fresh cup of amber tea with tea leaves"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TeaJourney;
