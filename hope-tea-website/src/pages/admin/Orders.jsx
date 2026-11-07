
import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  X,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

const ORDERS_KEY = "hopeTeaOrders";

const statusOptions = [
  "Pending",
  "Processing",
  "Packed",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

const formatPrice = (price) =>
  `LKR ${Number(price || 0).toLocaleString("en-LK")}`;

function readOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getCustomerName(order) {
  const customer = order.customer || {};

  return (
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Unknown Customer"
  );
}

function getStatusClass(status) {
  return String(status || "Pending").toLowerCase();
}

function Orders() {
  const [orders, setOrders] = useState(readOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const refreshOrders = () => {
    setOrders(readOrders());
  };

  const updateStatus = (orderNumber, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.orderNumber === orderNumber
        ? { ...order, status: newStatus }
        : order
    );

    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    if (selectedOrder?.orderNumber === orderNumber) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
      });
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = getCustomerName(order).toLowerCase();
      const orderNumber = String(order.orderNumber || "").toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        customer.includes(query) || orderNumber.includes(query);

      const matchesFilter =
        filter === "All" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      label: "Pending Orders",
      value: pendingCount,
      icon: Clock,
    },
    {
      label: "Processing",
      value: processingCount,
      icon: Package,
    },
    {
      label: "Delivered",
      value: deliveredCount,
      icon: CheckCircle,
    },
  ];

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-LK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-orders">

      {/* PAGE HEADER */}
      <div className="admin-orders-header">
        <div>
          <span className="admin-eyebrow">SALES MANAGEMENT</span>
          <h1>Orders</h1>
          <p>Manage and track customer orders from across the estate.</p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={refreshOrders}
          type="button"
        >
          <ArrowUpRight size={16} />
          Refresh Orders
        </button>
      </div>

      {/* STATISTICS */}
      <div className="admin-order-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="admin-order-stat" key={stat.label}>
              <div className="admin-stat-top">
                <span>{stat.label}</span>
                <Icon size={19} />
              </div>

              <strong>{stat.value}</strong>
            </div>
          );
        })}
      </div>

      {/* REVENUE */}
      <div className="admin-order-revenue">
        <div>
          <span>TOTAL ORDER VALUE</span>
          <h2>{formatPrice(totalRevenue)}</h2>
          <p>Excludes cancelled orders. Not a verified payment total.</p>
        </div>

        <div className="admin-revenue-icon">
          <Truck size={25} />
        </div>
      </div>

      {/* ORDER TABLE */}
      <section className="admin-orders-table-section">

        <div className="admin-orders-table-heading">
          <div>
            <span>ORDER OVERVIEW</span>
            <h2>Customer Orders</h2>
          </div>

          <span className="admin-order-total">
            {filteredOrders.length} orders shown
          </span>
        </div>

        <div className="admin-order-toolbar">
          <div className="admin-order-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search order number or customer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Orders</option>
            {statusOptions.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderNumber}>
                  <td>
                    <strong className="admin-order-id">
                      {order.orderNumber}
                    </strong>
                  </td>

                  <td>
                    <strong>{getCustomerName(order)}</strong>
                    <small>{order.customer?.email || "No email"}</small>
                  </td>

                  <td>{formatDate(order.createdAt)}</td>

                  <td>
                    {(order.items || []).reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0
                    )}
                  </td>

                  <td>
                    <strong>{formatPrice(order.total)}</strong>
                  </td>

                  <td>
                    <span
                      className={`admin-order-status ${getStatusClass(order.status)}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="admin-view-order"
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      aria-label={`View ${order.orderNumber}`}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="admin-orders-empty">
                      <ShoppingBag size={30} />
                      <strong>No orders found</strong>
                      <span>
                        Orders placed through the website will appear here.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <span>ORDER DETAILS</span>
                <h2>{selectedOrder.orderNumber}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-customer">
              <span>CUSTOMER</span>
              <h3>{getCustomerName(selectedOrder)}</h3>
              <p>{selectedOrder.customer?.email}</p>
              <p>{selectedOrder.customer?.phone}</p>
            </div>

            <div className="admin-modal-delivery">
              <span>DELIVERY ADDRESS</span>
              <p>
                {selectedOrder.customer?.address || "Not provided"}
                <br />
                {selectedOrder.customer?.city || ""}
                {selectedOrder.customer?.postalCode
                  ? `, ${selectedOrder.customer.postalCode}`
                  : ""}
              </p>
              {selectedOrder.customer?.notes && (
                <p>
                  <strong>Notes:</strong> {selectedOrder.customer.notes}
                </p>
              )}
            </div>

            <div className="admin-modal-products">
              <span>ORDER ITEMS</span>

              {(selectedOrder.items || []).map((item, index) => (
                <div
                  className="admin-modal-product"
                  key={`${item.id}-${index}`}
                >
                  <img src={item.image} alt={item.name} />

                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.weight} · Quantity: {item.quantity}
                    </small>
                  </div>

                  <strong>
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </strong>
                </div>
              ))}
            </div>

            <div className="admin-modal-total">
              <span>ORDER TOTAL</span>
              <strong>{formatPrice(selectedOrder.total)}</strong>
            </div>

            <div className="admin-modal-payment">
              <span>PAYMENT METHOD</span>
              <strong>
                {selectedOrder.paymentMethod || "Not specified"}
              </strong>
            </div>

            <div className="admin-modal-status">
              <label htmlFor="orderStatus">UPDATE ORDER STATUS</label>

              <div>
                <select
                  id="orderStatus"
                  value={selectedOrder.status || "Pending"}
                  onChange={(event) =>
                    updateStatus(
                      selectedOrder.orderNumber,
                      event.target.value
                    )
                  }
                >
                  {statusOptions.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <button
              type="button"
              className="admin-modal-close-button"
              onClick={() => setSelectedOrder(null)}
            >
              CLOSE DETAILS
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Orders;
