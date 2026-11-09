import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, Leaf } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/collection";

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);

      if (res.success) {
        navigate(redirectPath);
      } else {
        setError(res.error || "Failed to sign in.");
      }
    }, 300);
  };

  const handleGoogleSuccess = () => {
    navigate(redirectPath);
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <main className="auth-page-wrap">
      <div className="auth-card-container">
        {/* Brand Header */}
        <div className="auth-card-header">
          <div className="auth-brand-badge">
            <Leaf size={20} />
          </div>
          <span className="auth-subtitle">HOPE TEA ESTATE · HEWAHETA</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-desc">
            Sign in to access your orders, saved addresses, and express checkout.
          </p>
        </div>

        {/* Redirect Notice if coming from checkout */}
        {redirectPath === "/checkout" && (
          <div className="auth-redirect-notice">
            <ShieldCheck size={16} />
            <span>Please sign in or create an account to finalize your order. Your cart items are saved.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Google Account Sign In */}
        <div className="auth-social-block">
          <GoogleSignInButton
            text="Continue with Google"
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
          />
        </div>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="login-password">Password</label>
              <span className="auth-forgot-link" onClick={() => setError("For testing, please use demo credentials or Google sign in.")}>
                Forgot password?
              </span>
            </div>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? "Signing in..." : "Sign In to Hope Tea"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Quick Demo Credentials for Fast Evaluation */}
        <div className="auth-demo-credentials-box">
          <span className="demo-box-label">QUICK DEMO ACCOUNTS</span>
          <div className="demo-pills-row">
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickDemo("amelia.f@gmail.com", "password123")}
            >
              <strong>Amelia F.</strong>
              <span>Colombo customer</span>
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickDemo("daniel.p@outlook.com", "password123")}
            >
              <strong>Daniel P.</strong>
              <span>Kandy customer</span>
            </button>
          </div>
        </div>

        {/* Register Prompt */}
        <div className="auth-card-footer">
          <p>
            Don't have an estate account?{" "}
            <Link
              to={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"}
              className="auth-switch-link"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

