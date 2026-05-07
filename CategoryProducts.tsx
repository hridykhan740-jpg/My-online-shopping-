import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "@/types";
import { db, collection, getDocs, query, where } from "@/lib/firebase";
import { ProductCard } from "@/components/home/ProductCard";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CategoryProducts() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "products"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col gap-6 mb-10">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-1">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tighter">
            {category} <span className="text-primary italic">Collection</span>
          </h1>
          <p className="text-muted-foreground">Showing all products in {category}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-[4/5] rounded-sm bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found in this category.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
}
