import { useState, useEffect, useRef, useCallback } from "react";
import CategoryPanel from "./CategoryPanel";
import ProductGrid from "./ProductGrid";

const ProductList = ({
  products,
  setProducts,
  onProductCountChange,
  onDeleteProduct,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const itemsPerLoad = 12;

  // Track when products are initially loaded
  useEffect(() => {
    if (products.length > 0 && !productsLoaded) {
      setProductsLoaded(true);
    }
  }, [products.length, productsLoaded]);

  // Filter products by category and search
  useEffect(() => {
    const filterProducts = async () => {
      if (selectedCategory === "all") {
        let filtered = products;

        // Apply search filter
        if (searchQuery.trim()) {
          setHasSearched(true);
          filtered = filtered.filter(
            (product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        } else if (productsLoaded) {
          // Products have been loaded, user can see empty state if needed
          setHasSearched(true);
        } else {
          // Still loading initial products
          setHasSearched(false);
        }

        setFilteredProducts(filtered);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://fakestoreapi.com/products/category/${selectedCategory}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch filtered products");
        }
        const data = await response.json();

        // Get API product IDs to avoid duplicates
        const apiProductIds = new Set(data.map((p) => p.id));

        // Filter local products that match the category and are not in API response
        // (these are newly added products)
        const localProducts = products.filter(
          (p) => p.category === selectedCategory && !apiProductIds.has(p.id)
        );

        // Merge API products with local products
        let filtered = [...data, ...localProducts];

        // Apply search filter
        if (searchQuery.trim()) {
          setHasSearched(true);
          filtered = filtered.filter(
            (product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        } else {
          // Category selected but no search - user has filtered
          setHasSearched(true);
        }

        setFilteredProducts(filtered);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching filtered products:", err);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [selectedCategory, products, searchQuery]);

  // Update product count in parent
  useEffect(() => {
    if (onProductCountChange) {
      onProductCountChange(filteredProducts.length);
    }
  }, [filteredProducts.length, onProductCountChange]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setDisplayCount(itemsPerLoad); // Reset display count when category changes
  };

  // Reset display count when search query changes
  useEffect(() => {
    setDisplayCount(itemsPerLoad);
  }, [searchQuery]);

  // Get products to display based on displayCount
  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  // Load more products
  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate slight delay for smooth UX
      setTimeout(() => {
        setDisplayCount((prev) => prev + itemsPerLoad);
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMore, isLoadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isLoadingMore
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, isLoadingMore, loadMore]);

  const categories = [
    "all",
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  return (
    <>
      <CategoryPanel
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-6 py-8">
        <ProductGrid
          products={displayedProducts}
          loading={loading}
          error={error}
          onDeleteProduct={onDeleteProduct}
          hasSearched={hasSearched}
        />

        {/* Infinite Scroll Observer */}
        {!loading && !error && hasMore && (
          <div
            ref={observerTarget}
            className="h-10 flex justify-center items-center mt-8"
          >
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600"></div>
                <span className="text-sm">Loading more products...</span>
              </div>
            )}
          </div>
        )}

        {/* End of list indicator */}
        {!loading && !error && !hasMore && filteredProducts.length > 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            You've reached the end of the list
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
