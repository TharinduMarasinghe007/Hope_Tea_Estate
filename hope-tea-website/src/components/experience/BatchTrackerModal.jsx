import { useState } from "react";
import { X, ShieldCheck, MapPin, Calendar, UserCheck, Flame, Award, CheckCircle } from "lucide-react";

const mockBatches = {
  "HP-HW-2026-B1": {
    code: "HP-HW-2026-B1",
    teaName: "Estate Breakfast Black Tea",
    grade: "Broken Orange Pekoe (BOP1)",
    elevation: "1,420m above sea level",
    division: "Hope Upper Division · Plot 4B",
    harvestDate: "02 November 2026",
    dawnWeather: "17°C · Misty Mountain Wind",
    leadPlucker: "S. Vasanthi (19 yrs experience)",
    teaMaker: "M. Ramanathan (Master Artisan)",
    witheringHours: "14 hours under controlled ambient mountain breeze",
    moisture: "3.2% (Premium export grade)",
    lionLogoCertified: true,
  },
  "HP-HW-2026-B2": {
    code: "HP-HW-2026-B2",
    teaName: "Pure Highland Green Tea",
    grade: "Fine Whole Pekoe (P1)",
    elevation: "1,450m above sea level",
    division: "Hope Sunrise Ridge · Plot 1A",
    harvestDate: "04 November 2026",
    dawnWeather: "16°C · Crisp morning sun",
    leadPlucker: "K. Malar (14 yrs experience)",
    teaMaker: "M. Ramanathan (Master Artisan)",
    witheringHours: "Immediate pan-firing to arrest oxidation",
    moisture: "2.9% (Preserved freshness)",
    lionLogoCertified: true,
  },
  "HP-HW-2026-B4": {
    code: "HP-HW-2026-B4",
    teaName: "Golden Breakfast High Grown Blend",
    grade: "Orange Pekoe (OP)",
    elevation: "1,380m above sea level",
    division: "Hope Valley Valley · Plot 7C",
    harvestDate: "05 November 2026",
    dawnWeather: "18°C · Light morning drizzle",
    leadPlucker: "R. Jayanthi (22 yrs experience)",
    teaMaker: "A. Fernando (Factory Specialist)",
    witheringHours: "16 hours gentle trough withering",
    moisture: "3.4% (Optimal liquor density)",
    lionLogoCertified: true,
  },
};

export default function BatchTrackerModal({ isOpen, onClose, initialBatch = "HP-HW-2026-B1" }) {
  const [selectedBatchCode, setSelectedBatchCode] = useState(initialBatch);
  const [inputCode, setInputCode] = useState("");

  if (!isOpen) return null;

  const currentBatch = mockBatches[selectedBatchCode] || mockBatches["HP-HW-2026-B1"];

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    if (mockBatches[clean]) {
      setSelectedBatchCode(clean);
    } else {
      // Default to first match or show alert
      alert(`Batch "${clean}" is undergoing final moisture kiln verification. Showing closest verified estate harvest.`);
      setSelectedBatchCode("HP-HW-2026-B1");
    }
  };

  return (
    <div className="batch-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="batch-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="batch-modal-header">
          <div className="batch-header-title-flex">
            <div className="batch-shield-halo">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="batch-eyebrow">CEYLON TERROIR CERTIFICATE</span>
              <h2>Hope Tea Estate · Batch Passport</h2>
            </div>
          </div>

          <button type="button" className="batch-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Batch Selector Pills */}
        <div className="batch-selector-strip">
          <span className="batch-quick-label">Verified Harvest Batches:</span>
          <div className="batch-quick-pills">
            {Object.keys(mockBatches).map((code) => (
              <button
                key={code}
                type="button"
                className={`batch-pill-btn ${selectedBatchCode === code ? "active" : ""}`}
                onClick={() => setSelectedBatchCode(code)}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Passport Certificate Card */}
        <div className="batch-certificate-card">
          <div className="certificate-crest-row">
            <div className="cert-lion-seal">
              <Award size={20} />
              <span>100% PURE CEYLON TEA</span>
            </div>
            <div className="cert-serial-tag">
              Batch: <strong>{currentBatch.code}</strong>
            </div>
          </div>

          <div className="certificate-tea-banner">
            <h3>{currentBatch.teaName}</h3>
            <span>Grade: {currentBatch.grade}</span>
          </div>

          <div className="certificate-specs-grid">
            <div className="cert-spec-item">
              <MapPin size={16} className="cert-spec-icon" />
              <div>
                <span className="spec-label">ESTATE ELEVATION & TERROIR</span>
                <strong>{currentBatch.elevation}</strong>
                <p className="spec-micro">{currentBatch.division}</p>
              </div>
            </div>

            <div className="cert-spec-item">
              <Calendar size={16} className="cert-spec-icon" />
              <div>
                <span className="spec-label">HARVEST & PLUCKING DAWN</span>
                <strong>{currentBatch.harvestDate}</strong>
                <p className="spec-micro">{currentBatch.dawnWeather}</p>
              </div>
            </div>

            <div className="cert-spec-item">
              <UserCheck size={16} className="cert-spec-icon" />
              <div>
                <span className="spec-label">HAND-PLUCKED & AUDITED BY</span>
                <strong>{currentBatch.leadPlucker}</strong>
                <p className="spec-micro">Supervised by Master Tea Maker {currentBatch.teaMaker}</p>
              </div>
            </div>

            <div className="cert-spec-item">
              <Flame size={16} className="cert-spec-icon" />
              <div>
                <span className="spec-label">ARTISANAL PROCESSING & DRIED MOISTURE</span>
                <strong>Moisture: {currentBatch.moisture}</strong>
                <p className="spec-micro">{currentBatch.witheringHours}</p>
              </div>
            </div>
          </div>

          <div className="certificate-footer-seal">
            <CheckCircle size={15} style={{ color: "#2d5438" }} />
            <span>
              Directly packaged at Hope Tea Estate, Hewaheta, Sri Lanka. Untouched by intermediaries.
            </span>
          </div>
        </div>

        {/* Custom Batch Search */}
        <form onSubmit={handleSearch} className="batch-search-bar">
          <input
            type="text"
            placeholder="Check another batch number (e.g. HP-HW-2026-B2)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="batch-search-input"
          />
          <button type="submit" className="batch-search-btn">
            Verify Batch
          </button>
        </form>
      </div>
    </div>
  );
}

