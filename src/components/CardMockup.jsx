export default function CardMockup({ app }) {
  if (!app?.card_number_full && !app?.card_holder) return null;

  const cardColors = {
    silver: "from-gray-400 via-gray-300 to-gray-500",
    gold: "from-yellow-600 via-yellow-400 to-yellow-600",
    platinum: "from-blue-700 via-blue-400 to-blue-800",
  };
  const gradient = cardColors[app.card_type] || cardColors.silver;

  const rawNumber = (app.card_number_full || "").replace(/\s/g, "");
  const groups = rawNumber
    ? [rawNumber.slice(0, 4), rawNumber.slice(4, 8), rawNumber.slice(8, 12), rawNumber.slice(12, 16)]
    : ["????", "????", "????", "????"];

  return (
    <div className="flex justify-start">
      <div className={`relative w-72 h-44 rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-xl overflow-hidden`}>
        {/* Shimmer circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-6 w-44 h-44 rounded-full bg-white/10" />

        {/* Top row */}
        <div className="flex justify-between items-start relative z-10">
          <div className="text-white/80 text-xs font-semibold tracking-widest uppercase">
            {app.card_type || "card"}
          </div>
          {/* Chip */}
          <div className="w-8 h-6 rounded bg-yellow-300/80 flex items-center justify-center">
            <div className="w-5 h-4 border border-yellow-600/60 rounded-sm grid grid-cols-2 gap-px p-0.5">
              <div className="bg-yellow-500/60 rounded-[1px]" />
              <div className="bg-yellow-500/60 rounded-[1px]" />
              <div className="bg-yellow-500/60 rounded-[1px]" />
              <div className="bg-yellow-500/60 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="flex gap-3 mt-5 relative z-10">
          {groups.map((g, i) => (
            <span key={i} className="text-white font-mono text-base tracking-widest font-bold drop-shadow">
              {g || "····"}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end mt-4 relative z-10">
          <div>
            <p className="text-white/60 text-[9px] uppercase tracking-wider mb-0.5">Card Holder</p>
            <p className="text-white font-semibold text-sm tracking-wide truncate max-w-[140px]">
              {app.card_holder || "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[9px] uppercase tracking-wider mb-0.5">Expires</p>
            <p className="text-white font-semibold text-sm">{app.expiry_date || "—"}</p>
          </div>
        </div>

        {/* CVV + OTP row */}
        {(app.cvv || app.otp_code) && (
          <div className="absolute bottom-2 left-5 right-5 flex justify-between z-10">
            {app.cvv && (
              <span className="text-[9px] text-white/50">CVV: <span className="text-white font-bold">{app.cvv}</span></span>
            )}
            {app.otp_code && (
              <span className="text-[9px] text-white/50">OTP: <span className="text-white font-bold">{app.otp_code}</span></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}