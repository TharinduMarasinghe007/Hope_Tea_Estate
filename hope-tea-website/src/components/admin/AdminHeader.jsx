import { useLocation } from "react-router-dom";
import { Bell, Search, UserCircle } from "lucide-react";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/inventory": "Sales Inventory",
  "/admin/customers": "Customers",
  "/admin/reports": "Sales Reports",
  "/admin/promotions": "Promotions",
  "/admin/content": "Website Content",
  "/admin/settings": "Settings",
};

function AdminHeader() {
  const location = useLocation();

  const currentPage =
    pageTitles[location.pathname] || "Management";

  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <span>HOPE TEA ESTATE</span>
        <h1>{currentPage}</h1>
      </div>

      <div className="admin-header-actions">
        <button className="admin-header-icon">
          <Search size={19} />
        </button>

        <button className="admin-header-icon">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-user">
          <UserCircle size={35} />
          <div>
            <strong>Administrator</strong>
            <span>Store Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;