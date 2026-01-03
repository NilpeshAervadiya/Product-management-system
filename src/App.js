import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import TopBar from "./components/TopBar";
import ProductList from "./components/ProductList";
import AddProductFormView from "./components/AddProductFormView";

function App() {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setProductCount(data.length);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    setProductCount((prevCount) => prevCount + 1);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
    setProductCount((prevCount) => Math.max(0, prevCount - 1));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              borderRadius: "8px",
              padding: "12px 16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
          }}
        />
        <TopBar productCount={productCount} />

        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                products={products}
                setProducts={setProducts}
                onProductCountChange={setProductCount}
                onDeleteProduct={handleDeleteProduct}
              />
            }
          />
          <Route
            path="/add-product"
            element={
              <AddProductFormView
                onAddProduct={handleAddProduct}
                products={products}
              />
            }
          />
          <Route
            path="/edit-product"
            element={
              <AddProductFormView
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                products={products}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
