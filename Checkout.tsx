import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Truck, Landmark, Wallet, CheckCircle2, QrCode, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { db, addDoc, collection, handleFirestoreError, OperationType } from "@/lib/firebase";

export function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket' | 'upay'>('cod');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const SHIPPING_COST = deliveryArea === 'dhaka' ? 100 : 170;
  const TOTAL_WITH_SHIPPING = total + SHIPPING_COST;
  const PAYMENT_NUMBER = "+8801604485328";

  const saveOrder = async (orderData: any) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: Date.now(),
        status: 'pending',
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
        transactionId: orderData.transactionId || null,
        deliveryArea: orderData.deliveryArea,
        shippingCost: orderData.shippingCost,
        totalWithShipping: orderData.totalWithShipping
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "orders");
      throw error;
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!transactionId) {
      toast.error(paymentMethod === 'cod' ? "Please enter Transaction ID for Delivery Charge" : "Please enter your Transaction ID");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
      userId: user?.uid,
      items: cart,
      total,
      shippingCost: SHIPPING_COST,
      totalWithShipping: TOTAL_WITH_SHIPPING,
      paymentMethod,
      deliveryArea,
      customerName: formData.get('name'),
      customerEmail: formData.get('email'),
      customerPhone: formData.get('phone'),
      transactionId,
    };
    
    toast.loading('Processing your order...');
    try {
      const id = await saveOrder(orderData);
      setOrderId(id);
      setIsOrdered(true);
      clearCart();
      toast.dismiss();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to place order');
    }
  };

  if (isOrdered) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-display">Thank You!</h1>
          <p className="text-xl text-muted-foreground">Your order has been placed successfully.</p>
          <p className="font-mono text-sm bg-muted rounded-md px-3 py-1 inline-block">Order ID: {orderId}</p>
        </div>
        <p className="max-w-md mx-auto text-muted-foreground">
          Your order is being processed. We will contact you at your provided phone number soon.
        </p>
        <Button size="lg" className="rounded-full px-8" onClick={() => navigate("/")}>
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold font-display mb-10">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input name="name" id="name" placeholder="John Doe" defaultValue={user?.displayName} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input name="email" id="email" type="email" placeholder="john@example.com" defaultValue={user?.email} required className="rounded-xl" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="deliveryArea">Delivery Area</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${deliveryArea === 'dhaka' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setDeliveryArea('dhaka')}
                  >
                    <span className="font-bold text-sm block">Inside Dhaka</span>
                    <span className="text-xs text-muted-foreground">Charge: ৳100</span>
                  </div>
                  <div 
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${deliveryArea === 'outside' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => setDeliveryArea('outside')}
                  >
                    <span className="font-bold text-sm block">Outside Dhaka</span>
                    <span className="text-xs text-muted-foreground">Charge: ৳170</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input name="address" id="address" placeholder="House, Road, Area, District" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input name="phone" id="phone" placeholder="01XXX XXXXXX" required className="rounded-xl" />
              </div>
            </form>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </h2>

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-sm font-medium">
                ⚠️ Cash on Delivery এর ক্ষেত্রে ডেলিভারি চার্জ (Inside Dhaka ৳100 / Outside ৳170) অগ্রিম পেমেন্ট করতে হবে।
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { id: 'cod', label: 'Cash on Delivery', icon: Wallet, color: 'text-gray-600' },
                { id: 'bkash', label: 'bKash', icon: Smartphone, color: 'text-[#E2136E]' },
                { id: 'nagad', label: 'Nagad', icon: Smartphone, color: 'text-[#F15922]' },
                { id: 'rocket', label: 'Rocket', icon: Smartphone, color: 'text-[#8C3494]' },
                { id: 'upay', label: 'Upay', icon: Smartphone, color: 'text-[#FFCC00]' },
              ].map((method) => (
                <div 
                  key={method.id}
                  className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setPaymentMethod(method.id as any)}
                >
                  <method.icon className={`h-6 w-6 ${method.color}`} />
                  <span className="text-xs font-bold">{method.label}</span>
                </div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  {paymentMethod === 'cod' ? `Pay Delivery Charge (৳${SHIPPING_COST})` : `Pay Full Amount (৳${TOTAL_WITH_SHIPPING.toLocaleString()})`}
                </h3>
                <ol className="text-sm list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Open your {paymentMethod === 'cod' ? 'Payment' : paymentMethod.toUpperCase()} app.</li>
                  <li>Enter Number: <span className="font-bold text-primary">{PAYMENT_NUMBER}</span></li>
                  <li>Amount: <span className="font-bold text-primary">৳{paymentMethod === 'cod' ? SHIPPING_COST : TOTAL_WITH_SHIPPING.toLocaleString()}</span></li>
                  <li>Enter Transaction ID from the message below.</li>
                </ol>
              </div>
              <div className="space-y-2">
                <Label htmlFor="txid">Transaction ID</Label>
                <Input 
                  id="txid" 
                  placeholder="Enter 10-digit ID here" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="rounded-xl border-primary/30"
                  required
                />
              </div>
            </motion.div>
          </section>
        </div>

        <div>
          <Card className="rounded-3xl border-none shadow-xl bg-primary text-white overflow-hidden">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-white/70">{item.quantity}x {item.name}</span>
                    <span className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Shipping ({deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span>৳{SHIPPING_COST.toLocaleString()}</span>
                </div>
                <Separator className="bg-white/10 my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>৳{TOTAL_WITH_SHIPPING.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-full h-14 text-lg font-bold"
              >
                Place Order
              </Button>
              <p className="text-center text-xs text-white/50">
                Secure SSL Encrypted Checkout
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
