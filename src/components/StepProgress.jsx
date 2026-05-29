import { Check } from "lucide-react";

const steps = [
  { id: "form", label: "البيانات" },
  { id: "network_pay", label: "الرسوم" },
  { id: "payment", label: "الدفع" },
  { id: "confirmation", label: "تأكيد" },
];

export default function StepProgress({ currentStep }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white px-4 py-4 border-b border-gray-100" dir="rtl">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      index <= currentIndex ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      index < currentIndex ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs mt-2 ${
                  isCurrent || isCompleted
                    ? "text-primary font-semibold"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}