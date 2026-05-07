import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  Trash2,
  Edit,
  TrendingUp,
  CreditCard,
  PackageCheck,
  Menu,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, handleFirestoreError, OperationType } from "@/lib/firebase";
import { Product, Order } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      
      const orderSnap = await getDocs(collection(db, "orders"));
      const ordersData = orderSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      setOrders(ordersData.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Fetch error:", error);
      handleFirestoreError(error, OperationType.LIST, "admin_data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProd = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      category: formData.get('category') as string,
      image: (formData.get('image') as string) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      description: (formData.get('description') as string) || "Product added via Admin Panel",
      createdAt: Date.now()
    };

    try {
      await addDoc(collection(db, "products"), newProd);
      toast.success("Product added successfully!");
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "products");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedProd = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      category: formData.get('category') as string,
    };

    try {
      await updateDoc(doc(db, "products", id), updatedProd);
      toast.success("Product updated successfully!");
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  const NavItems = () => (
    <nav className="p-4 space-y-2">
      <Button 
        variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
        className="w-full justify-start gap-3 rounded-lg"
        onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
      >
        <LayoutDashboard className="h-4 w-4" />
        Overview
      </Button>
      <Button 
        variant={activeTab === 'products' ? 'secondary' : 'ghost'} 
        className="w-full justify-start gap-3 rounded-lg"
        onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
      >
        <Package className="h-4 w-4" />
        Products
      </Button>
      <Button 
        variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
        className="w-full justify-start gap-3 rounded-lg"
        onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
      >
        <ShoppingBag className="h-4 w-4" />
        Orders
      </Button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 border-r bg-background hidden lg:block">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-xl tracking-tight text-primary">HOSSAIN ADMIN</span>
        </div>
        <NavItems />
      </aside>

      <main className="flex-grow p-4 md:p-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="text-xl font-bold">HOSSAIN ADMIN</SheetTitle>
                </SheetHeader>
                <NavItems />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl font-bold font-display capitalize flex items-center gap-2">
                {activeTab}
              </h1>
              <p className="text-sm text-muted-foreground">Manage your store resources effectively.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {activeTab === 'products' && (
              <Dialog>
                <DialogTrigger render={
                  <Button className="rounded-full bg-primary hover:bg-primary/90 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    New Product
                  </Button>
                } />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4 py-4" onSubmit={handleAddProduct}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label>Product Name</Label>
                        <Input name="name" placeholder="E.g. Wireless Mouse" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (৳)</Label>
                        <Input name="price" type="number" placeholder="1000" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input name="stock" type="number" placeholder="50" required />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Category</Label>
                        <Input name="category" placeholder="Electronics" required />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Image URL (Optional)</Label>
                        <Input name="image" placeholder="https://..." />
                      </div>
                    </div>
                    <Button type="submit" className="w-full rounded-full">Save Product</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={`৳${totalRevenue.toLocaleString()}`} change="+12.5%" icon={<CreditCard className="h-5 w-5" />} />
              <StatCard title="Total Orders" value={orders.length.toString()} change="+18.2%" icon={<ShoppingBag className="h-5 w-5" />} />
              <StatCard title="Products" value={products.length.toString()} icon={<Package className="h-5 w-5" />} change="" />
              <StatCard title="Pending Orders" value={orders.filter(o => o.status === 'pending').length.toString()} change="-5%" icon={<PackageCheck className="h-5 w-5" />} />
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img src={item.image} className="h-10 w-10 rounded object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                    <TableCell>৳{item.price.toLocaleString()}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger render={
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          } />
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4 py-4" onSubmit={(e) => handleUpdateProduct(e, item.id)}>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Product Name</Label>
                                  <Input name="name" defaultValue={item.name} required />
                                </div>
                                <div className="space-y-2">
                                  <Label>Price (৳)</Label>
                                  <Input name="price" type="number" defaultValue={item.price} required />
                                </div>
                                <div className="space-y-2">
                                  <Label>Stock</Label>
                                  <Input name="stock" type="number" defaultValue={item.stock} required />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Category</Label>
                                  <Input name="category" defaultValue={item.category} required />
                                </div>
                              </div>
                              <Button type="submit" className="w-full rounded-full">Update Product</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProduct(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs max-w-[100px] truncate">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customerName || order.customerEmail}</TableCell>
                    <TableCell>
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        'bg-blue-100 text-blue-700 hover:bg-blue-100'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>৳{order.total.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger render={
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        } />
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-8 py-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-1">Customer Info</h4>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-1">Shipping Address</h4>
                                <p className="text-sm">{order.shippingAddress}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-1">Payment</h4>
                                <Badge variant="outline" className="capitalize">{order.paymentMethod}</Badge>
                                <Badge variant="outline" className="ml-2 capitalize">{order.paymentStatus}</Badge>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-1">Items</h4>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-sm py-2 border-b last:border-0">
                                    <span>{item.product.name} x{item.quantity}</span>
                                    <span>৳{(item.product.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>৳{order.total.toLocaleString()}</span>
                              </div>
                              
                              <div className="pt-4 space-y-2">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Update Status</h4>
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'processing')}>Processing</Button>
                                  <Button size="sm" variant="outline" className="bg-green-50 text-green-700 border-green-200" onClick={() => updateOrderStatus(order.id, 'delivered')}>Delivered</Button>
                                  <Button size="sm" variant="outline" className="bg-red-50 text-red-700 border-red-200" onClick={() => updateOrderStatus(order.id, 'cancelled')}>Cancel</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1 text-green-600 font-medium tracking-tight">
            {change} <span className="text-muted-foreground font-normal">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
