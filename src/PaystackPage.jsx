import React, { useEffect, useState, useCallback } from "react";
import { ShieldCheck, Mail, Smartphone, Lock, Shield } from "lucide-react";

const C = {
  green: "#16a34a",
  greenLight: "#22c55e",
  greenFaint: "rgba(22,163,74,0.08)",
  greenBorder: "rgba(22,163,74,0.2)",
  dark: "#0f172a",
  mid: "#334155",
  muted: "#94a3b8",
  surface: "#ffffff",
  bg: "#f0fdf4",
  border: "#e2e8f0",
};

// Paystack's web checkout is loaded via their Inline JS SDK.
// Add this script tag once in your app's index.html:
//   <script src="https://js.paystack.co/v1/inline.js"></script>
const PAYSTACK_PUBLIC_KEY = "pk_live_527b08c7d322316a1727249881ebcb0657a4c9cd";

export default function PaystackCheckout() {
  const [myEmail, setMyEmail] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  // Load the Paystack Inline JS SDK if it isn't already on the page.
  useEffect(() => {
    if (window.PaystackPop) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // On web there's no AsyncStorage — swap this for however you persist
  // the lecturer's identity (localStorage, a cookie, your auth context, etc).
  useEffect(() => {
    const stored = window.localStorage?.getItem("lecturerId");
    if (stored) {
      setMyEmail(stored.replace(",", "."));
    }
  }, []);

  const handlePaymentInit = useCallback(() => {
    if (!scriptReady || !window.PaystackPop) {
      alert("Payment gateway is still loading, please try again in a moment.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: myEmail || "",
      amount: 10 * 100, // Paystack expects the amount in kobo/pesewas
      currency: "GHS",
      channels: ["mobile_money", "card", "bank"],
      callback: () => {
        alert("Payment Successful! Go to settings to verify status");
      },
      onClose: () => {
        alert("Payment Cancelled");
      },
    });

    try {
      handler.openIframe();
    } catch (err) {
      alert("Payment Gateway Error");
    }
  }, [scriptReady, myEmail]);

  return (
    <div style={s.screen}>
      <div style={s.card}>
        {/* Icon */}
        <div style={s.iconCircle}>
          <ShieldCheck size={36} color={C.green} />
        </div>

        <h1 style={s.cardTitle}>Checkout Summary</h1>
        <p style={s.cardSubtitle}>Secure payment powered by Paystack</p>

        <div style={s.divider} />

        {/* Price rows */}
        <div style={s.priceRow}>
          <span style={s.priceLabel}>Subscription (1 month)</span>
          <span style={s.priceValue}>GHS 10.00</span>
        </div>

        <div style={s.priceRow}>
          <span style={s.priceLabel}>Processing fee</span>
          <span style={s.priceValue}>GHS 0.00</span>
        </div>

        <div style={s.divider} />

        <div style={s.priceRow}>
          <span style={s.totalLabel}>Total</span>
          <span style={s.totalValue}>GHS 10.00</span>
        </div>

        {/* Email display */}
        {myEmail ? (
          <div style={s.emailRow}>
            <Mail size={15} color={C.muted} />
            <span style={s.emailText}>{myEmail}</span>
          </div>
        ) : null}

        {/* Pay button */}
        <button style={s.payBtn} onClick={handlePaymentInit}>
          <Smartphone size={20} color="#fff" />
          <span style={s.payBtnText}>Pay with Mobile Money / Bank</span>
        </button>

        {/* Trust badges */}
        <div style={s.badgeRow}>
          <Lock size={13} color={C.muted} />
          <span style={s.badgeText}>256-bit SSL secured</span>
          <span style={s.badgeDot}>·</span>
          <Shield size={13} color={C.muted} />
          <span style={s.badgeText}>Powered by Paystack</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  screen: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bg,
    padding: 24,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    border: `1px solid ${C.border}`,
    boxSizing: "border-box",
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: C.greenFaint,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    boxShadow: `0 4px 10px rgba(22,163,74,0.15)`,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: C.dark,
    margin: 0,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: C.muted,
    margin: 0,
    marginBottom: 20,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: C.border,
    margin: "16px 0",
  },

  priceRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  priceLabel: { fontSize: 14, color: C.mid },
  priceValue: { fontSize: 14, fontWeight: 600, color: C.dark },
  totalLabel: { fontSize: 16, fontWeight: 800, color: C.dark },
  totalValue: { fontSize: 18, fontWeight: 800, color: C.green },

  emailRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.greenFaint,
    padding: "8px 14px",
    borderRadius: 20,
    border: `1px solid ${C.greenBorder}`,
    marginTop: 8,
    marginBottom: 24,
  },
  emailText: { fontSize: 13, color: C.mid, fontWeight: 500 },

  payBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: C.green,
    border: "none",
    borderRadius: 14,
    height: 54,
    width: "100%",
    boxShadow: `0 4px 10px rgba(22,163,74,0.3)`,
    marginBottom: 16,
    cursor: "pointer",
  },
  payBtnText: { color: "#fff", fontSize: 16, fontWeight: 700 },

  badgeRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  badgeDot: { color: C.muted, fontSize: 12 },
  badgeText: { fontSize: 11, color: C.muted },
};
