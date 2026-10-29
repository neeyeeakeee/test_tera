import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, totalReviews = null, size = 16, showScore = false }) {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center text-purple-400" aria-label={`Rating: ${numericRating} out of 5 stars`}>
        {stars.map((starIndex) => {
          const filled = numericRating >= starIndex;
          const half = !filled && numericRating >= starIndex - 0.5;
          return (
            <span key={starIndex} className="relative inline-block">
              <Star
                size={size}
                className={filled ? 'fill-purple-500 text-purple-500' : 'text-slate-700'}
              />
              {half && (
                <span className="absolute inset-0 overflow-hidden w-1/2 text-purple-400">
                  <Star size={size} className="fill-purple-500 text-purple-500" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-slate-200 ml-0.5">
          {numericRating.toFixed(1)}
        </span>
      )}
      {totalReviews !== null && (
        <span className="text-xs text-slate-400">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
