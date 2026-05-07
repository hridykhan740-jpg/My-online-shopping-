import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Flame, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = 15; 

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="bg-red-600 text-white rounded-none font-bold text-[10px] uppercase px-1.5 h-5 flex items-center gap-1 border-none">
            <Flame className="h-3 w-3 fill-white" /> HOT
          </Badge>
          <Badge className="bg-red-500 text-white rounded-none font-bold text-[10px] px-1.5 h-5 border-none">
            -{discount}%
          </Badge>
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full shadow-lg bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full shadow-lg bg-white" onClick={() => navigate(`/product/${product.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur-sm">
          <Button 
            className="w-full bg-primary hover:bg-black text-white rounded-none font-bold text-[10px] h-9"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </Button>
          <Button 
            className="w-full bg-black hover:bg-primary text-white rounded-none font-bold text-[10px] h-9"
            onClick={handleBuyNow}
          >
            BUY NOW
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">{product.category}</p>
        <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors text-sm">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-primary font-bold text-lg">৳{product.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground line-through">৳{(product.price * 1.2).toLocaleString()}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-primary"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
