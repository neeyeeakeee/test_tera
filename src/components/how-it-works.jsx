import React from 'react';
import { Smartphone, Wrench, ShieldCheck, MapPin, Clock, DollarSign } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Book Your Service Online',
    subtitle: 'Transparent Pricing in Seconds',
    description: 'Tell us what your car needs—dead battery, squeaky brakes, check engine light, or a no-start issue—plus your Atlanta location. We show you upfront pricing with no hidden shop fees.',
    icon: Smartphone
  },
  {
    step: '02',
    title: 'Mechanic Arrives At Your Location',
    subtitle: 'Like Uber, Delivered To You',
    description: 'A vetted, insured mobile technician arrives at your driveway, office parking deck, or roadside with professional diagnostic equipment, specialized tools, and genuine parts.',
    icon: Wrench
  },
  {
    step: '03',
    title: 'Work Completed & Inspected',
    subtitle: 'Full Warranty Included',
    description: 'Inspect the repairs with the technician, review the diagnostic readout, and approve completion. Every job is backed by our 12-month / 12,000-mile warranty.',
    icon: ShieldCheck
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-zinc-950 border-b border-purple-950/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/50 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <span>The Quick Mechs Way</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Automotive Repair Reimagined Like Ride-Sharing
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Skip the tow truck bills and grease-stained waiting rooms. We make professional auto maintenance as effortless as summoning a ride in Atlanta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-zinc-900/60 border border-zinc-800 hover:border-purple-600/50 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/30 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-lg shadow-purple-950/60">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-zinc-800 group-hover:text-purple-400/40 font-mono transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 tracking-tight group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Fast dispatch across Atlanta</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/70 via-zinc-900 to-zinc-950 border border-purple-800/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Need Urgent Diagnostic Help or Stranded on the Road?
            </h4>
            <p className="text-sm text-zinc-300 max-w-xl">
              Our mobile technicians carry on-board diagnostic scanners, commercial jump starters, and brake testing instruments for same-day service.
            </p>
          </div>
          <a
            href="#request-form"
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-900/60 whitespace-nowrap transition-colors flex-shrink-0"
          >
            Request Mobile Tech
          </a>
        </div>
      </div>
    </section>
  );
}