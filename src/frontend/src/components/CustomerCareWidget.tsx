import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  HeadphonesIcon,
  MessageCircle,
  MoreHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// Owner email — never rendered in UI
const SUPPORT_EMAIL = atob("Mjk5NzkyNDU4c29vcmFqMjQ4OThAZ21haWwuY29t");

type Topic = "feedback" | "payment" | "other";

interface FormState {
  name: string;
  message: string;
  transactionId: string;
  mobile: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  message: "",
  transactionId: "",
  mobile: "",
};

const TOPICS: {
  id: Topic;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  ocid: string;
}[] = [
  {
    id: "feedback",
    label: "General Feedback",
    description: "Share your thoughts, suggestions, or appreciation",
    icon: MessageCircle,
    ocid: "support.feedback.tab",
  },
  {
    id: "payment",
    label: "Payment Issue",
    description: "Problems with payment, refunds, or transaction errors",
    icon: CreditCard,
    ocid: "support.payment.tab",
  },
  {
    id: "other",
    label: "Other",
    description: "Any other questions or concerns",
    icon: MoreHorizontal,
    ocid: "support.other.tab",
  },
];

export function CustomerCareWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const needsPaymentFields = topic === "payment" || topic === "other";

  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setTopic(null);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectTopic = (t: Topic) => {
    setTopic(t);
    setStep(2);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  const handleBack = () => {
    setStep(1);
    setTopic(null);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.message.trim()) newErrors.message = "Please describe your issue.";
    if (needsPaymentFields) {
      if (!form.transactionId.trim())
        newErrors.transactionId = "Transaction ID is required.";
      if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const topicLabel = TOPICS.find((t) => t.id === topic)?.label ?? topic;
    const subject = encodeURIComponent(`[ProResume Support] ${topicLabel}`);

    let body = `Topic: ${topicLabel}\n`;
    if (form.name.trim()) body += `Name: ${form.name.trim()}\n`;
    if (needsPaymentFields) {
      body += `Transaction ID: ${form.transactionId.trim()}\n`;
      body += `Mobile Number: ${form.mobile.trim()}\n`;
    }
    body += `\nMessage:\n${form.message.trim()}`;

    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setStep(3);
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 md:bottom-6 md:right-6 md:h-14 md:w-14"
        data-ocid="support.open_modal_button"
        aria-label="Customer Support"
      >
        <HeadphonesIcon className="h-5 w-5 md:h-6 md:w-6" />
        {/* Pulsing dot */}
        <span className="absolute right-0.5 top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent
          className="flex max-h-[90vh] w-[95vw] max-w-md flex-col gap-0 overflow-hidden p-0"
          data-ocid="support.dialog"
        >
          {/* Header */}
          <DialogHeader className="flex-row items-center justify-between border-b border-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="mr-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  data-ocid="support.back_button"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <HeadphonesIcon className="h-4 w-4 text-primary" />
              <DialogTitle className="text-sm font-semibold">
                Customer Support
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              data-ocid="support.close_button"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Step 1 — Topic Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  className="p-5"
                >
                  <p className="mb-4 text-sm text-muted-foreground">
                    How can we help you today? Choose a topic below.
                  </p>
                  <div className="flex flex-col gap-3">
                    {TOPICS.map(
                      ({ id, label, description, icon: Icon, ocid }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSelectTopic(id)}
                          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
                          data-ocid={ocid}
                        >
                          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {label}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Form */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.18 }}
                  className="p-5"
                >
                  {/* Payment issue notice */}
                  {topic === "payment" && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                      <p className="text-xs leading-relaxed text-amber-800">
                        <span className="font-semibold">
                          Before you submit:
                        </span>{" "}
                        Please have your{" "}
                        <span className="font-semibold">transaction ID</span>{" "}
                        and <span className="font-semibold">mobile number</span>{" "}
                        ready. You can find the transaction ID in your payment
                        confirmation screen or SMS.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="support-name"
                        className="text-xs font-medium"
                      >
                        Your Name{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="support-name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="h-9 text-sm"
                        data-ocid="support.name.input"
                      />
                    </div>

                    {/* Transaction ID — for payment & other */}
                    {needsPaymentFields && (
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="support-txn"
                          className="text-xs font-medium"
                        >
                          Transaction ID{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="support-txn"
                          placeholder="e.g. pay_ABC123XYZ"
                          value={form.transactionId}
                          onChange={(e) =>
                            updateField("transactionId", e.target.value)
                          }
                          className={`h-9 text-sm ${errors.transactionId ? "border-destructive" : ""}`}
                          data-ocid="support.transaction.input"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          💡 Copy your transaction ID from the payment
                          confirmation screen or SMS.
                        </p>
                        {errors.transactionId && (
                          <p className="text-[11px] text-destructive">
                            {errors.transactionId}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mobile Number — for payment & other */}
                    {needsPaymentFields && (
                      <div className="flex flex-col gap-1.5">
                        <Label
                          htmlFor="support-mobile"
                          className="text-xs font-medium"
                        >
                          Mobile Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="support-mobile"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={form.mobile}
                          onChange={(e) =>
                            updateField("mobile", e.target.value)
                          }
                          className={`h-9 text-sm ${errors.mobile ? "border-destructive" : ""}`}
                          data-ocid="support.mobile.input"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          📱 Enter the mobile number used during payment.
                        </p>
                        {errors.mobile && (
                          <p className="text-[11px] text-destructive">
                            {errors.mobile}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="support-message"
                        className="text-xs font-medium"
                      >
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="support-message"
                        placeholder="Describe your issue or feedback in detail..."
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        rows={4}
                        className={`resize-none text-sm ${errors.message ? "border-destructive" : ""}`}
                        data-ocid="support.message.textarea"
                      />
                      {errors.message && (
                        <p className="text-[11px] text-destructive">
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    onClick={handleSubmit}
                    className="mt-5 w-full"
                    data-ocid="support.submit_button"
                  >
                    Send via Email
                  </Button>
                </motion.div>
              )}

              {/* Step 3 — Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center gap-4 px-6 py-10 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      Message Ready!
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Your message has been prepared. Your email client will
                      open to send it. If it doesn&apos;t open, please try
                      again.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClose}
                    className="mt-2"
                    data-ocid="support.close_button"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
