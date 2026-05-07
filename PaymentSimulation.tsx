import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Landmark } from "lucide-react";
import { motion } from "motion/react";

export function PaymentSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success'>('pending');
  const type = window.location.pathname.includes('bkash') ? 'bKash' : 'Nagad';

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ${type === 'bKash' ? 'bg-[#E2136E] text-white' : 'bg-[#F15922] text-white'}`}>
        <Landmark className="h-12 w-12" />
      </div>
      
      <div className="space-y-4 max-w-md">
        <h1 className="text-3xl font-bold font-display tracking-tight">
          {type} Payment Portal
        </h1>
        
        {status === 'pending' ? (
          <div className="space-y-6">
            <p className="text-muted-foreground italic">Verifying your transaction with {type} gateway...</p>
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl">
              <CheckCircle2 className="h-6 w-6" />
              <span>Payment Verified!</span>
            </div>
            <p className="text-muted-foreground">
              Your payment has been successfully processed. You will be redirected shortly.
            </p>
            <Button size="lg" className="rounded-full px-12" onClick={() => navigate('/checkout?success=true')}>
              Complete Checkout
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
