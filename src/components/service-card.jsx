import React from 'react';
import { Check, ArrowRight, Wrench } from 'lucide-react';

export default function ServiceCard({
  title,
  subtitle,
  description,
  badge,
  features = [],
  image,
  imageAlt,
  icon: IconComponent = Wrench,
  onSelect
}) {
  return (
    <div className="bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-600/60 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40 group">
      {image && (
        <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
          <img
            src={image}
            alt={imageAlt || title}
            width="1200"
            height="800"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
          {badge && (
            <div className="absolute top-3 left-3 bg-purple-950/90 text-purple-300 border border-purple-700/50 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
              {badge}
            </div>
          )}
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-purple-950/70 border border-purple-800/50 flex items-center justify-center text-purple-400 flex-shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-purple-400 font-medium">{subtitle}</p>
              )}
            </div>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {features.length > 0 && (
            <ul className="space-y-2 mb-6 pt-2 border-t border-zinc-800/80">
              {features.map((item, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-800/60">
          <a
            href="#request-form"
            onClick={() => onSelect && onSelect(title)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-purple-600 text-zinc-200 hover:text-white font-semibold text-xs tracking-wide uppercase transition-colors duration-200"
          >
            <span>Book This Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}