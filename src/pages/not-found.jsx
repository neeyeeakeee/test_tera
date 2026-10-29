import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center bg-white">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 mb-6 shadow-sm">
          <Wrench className="w-8 h-8 rotate-45" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Page Off The Radar</h2>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          The page you are looking for has been relocated or doesn't exist. Let's get you back on the road.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-lg shadow-purple-200 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-all border border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}