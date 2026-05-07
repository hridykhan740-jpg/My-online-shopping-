import { useState } from "react";
import { ShoppingCart, User, Search, Menu, LogOut, LayoutDashboard, X, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 py-2 md:py-4 space-y-4">
        {/* Top Row: Menu, Logo, Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              } />
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="text-xl font-bold font-display tracking-tight text-primary">
                    HOSSAIN ONLINE SHOP
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-4 space-y-4">
                  <a href="/" className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors group">
                    <span className="font-medium">Home</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/products" className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors group">
                    <span className="font-medium">Products</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/categories" className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors group">
                    <span className="font-medium">Categories</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </a>
                  {user?.isAdmin && (
                    <a href="/admin" className="flex items-center justify-between p-2 bg-primary/5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <span className="font-bold flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </span>
                    </a>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <a href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <img src="/input_file_0.png" alt="Logo" className="h-8 w-8 rounded-full border border-primary/20 object-cover" />
            <span className="text-xl md:text-2xl font-black font-display tracking-tighter text-black uppercase">
              HOSSAIN<span className="text-primary">SHOP</span>
            </span>
          </a>

          <div className="flex items-center gap-1 md:gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary">{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                } />
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="px-2 py-1.5 font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => loginWithGoogle()}
                className="h-10 w-10 text-gray-600"
              >
                <User className="h-6 w-6" />
              </Button>
            )}

            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 p-0 text-gray-600">
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white p-0">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </CartDrawer>
          </div>
        </div>

        {/* Bottom Row: Search Bar */}
        <div className="relative max-w-2xl mx-auto w-full pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search products..." 
              className="w-full pl-12 pr-4 h-11 bg-gray-100 border-none rounded-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
