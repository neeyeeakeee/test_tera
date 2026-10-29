import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Wrench,
  Star,
  Clock,
  ArrowLeft,
  PackageCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import RatingStars from '../components/rating-stars.jsx';
import { useCart } from '../lib/cart-context.jsx';
import { useAuth } from '../lib/auth-context.jsx';
import { api } from '../lib/api.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          api.get(`/api/products/${id}`),
          api.get(`/api/reviews?productId=${id}`)
        ]);

        if (prodRes.ok && prodRes.data?.product) {
          setProduct(prodRes.data.product);
        }
        if (revRes.ok && Array.isArray(revRes.data?.reviews)) {
          setReviews(revRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewMessage(null);

    const nameToSubmit = user?.name || reviewerName.trim();
    if (!nameToSubmit) {
      setReviewError('Please enter your name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setReviewError('Please write a review comment (minimum 5 characters).');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/api/reviews', {
        product_id: parseInt(id, 10),
        rating: Number(rating),
        comment: comment.trim(),
        user_name: nameToSubmit
      });

      if (res.ok && res.data?.review) {
        setReviews([res.data.review, ...reviews]);
        setComment('');
        setReviewMessage('Your review has been published!');
      } else {
        setReviewError(res.data?.error || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError('Network error while posting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 font-medium">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          Loading auto part specifications...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center bg-slate-900 rounded-3xl p-10 border border-purple-900/40 shadow-sm">
          <AlertCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white">Auto Part Not Found</h1>
          <p className="text-slate-300 text-sm mt-2">
            The requested item may have been moved or removed from our current inventory.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isPreOrder = product.stock <= 0;
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Parts Catalog
          </Link>
        </div>

        {/* Product Details Card */}
        <div className="bg-slate-900 rounded-3xl border border-purple-900/40 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Image Box */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-950 border border-purple-900/40 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image_url || '/assets/mechanic-checking-car-engine-in-a-clean-garage-kwey.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  width="640"
                  height="480"
                />
                <span
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    isPreOrder
                      ? 'bg-purple-950 text-purple-300 border border-purple-700'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  {isPreOrder ? 'Available for Pre-Order' : `In Stock: ${product.stock} units`}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-purple-900/40 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>OEM Verified Quality</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-purple-900/40 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Atlanta Warehouse Dispatch</span>
                </div>
              </div>
            </div>

            {/* Info & Buying Box */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                  <span>Category: {product.category}</span>
                  {product.part_number && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">Part #{product.part_number}</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {product.name}
                </h1>

                {/* Rating display */}
                <div className="flex items-center gap-2 mt-3">
                  <RatingStars rating={Number(avgRating) || 5} size="w-4 h-4" />
                  <span className="text-sm font-bold text-white">
                    {avgRating ? `${avgRating} / 5.0` : 'No reviews yet'}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-purple-900/40 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Upfront transparent price (Taxes calculated at checkout)
                  </span>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Component Overview
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Vehicle Fitment Note */}
                {product.vehicle_fitment && (
                  <div className="mt-6 p-4 rounded-xl bg-purple-950/40 border border-purple-800/40">
                    <div className="flex items-start gap-2.5">
                      <Wrench className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                          Verified Vehicle Compatibility
                        </div>
                        <p className="text-xs text-purple-300 mt-1 font-medium">
                          {product.vehicle_fitment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Controls */}
              <div className="mt-8 pt-6 border-t border-purple-950">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center border border-purple-900/50 rounded-xl bg-slate-950 p-1 shrink-0 w-32 justify-between">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-white px-2">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-3.5 rounded-xl shadow-md transition duration-150 flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isPreOrder ? 'Pre-Order This Part' : 'Add To Cart'}
                  </button>
                </div>

                {addedToast && (
                  <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Item added to your cart!
                    </span>
                    <Link to="/cart" className="underline font-bold text-emerald-200 hover:text-white">
                      View Cart
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-slate-900 rounded-3xl border border-purple-900/40 shadow-sm p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-purple-950">
              <div>
                <h2 className="text-2xl font-black text-white">Customer Reviews</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real feedback from drivers and mechanics who installed this part.
                </p>
              </div>
              {avgRating && (
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-purple-900/40">
                  <span className="text-2xl font-black text-white">{avgRating}</span>
                  <div>
                    <RatingStars rating={Number(avgRating)} size="w-3.5 h-3.5" />
                    <span className="text-[11px] text-slate-400 font-medium">
                      Based on {reviews.length} reviews
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="my-8 p-6 bg-slate-950 rounded-2xl border border-purple-900/40">
              <h3 className="text-base font-bold text-white mb-1">Leave a Product Review</h3>
              <p className="text-xs text-slate-400 mb-4">
                Share your installation experience and product performance.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {!user && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus T."
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-purple-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-slate-900 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-slate-600 hover:text-purple-400 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'text-purple-400 fill-purple-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-2">
                      {rating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    rows="3"
                    placeholder="How was the fitment? Did the item arrive as described?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-purple-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-slate-900 text-white"
                  />
                </div>

                {reviewError && (
                  <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl font-medium">
                    {reviewError}
                  </div>
                )}

                {reviewMessage && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl font-medium">
                    {reviewMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingReview ? 'Posting Review...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl border border-purple-950 bg-slate-950 hover:border-purple-900/60 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {rev.user_name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <RatingStars rating={rev.rating} size="w-3.5 h-3.5" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No reviews yet for this vehicle part. Be the first to review it!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
