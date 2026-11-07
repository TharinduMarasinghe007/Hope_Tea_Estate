
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Send,
  CheckCircle
} from "lucide-react";


function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Enquiry",
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
    <main className="estate-contact">

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-image" />
        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
          <span>WE WOULD LOVE TO HEAR FROM YOU</span>
          <h1>
            Let's start a
            <br />
            <i>conversation.</i>
          </h1>
          <p>
            Have a question about our tea, our estate
            or something else? We would be happy to
            hear from you.
          </p>
        </div>

        <div className="contact-hero-caption">
          HOPE TEA ESTATE · HEWAHETA
        </div>
      </section>

      {/* CONTACT MAIN */}
      <section className="contact-main">

        <div className="contact-information">
          <span className="contact-eyebrow">GET IN TOUCH</span>

          <h2>
            Every good
            <br />
            conversation
            <br />
            starts <i>somewhere.</i>
          </h2>

          <p>
            Whether you are interested in our tea collection,
            have a business enquiry or simply want to know
            more about Hope Tea Estate, get in touch.
          </p>

          <div className="contact-details">

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <MapPin size={21} />
              </div>
              <div>
                <span>OUR LOCATION</span>
                <p>Hewaheta, Sri Lanka</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Mail size={21} />
              </div>
              <div>
                <span>EMAIL ADDRESS</span>
                <p>Contact details to be confirmed</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Phone size={21} />
              </div>
              <div>
                <span>PHONE NUMBER</span>
                <p>Contact details to be confirmed</p>
              </div>
            </div>

          </div>

          <div className="contact-social">
            <span>FOLLOW OUR JOURNEY</span>
            <div>
              <a href="#instagram">Instagram</a>
                <a href="#facebook">Facebook</a>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="contact-form-container">
          <div className="contact-form-heading">
            <span>SEND US A MESSAGE</span>
            <h2>We are listening.</h2>
            <p>Fill in the details below and share your enquiry.</p>
          </div>

          {submitted ? (
            <div className="contact-success">
              <CheckCircle size={42} />
              <h3>Thank you!</h3>
              <p>
                Your message has been prepared successfully.
                The enquiry form is currently a frontend
                demonstration and has not been sent to the estate.
              </p>
              <button onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  subject: "General Enquiry",
                  message: "",
                });
              }}>
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">YOUR NAME *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">EMAIL ADDRESS *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">SUBJECT</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option>General Enquiry</option>
                  <option>Product Information</option>
                  <option>Business Partnership</option>
                  <option>Orders and Delivery</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">YOUR MESSAGE *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Write your message here..."
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="contact-submit">
                SEND MESSAGE <Send size={17} />
              </button>

              <p className="contact-form-note">
                * Required fields
              </p>

            </form>
          )}
        </div>

      </section>

      {/* LOCATION */}
      <section className="contact-location">
        <div className="contact-location-content">
          <span>COME FIND US</span>
          <h2>
            A place called
            <br />
            <i>Hope.</i>
          </h2>
          <p>
            Nestled in the beautiful surroundings of
            Hewaheta, Sri Lanka.
          </p>
          <Link to="/about">
            DISCOVER OUR ESTATE <ArrowRight size={17} />
          </Link>
        </div>

        <div className="contact-location-map">
          <iframe
            title="Hewaheta Sri Lanka map"
            src="https://www.google.com/maps?q=Hewaheta,Sri%20Lanka&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* CLOSING */}
      <section className="contact-closing">
        <span>HOPE TEA ESTATE · CEYLON</span>
        <h2>A little peace in every cup.</h2>
        <Link to="/collection">
          EXPLORE OUR TEA COLLECTION
          <ArrowRight size={17} />
        </Link>
      </section>

    </main>
  );
}

export default Contact;
