import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Clock,
  Award,
  X,
} from "lucide-react";
import { getStoredOrders } from "../../Data/adminStorage";

function formatPrice(val) {
  return `LKR ${Number(val || 0).toLocaleString("en-LK")}`;
}

function formatDate(isoStr) {
  if (!isoStr) return "N/A";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Customers() {
  const [orders] = useState(getStoredOrders);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Aggregate customers from orders
  const customerList = useMemo(() => {
    const map = {};

    orders.forEach((o) => {
      const c = o.customer || {};
      const key = (c.email || c.phone || `${c.firstName}_${c.lastName}`).toLowerCase();
      if (!key) return;

      if (!map[key]) {
        map[key] = {
          id: key,
          name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Guest Customer",
          email: c.email || "No email",
          phone: c.phone || "No phone",
          city: c.city || "Sri Lanka",
          address: c.address || "",
          orderCount: 0,
          totalSpent: 0,
          orders: [],
          lastOrderDate: o.createdAt || o.date,
        };
      }

      map[key].orderCount += 1;
      map[key].totalSpent += Number(o.total || o.subtotal || 0);
      map[key].orders.push(o);

      if (new Date(o.createdAt || 0) > new Date(map[key].lastOrderDate || 0)) {
        map[key].lastOrderDate = o.createdAt;
      }
    });

    return Object.values(map);
  }, [orders]);

  const filtered = useMemo(() => {
    return customerList.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase())
    );
  }, [customerList, search]);

  const totalCustomers = customerList.length;
  const repeatCount = customerList.filter((c) => c.orderCount > 1).length;
  const totalRevenue = customerList.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="admin-customers-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">STORE PATRONS & BUYERS</span>
          <h1>Customer Directory</h1>
          <p>View customer profiles, contact info, total tea purchase history, and lifetime value.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="admin-order-stats">
        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Total Customers</span>
            <Users size={19} />
          </div>
          <strong>{totalCustomers}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Repeat Tea Buyers</span>
            <Award size={19} color="#c69b51" />
          </div>
          <strong>{repeatCount}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Customer Lifetime Total</span>
            <ShoppingBag size={19} />
          </div>
          <strong>{formatPrice(totalRevenue)}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Avg Spend / Customer</span>
            <Clock size={19} />
          </div>
          <strong>
            {formatPrice(Math.round(totalRevenue / (totalCustomers || 1)))}
          </strong>
        </div>
      </div>

      {/* Table Section */}
      <section className="admin-orders-table-section">
        <div className="admin-orders-table-heading">
          <div>
            <span>REGISTERED PATRONS</span>
            <h2>Customer Records</h2>
          </div>
          <span className="admin-order-total">{filtered.length} Customers</span>
        </div>

        <div className="admin-order-toolbar">
          <div className="admin-order-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by customer name, email, phone, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>CUSTOMER NAME</th>
                <th>CONTACT INFO</th>
                <th>LOCATION</th>
                <th>ORDERS PLACED</th>
                <th>LIFETIME SPEND</th>
                <th>LAST ORDER</th>
                <th>TIER</th>
                <th>DETAILS</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => {
                const isRepeat = c.orderCount > 1;

                return (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <div className="admin-cust-contact">
                        <span><Mail size={12} /> {c.email}</span>
                        <span><Phone size={12} /> {c.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-field-location">
                        <MapPin size={13} /> {c.city}
                      </span>
                    </td>
                    <td>
                      <strong>{c.orderCount}</strong> order{c.orderCount > 1 ? "s" : ""}
                    </td>
                    <td className="order-amount">{formatPrice(c.totalSpent)}</td>
                    <td>{formatDate(c.lastOrderDate)}</td>
                    <td>
                      <span className={`order-status ${isRepeat ? "delivered" : "processing"}`}>
                        {isRepeat ? "Repeat Buyer" : "New Patron"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-adjust-btn"
                        onClick={() => setSelectedCustomer(c)}
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="admin-order-modal-backdrop" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span>PATRON PROFILE</span>
                <h2>{selectedCustomer.name}</h2>
              </div>
              <button type="button" onClick={() => setSelectedCustomer(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-customer">
              <span>CONTACT & DELIVERY</span>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Address:</strong> {selectedCustomer.address || "No saved address"}, {selectedCustomer.city}</p>
              <p><strong>Lifetime Orders:</strong> {selectedCustomer.orderCount} ({formatPrice(selectedCustomer.totalSpent)})</p>
            </div>

            <div className="admin-modal-products">
              <span>ORDER HISTORY</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                {selectedCustomer.orders.map((o) => (
                  <div
                    key={o.orderNumber}
                    style={{
                      padding: "12px",
                      background: "#f8faf7",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #e7ede5",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#253b2d" }}>{o.orderNumber}</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "#849182" }}>
                        {formatDate(o.createdAt || o.date)} · {o.items?.length || 0} item(s)
                      </span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: "#253b2d", fontSize: "13px" }}>
                        {formatPrice(o.total || o.subtotal)}
                      </strong>
                      <span
                        className={`order-status ${(o.status || "Pending").toLowerCase()}`}
                        style={{ display: "block", marginTop: "4px" }}
                      >
                        {o.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="admin-modal-close-button"
              onClick={() => setSelectedCustomer(null)}
              style={{ marginTop: "20px" }}
            >
              CLOSE PROFILE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
