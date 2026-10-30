import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, Wrench, Clock, CheckCircle } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: 'Atlanta On-Demand Mechanic',
    title: 'Auto Repair Like Uber: We Come To You.',
    highlight: 'No Tow Trucks. No Waiting Rooms.',
    description: 'Get verified master mechanics dispatched straight to your driveway or workplace with transparent, upfront quotes and real-time job tracking.',
    image: '/assets/car-engine-repair-on-the-road-hpfr.svg',
    alt: 'Quick Mechs roadside mobile mechanic repairing engine'
  },
  {
    id: 2,
    badge: 'Mobile Brake Service',
    title: 'Precision Brake Pad & Rotor Replacements',
    highlight: 'Done Right at Your Home or Office.',
    description: 'Squeaking, grinding, or soft brake pedals? Our certified technicians perform full on-site brake jobs using premium OEM-grade parts.',
    image: '/assets/mechanic-changing-brake-pads-on-a-vehicle-wny3.svg',
    alt: 'Professional mechanic changing brake pads on vehicle'
  },
  {
    id: 3,
    badge: 'Emergency Diagnostics',
    title: "Car Won't Start or Battery Died?",
    highlight: 'Fast Same-Day Mobile Dispatch in Atlanta.',
    description: 'Dead batteries, alternator failures, and starter issues diagnosed on the spot with instant mobile battery testing and replacement.',
    image: '/assets/mechanic-replacing-car-battery-outdoors-1424.svg',
    alt: 'Mobile mechanic replacing car battery outdoors in Atlanta'
  },
  {
    id: 4,
    badge: 'Check Engine Diagnostics',
    title: 'Computer Diagnostics & Engine Troubleshooting',
    highlight: 'Clear Answers Before Any Work Begins.',
    description: 'Avoid inflated shop markups. Our technicians run full diagnostic scans and provide honest, itemized quotes before turning a single wrench.',
    image: '/assets/mobile-mechanic-doing-diagnostic-test-on-car-5kup.svg',
    alt: 'Mobile technician performing vehicle diagnostic scan'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section 
      className="relative bg-gradient-to-b from-gray-100/60 via-white to-gray-50 border-b border-gray-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-300/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-white text-xs font-bold tracking-wide uppercase mb-6 w-fit shadow-sm">
              <Wrench className="w-3.5 h-3.5 text-gray-300" />
              <span>{SLIDES[current].badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-4">
              {SLIDES[current].title}{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-neutral-700 font-extrabold mt-1">
                {SLIDES[current].highlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl font-normal">
              {SLIDES[current].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                <span>Transparent upfront quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                <span>Vetted ASE-standard mobile techs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                <span>Service at home, office or roadside</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0" />
                <span>Serving all Atlanta metro suburbs</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#request-form"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm tracking-wide shadow-lg shadow-gray-200 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Book A Mobile Mechanic
              </a>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-semibold text-sm transition-all duration-200"
              >
                View All Services & Pricing
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-2xl shadow-gray-200 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
              <img
                src={SLIDES[current].image}
                alt={SLIDES[current].alt}
                width="1200"
                height="800"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white pointer-events-none">
                <span className="bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-gray-700 text-gray-200 font-medium">
                  Atlanta Mobile Dispatch
                </span>
                <span className="bg-gray-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-gray-700 text-gray-300 font-mono">
                  0{current + 1} / 0{SLIDES.length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 transition-all rounded-full ${
                      current === index ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="h-9 w-9 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 flex items-center justify-center transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="h-9 w-9 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 flex items-center justify-center transition-colors shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}