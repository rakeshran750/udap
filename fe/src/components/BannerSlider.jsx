import { useEffect, useState } from "react";

const slides = [
  { title: "Manage customers easily", desc: "Track balances and collections in one place" },
  { title: "Secure & Offline-ready", desc: "Works great as a PWA with your saved data" },
  { title: "Fast transaction logging", desc: "Add udhari or collection in a few taps" },
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-orange-50 shadow-sm">
      <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-orange-600 uppercase tracking-wide">Tip</p>
          <h3 className="text-sm sm:text-base font-bold text-gray-900">{slide.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{slide.desc}</p>
        </div>
        <div className="flex space-x-1 justify-end">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === index ? "bg-orange-500" : "bg-orange-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
