import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";

const BANNERS = [
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    badge: "MEGA SALE",
    title: <>সুরক্ষিত <br className="hidden md:block" /> অনলাইন শপিং</>,
    subtitle: "Premium quality guaranteed"
  },
  {
    image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop",
    badge: "NEW ARRIVAL",
    title: <>লেটেস্ট <br className="hidden md:block" /> ইলেকট্রনিক্স হাব</>,
    subtitle: "Explore high-tech gadgets"
  },
  {
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
    badge: "EXCLUSIVE",
    title: <>বিশ্বস্ত <br className="hidden md:block" /> কাস্টমার সাপোর্ট</>,
    subtitle: "24/7 Dedicated assistance"
  }
];

export function Hero() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-4 md:py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Large Banner */}
          <div className="lg:col-span-8 relative h-[300px] md:h-[500px] rounded-sm overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img 
                  src={BANNERS[currentBanner].image} 
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Main Banner"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white space-y-2 md:space-y-4">
                  <Badge className="bg-red-600 text-white rounded-none">{BANNERS[currentBanner].badge}</Badge>
                  <h2 className="text-3xl md:text-5xl font-black font-display leading-tight uppercase">
                    {BANNERS[currentBanner].title}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base hidden md:block">{BANNERS[currentBanner].subtitle}</p>
                  <Button size="lg" className="rounded-none bg-primary hover:bg-black text-white px-8">
                    SHOP NOW
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots navigation */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {BANNERS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1.5 rounded-full transition-all ${currentBanner === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          </div>

          {/* Side Small Table/List with pop-up/scrolling effect */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm h-full">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">Trending Now</h3>
              <div className="space-y-4 max-h-[350px] md:max-h-[420px] overflow-hidden relative">
                <motion.div 
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="space-y-4"
                >
                  {[
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1584006682522-d17d215caeb0?q=80&w=200&auto=format&fit=crop",
                    // Double for seamless scrolling
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1584006682522-d17d215caeb0?q=80&w=200&auto=format&fit=crop",
                  ].map((url, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 bg-white p-2 border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      <img src={url} className="w-16 h-16 object-cover bg-gray-50" />
                      <div>
                        <p className="text-xs font-bold line-clamp-1">Premium Product {i + 1}</p>
                        <p className="text-primary font-bold text-sm">৳1,200</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
           <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-12 bg-blue-400 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Solar & green energy</h2>
              <div className="h-[2px] w-12 bg-blue-400 rounded-full" />
           </div>
           <p className="text-muted-foreground text-sm">Products from <span className="text-blue-500 font-medium">solar & wind energy</span> and its subcategories.</p>
        </div>
      </div>
    </section>
  );
}
