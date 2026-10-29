import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../lib/cart-context.jsx';
import RatingStars from './rating-stars.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80';
  const displayImage = product.image_url || fallbackImage;

  return (
    <div className="group flex flex-col bg-slate-900 rounded-2xl border border-purple-900/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-600">
      {/* Product Image Box */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full bg-slate-950 aspect-[4/3] overflow-hidden"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-slate-950/90 text-purple-300 shadow-sm backdrop-blur-sm border border-purple-800/50">
            {product.category || 'Auto Part'}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-purple-950 text-purple-300 border border-purple-700 shadow-sm">
              Pre-Order
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-purple-800 text-white shadow-sm">
              Only {product.stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-600 text-white shadow-sm">
              In Stock ({product.stock})
            </span>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {product.part_number && (
          <p className="text-[11px] font-mono text-purple-400 mb-1">
            PART #{product.part_number}
          </p>
        )}

        <Link to={`/product/${product.id}`} className="group-hover:text-purple-400 transition-colors">
          <h3 className="font-bold text-white line-clamp-2 text-base leading-snug mb-1.5">
            {product.name}
          </h3>
        </Link>

        {product.vehicle_fitment && (
          <p className="text-xs text-slate-400 line-clamp-1 mb-2">
            Fitment: {product.vehicle_fitment}
          </p>
        )}

        {/* Rating */}
        <div className="mb-3">
          <RatingStars
            rating={product.avg_rating || 5}
            totalReviews={product.review_count !== undefined ? product.review_count : null}
            size={14}
            showScore={true}
          />
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Pricing and Cart Button */}
        <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block leading-tight font-medium">Price</span>
            <span className="text-lg sm:text-xl font-black text-white">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={added}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-900/40'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Pre-Order</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
