import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BsInfoCircle,
  BsStar,
  BsImage,
  BsCheck2,
  BsArrowRepeat,
} from "react-icons/bs";

const AddProductFormView = ({
  onAddProduct,
  onUpdateProduct,
  products = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editProduct = location.state?.product;
  const isEditMode = !!editProduct;

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rating: {
      rate: "",
      count: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Initialize form with product data if editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title || "",
        price: editProduct.price?.toString() || "",
        description: editProduct.description || "",
        category: editProduct.category || "",
        image: editProduct.image || "",
        rating: {
          rate: editProduct.rating?.rate?.toString() || "",
          count: editProduct.rating?.count?.toString() || "",
        },
      });
    }
  }, [editProduct]);

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rate" || name === "count") {
      setFormData({
        ...formData,
        rating: {
          ...formData.rating,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const compressImage = (
    file,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
  ) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }

      try {
        // Compress and resize image (max 600x600, quality 0.6 for smaller file size)
        const compressedImage = await compressImage(file, 600, 600, 0.6);

        // Check if compressed image is still too large (max 500KB for base64)
        const base64Size = compressedImage.length * 0.75; // Approximate size in bytes
        if (base64Size > 500 * 1024) {
          // Compress more aggressively
          const moreCompressed = await compressImage(file, 500, 500, 0.5);
          setFormData({
            ...formData,
            image: moreCompressed,
          });
        } else {
          setFormData({
            ...formData,
            image: compressedImage,
          });
        }

        if (errors.image) {
          setErrors({ ...errors, image: "" });
        }
      } catch (error) {
        console.error("Error compressing image:", error);
        setErrors({
          ...errors,
          image: "Failed to process image. Please try again.",
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image) newErrors.image = "Please select an image";
    if (
      !formData.rating.rate ||
      parseFloat(formData.rating.rate) < 0 ||
      parseFloat(formData.rating.rate) > 5
    )
      newErrors.rate = "Rating must be between 0 and 5";
    if (!formData.rating.count || parseInt(formData.rating.count) < 0)
      newErrors.count = "Count must be a positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (validate()) {
      setIsSubmitting(true);

      try {
        if (isEditMode) {
          // Edit mode - update locally
          const updatedProduct = {
            ...editProduct,
            title: formData.title,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            image: formData.image,
            rating: {
              rate: parseFloat(formData.rating.rate),
              count: parseInt(formData.rating.count),
            },
          };

          if (onUpdateProduct) {
            onUpdateProduct(updatedProduct);
          }

          // Show success toast
          toast.success("Product updated successfully!");

          // Navigate back to dashboard
          navigate("/");
          setIsSubmitting(false);
        } else {
          // Add mode - use API
          const productData = {
            title: formData.title,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            image: formData.image,
            rating: {
              rate: parseFloat(formData.rating.rate),
              count: parseInt(formData.rating.count),
            },
          };

          const response = await fetch("https://fakestoreapi.com/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          });

          if (!response.ok) {
            throw new Error("Failed to add product");
          }

          const createdProduct = await response.json();

          // Generate a unique ID to avoid duplicate IDs
          // Check existing product IDs and generate a unique one
          const existingIds = products
            .map((p) => p.id)
            .filter((id) => typeof id === "number");
          const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;

          // Use timestamp + random number to ensure uniqueness
          // If API returns an ID that already exists, generate a new one
          let uniqueId = createdProduct.id;
          if (!uniqueId || existingIds.includes(uniqueId)) {
            // Generate unique ID: timestamp + random number
            uniqueId = Date.now() + Math.floor(Math.random() * 1000);
            // Ensure it's higher than max existing ID
            if (uniqueId <= maxId) {
              uniqueId = maxId + 1 + Math.floor(Math.random() * 1000);
            }
          }

          // Ensure rating is included (API might not return it)
          const productWithRating = {
            ...createdProduct,
            id: uniqueId,
            rating: {
              rate: parseFloat(formData.rating.rate),
              count: parseInt(formData.rating.count),
            },
          };

          // Call the onAddProduct callback with the created product
          onAddProduct(productWithRating);

          // Show success toast
          toast.success("Product created successfully!");

          // Reset form
          handleReset();

          // Navigate back to dashboard
          navigate("/");
        }
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "adding"} product:`,
          error
        );
        setSubmitError(
          `Failed to ${
            isEditMode ? "update" : "add"
          } product. Please try again.`
        );
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
      rating: {
        rate: "",
        count: "",
      },
    });
    setErrors({});
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="bg-gray-50  pb-24">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Information Sections */}
              <div className="lg:col-span-2 space-y-4">
                {/* Basic Information Box */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BsInfoCircle className="w-4 h-4 text-gray-600" />
                      Basic Information
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className=" text-xs font-medium text-gray-700 mb-1">
                        Product Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 text-gray-900 ${
                          errors.title
                            ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 bg-white"
                        }`}
                        placeholder="Enter product title"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 text-gray-900 ${
                              errors.price
                                ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 bg-white"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 appearance-none bg-white cursor-pointer text-gray-900 ${
                            errors.category
                              ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-2.5 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 resize-none text-gray-900 ${
                          errors.description
                            ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 bg-white"
                        }`}
                        placeholder="Enter product description"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-0.5">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating Information Box */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BsStar className="w-4 h-4 text-gray-600" />
                      Rating & Reviews
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Rating <span className="text-red-500">*</span>
                          <span className="text-xs font-normal text-gray-500 ml-2">
                            (0-5)
                          </span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                          <input
                            type="number"
                            name="rate"
                            value={formData.rating.rate}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="5"
                            className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 text-gray-900 ${
                              errors.rate
                                ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 bg-white"
                            }`}
                            placeholder="4.5"
                          />
                        </div>
                        {errors.rate && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.rate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Review Count <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="count"
                          value={formData.rating.count}
                          onChange={handleChange}
                          min="0"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 text-gray-900 ${
                            errors.count
                              ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 bg-white"
                          }`}
                          placeholder="100"
                        />
                        {errors.count && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.count}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Section Box */}
              <div className="lg:col-span-1">
                {/* Product Image Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BsImage className="w-4 h-4 text-gray-600" />
                      Product Image
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Upload Image <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-0.5 focus:ring-gray-700 focus:border-gray-700 text-gray-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer ${
                          errors.image
                            ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        JPG, PNG, GIF, WEBP (Max 5MB)
                      </p>
                      {errors.image && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.image}
                        </p>
                      )}
                    </div>

                    {formData.image && (
                      <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="max-w-full max-h-64 object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Bar - Bottom Fixed */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
              <div className="w-full max-w-7xl rounded-t-lg bg-white border border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      disabled={isSubmitting}
                      className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="px-5 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto px-5 py-2 text-sm bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <BsArrowRepeat className="w-4 h-4 animate-spin" />
                          <span>
                            {isEditMode ? "Updating..." : "Adding..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <BsCheck2 className="w-4 h-4" />
                          <span>
                            {isEditMode ? "Update Product" : "Add Product"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Error Message */}
            {submitError && (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2"></div>
                <div className="lg:col-span-1">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-xs flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {submitError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductFormView;
