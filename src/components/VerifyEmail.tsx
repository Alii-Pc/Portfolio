import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AmbientGlow from "./AmbientGlow";

export default function VerifyEmail() {
  const { verifyEmail, emailForVerification, setView } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const email = emailForVerification;
    if (!email) {
      setError("No email address found to verify. Please try registering again.");
      return;
    }

    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    if (code.length !== 6 || isNaN(Number(code))) {
      setError("Verification code must be a 6-digit number.");
      return;
    }

    setLoading(true);
    const res = await verifyEmail(email, code);
    setLoading(false);

    if (res.success) {
      setSuccess(res.message);
    } else {
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
          onClick={() => setView("signup")}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono transition-colors hover:text-[var(--color-secondary)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiArrowLeft size={14} /> Back to Sign Up
        </button>

        <div className="mt-8 text-center">
          <span
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "var(--color-surface-2)", color: "var(--color-secondary)" }}
          >
            <FiMail size={22} />
          </span>
          <h2 className="mt-4 text-3xl font-bold font-display" style={{ color: "var(--color-text)" }}>
            Verify Email
          </h2>
          <p className="mt-2 text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
            We've sent a 6-digit verification code to
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {emailForVerification || "your email"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20"
            >
              <span>{success}</span>
            </motion.div>
          )}

          {/* Verification Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium font-mono" style={{ color: "var(--color-text-muted)" }}>
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center rounded-lg border bg-transparent py-3 text-2xl font-bold tracking-widest outline-none transition-all focus:border-[var(--color-secondary)]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              disabled={loading}
              autoFocus
            />
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
              "Verify Code"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          Didn't receive a code? Check your spam folder or register again to trigger a new verification code.
        </div>
      </motion.div>
    </div>
  );
}
