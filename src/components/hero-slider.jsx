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
      className="relative bg-black border-b border-purple-950/50 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-950/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-6 w-fit shadow-md shadow-purple-950/40">
              <Wrench className="w-3.5 h-3.5 text-purple-400" />
              <span>{SLIDES[current].badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
              {SLIDES[current].title}{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 font-extrabold mt-1">
                {SLIDES[current].highlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-8 max-w-2xl font-normal">
              {SLIDES[current].description}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Transparent upfront quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Vetted ASE-standard mobile techs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Service at home, office or roadside</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Serving all Atlanta metro suburbs</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#request-form"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-900/50 hover:shadow-purple-800/60 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Book A Mobile Mechanic
              </a>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 font-semibold text-sm transition-all duration-200"
              >
                View All Services & Pricing
              </Link>
            </div>
          </div>

          {/* Image & Slide Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-900/40 bg-zinc-900 shadow-2xl shadow-purple-950/60 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
              <img
                src={SLIDES[current].image}
                alt={SLIDES[current].alt}
                width="1200"
                height="800"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 pointer-events-none">
                <span className="bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-md border border-zinc-800 text-purple-300 font-medium">
                  Atlanta Mobile Dispatch
                </span>
                <span className="bg-black/75 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-zinc-800 text-zinc-400 font-mono">
                  0{current + 1} / 0{SLIDES.length}
                </span>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 transition-all rounded-full ${
                      current === index ? 'w-8 bg-purple-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="h-9 w-9 rounded-lg bg-zinc-900 hover:bg-purple-900/40 text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="h-9 w-9 rounded-lg bg-zinc-900 hover:bg-purple-900/40 text-zinc-300 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors"
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