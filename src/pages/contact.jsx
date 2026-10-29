import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactMessage } from '../lib/api.js';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await submitContactMessage(formData);
      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent to our dispatch team. We will get back to you shortly.'
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: res.data?.error || 'Failed to submit message. Please try again.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'A network error occurred. Please try again or reach out directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest bg-purple-950/60 border border-purple-800/40 px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            We\'re Here to Help Atlanta Drivers
          </h1>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed">
            Have a question regarding service availability, custom repairs, or fleet maintenance? Send us a message or reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
              <h2 className="text-xl font-bold text-white">Shop & Dispatch Information</h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Quick Mechs dispatches mobile mechanics across the Atlanta metropolitan area directly to your home, workplace, or roadside.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-950/80 border border-purple-800/40 text-purple-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-semibold">Service Headquarters</p>
                    <p className="text-sm font-medium text-neutral-200 mt-0.5">Atlanta, Georgia</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Fulton, DeKalb, Cobb & Gwinnett Counties</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-950/80 border border-purple-800/40 text-purple-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-semibold">Dispatch Hours</p>
                    <p className="text-sm font-medium text-neutral-200 mt-0.5">Monday – Saturday: 7:30 AM – 7:00 PM</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Sunday: Emergency Roadside by Appointment</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-950/80 border border-purple-800/40 text-purple-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-semibold">Online Support</p>
                    <p className="text-sm font-medium text-neutral-200 mt-0.5">support@quickmechs.local</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <h3 className="text-sm font-bold text-purple-300">Need immediate on-demand repair?</h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                For faster technician dispatch and upfront pricing, use our direct repair booking form on the homepage.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-sm text-neutral-400 mb-8">
                Fill out the form below and our customer support coordinators will follow up promptly.
              </p>

              {status.type && (
                <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 border ${
                  status.type === 'success' 
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' 
                    : 'bg-rose-950/60 border-rose-800 text-rose-200'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Michael Miller"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(404) 555-0199"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Inquiry or question"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist you with your vehicle or fleet?"
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-950/60"
                >
                  {loading ? 'Sending Message...' : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
