import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Check, X, Shield, User } from "lucide-react";

// Official Google "G" Logo
export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Preset Google Demo accounts for effortless evaluation
const demoGoogleAccounts = [
  {
    firstName: "Amelia",
    lastName: "Fernando",
    email: "amelia.f@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  {
    firstName: "Niroshan",
    lastName: "Perera",
    email: "niroshan.perera@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
  {
    firstName: "Dilini",
    lastName: "Senanayake",
    email: "dilini.s@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
  },
];

export default function GoogleSignInButton({
  text = "Continue with Google",
  onSuccess,
  onError,
  className = "",
}) {
  const { loginWithGoogle } = useAuth();
  const [showChooser, setShowChooser] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Initialize official Google Identity Services API if Client ID exists
  useEffect(() => {
    if (!googleClientId) return;

    // Load official GIS script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [googleClientId]);

  // Decode JWT credential from Google Identity Services
  const handleGoogleCredentialResponse = (response) => {
    try {
      setLoading(true);
      // Basic JWT payload decoder
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const profile = JSON.parse(jsonPayload);

      const res = loginWithGoogle({
        firstName: profile.given_name || profile.name || "Customer",
        lastName: profile.family_name || "",
        email: profile.email,
        avatar: profile.picture,
      });

      if (res.success && onSuccess) {
        onSuccess(res.user);
      }
    } catch (err) {
      console.error("Google sign in parse error", err);
      if (onError) onError("Failed to process Google sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setShowChooser(true);
        }
      });
    } else {
      // Show Google Account Chooser
      setShowChooser(true);
    }
  };

  const handleSelectAccount = (acc) => {
    setLoading(true);
    setTimeout(() => {
      const res = loginWithGoogle(acc);
      setLoading(false);
      setShowChooser(false);
      if (res.success && onSuccess) {
        onSuccess(res.user);
      }
    }, 350);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const parts = customName.trim().split(" ");
    const firstName = parts[0] || customEmail.split("@")[0];
    const lastName = parts.slice(1).join(" ") || "";

    handleSelectAccount({
      firstName,
      lastName,
      email: customEmail.trim(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName)}&backgroundColor=1e3b26,5b7360`,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`google-sign-in-btn ${className}`}
        aria-label={text}
      >
        <GoogleIcon size={19} />
        <span>{loading ? "Connecting to Google..." : text}</span>
      </button>

      {/* Google Account Chooser Modal */}
      {showChooser && (
        <div className="google-modal-backdrop" onClick={() => setShowChooser(false)}>
          <div
            className="google-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="google-modal-header">
              <div className="google-header-brand">
                <GoogleIcon size={24} />
                <div>
                  <h3>Sign in with Google</h3>
                  <p>Choose an account to continue to Hope Tea Estate</p>
                </div>
              </div>
              <button
                type="button"
                className="google-modal-close"
                onClick={() => setShowChooser(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="google-accounts-list">
              {demoGoogleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  className="google-account-item"
                  onClick={() => handleSelectAccount(acc)}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.firstName}
                    className="google-account-avatar"
                  />
                  <div className="google-account-text">
                    <strong>
                      {acc.firstName} {acc.lastName}
                    </strong>
                    <span>{acc.email}</span>
                  </div>
                  <Check size={16} className="google-account-arrow" />
                </button>
              ))}
            </div>

            <div className="google-divider">
              <span>or use another Google account</span>
            </div>

            <form onSubmit={handleCustomGoogleSubmit} className="google-custom-form">
              <div className="google-form-group">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Kasun Mendis)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="google-form-input"
                />
              </div>

              <div className="google-form-group">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="google-form-input"
                />
              </div>

              <button type="submit" className="google-custom-submit-btn">
                <User size={15} />
                <span>Continue with this Account</span>
              </button>
            </form>

            <div className="google-modal-footer">
              <Shield size={13} />
              <span>To continue, Google will share your name and email with Hope Tea Estate.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

