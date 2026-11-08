import { useState } from "react";
import {
  Save,
  CheckCircle,
  Megaphone,
  Layout,
  Quote,
} from "lucide-react";
import {
  getStoredWebContent,
  saveStoredWebContent,
} from "../../Data/adminStorage";

function WebsiteContent() {
  const [content, setContent] = useState(getStoredWebContent);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredWebContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-content-management-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">STOREFRONT COPY & HIGHLIGHTS</span>
          <h1>Website Content</h1>
          <p>
            Update key customer-facing announcements, hero messaging, and estate highlights.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={handleSave}
          style={{ background: "#26422d", color: "#ffffff" }}
        >
          <Save size={16} />
          Publish Updates
        </button>
      </div>

      {saved && (
        <div
          style={{
            padding: "14px 20px",
            background: "#eaf3e9",
            color: "#355e3b",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "500",
          }}
        >
          <CheckCircle size={18} />
          Content published successfully! Changes are live across the public storefront.
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {/* 1. Top Announcement Bar */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Top Announcement Notice</h3>
              <p>Prominent alert banner shown across public website pages</p>
            </div>
            <Megaphone size={20} color="#8a9987" />
          </div>

          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={content.topBannerActive}
                onChange={(e) => handleChange("topBannerActive", e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              <span><strong>Display Top Announcement Bar</strong> on public pages</span>
            </label>

            <div className="admin-form-group">
              <label>Announcement Banner Message</label>
              <input
                type="text"
                value={content.topBannerText}
                onChange={(e) => handleChange("topBannerText", e.target.value)}
                placeholder="e.g. Autumn Flush Harvest Now Available · Island-wide Delivery Available"
              />
            </div>
          </div>
        </section>

        {/* 2. Home Hero Messaging */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Home Page Hero Headlines</h3>
              <p>The primary introduction visitors see upon entering the website</p>
            </div>
            <Layout size={20} color="#8a9987" />
          </div>

          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <div className="admin-form-group">
              <label>Main Headline</label>
              <input
                type="text"
                value={content.homeHeroTitle}
                onChange={(e) => handleChange("homeHeroTitle", e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Secondary Subtitle</label>
              <input
                type="text"
                value={content.homeHeroSubtitle}
                onChange={(e) => handleChange("homeHeroSubtitle", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 3. Quote Banner & Estate Highlights */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Brand Philosophy & Estate Metrics</h3>
              <p>Reflective tea quote and highland terroir attributes</p>
            </div>
            <Quote size={20} color="#8a9987" />
          </div>

          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
            <div className="admin-form-group">
              <label>Featured Brand Quote Banner</label>
              <input
                type="text"
                value={content.homeQuoteText}
                onChange={(e) => handleChange("homeQuoteText", e.target.value)}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Highland Elevation Tag</label>
                <input
                  type="text"
                  value={content.estateElevation}
                  onChange={(e) => handleChange("estateElevation", e.target.value)}
                  placeholder="e.g. 1,200m"
                />
              </div>

              <div className="admin-form-group">
                <label>Harvest Integrity Note</label>
                <input
                  type="text"
                  value={content.curatedHarvestNotice}
                  onChange={(e) => handleChange("curatedHarvestNotice", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export default WebsiteContent;
