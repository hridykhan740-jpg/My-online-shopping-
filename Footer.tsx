import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <img src="/input_file_0.png" alt="Logo" className="h-10 w-10 rounded-full border border-white/20 object-cover" />
            <h2 className="text-2xl font-black font-display tracking-tighter uppercase">
              HOSSAIN<span className="text-accent">SHOP</span>
            </h2>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Discover a curated collection of premium products. We bring quality and style to your doorstep with every order.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/1AyvSXryyG/" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5 text-white/60 hover:text-accent cursor-pointer transition-colors" />
            </a>
            <a href="https://www.instagram.com/ali_8khan?igsh=N2FxZnVuZjR3ZWZ1" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 text-white/60 hover:text-accent cursor-pointer transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/hridy-khan-52b5243b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5 text-white/60 hover:text-accent cursor-pointer transition-colors" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li><a href="/products" className="hover:text-accent transition-colors">All Products</a></li>
            <li><a href="/categories" className="hover:text-accent transition-colors">Categories</a></li>
            <li><a href="/deals" className="hover:text-accent transition-colors">Exclusive Deals</a></li>
            <li><a href="/tracking" className="hover:text-accent transition-colors">Track Order</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Customer Service</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li><a href="/help" className="hover:text-accent transition-colors">Help Center</a></li>
            <li><a href="/shipping" className="hover:text-accent transition-colors">Shipping Info</a></li>
            <li><a href="/returns" className="hover:text-accent transition-colors">Returns & Exchanges</a></li>
            <li><a href="/contact" className="hover:text-accent transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6">Contact Info</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4" />
              <span>+8801604485328</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>hridykhan740@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center gap-4 text-xs text-white/40">
        <p>© 2024 HOSSAIN ONLINE SHOP. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
