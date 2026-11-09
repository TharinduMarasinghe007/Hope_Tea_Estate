import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Leaf,
  ShieldCheck,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/collection";

  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Colombo",
    postalCode: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((curr) => ({
      ...curr,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim()) {
      setError("Please provide your first name.");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }
    if (!form.agreeTerms) {
      setError("Please agree to the terms and privacy policy to continue.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        password: form.password,
      });

      setLoading(false);

      if (res.success) {
        navigate(redirectPath);
      } else {
        setError(res.error || "Failed to create account.");
      }
    }, 350);
  };

  const handleGoogleSuccess = () => {
    navigate(redirectPath);
  };

  return (
    <main className="auth-page-wrap">
      <div className="auth-card-container auth-register-card">
        {/* Brand Header */}
        <div className="auth-card-header">
          <div className="auth-brand-badge">
            <Leaf size={20} />
          </div>
          <span className="auth-subtitle">HOPE TEA ESTATE · HEWAHETA</span>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-desc">
            Register to place tea orders, save your delivery address, and track shipments from the estate.
          </p>
        </div>

        {/* Redirect Notice if coming from checkout */}
        {redirectPath === "/checkout" && (
          <div className="auth-redirect-notice">
            <ShieldCheck size={16} />
            <span>Create your account to finalize your order. Your cart items are saved.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Google Account Sign Up */}
        <div className="auth-social-block">
          <GoogleSignInButton
            text="Sign up with Google"
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
          />
        </div>

        <div className="auth-divider">
          <span>or register with email</span>
        </div>

        {/* 2. Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid-two">
            <div className="auth-form-group">
              <label htmlFor="reg-first-name">First Name *</label>
              <div className="auth-input-wrap">
                <User size={17} className="auth-input-icon" />
                <input
                  id="reg-first-name"
                  type="text"
                  required
                  placeholder="e.g. Kasun"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="reg-last-name">Last Name</label>
              <div className="auth-input-wrap">
                <User size={17} className="auth-input-icon" />
                <input
                  id="reg-last-name"
                  type="text"
                  placeholder="e.g. Mendis"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>
          </div>

          <div className="auth-grid-two">
            <div className="auth-form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <div className="auth-input-wrap">
                <Mail size={17} className="auth-input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="kasun@example.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="reg-phone">Phone Number *</label>
              <div className="auth-input-wrap">
                <Phone size={17} className="auth-input-icon" />
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  placeholder="+94 77 123 4567"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>
          </div>

          <div className="auth-grid-two">
            <div className="auth-form-group">
              <label htmlFor="reg-address">Delivery Address</label>
              <div className="auth-input-wrap">
                <MapPin size={17} className="auth-input-icon" />
                <input
                  id="reg-address"
                  type="text"
                  placeholder="Street / Apt / House No."
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="reg-city">City / Region</label>
              <div className="auth-input-wrap">
                <select
                  id="reg-city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="auth-input auth-select"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Negombo">Negombo</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Matara">Matara</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                </select>
              </div>
            </div>
          </div>

          <div className="auth-grid-two">
            <div className="auth-form-group">
              <label htmlFor="reg-password">Password (min. 6 chars) *</label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="reg-confirm-password">Confirm Password *</label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  id="reg-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="auth-checkbox-group">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I agree to Hope Tea Estate's <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? "Creating your account..." : "Complete Registration"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Login Switch */}
        <div className="auth-card-footer">
          <p>
            Already have an account?{" "}
            <Link
              to={redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
              className="auth-switch-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

