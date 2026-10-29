import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-purple-400 mb-6">
          <Wrench className="w-8 h-8 rotate-45" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-semibold text-neutral-200 mb-3">Page Off The Radar</h2>
        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          The page you are looking for has been relocated or doesn't exist. Let's get you back on the road.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}