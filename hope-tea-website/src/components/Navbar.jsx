import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Our Estate", path: "/about" },
    { name: "Tea Collection", path: "/collection" },
    { name: "Tea Journey", path: "/journey" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-name">HOPE</span>
        <span className="brand-subtitle">TEA ESTATE · CEYLON</span>
      </Link>

      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <Link to="/cart" className="cart-link" aria-label="Shopping cart">
          <ShoppingBag size={19} />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;