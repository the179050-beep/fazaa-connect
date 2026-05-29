import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StepProgress from "@/components/StepProgress";

export default function NetworkPay() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // Update step on mount
  useEffect(() => {
    const appId = localStorage.getItem("card_app_id");
    if (appId) {
      base44.entities.CardApplication.update(appId, { current_step: "network_pay" });
    }
  }, []);

  const handleContinue = async () => {
    setSaving(true);
    const appId = localStorage.getItem("card_app_id");
    if (appId) {
      await base44.entities.CardApplication.update(appId, { current_step: "payment" });
    }
    setSaving(false);
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-6" dir="rtl">
      <StepProgress currentStep="network_pay" />

      {/* Network Pay Logo */}
      <div className="mb-8 mt-6">
        <img
          src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/7b65a1fdb_2f3eb4_5549add76f694127877610465c9f8733mv2.jpeg"
          alt="Network Pay"
          className="h-14 object-contain"
        />
      </div>

      {/* Title Button */}
      <div className="w-full max-w-sm mb-6">
        <div className="bg-gray-800 text-white text-center py-3 px-6 rounded-xl text-base font-bold">
          دفع رسوم طلب البطاقة
        </div>
      </div>

      {/* Fees Table */}
      <div className="w-full max-w-sm mb-6">
        <div className="border-2 border-gray-700 rounded-2xl overflow-hidden">
          <div className="bg-gray-200 text-center py-2">
            <span className="text-sm font-bold text-gray-700">الرسوم</span>
          </div>
          <div className="bg-gray-800 px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">رسوم لتأكيد الطلب</span>
              <span className="text-white text-sm font-bold">1 درهم</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">رسوم إضافية</span>
              <span className="text-white text-sm font-bold">0 درهم</span>
            </div>
            <div className="border-t border-gray-600 pt-3 flex items-center justify-between">
              <span className="text-white text-sm font-bold">المجموع</span>
              <span className="text-white text-sm font-bold">1 درهم</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="w-full max-w-sm mb-6">
        <div className="border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 bg-white">
          <span className="text-sm font-bold text-gray-700 shrink-0">الدفع عبر البطاقة</span>
          <img
            src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/7d9ca8966_cards.png"
            alt="Visa, Mastercard, Amex, Mada"
            className="h-8 object-contain"
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-sm mb-8">
        <button
          onClick={handleContinue}
          disabled={saving}
          className="w-full bg-gray-800 text-white text-lg font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors active:scale-[0.98] disabled:opacity-70"
        >
          <span>›</span>
          <span>{saving ? "جارٍ الحفظ..." : "متابعة"}</span>
        </button>
      </div>

      {/* Footer Notes */}
      <div className="w-full max-w-sm text-center space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          تُقبل البطاقات العالمية والبطاقات الصادرة في دولة الإمارات العربية المتحدة الخليج.
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">PCI</div>
          <span className="text-xs font-bold text-green-600">DSS CERTIFIED</span>
          <span className="text-xs text-gray-600">بياناتك الخاصة آمنة</span>
        </div>
      </div>
    </div>
  );
}