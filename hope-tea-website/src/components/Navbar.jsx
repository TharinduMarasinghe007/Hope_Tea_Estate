import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";

function getCartCount() {
  try {
    const raw = localStorage.getItem("hopeTeaCart");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  } catch {
    return 0;
  }
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [menuOpenPath, setMenuOpenPath] = useState(null);
  const menuOpen = menuOpenPath === location.pathname;
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [cartCount, setCartCount] = useState(getCartCount);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [cartBouncing, setCartBouncing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!menuOpen && !userDropdownOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpenPath(null);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, userDropdownOpen]);

  // Reset navbar visibility on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavVisible(true);
      setScrolled(window.scrollY > 20);
      lastScrollY.current = window.scrollY;
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Keep navbar visible if mobile menu or dropdown is open
          if (menuOpen || userDropdownOpen) {
            setNavVisible(true);
            setScrolled(currentScrollY > 20);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          // Near top threshold (<= 70px): always show navbar
          if (currentScrollY <= 70) {
            setNavVisible(true);
            setScrolled(currentScrollY > 20);
          } else {
            const diff = currentScrollY - lastScrollY.current;
            // Scroll delta threshold prevents micro-jitter
            if (diff > 8) {
              // Scrolling DOWN -> hide navbar
              setNavVisible(false);
            } else if (diff < -8) {
              // Scrolling UP -> show navbar
              setNavVisible(true);
            }
            setScrolled(true);
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen, userDropdownOpen]);

  useEffect(() => {
    const updateCount = () => {
      setCartCount(getCartCount());
      setCartBouncing(true);
      setTimeout(() => setCartBouncing(false), 500);
    };
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Our Estate", path: "/about" },
    { name: "Our Teas", path: "/collection" },
    { name: "Tea Journey", path: "/journey" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`site-navbar ${scrolled ? "scrolled" : ""} ${
        navVisible ? "navbar-visible" : "navbar-hidden"
      } ${menuOpen ? "menu-open" : ""}`}
    >
      <div className="navbar-inner">
        <BrandLogo />

        <nav
          id="site-navigation"
          className={`navbar-nav-links ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpenPath(null)}
              className={({ isActive }) =>
                `nav-item-link ${isActive ? "active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="navbar-mobile-account-row">
            {isAuthenticated ? (
              <NavLink
                to="/account"
                onClick={() => setMenuOpenPath(null)}
                className="nav-item-link"
              >
                My Account ({currentUser?.firstName})
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpenPath(null)}
                className="nav-item-link"
              >
                Sign In / Register
              </NavLink>
            )}
          </div>
        </nav>

        {menuOpen && (
          <button
            type="button"
            className="navbar-menu-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpenPath(null)}
          />
        )}

        <div className="navbar-actions">
          {isAuthenticated && currentUser ? (
            <div className="navbar-user-menu-wrap" ref={dropdownRef}>
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-label="Open user account menu"
              >
                <div className="navbar-avatar-wrapper">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.firstName}
                      className="navbar-user-avatar"
                    />
                  ) : (
                    <span className="navbar-user-initials">
                      {(currentUser.firstName || "U")[0]}
                    </span>
                  )}
                  <span className="navbar-user-status-dot" title="Verified Member" />
                </div>
                <span className="navbar-user-name">{currentUser.firstName}</span>
                <ChevronDown
                  size={14}
                  className={`navbar-chevron ${userDropdownOpen ? "open" : ""}`}
                />
              </button>

              {userDropdownOpen && (
                <div className="navbar-user-dropdown-panel" role="menu">
                  <div className="dropdown-user-header">
                    <div className="dropdown-user-avatar-row">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.firstName}
                          className="dropdown-avatar-thumb"
                        />
                      ) : (
                        <span className="dropdown-avatar-initials">
                          {(currentUser.firstName || "U")[0]}
                        </span>
                      )}
                      <div className="dropdown-user-info-text">
                        <strong>
                          {currentUser.firstName} {currentUser.lastName}
                        </strong>
                        <span className="dropdown-user-email">{currentUser.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-badge-row">
                      <span className="dropdown-verified-badge">
                        <ShieldCheck size={12} />
                        {currentUser.provider === "google"
                          ? "Google Verified"
                          : "Verified Estate Patron"}
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to="/account"
                    className="dropdown-link-item"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={15} />
                    <span>My Account & Orders</span>
                  </Link>
                  <button
                    type="button"
                    className="dropdown-logout-btn"
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      navigate("/");
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar-auth-link"
              title="Sign In or Register"
            >
              <User size={15} />
              <span>Sign In</span>
            </Link>
          )}

          <Link to="/cart" className="navbar-cart-btn" aria-label="Shopping cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className={`navbar-cart-badge ${cartBouncing ? "bounce" : ""}`}>
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/collection" className="navbar-shop-tea-btn">
            Shop Tea
          </Link>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpenPath(menuOpen ? null : location.pathname)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            type="button"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
