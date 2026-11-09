import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="contact-page-wrap">
      {/* 1. HERO BANNER */}
      <section className="contact-hero-banner">
        <div className="contact-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=1600"
            alt="Freshly brewed Ceylon tea in a glass cup"
            className="contact-hero-img"
          />
          <div className="contact-hero-overlay" />
        </div>

        <div className="contact-hero-text">
          <h1>We'd love to hear from you</h1>
          <p>Get in touch with us for inquiries, feedback or orders.</p>
        </div>
      </section>

      {/* 2. SPLIT CONTACT SECTION */}
      <section className="contact-main-section">
        <div className="contact-split-grid">
          {/* Left Column: Direct info & Estate Vignette */}
          <div className="contact-info-column">
            <div className="contact-details-list">
              <div className="contact-detail-row">
                <div className="contact-icon-bubble">
                  <MapPin size={18} />
                </div>
                <span>Hewaheta, Sri Lanka</span>
              </div>

              <div className="contact-detail-row">
                <div className="contact-icon-bubble">
                  <Mail size={18} />
                </div>
                <a href="mailto:hello@hopeteaestate.lk">hello@hopeteaestate.lk</a>
              </div>

              <div className="contact-detail-row">
                <div className="contact-icon-bubble">
                  <Phone size={18} />
                </div>
                <a href="tel:+94112345678">+94 11 234 5678</a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="contact-social-pills">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            {/* Estate Vignette Image */}
            <div className="contact-estate-image-box">
              <img
                src="https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=85&w=900"
                alt="Lush green tea hills of Hewaheta"
              />
            </div>
          </div>

          {/* Right Column: Clean Form Card */}
          <div className="contact-form-column">
            <div className="contact-card-box">
              {submitted ? (
                <div className="contact-submitted-state">
                  <div className="submitted-check-icon">
                    <CheckCircle size={44} color="#2d5438" />
                  </div>
                  <h2>Message Received!</h2>
                  <p>
                    Thank you for reaching out, {formData.name}. Our estate team will reply to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-pill"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-actual-form">
                  <div className="contact-field-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Inquiry about our teas, wholesale, visiting..."
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-field-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn-primary-pill contact-submit-btn">
                    Send Message <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
