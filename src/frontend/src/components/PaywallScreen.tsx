import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Brain,
  FileDown,
  Layers,
  Loader2,
  Save,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useRecordRazorpayPayment } from "../hooks/useQueries";

const FEATURES = [
  {
    icon: Brain,
    label: "Real-Time ATS Score",
    sub: "100-point scoring engine",
  },
  {
    icon: Zap,
    label: "Keyword Gap Analysis",
    sub: "Match any job description",
  },
  { icon: Layers, label: "Live Resume Preview", sub: "See changes instantly" },
  { icon: FileDown, label: "PDF Export", sub: "Print-ready, ATS-friendly" },
  {
    icon: Sparkles,
    label: "12+ Pro Templates",
    sub: "Including photo templates",
  },
  { icon: Save, label: "Auto-Save", sub: "Never lose your work" },
];

const RAZORPAY_KEY = "rzp_live_SREVhKAcH7xaGm";
const DOWNLOAD_PRICE_PAISE = 100; // ₹1
const DOWNLOAD_PRICE_DISPLAY = 1;

interface PaywallScreenProps {
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaywallScreen({
  onPaymentSuccess,
  onCancel,
}: PaywallScreenProps) {
  const recordPayment = useRecordRazorpayPayment();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleUnlock = async () => {
    setIsLoading(true);
    setPaymentError(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPaymentError("Failed to load payment gateway. Please try again.");
      setIsLoading(false);
      return;
    }

    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      setPaymentError("Payment gateway unavailable. Please try again.");
      setIsLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: DOWNLOAD_PRICE_PAISE,
      currency: "INR",
      name: "ProResume",
      description: "Resume PDF Download",
      theme: { color: "#6366f1" },
      handler: async (response: { razorpay_payment_id: string }) => {
        try {
          await recordPayment.mutateAsync(response.razorpay_payment_id);
          onPaymentSuccess();
        } catch {
          // Even if backend recording fails, allow download since payment succeeded
          onPaymentSuccess();
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          onCancel();
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", () => {
      setIsLoading(false);
      setPaymentError(
        "Payment failed. Please try again or use a different method.",
      );
    });
    rzp.open();
  };

  return (
    <div className="paywall-bg flex min-h-screen items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="paywall-orb paywall-orb-1" />
        <div className="paywall-orb paywall-orb-2" />
        <div className="paywall-grid" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Main paywall card */}
        <div className="paywall-card" data-ocid="paywall.card">
          {/* Header */}
          <div className="paywall-header px-8 pb-6 pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-4 flex items-center justify-center gap-2"
            >
              <div className="paywall-logo-pill">
                <Star className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  ProResume
                </span>
              </div>
            </motion.div>

            <h1 className="font-display text-3xl font-bold leading-tight text-pw-heading">
              Download your <em className="pw-italic">resume</em>
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-pw-muted">
              One-time payment to download your ATS-perfect resume as PDF.
            </p>

            {/* Price block */}
            <div className="paywall-price-block mt-6">
              <div className="flex items-baseline gap-1">
                <span className="paywall-currency">₹</span>
                <span className="paywall-amount">{DOWNLOAD_PRICE_DISPLAY}</span>
              </div>
              <div className="paywall-price-tag">
                <BadgeCheck className="h-3.5 w-3.5" />
                One-time · Per download · No subscription
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="px-8 pb-6">
            <div className="paywall-features-grid">
              {FEATURES.map(({ icon: Icon, label, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                  className="paywall-feature-item"
                >
                  <div className="paywall-feature-icon">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-pw-heading">
                      {label}
                    </div>
                    <div className="text-xs text-pw-muted">{sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* UPI badges */}
          <div className="px-8 pb-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-pw-muted">Pay via</span>
              {["Google Pay", "PhonePe", "Paytm", "UPI"].map((method) => (
                <span
                  key={method}
                  className="rounded border border-pw-border bg-white/5 px-2 py-0.5 text-xs font-medium text-pw-muted"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-pw-border px-8 pb-8 pt-6">
            <Button
              onClick={handleUnlock}
              disabled={isLoading || recordPayment.isPending}
              className="paywall-cta-btn w-full"
              data-ocid="paywall.primary_button"
            >
              {isLoading || recordPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {recordPayment.isPending
                    ? "Confirming payment…"
                    : "Opening payment…"}
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Pay ₹{DOWNLOAD_PRICE_DISPLAY} & Download PDF
                </>
              )}
            </Button>

            {paymentError && (
              <p
                className="mt-2 text-center text-xs text-destructive"
                data-ocid="paywall.error_state"
              >
                {paymentError}
              </p>
            )}

            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={onCancel}
                className="paywall-signout-btn"
                data-ocid="paywall.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
