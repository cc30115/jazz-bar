import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const state = location.state as {
    show: any;
    area: any;
    dateRange: { start: number | null, end: number | null };
  } | null;

  useEffect(() => {
    if (!state || !state.show || !state.area) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state || !state.show || !state.area) return null;

  const { show, area, dateRange } = state;

  // Parse price strings to numbers for calculation
  const showPriceNum = parseInt(show.price.replace(/[^0-9]/g, '')) || 0;
  const areaPriceNum = parseInt(area.price.replace(/[^0-9]/g, '')) || 0;
  
  // Calculate total
  let multiplier = 1;
  if (area.fixed) {
    multiplier = parseInt(area.fixed.replace(/[^0-9]/g, '')) || 1;
  }
  
  const subtotal = (showPriceNum + areaPriceNum) * multiplier;
  const tax = Math.floor(subtotal * 0.1); // 10% tax
  const total = subtotal + tax;

  const formatPrice = (num: number) => `¥ ${num.toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a booking reference
    const bookingRef = `YORU-${Date.now().toString(36).toUpperCase()}`;
    const eventDate = `2026.${show.month.toString().padStart(2, '0')}.${(dateRange.start || show.date).toString().padStart(2, '0')}`;

    // If user is logged in, persist the ticket to Supabase
    if (user) {
      const { error } = await supabase
        .from('user_tickets')
        .insert({
          user_id: user.id,
          event_title: show.title,
          event_date: eventDate,
          event_time: show.time,
          event_genre: show.genre || null,
          event_image: show.img || null,
          seating_area: area.name,
          guest_count: multiplier,
          total_price: total,
          booking_ref: bookingRef,
          status: 'confirmed',
        });

      if (error) {
        console.error('Failed to save ticket:', error.message);
        // Still proceed — payment is "done", ticket just failed to save
      }
    }

    // Simulate payment delay then redirect
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Booking confirmed! Reference: ${bookingRef}\n\nWe look forward to seeing you at YORU.`);
      navigate(user ? '/profile' : '/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans selection:bg-gold-400/30 selection:text-gold-400">
      <div className="noise-overlay"></div>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-gold-400/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-cream/60 hover:text-gold-400 transition-colors flex items-center text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="font-logo text-2xl tracking-widest text-gold-400 uppercase">YORU</div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream tracking-wider uppercase mb-4">Complete Your Booking</h1>
          <p className="text-gold-400 font-sans tracking-[0.2em] text-sm md:text-base">結帳與確認</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Guest Details */}
              <section>
                <h2 className="font-serif text-xl text-gold-400 tracking-widest uppercase mb-6 flex items-center border-b border-gold-400/20 pb-3">
                  <User className="w-5 h-5 mr-3" /> Guest Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">First Name *</label>
                    <input required type="text" className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">Last Name *</label>
                    <input required type="text" className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                      <input required type="email" className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream pl-12 pr-4 py-3 outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                      <input required type="tel" className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream pl-12 pr-4 py-3 outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">Special Requests (Optional)</label>
                    <textarea rows={3} className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors resize-none"></textarea>
                  </div>
                </div>
              </section>

              {/* Payment Details */}
              <section>
                <h2 className="font-serif text-xl text-gold-400 tracking-widest uppercase mb-6 flex items-center border-b border-gold-400/20 pb-3">
                  <CreditCard className="w-5 h-5 mr-3" /> Payment Method
                </h2>
                <div className="bg-darker border border-cream/10 p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">Card Number *</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-dark border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors font-mono tracking-widest" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-cream/60">Expiry Date *</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-dark border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors font-mono tracking-widest" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-cream/60">CVC *</label>
                      <input required type="text" placeholder="123" className="w-full bg-dark border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors font-mono tracking-widest" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-cream/60">Name on Card *</label>
                    <input required type="text" className="w-full bg-dark border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors uppercase" />
                  </div>
                </div>
                
                <div className="mt-6 flex items-start space-x-3 text-cream/50 text-xs tracking-wider leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0" />
                  <p>Your payment information is encrypted and secure. By confirming this booking, you agree to our cancellation policy and terms of service.</p>
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gold-400 text-dark py-5 font-serif text-lg tracking-[0.2em] uppercase hover:bg-gold-300 transition-colors shadow-[0_0_20px_rgba(255,177,98,0.2)] hover:shadow-[0_0_30px_rgba(255,177,98,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <div className="sticky top-32 bg-darker border border-gold-400/20 p-8 shadow-2xl">
              <h3 className="font-serif text-2xl text-cream tracking-widest uppercase mb-8 text-center border-b border-cream/10 pb-6">Order Summary</h3>
              
              <div className="mb-8">
                <img src={show.img} alt={show.title} className="w-full h-48 object-cover mb-6 border border-cream/10 grayscale hover:grayscale-0 transition-all duration-700" />
                <h4 className="font-serif text-xl text-gold-400 mb-2">{show.title}</h4>
                <span className="text-[10px] uppercase tracking-widest text-cream/50 border border-cream/20 px-2 py-1 rounded-sm inline-block mb-4">{show.genre}</span>
                
                <div className="space-y-3 font-sans text-sm tracking-wider text-cream/80">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-3 mt-0.5 text-gold-400/70" />
                    <span>2026.{show.month.toString().padStart(2, '0')}.{dateRange.start || show.date}</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mr-3 mt-0.5 text-gold-400/70" />
                    <span>{show.time} (Open 1 hour prior)</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gold-400/70" />
                    <span>YORU Tokyo, Ginza 8-Chome</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-cream/10 pt-6 mb-6">
                <h5 className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-4">Seating Details</h5>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-serif text-cream tracking-wider">{area.name}</span>
                  <span className="font-sans text-cream/70">{area.desc}</span>
                </div>
                <div className="text-gold-400 text-sm font-sans tracking-wider text-right">
                  {area.fixed ? area.fixed : `${multiplier} Guest(s)`}
                </div>
              </div>

              <div className="border-t border-cream/10 pt-6 space-y-4 font-sans text-sm tracking-wider">
                <div className="flex justify-between text-cream/70">
                  <span>Performance Ticket</span>
                  <span>{formatPrice(showPriceNum)}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span>Seating Charge</span>
                  <span>{formatPrice(areaPriceNum)}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-cream/50">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gold-400/30 mt-6 pt-6 flex justify-between items-end">
                <span className="font-serif text-cream uppercase tracking-widest">Total</span>
                <span className="font-serif text-3xl text-gold-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
