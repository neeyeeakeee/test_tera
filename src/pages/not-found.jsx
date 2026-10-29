import { Link } from 'react-router-dom';
import { Wrench, ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-slate-50">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-200">
          <Wrench className="w-10 h-10 -rotate-45" />
        </div>
        
        <h1 className="text-7xl font-black text-slate-900 tracking-tight mb-2 font-mono">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Off-Road Detour: Page Not Found</h2>
        <p className="text-slate-600 mb-8 text-sm sm:text-base">
          The auto part, category, or order link you are looking for has been moved or doesn't exist in our workshop catalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm transition-colors"
          >
            <Search className="w-4 h-4" /> Search Auto Parts
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
