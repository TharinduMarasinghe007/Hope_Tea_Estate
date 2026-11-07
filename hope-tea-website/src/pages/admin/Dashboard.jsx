
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

const salesData = [
  { day: "Mon", sales: 45 },
  { day: "Tue", sales: 65 },
  { day: "Wed", sales: 38 },
  { day: "Thu", sales: 80 },
  { day: "Fri", sales: 58 },
  { day: "Sat", sales: 95 },
  { day: "Sun", sales: 72 },
];

const recentOrders = [
  {
    id: "HOPE-10245",
    customer: "Amelia Fernando",
    date: "08 Nov 2026",
    amount: "LKR 3,200",
    status: "Pending",
  },
  {
    id: "HOPE-10244",
    customer: "Daniel Perera",
    date: "07 Nov 2026",
    amount: "LKR 4,850",
    status: "Processing",
  },
  {
    id: "HOPE-10243",
    customer: "Sarah Silva",
    date: "07 Nov 2026",
    amount: "LKR 1,450",
    status: "Delivered",
  },
  {
    id: "HOPE-10242",
    customer: "Kasun Jayawardena",
    date: "06 Nov 2026",
    amount: "LKR 3,200",
    status: "Delivered",
  },
];

const topProducts = [
  { name: "Ceylon Black Tea", category: "Black Tea", sold: 124, stock: 86 },
  { name: "Pure Green Tea", category: "Green Tea", sold: 98, stock: 54 },
  { name: "Premium Leaf Tea", category: "Specialty Tea", sold: 76, stock: 32 },
];

function Dashboard() {
  return (
    <div className="sales-dashboard">
      {/* Welcome section */}
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">STORE OVERVIEW</p>
          <h2>Good morning, Administrator</h2>
          <p>Here's what's happening with your online tea store.</p>
        </div>

        <div className="dashboard-date">
          <span>REPORT PERIOD</span>
          <strong>Last 7 Days</strong>
        </div>
      </div>

      {/* Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-top">
            <span>Total Sales</span>
            <div className="stat-icon green">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3>LKR 284,500</h3>
          <div className="stat-change positive">
            <ArrowUpRight size={15} />
            12.8% <span>vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Orders</span>
            <div className="stat-icon gold">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3>186</h3>
          <div className="stat-change positive">
            <ArrowUpRight size={15} />
            8.4% <span>vs last week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Pending Orders</span>
            <div className="stat-icon orange">
              <Clock size={20} />
            </div>
          </div>
          <h3>24</h3>
          <div className="stat-description">
            Awaiting processing
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Products Listed</span>
            <div className="stat-icon blue">
              <Package size={20} />
            </div>
          </div>
          <h3>18</h3>
          <div className="stat-description">
            Active store products
          </div>
        </div>
      </div>

      {/* Sales chart and summary */}
      <div className="dashboard-main-grid">
        <section className="dashboard-panel sales-chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Your sales performance this week</p>
            </div>
            <button className="panel-menu">
              <MoreHorizontal size={21} />
            </button>
          </div>

          <div className="chart-summary">
            <h2>LKR 284,500</h2>
            <span className="positive">
              <ArrowUpRight size={15} /> 12.8%
            </span>
          </div>

          <div className="sales-chart">
            {salesData.map((item) => (
              <div className="chart-column" key={item.day}>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${item.sales}%` }}
                    title={`${item.sales}%`}
                  />
                </div>
                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel order-summary-panel">
          <div className="panel-heading">
            <div>
              <h3>Order Summary</h3>
              <p>Current order status</p>
            </div>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot pending-dot" />
              Pending
            </div>
            <strong>24</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot processing-dot" />
              Processing
            </div>
            <strong>18</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot delivered-dot" />
              Delivered
            </div>
            <strong>132</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot cancelled-dot" />
              Cancelled
            </div>
            <strong>12</strong>
          </div>

          <div className="order-summary-total">
            <span>Total Orders</span>
            <strong>186</strong>
          </div>
        </section>
      </div>

      {/* Recent orders */}
      <section className="dashboard-panel recent-orders-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest customer purchases</p>
          </div>

          <a href="/admin/orders" className="view-all-link">
            View all <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td className="order-amount">{order.amount}</td>
                  <td>
                    <span
                      className={`order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="table-action"
                      title="View orders"
                      onClick={() =>
                        (window.location.href = "/admin/orders")
                      }
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Best-selling products */}
      <section className="dashboard-panel top-products-panel">
        <div className="panel-heading">
          <div>
            <h3>Best-Selling Products</h3>
            <p>Popular products in your online store</p>
          </div>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>UNITS SOLD</th>
                <th>SALES STOCK</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="order-id">{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.sold}</td>
                  <td>{product.stock} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="dashboard-disclaimer">
        Demonstration data only. Sales figures and order summaries will be
        connected to the Hope Tea Estate database during backend integration.
      </p>
    </div>
  );
}

export default Dashboard;
