import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { getStoredOrders, getStoredProducts } from "../../Data/adminStorage";

function formatPrice(val) {
  return `LKR ${Number(val || 0).toLocaleString("en-LK")}`;
}

function formatDate(isoStr) {
  if (!isoStr) return "Recent";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(getStoredOrders);
  const [products, setProducts] = useState(getStoredProducts);
  const [timeRange, setTimeRange] = useState("7d"); // '7d', '30d', 'all'

  const reloadData = () => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    const handleStorage = () => reloadData();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    if (timeRange === "all") return orders;
    const now = Date.now();
    const days = timeRange === "7d" ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return orders.filter((o) => {
      const t = new Date(o.createdAt || o.date).getTime();
      return isNaN(t) || t >= cutoff;
    });
  }, [orders, timeRange]);

  // Key metrics
  const totalRevenue = useMemo(() => {
    return filteredOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total || o.subtotal || 0), 0);
  }, [filteredOrders]);

  const totalOrdersCount = filteredOrders.length;

  const pendingCount = useMemo(() => {
    return filteredOrders.filter((o) => o.status === "Pending").length;
  }, [filteredOrders]);

  const activeProductsCount = products.filter((p) => p.active !== false).length;

  // Order status counts
  const statusSummary = useMemo(() => {
    const counts = { Pending: 0, Processing: 0, Dispatched: 0, Delivered: 0, Cancelled: 0 };
    filteredOrders.forEach((o) => {
      const s = o.status || "Pending";
      if (counts[s] !== undefined) counts[s]++;
      else counts.Pending++;
    });
    return counts;
  }, [filteredOrders]);

  // Chart data: sales by day for the last 7 days
  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const buckets = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = days[d.getDay()];
      buckets[label] = { day: label, sales: 0 };
    }

    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      const d = new Date(o.createdAt || o.date);
      if (!isNaN(d.getTime())) {
        const label = days[d.getDay()];
        if (buckets[label]) {
          buckets[label].sales += Number(o.total || o.subtotal || 0);
        }
      }
    });

    const values = Object.values(buckets);
    const maxSale = Math.max(...values.map((v) => v.sales), 1);
    return values.map((v) => ({
      ...v,
      percent: Math.min(100, Math.max(15, Math.round((v.sales / maxSale) * 100))),
      formatted: formatPrice(v.sales),
    }));
  }, [orders]);

  // Top products aggregated from order line items
  const topProducts = useMemo(() => {
    const salesMap = {};
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      (o.items || []).forEach((item) => {
        if (!salesMap[item.name]) {
          salesMap[item.name] = {
            name: item.name,
            category: item.category || "Ceylon Tea",
            sold: 0,
            revenue: 0,
          };
        }
        salesMap[item.name].sold += Number(item.quantity || 1);
        salesMap[item.name].revenue += Number(item.price || 0) * Number(item.quantity || 1);
      });
    });

    const productList = Object.values(salesMap);
    if (productList.length > 0) {
      productList.sort((a, b) => b.sold - a.sold);
      return productList.slice(0, 4);
    }

    // fallback to products catalog if no orders placed yet
    return products.slice(0, 4).map((p) => ({
      name: p.name,
      category: p.category,
      sold: 12,
      revenue: p.price * 12,
    }));
  }, [orders, products]);

  // Recent 5 orders
  const recentOrdersList = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="sales-dashboard">
      {/* Welcome header with quick date filter */}
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">STORE OVERVIEW</p>
          <h2>Good morning, Administrator</h2>
          <p>Here is what is happening with Hope Tea Estate online store.</p>
        </div>

        <div className="dashboard-actions-row">
          <div className="dashboard-range-selector">
            <Calendar size={15} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Time range"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button
            type="button"
            className="admin-quick-refresh"
            onClick={reloadData}
            title="Refresh metrics"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-top">
            <span>Total Sales</span>
            <div className="stat-icon green">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3>{formatPrice(totalRevenue)}</h3>
          <div className="stat-change positive">
            <ArrowUpRight size={15} />
            <span>Active Period Revenue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Orders</span>
            <div className="stat-icon gold">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3>{totalOrdersCount}</h3>
          <div className="stat-change positive">
            <ArrowUpRight size={15} />
            <span>{timeRange === "7d" ? "This Week" : "Selected Period"}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Pending Orders</span>
            <div className="stat-icon orange">
              <Clock size={20} />
            </div>
          </div>
          <h3>{pendingCount}</h3>
          <div className="stat-description">
            {pendingCount > 0 ? "Requires packing/dispatch" : "All caught up"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Products Listed</span>
            <div className="stat-icon blue">
              <Package size={20} />
            </div>
          </div>
          <h3>{activeProductsCount}</h3>
          <div className="stat-description">
            Active teas in catalogue
          </div>
        </div>
      </div>

      {/* Sales Chart and Order Status Breakdown */}
      <div className="dashboard-main-grid">
        <section className="dashboard-panel sales-chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Weekly sales performance across Hope Tea Estate</p>
            </div>
            <button className="panel-menu" type="button" aria-label="More chart options">
              <MoreHorizontal size={21} />
            </button>
          </div>

          <div className="chart-summary">
            <h2>{formatPrice(totalRevenue)}</h2>
            <span className="positive">
              <ArrowUpRight size={15} /> Store Trend
            </span>
          </div>

          <div className="sales-chart">
            {chartData.map((item) => (
              <div className="chart-column" key={item.day}>
                <div className="chart-bar-wrapper" title={`${item.day}: ${item.formatted}`}>
                  <div
                    className="chart-bar"
                    style={{ height: `${item.percent}%` }}
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
              <p>Current distribution by status</p>
            </div>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot pending-dot" />
              Pending
            </div>
            <strong>{statusSummary.Pending}</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot processing-dot" />
              Processing
            </div>
            <strong>{statusSummary.Processing}</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot processing-dot" style={{ background: "#6b8bb0" }} />
              Dispatched
            </div>
            <strong>{statusSummary.Dispatched}</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot delivered-dot" />
              Delivered
            </div>
            <strong>{statusSummary.Delivered}</strong>
          </div>

          <div className="order-summary-item">
            <div className="summary-label">
              <span className="summary-dot cancelled-dot" />
              Cancelled
            </div>
            <strong>{statusSummary.Cancelled}</strong>
          </div>

          <div className="order-summary-total">
            <span>Total Orders</span>
            <strong>{totalOrdersCount}</strong>
          </div>
        </section>
      </div>

      {/* Recent Orders table */}
      <section className="dashboard-panel recent-orders-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest customer purchases from the tea estate</p>
          </div>

          <Link to="/admin/orders" className="view-all-link">
            View all orders <ArrowUpRight size={15} />
          </Link>
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
              {recentOrdersList.map((order) => {
                const customerName = order.customer
                  ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
                  : order.customerName || "Customer";
                const amount = order.total || order.subtotal || 0;
                const status = order.status || "Pending";

                return (
                  <tr key={order.orderNumber}>
                    <td className="order-id">{order.orderNumber}</td>
                    <td>{customerName}</td>
                    <td>{formatDate(order.createdAt || order.date)}</td>
                    <td className="order-amount">{formatPrice(amount)}</td>
                    <td>
                      <span className={`order-status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-action"
                        title="View in Orders"
                        type="button"
                        onClick={() => navigate("/admin/orders")}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Best-Selling Products table */}
      <section className="dashboard-panel top-products-panel">
        <div className="panel-heading">
          <div>
            <h3>Best-Selling Products</h3>
            <p>Popular teas by purchase volume</p>
          </div>
          <Link to="/admin/products" className="view-all-link">
            Manage Catalog <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>UNITS ORDERED</th>
                <th>TOTAL REVENUE</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="order-id">{product.name}</td>
                  <td>{product.category}</td>
                  <td><strong>{product.sold}</strong> units</td>
                  <td className="order-amount">{formatPrice(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
