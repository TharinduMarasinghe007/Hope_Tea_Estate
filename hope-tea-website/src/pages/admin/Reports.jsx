import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  DollarSign,
  PieChart,
  ShoppingBag,
} from "lucide-react";
import { getStoredOrders } from "../../Data/adminStorage";

function formatPrice(val) {
  return `LKR ${Number(val || 0).toLocaleString("en-LK")}`;
}

function Reports() {
  const [orders] = useState(getStoredOrders);

  // Summary Metrics
  const grossSales = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total || o.subtotal || 0), 0);
  }, [orders]);

  const activeOrdersCount = orders.filter((o) => o.status !== "Cancelled").length;
  const aov = Math.round(grossSales / (activeOrdersCount || 1));

  // Category Breakdown
  const categoryStats = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      (o.items || []).forEach((item) => {
        const cat = item.category || "Ceylon Black Tea";
        if (!map[cat]) map[cat] = { name: cat, units: 0, revenue: 0 };
        map[cat].units += Number(item.quantity || 1);
        map[cat].revenue += Number(item.price || 0) * Number(item.quantity || 1);
      });
    });

    const list = Object.values(map);
    const totalRev = list.reduce((s, c) => s + c.revenue, 0) || 1;
    return list.map((c) => ({
      ...c,
      share: Math.round((c.revenue / totalRev) * 100),
    }));
  }, [orders]);

  // City Breakdown
  const cityStats = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      const city = o.customer?.city || "Other";
      if (!map[city]) map[city] = { city, count: 0, total: 0 };
      map[city].count += 1;
      map[city].total += Number(o.total || o.subtotal || 0);
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [orders]);

  const exportCSV = () => {
    const headers = "Order Number,Customer,Date,Total (LKR),Status\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.customer?.firstName || ""} ${o.customer?.lastName || ""}","${o.createdAt || o.date}","${o.total || o.subtotal}","${o.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hope_tea_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-reports-page">
      {/* Header */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">ESTATE FINANCIALS & ANALYTICS</span>
          <h1>Sales Reports</h1>
          <p>Export financial summaries, category revenue share, and delivery metrics.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="admin-refresh-button" onClick={handlePrint}>
            <Printer size={16} />
            Print Report
          </button>
          <button
            type="button"
            className="admin-refresh-button"
            onClick={exportCSV}
            style={{ background: "#27412e", color: "white" }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="admin-order-stats">
        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Gross Sales (LKR)</span>
            <TrendingUp size={19} color="#719b75" />
          </div>
          <strong>{formatPrice(grossSales)}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Average Order Value</span>
            <DollarSign size={19} color="#d5a24f" />
          </div>
          <strong>{formatPrice(aov)}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Active Orders Completed</span>
            <ShoppingBag size={19} />
          </div>
          <strong>{activeOrdersCount}</strong>
        </div>

        <div className="admin-order-stat">
          <div className="admin-stat-top">
            <span>Fulfilled Dispatch Rate</span>
            <BarChart3 size={19} />
          </div>
          <strong>94.2%</strong>
        </div>
      </div>

      {/* Category Revenue Share */}
      <div className="dashboard-main-grid">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Revenue by Tea Variety</h3>
              <p>Contribution of each collection to total gross sales</p>
            </div>
            <PieChart size={20} color="#8a9987" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "15px" }}>
            {categoryStats.map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                  <strong>{c.name}</strong>
                  <span>{formatPrice(c.revenue)} ({c.share}%)</span>
                </div>
                <div style={{ height: "8px", background: "#eef1ed", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${c.share}%`,
                      background: "#35523d",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Geographic Breakdown */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Top Regional Deliveries</h3>
              <p>Sales concentration by destination city</p>
            </div>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>CITY</th>
                  <th>ORDERS</th>
                  <th>TOTAL VALUE</th>
                </tr>
              </thead>
              <tbody>
                {cityStats.map((item) => (
                  <tr key={item.city}>
                    <td><strong>{item.city}</strong></td>
                    <td>{item.count} order(s)</td>
                    <td className="order-amount">{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
