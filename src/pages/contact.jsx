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
    <div className="bg-white text-gray-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gray-900 text-xs font-bold uppercase tracking-widest bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full shadow-sm">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4">
            We\'re Here to Help Atlanta Drivers
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
            Have a question regarding service availability, custom repairs, or fleet maintenance? Send us a message or reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Shop & Dispatch Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Quick Mechs dispatches mobile mechanics across the Atlanta metropolitan area directly to your home, workplace, or roadside.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Service Headquarters</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">Atlanta, Georgia</p>
                    <p className="text-xs text-gray-500 mt-0.5">Fulton, DeKalb, Cobb & Gwinnett Counties</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Dispatch Hours</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">Monday – Saturday: 7:30 AM – 7:00 PM</p>
                    <p className="text-xs text-gray-500 mt-0.5">Sunday: Emergency Roadside by Appointment</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Online Support</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">support@quickmechs.local</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900">Need immediate on-demand repair?</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                For faster technician dispatch and upfront pricing, use our direct repair booking form on the homepage.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-200 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-sm text-gray-600 mb-8">
                Fill out the form below and our customer support coordinators will follow up promptly.
              </p>

              {status.type && (
                <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Michael Miller"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:border-gray-900 focus:outline-none text-gray-900 text-sm placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:border-gray-900 focus:outline-none text-gray-900 text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(404) 555-0199"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:border-gray-900 focus:outline-none text-gray-900 text-sm placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Inquiry or question"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:border-gray-900 focus:outline-none text-gray-900 text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist you with your vehicle or fleet?"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:border-gray-900 focus:outline-none text-gray-900 text-sm placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-gray-200"
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