import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-blue-100 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-blue-600">Filter by Category</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md"
            }`}
          >
            {category === "all" ? "✨ All Products" : category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
