import React from "react";
import { BsArrowLeft, BsPlus } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

const TopBar = ({ productCount }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAddProductPage = location.pathname === "/add-product";
  const isEditProductPage = location.pathname === "/edit-product";
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 py-2 md:py-3">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-3 min-w-0 flex-1"
          >
            {/* Company Logo Icon */}
            <div className="bg-gray-800 rounded-lg p-1.5 md:p-2 flex-shrink-0">
              <svg
                className="w-4 h-4 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-gray-900 mb-0.5 leading-tight">
                {isAddProductPage
                  ? "Add New Product"
                  : isEditProductPage
                  ? "Edit Product"
                  : "Product Management"}
              </h1>
              {isHomePage && (
                <p className="text-gray-500 text-[10px] md:text-xs">
                  {productCount} products available
                </p>
              )}
              {isAddProductPage && (
                <p className="text-gray-500 text-[10px] md:text-xs">
                  Fill in the details to create a new product
                </p>
              )}
              {isEditProductPage && (
                <p className="text-gray-500 text-[10px] md:text-xs">
                  Update the product details
                </p>
              )}
            </div>
          </Link>
          {isAddProductPage || isEditProductPage ? (
            <Link
              to="/"
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs md:text-sm font-medium shadow-sm flex-shrink-0"
            >
              {/* Use react-icons/bs ArrowLeft */}
              <BsArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Back to Products</span>
              <span className="sm:hidden">Back</span>
            </Link>
          ) : (
            <Link
              to="/add-product"
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs md:text-sm font-medium shadow-sm flex-shrink-0"
            >
              {/* Use react-icons/bs Plus */}
              <BsPlus className="w-3.5 h-3.5 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
