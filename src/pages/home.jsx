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
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section with Interactive Slider */}
      <HeroSlider />

      {/* Trust Badges Bar */}
      <section className="border-y border-gray-200 bg-gray-50/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5 p-5 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 shadow-sm transition-colors">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 shrink-0 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.text}</p>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-purple-600" />
            Full-Service Mobile Workshop
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Classic Auto Shop Expertise, Brought to Your Doorstep
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
            Skip traditional repair shop wait times and expensive towing bills. Our Atlanta mechanics come to your home, office, or roadside with professional-grade diagnostics and quality replacement parts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold text-sm transition-all shadow-sm"
          >
            View All Maintenance & Repair Services
            <ArrowRight className="w-4 h-4 text-purple-600" />
          </Link>
        </div>
      </section>

      {/* How Quick Mechs Works (Uber for Auto Repair) */}
      <HowItWorks />

      {/* Classic Auto Shop Advantage vs Traditional Shops */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Car className="w-3.5 h-3.5 text-purple-600" />
                Transparent & Honest Auto Care
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Why Atlanta Drivers Choose Quick Mechs Over Dealerships
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
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
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="#request-form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all shadow-lg shadow-purple-200"
                >
                  Request a Mechanic
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm transition-colors border border-gray-300"
                >
                  Our Story & Guarantee
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-2xl">
                <img
                  src="/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg"
                  alt="Mechanic checking car engine in Atlanta workshop"
                  width="640"
                  height="420"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Local Atlanta Guarantee</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">12-Month / 12,000-Mile Warranty on Parts & Labor</p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-purple-600 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Atlanta Driver Reviews */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Local Customer Feedback</h2>
          <p className="text-gray-600 text-sm mt-3">
            Hear what Atlanta drivers have to say about our fast on-site repair visits and upfront pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between hover:border-purple-300 shadow-sm hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">"{rev.comment}"</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{rev.name}</p>
                  <p className="text-xs text-gray-500">{rev.neighborhood}</p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md shadow-sm">
                  Verified Service
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Service Request & Quote Section */}
      <div id="request-form">
        <ServiceRequestForm />
      </div>
    </div>
  );
}