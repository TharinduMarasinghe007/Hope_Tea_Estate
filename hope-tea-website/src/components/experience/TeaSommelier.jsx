import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Award } from "lucide-react";
import { products } from "../../Data/Products";

const questions = [
  {
    id: "time",
    title: "1. What is your ideal tea moment?",
    options: [
      {
        label: "Early Morning Kickstart",
        sub: "Needs briskness, strength & depth",
        matchCategory: "Black Tea",
        icon: "🌅",
      },
      {
        label: "Midday Serenity & Focus",
        sub: "Fresh, smooth, delicate antioxidant boost",
        matchCategory: "Green Tea",
        icon: "☀️",
      },
      {
        label: "Afternoon High Tea Ritual",
        sub: "Complex, golden cup with refined balance",
        matchCategory: "Specialty Tea",
        icon: "🫖",
      },
      {
        label: "Celebration or Estate Gifting",
        sub: "Showcases Ceylon's most cherished leaves",
        matchCategory: "Tea Gifts",
        icon: "🎁",
      },
    ],
  },
  {
    id: "flavor",
    title: "2. Which flavour profile appeals to your palate?",
    options: [
      {
        label: "Robust, Malty & Full-Bodied",
        hint: "Pairs perfectly with milk or honey",
        preferredId: 1, // Ceylon Black Tea
        icon: "🪵",
      },
      {
        label: "Crisp, Herbal & Clean",
        hint: "Gentle natural sweetness, light finish",
        preferredId: 2, // Pure Green Tea
        icon: "🌿",
      },
      {
        label: "Golden, Amber & Aromatic",
        hint: "High mountain mist character",
        preferredId: 4, // Golden Breakfast
        icon: "✨",
      },
      {
        label: "Rare Whole-Leaf Harmony",
        hint: "Unbroken leaves with lingering floral notes",
        preferredId: 3, // Premium Leaf Tea
        icon: "🍃",
      },
    ],
  },
];

export default function TeaSommelier({ onSelectTea }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchedTea, setMatchedTea] = useState(null);
  const [added, setAdded] = useState(false);

  const handleSelectOption = (questionId, option) => {
    const updated = { ...answers, [questionId]: option };
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate match
      calculateMatch(updated);
    }
  };

  const calculateMatch = (finalAnswers) => {
    let matched = null;

    if (finalAnswers.flavor?.preferredId) {
      matched = products.find((p) => p.id === finalAnswers.flavor.preferredId);
    }

    if (!matched && finalAnswers.time?.matchCategory) {
      matched = products.find((p) => p.category === finalAnswers.time.matchCategory);
    }

    if (!matched) {
      matched = products[0];
    }

    setMatchedTea(matched);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setMatchedTea(null);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!matchedTea) return;
    try {
      const currentCart = JSON.parse(localStorage.getItem("hopeTeaCart") || "[]");
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const cartItemId = `${matchedTea.id}-100g`;

      const existing = safeCart.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        existing.quantity = Number(existing.quantity || 1) + 1;
      } else {
        safeCart.push({
          cartItemId,
          id: matchedTea.id,
          name: `${matchedTea.name} (100g)`,
          price: matchedTea.price,
          image: matchedTea.image,
          weight: "100g",
          quantity: 1,
        });
      }

      localStorage.setItem("hopeTeaCart", JSON.stringify(safeCart));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("tea-cart-added", {
          detail: {
            name: matchedTea.name,
            price: matchedTea.price,
            image: matchedTea.image,
            quantity: 1,
          },
        })
      );

      setAdded(true);
      setTimeout(() => setAdded(false), 2400);
      if (onSelectTea) onSelectTea(matchedTea);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="sommelier-experience-card">
      <div className="sommelier-top-banner">
        <div className="sommelier-title-row">
          <div className="sommelier-icon-halo">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="sommelier-eyebrow">ESTATE TEA SOMMELIER</span>
            <h3 className="sommelier-heading">Discover Your Signature Ceylon Blend</h3>
          </div>
        </div>

        {matchedTea && (
          <button
            type="button"
            onClick={handleRestart}
            className="sommelier-restart-btn"
          >
            <RotateCcw size={13} />
            <span>Retake Sommelier Quiz</span>
          </button>
        )}
      </div>

      {!matchedTea ? (
        <div className="sommelier-quiz-body">
          <div className="sommelier-step-indicator">
            <span className="step-pill">Question {currentStep + 1} of {questions.length}</span>
            <span className="step-prompt">{questions[currentStep].title}</span>
          </div>

          <div className="sommelier-options-grid">
            {questions[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className="sommelier-option-btn"
                onClick={() => handleSelectOption(questions[currentStep].id, opt)}
              >
                <span className="option-emoji">{opt.icon}</span>
                <div className="option-copy">
                  <strong>{opt.label}</strong>
                  <span>{opt.sub || opt.hint}</span>
                </div>
                <ArrowRight size={15} className="option-arrow" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="sommelier-result-card">
          <div className="result-match-header">
            <div className="match-percent-tag">
              <Award size={14} />
              <span>98% Palate Harmony</span>
            </div>
            <span className="match-tagline">Curated especially for your tea ritual</span>
          </div>

          <div className="result-product-split">
            <div className="result-tea-image-wrap">
              <img src={matchedTea.image} alt={matchedTea.name} />
              <div className="result-lion-crest">100% Ceylon</div>
            </div>

            <div className="result-tea-info">
              <span className="result-category">{matchedTea.category} · High Grown Hewaheta</span>
              <h2 className="result-name">{matchedTea.name}</h2>
              <p className="result-desc">{matchedTea.description}</p>

              <div className="result-flavor-bars">
                <div className="flavor-bar-item">
                  <div className="bar-labels">
                    <span>Body & Strength</span>
                    <strong>85%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="flavor-bar-item">
                  <div className="bar-labels">
                    <span>Aroma Intensity</span>
                    <strong>92%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>

              <div className="result-price-row">
                <div className="price-stack">
                  <span className="price-label">ESTATE HARVEST PACK</span>
                  <strong className="price-val">
                    LKR {matchedTea.price.toLocaleString("en-LK")}
                  </strong>
                </div>

                <div className="result-actions">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`btn-primary-pill ${added ? "added-toast" : ""}`}
                  >
                    {added ? (
                      <>
                        <Check size={16} /> In Your Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Add to Bag
                      </>
                    )}
                  </button>

                  <Link
                    to={`/product/${matchedTea.id}`}
                    className="btn-secondary-pill"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
