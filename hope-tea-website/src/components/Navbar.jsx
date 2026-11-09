import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, ChevronDown } from "lucide-react";
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
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [cartCount, setCartCount] = useState(getCartCount);
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`site-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <BrandLogo />

        <nav className={`navbar-nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `nav-item-link ${isActive ? "active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile only account link */}
          <div className="navbar-mobile-account-row">
            {isAuthenticated ? (
              <NavLink
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="nav-item-link"
              >
                My Account ({currentUser?.firstName})
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="nav-item-link"
              >
                Sign In / Register
              </NavLink>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          {isAuthenticated && currentUser ? (
            <div className="navbar-user-menu-wrap" ref={dropdownRef}>
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
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
                <span className="navbar-user-name">{currentUser.firstName}</span>
                <ChevronDown
                  size={14}
                  className={`navbar-chevron ${userDropdownOpen ? "open" : ""}`}
                />
              </button>

              {userDropdownOpen && (
                <div className="navbar-user-dropdown-panel">
                  <div className="dropdown-user-header">
                    <strong>
                      {currentUser.firstName} {currentUser.lastName}
                    </strong>
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to="/account"
                    className="dropdown-link-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={15} />
                    <span>My Account & Orders</span>
                  </Link>
                  <button
                    type="button"
                    className="dropdown-logout-btn"
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
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
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
