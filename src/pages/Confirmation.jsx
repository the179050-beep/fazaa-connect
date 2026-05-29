import { useNavigate } from "react-router-dom";
import { CheckCircle, Home, FileText } from "lucide-react";
import StepProgress from "@/components/StepProgress";

export default function Confirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      <StepProgress currentStep="confirmation" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="text-gray-500 text-center mb-8 max-w-xs">
          شكراً لتسجيلك في بطاقة فزعة. سيتم التواصل معك قريباً لتأكيد موعد التوصيل.
        </p>

        {/* Order Summary Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">تفاصيل الطلب</p>
              <p className="text-xs text-gray-500">رقم المرجع: #{Date.now().toString().slice(-8)}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">الحالة</span>
              <span className="text-green-600 font-medium">تم الدفع ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">المبلغ المدفوع</span>
              <span className="font-medium">1 درهم</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">تاريخ الطلب</span>
              <span className="font-medium">{new Date().toLocaleDateString("ar-AE")}</span>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full max-w-sm py-4 text-base font-bold rounded-2xl text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #c9a227 0%, #e6c84a 50%, #c9a227 100%)' }}
        >
          <Home className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </button>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-1">للاستفسارات تواصل معنا</p>
          <p className="text-sm font-medium text-primary">www.fazaa.ae</p>
        </div>
      </div>
    </div>
  );
}