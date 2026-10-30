import React, { useState } from 'react';
import { submitServiceRequest } from '../lib/api.js';
import { Wrench, CheckCircle, AlertCircle, Loader2, MapPin, Car, Phone, Mail, User } from 'lucide-react';

export default function ServiceRequestForm({ preselectedIssue = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    issue: preselectedIssue || "Car Won't Start",
    address: '',
    notes: ''
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.issue.trim()) {
      setStatus({ state: 'error', message: 'Please provide your name, phone number, email, and vehicle issue.' });
      return;
    }

    const res = await submitServiceRequest(formData);
    if (res.ok) {
      setStatus({
        state: 'success',
        message: "Your service request has been received! A Quick Mechs Atlanta technician will review your vehicle details and call or text you shortly with your dispatch window."
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        vehicle_year: '',
        vehicle_make: '',
        vehicle_model: '',
        issue: "Car Won't Start",
        address: '',
        notes: ''
      });
    } else {
      setStatus({
        state: 'error',
        message: res.data?.error || 'Unable to submit your service request right now. Please try again or call us.'
      });
    }
  };

  return (
    <section id="request-form" className="py-20 bg-gray-50 relative border-b border-gray-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-gray-300" />
            <span>Fast Mobile Dispatch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Request a Mobile Mechanic or Get an Upfront Quote
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Serving everyday drivers and fleet managers in Atlanta. Provide your vehicle details below and we will confirm an on-demand technician for you.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-gray-100">
          {status.state === 'success' ? (
            <div className="text-center py-10 px-4">
              <div className="h-16 w-16 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-900 mx-auto mb-6 shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Request Dispatched Successfully!
              </h3>
              <p className="text-gray-600 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                {status.message}
              </p>
              <button
                onClick={() => setStatus({ state: 'idle', message: '' })}
                className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-sm transition-colors shadow-md"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.state === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{status.message}</span>
                </div>
              )}

              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-1">
                  1. Contact Information
                </h4>
                <p className="text-xs text-gray-500">
                  Where should our technician reach you with arrival times and job status?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Miller"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(404) 555-0123"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 pt-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-1">
                  2. Vehicle Information
                </h4>
                <p className="text-xs text-gray-500">
                  Details ensure our mobile mechanic arrives with matching diagnostics and parts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    placeholder="e.g. 2019"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Make
                  </label>
                  <input
                    type="text"
                    name="vehicle_make"
                    value={formData.vehicle_make}
                    onChange={handleChange}
                    placeholder="e.g. Toyota, Ford, BMW"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    placeholder="e.g. Camry, F-150, 330i"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 pt-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-1">
                  3. Service & Location
                </h4>
                <p className="text-xs text-gray-500">
                  Select the main symptom or repair requirement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Primary Issue / Service Needed *
                  </label>
                  <select
                    name="issue"
                    required
                    value={formData.issue}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  >
                    <option value="Car Won't Start">Car Won't Start (No-Start / Cranking)</option>
                    <option value="Dead Battery">Dead Battery / Replacement</option>
                    <option value="Brake Replacement">Brake Pads & Rotors Replacement</option>
                    <option value="Check Engine Light">Check Engine Light Diagnostics</option>
                    <option value="Overheated Engine">Overheated Engine / Radiator Issue</option>
                    <option value="Starter / Alternator">Starter or Alternator Repair</option>
                    <option value="Flat Tire / Roadside">Flat Tire / Emergency Roadside</option>
                    <option value="General Maintenance / Oil">Mobile Oil Change & Multi-Point Inspection</option>
                    <option value="Small Fleet Maintenance">Small Fleet Scheduled Service</option>
                    <option value="Other">Other Repair Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Service Address or Atlanta Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Driveway or parking lot address (e.g. Midtown Atlanta)"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Symptom Notes & Repair History
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell us any sounds, warning lights, or when the problem started..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.state === 'loading'}
                className="w-full py-4 px-6 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status.state === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span>Submit Service Request</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  No upfront payment required to submit a quote request. An Atlanta certified technician will confirm parts and time estimate with you directly.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}