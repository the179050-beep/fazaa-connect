import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StepProgress from "@/components/StepProgress";

export default function CardRequest() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    id_number: "",
    card_type: "",
    address: "",
    date: today,
  });
  const [saving, setSaving] = useState(false);
  const [appId, setAppId] = useState(null);

  // Load existing draft from localStorage if any
  useEffect(() => {
    const savedId = localStorage.getItem("card_app_id");
    if (savedId) setAppId(savedId);
  }, []);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  // Auto-save on field change
  useEffect(() => {
    if (!form.name && !form.mobile) return;
    const timer = setTimeout(() => autoSave(), 800);
    return () => clearTimeout(timer);
  }, [form]);

  const autoSave = async () => {
    setSaving(true);
    const data = {
      name: form.name,
      mobile: form.mobile,
      id_number: form.id_number,
      card_type: form.card_type,
      address: form.address,
      delivery_date: form.date,
      current_step: "form",
      status: "in_progress",
    };
    if (appId) {
      await base44.entities.CardApplication.update(appId, data);
    } else {
      const record = await base44.entities.CardApplication.create(data);
      setAppId(record.id);
      localStorage.setItem("card_app_id", record.id);
    }
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      name: form.name,
      mobile: form.mobile,
      id_number: form.id_number,
      card_type: form.card_type,
      address: form.address,
      delivery_date: form.date,
      current_step: "network_pay",
      status: "in_progress",
    };
    if (appId) {
      await base44.entities.CardApplication.update(appId, data);
    } else {
      const record = await base44.entities.CardApplication.create(data);
      localStorage.setItem("card_app_id", record.id);
    }
    setSaving(false);
    navigate("/network-pay");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-y-auto" dir="rtl">
      <StepProgress currentStep="form" />

      {/* Top cards banner */}
      <div className="bg-white flex flex-col items-center pt-6 pb-0">
        <img
          src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/fb31ff7e9_static_wixstatic_com_1_4c363b09.jpg"
          alt="بطاقات فزعة"
          className="w-full max-w-sm object-contain"
        />
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 py-6 max-w-sm mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-center text-sm font-semibold text-foreground leading-relaxed flex-1">
            أدخل البيانات المطلوبة لأكمال طلب البطاقة وتأكيد<br />عنوان التوصيل
          </p>
          {saving && <span className="text-xs text-gray-400 shrink-0 mr-2">حفظ...</span>}
          {!saving && appId && <span className="text-xs text-green-500 shrink-0 mr-2">✓ محفوظ</span>}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
            required
          />
          <input
            type="tel"
            placeholder="Mobile number"
            value={form.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
            required
          />
          <input
            type="text"
            placeholder="رقم الهوية"
            value={form.id_number}
            onChange={(e) => handleChange("id_number", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
            required
          />
          <div className="relative">
            <select
              value={form.card_type}
              onChange={(e) => handleChange("card_type", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right appearance-none bg-white focus:outline-none focus:border-primary text-gray-500"
              required
            >
              <option value="" disabled>نوع البطاقة</option>
              <option value="silver">عضوية فضية</option>
              <option value="gold">عضوية ذهبية</option>
              <option value="platinum">عضوية بلاتينية</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder="عنوان التوصيل"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right bg-white focus:outline-none focus:border-primary text-gray-600"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 mt-2 text-base font-bold rounded-2xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #8a8a8a 0%, #b0b0b0 50%, #8a8a8a 100%)' }}
          >
            المتابعة
          </button>
        </form>
      </div>

      {/* Bottom banner */}
      <div className="bg-white flex flex-col items-center py-6 mt-auto">
        <img
          src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/e799bc032_2f3eb4_5549add76f694127877610465c9f8733mv2.jpeg"
          alt="Network Pay"
          className="w-48 object-contain mb-3"
        />
        <p className="text-xs text-gray-500 text-center">Fazaa... a lifestyle of happiness & positivity</p>
        <p className="text-xs text-primary text-center">www.fazaa.ae</p>
      </div>
    </div>
  );
}