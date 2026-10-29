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
    <section className="py-20 bg-gray-50 border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <span>The Quick Mechs Way</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Automotive Repair Reimagined Like Ride-Sharing
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Skip the tow truck bills and grease-stained waiting rooms. We make professional auto maintenance as effortless as summoning a ride in Atlanta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-gray-300 group-hover:text-gray-400 font-mono transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight group-hover:text-gray-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-gray-900" />
                  <span>Fast dispatch across Atlanta</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gray-900 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Need Urgent Diagnostic Help or Stranded on the Road?
            </h4>
            <p className="text-sm text-gray-300 max-w-xl">
              Our mobile technicians carry on-board diagnostic scanners, commercial jump starters, and brake testing instruments for same-day service.
            </p>
          </div>
          <a
            href="#request-form"
            className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm tracking-wide shadow-lg whitespace-nowrap transition-colors flex-shrink-0"
          >
            Request Mobile Tech
          </a>
        </div>
      </div>
    </section>
  );
}