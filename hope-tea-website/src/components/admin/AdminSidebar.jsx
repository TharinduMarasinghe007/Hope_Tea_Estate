import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  BarChart3,
  Tag,
  FileText,
  Settings,
  ExternalLink,
  Leaf,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Sales Inventory", path: "/admin/inventory", icon: Boxes },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Sales Reports", path: "/admin/reports", icon: BarChart3 },
  { name: "Promotions", path: "/admin/promotions", icon: Tag },
  { name: "Website Content", path: "/admin/content", icon: FileText },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <Leaf size={22} />
        </div>
        <div>
          <h2>HOPE</h2>
          <span>ESTATE ADMIN</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <span className="admin-nav-section-title">STORE MANAGEMENT</span>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="admin-nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-sidebar-store-link">
          <ExternalLink size={16} />
          <span>View Public Store</span>
        </Link>
        <span className="admin-version">v1.0 · Hewaheta, Ceylon</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
