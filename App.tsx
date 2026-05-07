import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/home/Hero";
import { ProductCard } from "./components/home/ProductCard";
import { Product } from "./types";
import { Toaster } from "@/components/ui/sonner";
import { ProductDetails } from "./pages/ProductDetails";
import { Checkout } from "./pages/Checkout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PaymentSimulation } from "./pages/PaymentSimulation";
import { db, collection, getDocs, setDoc, doc } from "@/lib/firebase";

const MOCK_PRODUCTS: Product[] = [
  // ... (keeping them here as fallback/seed source)
  {
    id: "1",
    name: "Classic Leather Backpack",
    description: "Our Classic Leather Backpack is designed for the modern professional.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    stock: 12,
    createdAt: Date.now()
  },
  {
    id: "2",
    name: "Noise Cancelling Headphones",
    description: "Experience pure sound without distractions.",
    price: 12500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    category: "Electronics",
    stock: 5,
    createdAt: Date.now()
  },
  {
    id: "3",
    name: "Minimalist Quartz Watch",
    description: "Simplicity meets elegance.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    stock: 20,
    createdAt: Date.now()
  },
  {
    id: "4",
    name: "Cotton Comfort T-Shirt",
    description: "The perfect basic for every wardrobe.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    category: "Apparel",
    stock: 50,
    createdAt: Date.now()
  }
];

import { CategoryProducts } from "./pages/CategoryProducts";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (items.length === 0) {
          setProducts(MOCK_PRODUCTS);
          MOCK_PRODUCTS.forEach(async (p) => {
            try { await setDoc(doc(db, "products", p.id), p); } catch (e) {}
          });
        } else {
          setProducts(items);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by category
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="bg-white">
      <Hero />
      <section className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-primary">📦</span>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Product Categories</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square rounded-sm bg-gray-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map(category => {
              const categoryProduct = products.find(p => p.category === category);
              return (
                <div key={category} className="group flex flex-col gap-3">
                  <Link to={`/category/${category}`} className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm border border-gray-100 group-hover:border-primary transition-all">
                    {categoryProduct && (
                      <img 
                        src={categoryProduct.image} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={category}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">{category}</span>
                    </div>
                  </Link>
                  <Link to={`/category/${category}`} className="text-center bg-gray-50 hover:bg-primary hover:text-white py-2 text-xs font-bold transition-colors border border-gray-100 flex items-center justify-center gap-1">
                    মোর <span className="text-[10px]">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Recommended for You</h2>
            <Link to="/products" className="text-sm font-bold text-primary">All Products</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {products.slice(0, 5).map(p => (
               <Link key={p.id} to={`/product/${p.id}`}>
                 <ProductCard product={p} />
               </Link>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:category" element={<CategoryProducts />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment-simulation/bkash" element={<PaymentSimulation />} />
            <Route path="/payment-simulation/nagad" element={<PaymentSimulation />} />
            <Route path="/products" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}
