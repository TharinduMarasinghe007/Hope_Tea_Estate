import { products as defaultProducts } from "./Products";

export const ORDERS_KEY = "hopeTeaOrders";
export const PRODUCTS_KEY = "hopeTeaAdminProducts";
export const INVENTORY_KEY = "hopeTeaInventory";
export const SETTINGS_KEY = "hopeTeaSettings";
export const PROMOTIONS_KEY = "hopeTeaPromotions";
export const CONTENT_KEY = "hopeTeaWebContent";

export const initialOrders = [
  {
    orderNumber: "HOPE-10245",
    customer: {
      firstName: "Amelia",
      lastName: "Fernando",
      email: "amelia.f@gmail.com",
      phone: "+94 77 123 4567",
      address: "42 Queen's Road",
      city: "Colombo",
      postalCode: "00300",
      notes: "Please call upon arrival",
    },
    items: [
      {
        id: 1,
        name: "Ceylon Black Tea",
        price: 1250,
        quantity: 2,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=85&w=900",
      },
      {
        id: 2,
        name: "Pure Green Tea",
        price: 1450,
        quantity: 1,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=85&w=900",
      },
    ],
    subtotal: 3950,
    delivery: 0,
    total: 3950,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-08T08:30:00.000Z",
  },
  {
    orderNumber: "HOPE-10244",
    customer: {
      firstName: "Daniel",
      lastName: "Perera",
      email: "daniel.p@outlook.com",
      phone: "+94 71 987 6543",
      address: "18 Temple Lane",
      city: "Kandy",
      postalCode: "20000",
      notes: "",
    },
    items: [
      {
        id: 6,
        name: "Hope Tea Gift Selection",
        price: 3200,
        quantity: 1,
        weight: "Gift set",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=85&w=900",
      },
      {
        id: 4,
        name: "Golden Breakfast Tea",
        price: 1650,
        quantity: 1,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=85&w=900",
      },
    ],
    subtotal: 4850,
    delivery: 0,
    total: 4850,
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-07T14:15:00.000Z",
  },
  {
    orderNumber: "HOPE-10243",
    customer: {
      firstName: "Sarah",
      lastName: "Silva",
      email: "sarah.silva@yahoo.com",
      phone: "+94 76 555 4321",
      address: "88 Galle Face Terrace",
      city: "Colombo",
      postalCode: "00100",
      notes: "Leave with security",
    },
    items: [
      {
        id: 2,
        name: "Pure Green Tea",
        price: 1450,
        quantity: 1,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=85&w=900",
      },
    ],
    subtotal: 1450,
    delivery: 0,
    total: 1450,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-07T10:00:00.000Z",
  },
  {
    orderNumber: "HOPE-10242",
    customer: {
      firstName: "Kasun",
      lastName: "Jayawardena",
      email: "kasun.j@gmail.com",
      phone: "+94 70 333 2211",
      address: "12 Hill Crest Road",
      city: "Nuwara Eliya",
      postalCode: "22200",
      notes: "",
    },
    items: [
      {
        id: 3,
        name: "Premium Leaf Tea",
        price: 1850,
        quantity: 2,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=85&w=900",
      },
    ],
    subtotal: 3700,
    delivery: 0,
    total: 3700,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-06T16:45:00.000Z",
  },
  {
    orderNumber: "HOPE-10241",
    customer: {
      firstName: "Nimali",
      lastName: "Wickramasinghe",
      email: "nimali.w@gmail.com",
      phone: "+94 77 444 8899",
      address: "55 Circular Road",
      city: "Galle",
      postalCode: "80000",
      notes: "Morning delivery preferred",
    },
    items: [
      {
        id: 1,
        name: "Ceylon Black Tea",
        price: 1250,
        quantity: 3,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=85&w=900",
      },
      {
        id: 5,
        name: "Garden Green Tea",
        price: 1550,
        quantity: 1,
        weight: "100g",
        image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=85&w=900",
      },
    ],
    subtotal: 5300,
    delivery: 0,
    total: 5300,
    status: "Dispatched",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-05T11:20:00.000Z",
  },
];

export const initialInventory = [
  {
    id: "BATCH-HT-01",
    productName: "Ceylon Black Tea (Grade BOP)",
    originField: "Hewaheta Upper Division - Block 4",
    harvestDate: "Oct 2026",
    packageWeight: "100g",
    stockUnits: 142,
    thresholdUnits: 30,
    status: "Normal",
  },
  {
    id: "BATCH-HT-02",
    productName: "Pure Green Tea (Hand-Plucked)",
    originField: "Misty Ridge - Block 2",
    harvestDate: "Nov 2026",
    packageWeight: "100g",
    stockUnits: 78,
    thresholdUnits: 25,
    status: "Normal",
  },
  {
    id: "BATCH-HT-03",
    productName: "Premium Leaf Tea (Whole Leaf Pekoe)",
    originField: "Hope Heritage Plateau",
    harvestDate: "Sep 2026",
    packageWeight: "100g",
    stockUnits: 22,
    thresholdUnits: 25,
    status: "Low Stock",
  },
  {
    id: "BATCH-HT-04",
    productName: "Golden Breakfast Tea",
    originField: "Sunrise Slope - Block 7",
    harvestDate: "Oct 2026",
    packageWeight: "100g",
    stockUnits: 95,
    thresholdUnits: 20,
    status: "Normal",
  },
  {
    id: "BATCH-HT-05",
    productName: "Garden Green Tea",
    originField: "Spring Valley - Block 1",
    harvestDate: "Nov 2026",
    packageWeight: "100g",
    stockUnits: 110,
    thresholdUnits: 30,
    status: "Normal",
  },
  {
    id: "BATCH-HT-06",
    productName: "Hope Tea Gift Selection (Wooden Box)",
    originField: "Estate Curated Selection",
    harvestDate: "Nov 2026",
    packageWeight: "Gift set",
    stockUnits: 38,
    thresholdUnits: 15,
    status: "Normal",
  },
];

export const defaultSettings = {
  estateName: "Hope Tea Estate",
  estateSubtitle: "Ceylon · Hewaheta",
  contactEmail: "info@hopeteaestate.lk",
  contactPhone: "+94 81 223 4567",
  address: "Hope Tea Estate, Hewaheta, Central Province, Sri Lanka",
  currency: "LKR",
  deliveryFee: 350,
  freeDeliveryThreshold: 5000,
  storeOpen: true,
  codEnabled: true,
  orderNotifications: true,
};

// Safe retrieval with fallback seeding
export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialOrders;
  } catch {
    return initialOrders;
  }
}

export function saveStoredOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed saving orders", err);
  }
}

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      const enriched = defaultProducts.map((p, idx) => ({
        ...p,
        stock: [86, 54, 32, 65, 48, 20][idx] ?? 50,
        active: true,
      }));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(enriched));
      return enriched;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed saving products", err);
  }
}

export function getStoredInventory() {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(initialInventory));
      return initialInventory;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialInventory;
  } catch {
    return initialInventory;
  }
}

export function saveStoredInventory(inv) {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
  } catch (err) {
    console.error("Failed saving inventory", err);
  }
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Failed saving settings", err);
  }
}

export const initialPromotions = [
  {
    id: "PROMO-01",
    code: "WELCOME10",
    description: "10% off for first-time online tea buyers",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 2000,
    validUntil: "2026-12-31",
    active: true,
    usesCount: 42,
  },
  {
    id: "PROMO-02",
    code: "CEYLONTEA",
    description: "15% off orders over LKR 4,000",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 4000,
    validUntil: "2026-11-30",
    active: true,
    usesCount: 18,
  },
  {
    id: "PROMO-03",
    code: "HEWAHETA500",
    description: "LKR 500 flat discount on premium gift orders",
    discountType: "fixed",
    discountValue: 500,
    minOrderAmount: 3500,
    validUntil: "2026-12-15",
    active: true,
    usesCount: 9,
  },
];

export const initialWebContent = {
  topBannerActive: true,
  topBannerText: "Autumn Flush Harvest Now Available · Island-wide Delivery Available",
  homeHeroTitle: "A taste of the quiet highlands.",
  homeHeroSubtitle: "Premium Ceylon tea from Hope Tea Estate.",
  homeQuoteText: "More than tea... It's a feeling.",
  estateElevation: "1,200m",
  curatedHarvestNotice: "Fresh single-origin Ceylon tea harvested and packaged in Hewaheta, Sri Lanka.",
};

export function getStoredPromotions() {
  try {
    const raw = localStorage.getItem(PROMOTIONS_KEY);
    if (!raw) {
      localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(initialPromotions));
      return initialPromotions;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialPromotions;
  } catch {
    return initialPromotions;
  }
}

export function saveStoredPromotions(promos) {
  try {
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(promos));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed saving promotions", err);
  }
}

export function getStoredWebContent() {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(initialWebContent));
      return initialWebContent;
    }
    return { ...initialWebContent, ...JSON.parse(raw) };
  } catch {
    return initialWebContent;
  }
}

export function saveStoredWebContent(content) {
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed saving web content", err);
  }
}

