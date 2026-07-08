import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowLeft, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AmbientGlow from "./AmbientGlow";

export default function Signup() {
  const { signup, setView } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <AmbientGlow color="var(--color-secondary)" size={400} className="-top-12 left-1/4" />
      <AmbientGlow color="var(--color-primary)" size={450} className="-bottom-16 right-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        {/* Back Button */}
        <button
          onClick={() => setView("home")}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono transition-colors hover:text-[var(--color-secondary)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiArrowLeft size={14} /> Back
        </button>

        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold font-display" style={{ color: "var(--color-text)" }}>
            Create Account
          </h2>
          <p className="mt-2 text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
            Get started with your free account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20"
            >
              <FiAlertCircle className="flex-shrink-0" size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium font-mono" style={{ color: "var(--color-text-muted)" }}>
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: "var(--color-text-muted)" }}>
                <FiUser size={16} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-secondary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium font-mono" style={{ color: "var(--color-text-muted)" }}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: "var(--color-text-muted)" }}>
                <FiMail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-secondary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium font-mono" style={{ color: "var(--color-text-muted)" }}>
              Password (min 6 chars)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: "var(--color-text-muted)" }}>
                <FiLock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border bg-transparent pl-10 pr-10 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-secondary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-sm transition-colors hover:text-[var(--color-text)]"
                style={{ color: "var(--color-text-muted)" }}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium font-mono" style={{ color: "var(--color-text-muted)" }}>
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center" style={{ color: "var(--color-text-muted)" }}>
                <FiLock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border bg-transparent pl-10 pr-10 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-secondary)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <button
            onClick={() => setView("login")}
            className="font-medium hover:underline"
            style={{ color: "var(--color-secondary-soft)" }}
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}
