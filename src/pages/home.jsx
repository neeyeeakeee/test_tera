import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, MapPin, CheckCircle2, Star, Car, ArrowRight, Zap, PhoneCall } from 'lucide-react';
import HeroSlider from '../components/hero-slider.jsx';
import ServiceCard from '../components/service-card.jsx';
import HowItWorks from '../components/how-it-works.jsx';
import ServiceRequestForm from '../components/service-request-form.jsx';

export default function HomePage() {
  const services = [
    {
      id: 'diagnostics',
      title: 'Mobile Diagnostics & Troubleshooting',
      description: 'Check engine light on or car won\'t start? Our certified technicians come directly to your driveway with high-end diagnostic gear.',
      image: '/assets/mobile-mechanic-doing-diagnostic-test-on-car-5kup.svg',
      badge: 'Most Requested',
      features: ['OBD-II error scans', 'No-start troubleshooting', 'Comprehensive multi-point check']
    },
    {
      id: 'brakes',
      title: 'Brake Pad & Rotor Replacement',
      description: 'Squeaking, grinding, or soft pedals? Get premium ceramic pads and fresh rotors replaced on-site without losing a full day at the shop.',
      image: '/assets/mechanic-changing-brake-pads-on-a-vehicle-wny3.svg',
      badge: 'Essential Safety',
      features: ['Front & rear brake sets', 'Rotor replacement & resurfacing', 'Brake fluid level inspection']
    },
    {
      id: 'battery',
      title: 'Battery, Alternator & Starter',
      description: 'Stranded in your office parking lot or garage? Fast mobile battery testing and on-the-spot replacement across the Atlanta metro.',
      image: '/assets/mechanic-replacing-car-battery-outdoors-1424.svg',
      badge: 'Fast Response',
      features: ['12V battery test & replacement', 'Alternator load output check', 'Starter motor diagnostics']
    },
    {
      id: 'engine',
      title: 'Engine & Cooling System Repairs',
      description: 'Overheated engines, radiator leaks, serpentine belt replacements, and spark plug renewals handled directly where your car is parked.',
      image: '/assets/car-engine-repair-on-the-road-hpfr.svg',
      badge: 'Certified Pros',
      features: ['Cooling system pressure tests', 'Belt & hose swap', 'Spark plugs & ignition coils']
    }
  ];

  const trustPoints = [
    {
      icon: ShieldCheck,
      title: 'Vetted Master Mechanics',
      text: 'Every technician is rigorously screened, background-checked, and equipped with professional workshop-grade tools.'
    },
    {
      icon: Clock,
      title: 'Upfront Pricing Guarantee',
      text: 'No hidden shop supplies fees or arbitrary dealer markups. You know the exact cost before work starts.'
    },
    {
      icon: Zap,
      title: 'Uber-Style Convenience',
      text: 'Skip the tow truck and boring waiting rooms. We dispatch certified mobile repair directly to your location in Atlanta.'
    },
    {
      icon: MapPin,
      title: 'Serving Greater Atlanta',
      text: 'Covering Downtown, Midtown, Buckhead, Decatur, Sandy Springs, Marietta, Alpharetta, and surrounding communities.'
    }
  ];

  const reviews = [
    {
      name: 'Marcus Vance',
      neighborhood: 'Midtown Atlanta',
      rating: 5,
      comment: 'Car died in my apartment parking deck. Quick Mechs sent a tech who diagnosed a dead alternator and swapped it out right there. Saved me hundreds on a tow truck.'
    },
    {
      name: 'Elena Rostova',
      neighborhood: 'Buckhead',
      rating: 5,
      comment: 'Replaced my brake pads and rotors while I worked from home. The upfront estimate was exactly what I paid. Professional, clean, and zero hassle.'
    },
    {
      name: 'David Jenkins',
      neighborhood: 'Sandy Springs',
      rating: 5,
      comment: 'Feels like Uber for auto mechanics. Transparent, polite technician, and excellent communication throughout. Highly recommend for any busy professional.'
    }
  ];

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      {/* Hero Section with Interactive Slider */}
      <HeroSlider />

      {/* Trust Badges Bar */}
      <section className="border-y border-neutral-800 bg-neutral-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900/40 border border-neutral-800/80 hover:border-purple-500/40 transition-colors">
                  <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-100">{item.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/50 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5 text-purple-400" />
            Full-Service Mobile Workshop
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Classic Auto Shop Expertise, Brought to Your Doorstep
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed">
            Skip traditional repair shop wait times and expensive towing bills. Our Atlanta mechanics come to your home, office, or roadside with professional-grade diagnostics and quality replacement parts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-900 border border-neutral-700 hover:border-purple-500 text-white font-medium text-sm transition-all hover:bg-neutral-800"
          >
            View All Maintenance & Repair Services
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
        </div>
      </section>

      {/* How Quick Mechs Works (Uber for Auto Repair) */}
      <HowItWorks />

      {/* Classic Auto Shop Advantage vs Traditional Shops */}
      <section className="py-20 bg-neutral-900/40 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/50 text-purple-300 text-xs font-semibold uppercase tracking-wider">
                <Car className="w-3.5 h-3.5 text-purple-400" />
                Transparent & Honest Auto Care
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Why Atlanta Drivers Choose Quick Mechs Over Dealerships
              </h2>
              <p className="text-neutral-300 text-base leading-relaxed">
                Traditional repair facilities often hit drivers with unexpected diagnostic fees, high markups, and days without transportation. We built Quick Mechs to deliver genuine master craftsmanship with modern on-demand transparency.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  'No towing required—our mobile service trucks come to you fully equipped.',
                  'Direct communication with the certified mechanic working on your vehicle.',
                  'Upfront quotes with explicit itemized breakdowns before any wrench turns.',
                  'Coverage across Atlanta for both personal vehicles and light commercial fleets.'
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="#request-form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-900/40"
                >
                  Request a Mechanic
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm transition-colors border border-neutral-700"
                >
                  Our Story & Guarantee
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <img
                  src="/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg"
                  alt="Mechanic checking car engine in Atlanta workshop"
                  width="640"
                  height="420"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Local Atlanta Guarantee</p>
                    <p className="text-sm font-bold text-white mt-0.5">12-Month / 12,000-Mile Warranty on Parts & Labor</p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-purple-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Atlanta Driver Reviews */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Local Customer Feedback</h2>
          <p className="text-neutral-400 text-sm mt-3">
            Hear what Atlanta drivers have to say about our fast on-site repair visits and upfront pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-purple-600/40 transition-colors">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed italic">"{rev.comment}"</p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{rev.name}</p>
                  <p className="text-xs text-neutral-400">{rev.neighborhood}</p>
                </div>
                <span className="text-xs font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                  Verified Service
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Service Request & Quote Section */}
      <section id="request-form" className="py-20 bg-neutral-900/80 border-t border-neutral-800 relative scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/50 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              Book Mobile Service
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Request a Mechanic or Upfront Quote
            </h2>
            <p className="mt-2 text-neutral-300 text-sm sm:text-base">
              Tell us what is happening with your car and where you are located in Atlanta. We will reach out quickly with transparent pricing.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            <ServiceRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
