import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { db, doc, getDoc, handleFirestoreError, OperationType, collection, addDoc, query, where, getDocs, orderBy } from "@/lib/firebase";
import { Review } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const q = query(collection(db, "reviews"), where("productId", "==", id), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(items);
    } catch (e) {
      console.error("Error fetching reviews:", e);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const prodRef = doc(db, "products", id);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          setProduct({ id: prodSnap.id, ...prodSnap.data() } as Product);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }
    if (!newReview.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData: Review = {
        productId: id!,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL,
        rating,
        comment: newReview,
        createdAt: Date.now(),
      };
      await addDoc(collection(db, "reviews"), reviewData);
      setNewReview("");
      setRating(5);
      toast.success("Review added successfully!");
      fetchReviews();
    } catch (e) {
      toast.error("Failed to add review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <div className="container mx-auto p-20 text-center animate-pulse">Loading product details...</div>;
  if (!product) return <div className="container mx-auto p-20 text-center uppercase tracking-widest text-muted-foreground">Product Not Found</div>;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Button 
        variant="ghost" 
        className="mb-8 pl-0 hover:bg-transparent hover:text-accent"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to shopping
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex flex-col">
          <div className="space-y-4">
            <Badge className="bg-accent/10 border-accent/20 text-accent font-medium rounded-full cursor-default uppercase">
              {product.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-primary">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">৳{product.price.toLocaleString()}</p>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-grow bg-primary hover:bg-black text-white rounded-full h-14 text-lg font-semibold"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full h-14 px-8 border-primary/20 hover:bg-black hover:text-white transition-colors text-lg font-semibold"
              onClick={() => {
                addToCart(product);
                navigate("/checkout");
              }}
            >
              Buy Now
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs">
                <p className="font-bold">Free Delivery</p>
                <p className="text-muted-foreground">Orders over ৳2000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs">
                <p className="font-bold">Easy Returns</p>
                <p className="text-muted-foreground">30 days return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs">
                <p className="font-bold">Secure Payment</p>
                <p className="text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Customer Reviews ({reviews.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-fit sticky top-24 space-y-4">
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
              <h3 className="font-bold mb-4">Add a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-6 w-6 cursor-pointer transition-colors ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Textarea 
                    placeholder="Write your review here..." 
                    className="rounded-xl resize-none"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                  <Button 
                    className="w-full rounded-xl" 
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">Please sign in to leave a review.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={review.userPhoto || "https://ui-avatars.com/api/?name=" + review.userName} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-sm">{review.userName}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-3 w-3 ${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
