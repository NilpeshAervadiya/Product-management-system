import React from "react";

const ProductDetailModal = ({ product, modalId }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id={`half-modal-${product.id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-modal-${product.id})`}
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 md:w-5 md:h-5 text-gray-200 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-4xl bg-white p-4 md:p-8 relative z-50">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 md:right-4 md:top-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs md:text-base">
            ✕
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3 md:p-6">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-48 md:max-h-96 object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-3 md:space-y-5">
            {/* Category Badge */}
            <div>
              <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white border border-gray-200 text-gray-900 text-xs md:text-sm font-medium rounded-full">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-0.5 md:gap-1">
                {renderStars(product.rating?.rate || 0)}
              </div>
              <span className="text-base md:text-lg font-semibold text-gray-700">
                {product.rating?.rate?.toFixed(1) || "0.0"}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm md:text-base text-gray-600">
                {product.rating?.count || 0} reviews
              </span>
            </div>

            {/* Price */}
            <div className="pt-1">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>

            {/* Description */}
            <div className="pt-3 md:pt-4 border-t border-gray-200">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                Description
              </h4>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/70">
        <button aria-label="Close modal">close</button>
      </form>
    </dialog>
  );
};

export default ProductDetailModal;
