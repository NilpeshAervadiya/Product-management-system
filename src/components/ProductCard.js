import React from "react";
import { useNavigate } from "react-router-dom";
import ProductDetailModal from "./ProductDetailModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { PiNotePencil } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";

const ProductCard = ({ product, onDeleteProduct }) => {
  const navigate = useNavigate();
  const modalId = `product_modal_${product.id}`;
  const deleteModalId = `delete_modal_${product.id}`;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    document.getElementById(deleteModalId).showModal();
  };

  const handleConfirmDelete = () => {
    if (onDeleteProduct) {
      onDeleteProduct(product.id);
    }
    document.getElementById(deleteModalId).close();
  };

  const handleCancelDelete = () => {
    document.getElementById(deleteModalId).close();
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-3.5 h-3.5 text-yellow-400 fill-current"
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
          className="w-3.5 h-3.5 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id={`half-${product.id}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${product.id})`}
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
          className="w-3.5 h-3.5 text-gray-200 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer">
        {/* Product Image */}
        <div
          className="relative bg-gray-50 h-48 overflow-hidden"
          onClick={() => document.getElementById(modalId).showModal()}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* Category Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating?.rate || 0)}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating?.rate?.toFixed(1) || "0.0"}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {product.rating?.count || 0} reviews
            </span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* View Details Button */}
              <button
                className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById(modalId).showModal();
                }}
                title="View Details"
              >
                <MdOutlineRemoveRedEye className="w-4 h-4" />
              </button>

              {/* Edit Button */}
              <button
                className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/edit-product", { state: { product } });
                }}
                title="Edit Product"
              >
                <PiNotePencil className="w-4 h-4" />
              </button>

              {/* Delete Button */}
              <button
                className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                onClick={handleDeleteClick}
                title="Delete Product"
              >
                <RiDeleteBinLine className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal product={product} modalId={modalId} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        modalId={deleteModalId}
        productTitle={product.title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ProductCard;
