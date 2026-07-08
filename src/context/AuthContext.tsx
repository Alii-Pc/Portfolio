import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export type AuthView = "home" | "login" | "signup" | "verify";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  view: AuthView;
  setView: (view: AuthView) => void;
  emailForVerification: string | null;
  setEmailForVerification: (email: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; isVerified?: boolean; email?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string; email?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://portfolio-nine-mu-t1un059vgu.vercel.app/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<AuthView>("home");
  const [emailForVerification, setEmailForVerification] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("portfolio_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("portfolio_token");
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("portfolio_token", data.token);
        setUser(data.user);
        setView("home");
        return { success: true, message: "Logged in successfully" };
      } else if (res.status === 403 && data.isVerified === false) {
        // Needs email verification
        setEmailForVerification(data.email || email);
        setView("verify");
        return {
          success: false,
          message: data.message,
          isVerified: false,
          email: data.email || email,
        };
      } else {
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error, please try again." };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok || res.status === 201 || res.status === 200) {
        setEmailForVerification(data.email || email);
        setView("verify");
        return { success: true, message: data.message, email: data.email || email };
      } else {
        return { success: false, message: data.message || "Signup failed" };
      }
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: "Network error, please try again." };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("portfolio_token", data.token);
        setUser(data.user);
        setView("home");
        setEmailForVerification(null);
        return { success: true, message: "Email verified and logged in successfully!" };
      } else {
        return { success: false, message: data.message || "Invalid or expired code" };
      }
    } catch (err) {
      console.error("Email verification error:", err);
      return { success: false, message: "Network error, please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("portfolio_token");
    setUser(null);
    setView("home");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        view,
        setView,
        emailForVerification,
        setEmailForVerification,
        login,
        signup,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
