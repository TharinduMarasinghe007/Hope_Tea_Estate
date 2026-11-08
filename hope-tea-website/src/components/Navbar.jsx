import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import BrandLogo from "./BrandLogo";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
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
    <header className="site-navbar">
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
        </nav>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-cart-btn" aria-label="Shopping cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
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
