import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Check, ArrowRight, Zap, BatteryCharging, AlertCircle, HelpCircle } from 'lucide-react';

export default function ServicesPage() {
  const serviceCategories = [
    {
      title: 'Diagnostic & Troubleshooting',
      image: '/assets/mobile-mechanic-doing-diagnostic-test-on-car-5kup.svg',
      description: 'Comprehensive computer scans and physical inspections for warning lights, strange engine noises, stalling, or starting failures.',
      items: [
        'OBD-II check engine light scan and report',
        'No-start and hard-start electrical diagnosis',
        'Coolant leak and overheating investigation',
        'Battery, alternator, and starter circuit tests'
      ]
    },
    {
      title: 'Brake System Service',
      image: '/assets/mechanic-changing-brake-pads-on-a-vehicle-wny3.svg',
      description: 'Complete brake replacements performed safely on your vehicle while parked at your location.',
      items: [
        'Ceramic brake pad replacements',
        'Rotor inspection, replacement, or resurfacing',
        'Brake caliper inspection and hardware replacement',
        'Brake fluid flush and system bleeding'
      ]
    },
    {
      title: 'Battery, Starting & Charging',
      image: '/assets/mechanic-replacing-car-battery-outdoors-1424.svg',
      description: 'Fast mobile response for dead batteries, weak alternators, and faulty starter motors without needing a tow truck.',
      items: [
        'On-site 12V battery testing & warranty replacements',
        'Alternator testing and replacement',
        'Starter motor replacement',
        'Battery terminal cleaning & corrosion treatment'
      ]
    },
    {
      title: 'Engine Maintenance & Belts',
      image: '/assets/car-engine-repair-on-the-road-hpfr.svg',
      description: 'Keep your engine performing smoothly with precision maintenance scheduled conveniently around your calendar.',
      items: [
        'Serpentine drive belt replacement',
        'Spark plugs and ignition coil packs',
        'Engine air filter and cabin air filter swap',
        'Radiator hose and coolant thermostat replacement'
      ]
    }
  ];

  const faqs = [
    {
      q: 'Can you work on my car in my driveway or apartment parking lot?',
      a: 'Yes. As long as your vehicle is parked on a reasonably flat, safe surface (driveway, designated stall, or open garage), our mobile mechanics arrive equipped to complete standard repairs without spilling fluids or creating a disturbance.'
    },
    {
      q: 'How does your upfront pricing work?',
      a: 'Before any work begins, we provide an itemized quote detailing the required replacement parts and labor. We never bill surprise shop fees or authorize work without your approval.'
    },
    {
      q: 'What warranty is included with your mobile repairs?',
      a: 'Our qualifying repairs are backed by a 12-month / 12,000-mile parts and labor warranty, giving you the same peace of mind you\'d expect from top-tier brick-and-mortar repair shops.'
    },
    {
      q: 'Do you service small commercial fleets in Atlanta?',
      a: 'Yes, we provide routine on-site inspection and scheduled maintenance for service vans, delivery fleets, and small business vehicles across greater Atlanta.'
    }
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */} 
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest bg-purple-950/60 border border-purple-800/40 px-3 py-1 rounded-full">
            Mobile Repair Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            Comprehensive Mobile Auto Services
          </h1>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed">
            Explore our on-demand repair solutions. From instant diagnostics to complete brake overhauls, our Atlanta mechanics arrive ready to resolve your issue.
          </p>
        </div>

        {/* Service Categories Grid */} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {serviceCategories.map((cat, i) => (
            <div key={i} className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-purple-600/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="h-56 bg-neutral-950 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    width="600"
                    height="320"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{cat.title}</h2>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">{cat.description}</p>
                  <div className="space-y-2.5">
                    {cat.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 pt-0">
                <Link
                  to="/#request-form"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-800 hover:bg-purple-600 text-white text-xs sm:text-sm font-semibold transition-colors border border-neutral-700 hover:border-purple-500"
                >
                  Request This Service
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Fleet Maintenance Callout */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/70 via-neutral-900 to-neutral-900 border border-purple-800/40 p-8 sm:p-12 mb-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              Commercial Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Keep Your Small Fleet Road-Ready
            </h2>
            <p className="text-neutral-300 text-sm mt-3 leading-relaxed">
              Delivery vans and service pickups make your business run. We schedule scheduled on-site inspections and rapid maintenance so your drivers spend less time idle and more time serving customers in Atlanta.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shrink-0 transition-all shadow-lg shadow-purple-950/80"
          >
            Inquire About Fleet Care
          </Link>
        </div>

        {/* Common Questions */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-base font-bold text-white">{faq.q}</h3>
                <p className="text-sm text-neutral-300 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
