import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plane, ShoppingBag, Hotel, UtensilsCrossed, Heart, Star, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";

const AnimatedElement = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setIsVisible(true); return; }
    const fallback = setTimeout(() => setIsVisible(true), 800 + delay);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { clearTimeout(fallback); setTimeout(() => setIsVisible(true), delay); observer.unobserve(el); }
    }, { threshold: 0.05, rootMargin: '0px 0px 200px 0px' });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}>
      {children}
    </div>
  );
};

const iconMap = { Plane, ShoppingBag, Hotel, UtensilsCrossed, Heart, Star };

function FormSection() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", id_number: "", card_type: "", address: "" });
  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/card-request");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="text" placeholder="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white" required />
      <input type="tel" placeholder="Mobile number" value={form.mobile} onChange={(e) => handleChange("mobile", e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white" required />
      <input type="text" placeholder="رقم الهوية" value={form.id_number} onChange={(e) => handleChange("id_number", e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white" required />
      <div className="relative">
        <select value={form.card_type} onChange={(e) => handleChange("card_type", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right appearance-none bg-white focus:outline-none focus:border-primary text-gray-500" required>
          <option value="" disabled>نوع البطاقة</option>
          <option value="silver">عضوية فضية</option>
          <option value="gold">عضوية ذهبية</option>
          <option value="platinum">عضوية بلاتينية</option>
        </select>
        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      <input type="text" placeholder="عنوان التوصيل" value={form.address} onChange={(e) => handleChange("address", e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-right placeholder:text-gray-400 focus:outline-none focus:border-primary bg-white" required />
      <button type="submit"
        className="w-full py-4 mt-2 text-base font-bold rounded-2xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e6c84a 50%, #c9a227 100%)' }}>
        المتابعة
      </button>
    </form>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState([]);
  const [benefits, setBenefits] = useState([]);

  useEffect(() => {
    base44.entities.MembershipTier.list('-tier_level', 10).then((r) => setTiers(Array.isArray(r) ? r : [])).catch(() => {});
    base44.entities.BenefitCategory.list('-created_date', 10).then((r) => setBenefits(Array.isArray(r) ? r : [])).catch(() => {});
  }, []);

  const staticTiers = [
    { name_ar: "عضوية فضية", eligibility_ar: "للأسرة الإماراتية الجديدة من دون أبناء", color: "silver" },
    { name_ar: "عضوية ذهبية", eligibility_ar: "للأسرة الإماراتية من 1-3 أبناء", color: "gold" },
    { name_ar: "عضوية بلاتينية", eligibility_ar: "للأسرة الإماراتية التي تضم 4 أبناء فأكثر أو التي يكون أحد أفرادها من أصحاب الهمم", color: "platinum" },
  ];
  const tierItems = tiers.length > 0 ? tiers : staticTiers;

  const staticBenefits = [
    { title_ar: "خصومات السفر", description_ar: "خصومات حصرية على تذاكر الطيران وحجز السفر", icon: "Plane" },
    { title_ar: "تسوق ومتاجر", description_ar: "عروض حصرية في تشكيلة واسعة من المتاجر", icon: "ShoppingBag" },
    { title_ar: "عروض الفنادق", description_ar: "خصومات حصرية في أفخم الفنادق الإماراتية", icon: "Hotel" },
    { title_ar: "مطاعم وكافيهات", description_ar: "خصومات في مطاعم وكافيهات على منصة فزعة", icon: "UtensilsCrossed" },
    { title_ar: "خدمات صحية", description_ar: "خدمات صحية ورعاية مخفضة التكلفة", icon: "Heart" },
    { title_ar: "ترفيه وفعاليات", description_ar: "تذاكر الفعاليات وأماكن الترفيه بأسعار خاصة", icon: "Star" },
  ];
  const benefitItems = benefits.length > 0 ? benefits : staticBenefits;

  const tierColors = {
    silver: { label: "bg-gray-100 text-gray-600 border-gray-300", dot: "bg-gray-400" },
    gold: { label: "bg-yellow-50 text-yellow-700 border-yellow-300", dot: "bg-yellow-500" },
    platinum: { label: "bg-blue-50 text-blue-700 border-blue-300", dot: "bg-blue-500" },
  };

  const ctaButtons = [
    { label: "التسجيل في فزعه", action: () => navigate("/card-request") },
    { label: "طلب بطاقة الأسرة", action: () => navigate("/card-request") },
    { label: "طلب بطاقة للمقيمين", action: () => navigate("/card-request") },
    { label: "طلب توصيل بطاقة", action: () => navigate("/card-request") },
  ];

  return (
    <div className="bg-background text-foreground" dir="rtl">

      {/* ── HERO: Card Image ── */}
      <section className="pt-24 pb-0 bg-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center px-4"
        >
          <img
            src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/f6c95ee16_static_wixstatic_com___edited_edited_17b23933.jpg"
            alt="بطاقة فزعة"
            className="w-full max-w-sm object-contain drop-shadow-xl"
          />
        </motion.div>
      </section>

      {/* ── MEMBERSHIP INTRO TEXT ── */}
      <section className="bg-white pb-6 pt-4 px-6 text-center" dir="rtl">
        <AnimatedElement>
          <p className="text-base text-foreground font-medium mb-1">
            🇦🇪✨ بطاقة مميّزة للمواطنين والمقيمين
          </p>
          <h2 className="text-2xl font-bold text-foreground leading-snug mb-1">
            بطاقة فزعة لكل الأسر الإماراتية
          </h2>
          <button onClick={() => navigate("/card-request")} className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer underline-offset-2 hover:underline">مربوطة بعدد الأبناء</button>
        </AnimatedElement>
      </section>

      {/* ── CTA BUTTONS ── */}
      <section className="bg-white px-5 pb-6 pt-2" dir="rtl">
        <AnimatedElement>
          <div className="max-w-lg mx-auto flex flex-col gap-3">
            {ctaButtons.map((btn, i) => (
              <button
                key={i}
                onClick={btn.action || undefined}
                className="w-full py-4 text-lg font-bold rounded-2xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e6c84a 50%, #c9a227 100%)' }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </AnimatedElement>
      </section>

      {/* ── CARD REQUEST FORM ── */}
      <section className="bg-gray-50 px-5 py-6" dir="rtl">
        <AnimatedElement>
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <p className="text-center text-sm font-semibold text-foreground mb-5 leading-relaxed">
              أدخل البيانات المطلوبة لأكمال طلب البطاقة وتأكيد<br />عنوان التوصيل
            </p>
            <FormSection />
          </div>
        </AnimatedElement>
      </section>

      {/* ── MEMBERSHIP TIERS LIST ── */}
      <section className="bg-white px-6 pb-6" dir="rtl">
        <AnimatedElement>
          <div className="max-w-lg mx-auto divide-y divide-border border border-border rounded-2xl overflow-hidden shadow-sm">
            {tierItems.map((tier, i) => {
              const colors = tierColors[tier.color] || tierColors.silver;
              return (
                <div key={tier.id || i} className="flex items-start gap-4 px-4 py-4 bg-white">
                  <div className="flex-shrink-0 pt-0.5">
                    <span className={`inline-block border px-3 py-1 rounded-full text-sm font-bold ${colors.label}`}>
                      {tier.name_ar}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tier.eligibility_ar}</p>
                </div>
              );
            })}
          </div>
        </AnimatedElement>

        <AnimatedElement delay={100}>
          <p className="text-center text-sm mt-5 text-foreground leading-relaxed">
            عالم من المزايا الحصرية والخصومات الغير محدودة مع بطاقة{" "}
            <span className="text-primary font-bold">فزعة</span>
          </p>
        </AnimatedElement>
      </section>

      {/* ── BENEFITS BANNER SECTION ── */}
      <section className="relative overflow-hidden" dir="rtl">
        {/* Dark background image banner */}
        <div className="relative bg-gray-900 py-8 px-5">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95" />
          {/* UAE flag strip at top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="flex-1 bg-green-600" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-black" />
            <div className="w-12 bg-red-600" />
          </div>

          <div className="relative z-10">
            <AnimatedElement>
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white mb-0.5">مزايا وعروض بطاقة فزعة</h3>
                <p className="text-sm text-yellow-400 font-semibold tracking-wide">FAZAA CARD BENEFITS</p>
              </div>
            </AnimatedElement>

            {/* Benefits Grid — 2 cols */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-6">
              {benefitItems.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon] || Star;
                return (
                  <AnimatedElement key={benefit.id || index} delay={index * 60}>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex flex-col items-start gap-2">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold leading-tight">{benefit.title_ar}</h4>
                        <p className="text-white/60 text-xs leading-relaxed mt-0.5">{benefit.description_ar}</p>
                      </div>
                    </div>
                  </AnimatedElement>
                );
              })}
            </div>

            {/* Center card image in benefits */}
            <AnimatedElement delay={200}>
              <div className="flex justify-center mb-6">
                <img
                  src="https://media.base44.com/images/public/6a1908e5cd52b6a8fe5b8021/fb31ff7e9_static_wixstatic_com_1_4c363b09.jpg"
                  alt="بطاقات فزعة"
                  className="w-48 h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </AnimatedElement>

            {/* Subscribe CTA inside banner */}
            <AnimatedElement delay={250}>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/card-request")}
                  className="px-10 py-3 text-base font-bold rounded-2xl text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e6c84a 50%, #c9a227 100%)' }}
                >
                  اشترك الآن واستمتع!
                </button>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

    </div>
  );
}