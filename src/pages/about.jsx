import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, MapPin, CheckCircle, Wrench, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      title: 'No Surprise Invoices',
      description: 'We believe drivers deserve absolute honesty. Every diagnostic finding is photographed and explained before any replacement work begins.',
      icon: Shield
    },
    {
      title: 'Rigorous Mechanic Vetting',
      description: 'Only experienced technicians with verifiable track records and certified competency join our mobile response team.',
      icon: Award
    },
    {
      title: 'Driver-First Convenience',
      description: 'Your time is valuable. We eliminate the need to sit in outdated waiting rooms or pay costly towing charges for common mechanical issues.',
      icon: Wrench
    },
    {
      title: 'Atlanta Community Dedication',
      description: 'Proudly serving everyday commuters, families, and commercial fleet operators across the entire Atlanta metropolitan area.',
      icon: Users
    }
  ];

  const serviceAreas = [
    'Downtown Atlanta', 'Midtown', 'Buckhead', 'Old Fourth Ward',
    'Inman Park', 'Decatur', 'Sandy Springs', 'Dunwoody',
    'Marietta', 'Smyrna', 'Roswell', 'Alpharetta',
    'East Point', 'College Park', 'Brookhaven', 'Vinings'
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest bg-purple-950/60 border border-purple-800/40 px-3 py-1 rounded-full">
            About Quick Mechs
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            Re-imagining Auto Care for the Modern Atlanta Driver
          </h1>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed">
            We combined classic workshop craftsmanship with the effortless convenience of on-demand technology—bringing trusted mechanics directly to where your car is parked.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The Problem With Traditional Repair Shops
            </h2>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              Everyone knows the feeling: your car won\'t start in your driveway, or the check engine light flickers on during your morning commute. Traditionally, that meant calling an expensive tow truck, rearranging your work schedule, and waiting hours in a noisy garage lobby only to receive a bill loaded with ambiguous shop fees.
            </p>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              Quick Mechs was founded to deliver a better way. By outfitting vetted master technicians with high-grade mobile diagnostic units and repair vans, we turn your home driveway or company parking lot into a clean, professional service bay.
            </p>
            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
              <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Our Mission</p>
              <p className="text-sm text-neutral-200 mt-1 font-medium">
                To provide transparent, fair-priced, and on-demand automotive repair that respects your schedule and safeguards your peace of mind.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
            <img
              src="/assets/friendly-professional-mechanic-smiling-in-workshop-djge.svg"
              alt="Friendly professional mechanic ready to assist Atlanta drivers"
              width="600"
              height="400"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-sm">
              <p className="text-xs text-neutral-400 uppercase font-semibold">Vetted & Certified</p>
              <p className="text-sm font-bold text-white">Local Atlanta Automotive Technicians</p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Principles & Standards</h2>
            <p className="text-neutral-400 text-sm mt-2">
              The foundational pillars that guide every repair and customer interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-600/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atlanta Service Area Breakdown */}
        <div className="p-8 sm:p-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              Active Coverage Area
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Serving Drivers Across Greater Atlanta
            </h2>
            <p className="text-neutral-300 text-sm mt-2 leading-relaxed">
              Our mobile units operate throughout Fulton, DeKalb, Cobb, and Gwinnett counties. If your vehicle is parked at your home, office, or stranded roadside within our service perimeter, our team is ready to respond.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {serviceAreas.map((area, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300 bg-neutral-950/80 px-3 py-2 rounded border border-neutral-800">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center bg-gradient-to-r from-purple-950/50 via-neutral-900 to-purple-950/50 p-10 rounded-2xl border border-purple-800/40">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Need a Reliable Mechanic Today?</h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Submit your vehicle information and receive upfront, transparent repair guidance from our Atlanta team.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/#request-form"
              className="px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-950/60 inline-flex items-center gap-2"
            >
              Book Mobile Service
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm transition-colors border border-neutral-700"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
