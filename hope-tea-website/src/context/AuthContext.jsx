import { createContext, useContext, useState, useEffect } from "react";
import { getStoredOrders, saveStoredOrders } from "../Data/adminStorage";

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = "hopeTeaUsers";
const CURRENT_USER_KEY = "hopeTeaCurrentUser";

// Initial demo accounts for smooth review & testing
const initialUsers = [
  {
    id: "usr-1",
    firstName: "Amelia",
    lastName: "Fernando",
    email: "amelia.f@gmail.com",
    phone: "+94 77 123 4567",
    address: "42 Queen's Road",
    city: "Colombo",
    postalCode: "00300",
    password: "password123",
    provider: "email",
    avatar: null,
    createdAt: "2026-10-15T09:00:00.000Z",
  },
  {
    id: "usr-2",
    firstName: "Daniel",
    lastName: "Perera",
    email: "daniel.p@outlook.com",
    phone: "+94 71 987 6543",
    address: "18 Temple Lane",
    city: "Kandy",
    postalCode: "20000",
    password: "password123",
    provider: "email",
    avatar: null,
    createdAt: "2026-10-20T11:30:00.000Z",
  },
];

export function AuthProvider({ children }) {
  // Registered users directory
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    } catch {
      return initialUsers;
    }
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep storage in sync
  const saveUsersToStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save users", e);
    }
  };

  const setSessionUser = (user) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to set session user", e);
    }
  };

  // Listen for storage events (e.g. multi-tab synchronization)
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(CURRENT_USER_KEY);
        setCurrentUser(saved ? JSON.parse(saved) : null);
        const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (savedUsers) setUsers(JSON.parse(savedUsers));
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Login with Email & Password
  const login = (email, password) => {
    const trimmedEmail = (email || "").trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!user) {
      // Check if user exists but has google provider
      const googleUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail && u.provider === "google"
      );
      if (googleUser) {
        return {
          success: false,
          error: "This account was created with Google. Please use the 'Continue with Google' button.",
        };
      }
      return {
        success: false,
        error: "Invalid email or password. Please check your credentials.",
      };
    }

    setSessionUser(user);
    return { success: true, user };
  };

  // Login / Register with Google Account
  const loginWithGoogle = (googleProfile) => {
    if (!googleProfile || !googleProfile.email) {
      return { success: false, error: "Google profile data is missing email." };
    }

    const trimmedEmail = googleProfile.email.trim().toLowerCase();
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    let authenticatedUser;

    if (existingIndex >= 0) {
      // Update existing account with latest Google details
      const existing = users[existingIndex];
      authenticatedUser = {
        ...existing,
        firstName: googleProfile.firstName || existing.firstName,
        lastName: googleProfile.lastName || existing.lastName,
        avatar: googleProfile.avatar || existing.avatar,
        provider: "google",
      };
      const updatedList = [...users];
      updatedList[existingIndex] = authenticatedUser;
      saveUsersToStorage(updatedList);
    } else {
      // Create new account with Google
      authenticatedUser = {
        id: `usr-g-${Date.now().toString().slice(-6)}`,
        firstName: googleProfile.firstName || "Tea Lover",
        lastName: googleProfile.lastName || "",
        email: trimmedEmail,
        phone: googleProfile.phone || "",
        address: googleProfile.address || "",
        city: googleProfile.city || "Colombo",
        postalCode: googleProfile.postalCode || "",
        password: null,
        provider: "google",
        avatar:
          googleProfile.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
        createdAt: new Date().toISOString(),
      };
      saveUsersToStorage([authenticatedUser, ...users]);
    }

    setSessionUser(authenticatedUser);
    return { success: true, user: authenticatedUser };
  };

  // Register a new customer
  const register = (registrationData) => {
    const trimmedEmail = (registrationData.email || "").trim().toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: "Email is required." };
    }

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }

    const newUser = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      firstName: (registrationData.firstName || "").trim(),
      lastName: (registrationData.lastName || "").trim(),
      email: trimmedEmail,
      phone: (registrationData.phone || "").trim(),
      address: (registrationData.address || "").trim(),
      city: (registrationData.city || "").trim() || "Colombo",
      postalCode: (registrationData.postalCode || "").trim(),
      password: registrationData.password,
      provider: "email",
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    saveUsersToStorage([newUser, ...users]);
    setSessionUser(newUser);
    return { success: true, user: newUser };
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    if (!currentUser) return { success: false, error: "Not authenticated" };

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    const updatedList = users.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );

    saveUsersToStorage(updatedList);
    setSessionUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // Logout
  const logout = () => {
    setSessionUser(null);
  };

  // Get current user's order history
  const getUserOrders = () => {
    if (!currentUser) return [];
    try {
      const allOrders = getStoredOrders();
      const userEmail = (currentUser.email || "").toLowerCase();
      return allOrders.filter(
        (o) =>
          (o.customer?.email || "").toLowerCase() === userEmail ||
          o.userId === currentUser.id
      );
    } catch {
      return [];
    }
  };

  const value = {
    currentUser,
    users,
    isAuthenticated: !!currentUser,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    getUserOrders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

