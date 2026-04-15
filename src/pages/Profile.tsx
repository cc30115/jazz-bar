import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Ticket, Heart, Crown, Settings, LogOut, 
  Calendar, Clock, MapPin, QrCode, Play
} from 'lucide-react';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// ── Guest Landing (not logged in) ──────────────────────────
function GuestProfileLanding() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openLogin = () => { setAuthMode('login'); setShowAuth(true); };
  const openSignup = () => { setAuthMode('signup'); setShowAuth(true); };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans selection:bg-gold-400/30 selection:text-gold-400">
      <div className="noise-overlay"></div>

      <header className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-gold-400/20">
        <div className="max-w-[90rem] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-cream/60 hover:text-gold-400 transition-colors flex items-center text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="font-logo text-2xl tracking-widest text-gold-400 uppercase">YORU</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 flex items-center justify-center min-h-[80vh] relative z-10">
        <div className="text-center max-w-lg">
          {/* Decorative icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 border border-gold-400/20 rounded-full mb-8">
            <User className="w-10 h-10 text-gold-400/60" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-cream tracking-wider uppercase mb-4">
            Your YORU Account
          </h1>
          <p className="text-cream/40 font-sans tracking-wider text-sm mb-4">
            アカウントにログイン
          </p>
          <p className="text-cream/60 font-sans tracking-wider text-sm leading-relaxed mb-12 max-w-md mx-auto">
            Sign in to view your tickets, saved performances, membership status, and personal settings.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openLogin}
              className="bg-gold-400 text-dark px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase hover:bg-gold-300 transition-all shadow-[0_0_20px_rgba(255,177,98,0.15)]"
            >
              Sign In
            </button>
            <button
              onClick={openSignup}
              className="border border-gold-400/40 text-gold-400 px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase hover:bg-gold-400/10 transition-all"
            >
              Create Account
            </button>
          </div>

          {/* Perks preview */}
          <div className="mt-16 pt-12 border-t border-cream/10">
            <p className="text-cream/40 text-xs tracking-[0.2em] uppercase mb-8 font-sans">Member Benefits</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Ticket, label: 'Digital Tickets', desc: 'Your bookings in one place' },
                { icon: Heart, label: 'Save Events', desc: 'Curate your lineup' },
                { icon: Crown, label: 'Rewards', desc: 'Earn points, unlock perks' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="w-6 h-6 text-gold-400/60 mx-auto mb-3" />
                  <p className="text-cream text-sm tracking-wider mb-1">{item.label}</p>
                  <p className="text-cream/40 text-xs tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
    </div>
  );
}

// ── Ticket type ─────────────────────────────────────────────
interface UserTicket {
  id: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_genre: string | null;
  event_image: string | null;
  seating_area: string;
  guest_count: number;
  total_price: number;
  booking_ref: string;
  status: string;
  created_at: string;
}

interface SavedEvent {
  id: string;
  event_id: string;
  created_at: string;
  events?: {
    id: string;
    title: string;
    genre: string;
    hero_image: string;
    date: number;
    month: number;
  };
}

// ── Authenticated Profile ───────────────────────────────────
function AuthenticatedProfile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      
      // Fetch tickets
      const { data: ticketData } = await supabase
        .from('user_tickets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (ticketData) setTickets(ticketData);

      // Fetch saved events
      const { data: favData } = await supabase
        .from('user_favorites')
        .select('*, events(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (favData) setSavedEvents(favData);

      setLoadingData(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Guest';
  const memberSince = profile?.member_since ? new Date(profile.member_since).getFullYear().toString() : new Date().getFullYear().toString();
  const tierLabel = profile?.tier ? profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1) + ' Patron' : 'Bronze Patron';

  const tabs = [
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'saved', label: 'Saved Events', icon: Heart },
    { id: 'membership', label: 'Membership', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark text-cream font-sans selection:bg-gold-400/30 selection:text-gold-400">
      <div className="noise-overlay"></div>
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-gold-400/20">
        <div className="max-w-[90rem] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-cream/60 hover:text-gold-400 transition-colors flex items-center text-sm uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="font-logo text-2xl tracking-widest text-gold-400 uppercase">YORU</div>
          <button onClick={handleSignOut} className="text-cream/60 hover:text-gold-400 transition-colors flex items-center text-sm uppercase tracking-widest">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-[90rem] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 lg:pr-8">
            <div className="mb-12">
              <h1 className="font-serif text-3xl text-cream tracking-wider mb-2">{displayName}</h1>
              <div className="flex items-center text-gold-400 text-sm tracking-widest uppercase mb-4">
                <Crown className="w-4 h-4 mr-2" /> {tierLabel}
              </div>
              <p className="text-cream/40 text-xs tracking-widest uppercase">Member since {memberSince}</p>
              <p className="text-cream/30 text-xs tracking-wider mt-1">{user?.email}</p>
            </div>

            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full text-left px-6 py-4 transition-all duration-300 whitespace-nowrap ${
                      isActive 
                        ? 'bg-gold-400/10 border-l-2 border-gold-400 text-gold-400' 
                        : 'border-l-2 border-transparent text-cream/50 hover:text-cream hover:bg-cream/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-4 shrink-0" />
                    <span className="font-sans tracking-widest uppercase text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="w-full lg:w-3/4 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* TICKETS TAB */}
              {activeTab === 'tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-serif text-2xl text-cream tracking-wider mb-8 border-b border-cream/10 pb-4">My Reservations</h2>
                  
                  {loadingData ? (
                    <div className="text-center py-20">
                      <svg className="animate-spin h-8 w-8 text-gold-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-cream/40 text-sm tracking-widest font-sans">Loading your tickets...</p>
                    </div>
                  ) : tickets.length > 0 ? (
                    <div className="space-y-8">
                      {tickets.map(ticket => (
                        <div key={ticket.id} className="bg-darker border border-gold-400/20 flex flex-col md:flex-row overflow-hidden group">
                          <div className="md:w-2/5 relative overflow-hidden h-48 md:h-auto">
                            <img 
                              src={ticket.event_image || 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop'} 
                              alt={ticket.event_title} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-darker to-transparent"></div>
                          </div>
                          <div className="md:w-3/5 p-8 flex flex-col justify-between relative">
                            <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                              <QrCode className="w-16 h-16 text-gold-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-gold-400 text-xs tracking-[0.2em] uppercase">Ticket #{ticket.booking_ref}</span>
                                <span className={`text-xs tracking-wider uppercase px-2 py-0.5 border ${
                                  ticket.status === 'confirmed' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                                  ticket.status === 'cancelled' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                                  'text-cream/50 border-cream/20 bg-cream/5'
                                }`}>{ticket.status}</span>
                              </div>
                              <h3 className="font-serif text-2xl text-cream mb-6 pr-16">{ticket.event_title}</h3>
                              
                              <div className="grid grid-cols-2 gap-6 font-sans text-sm tracking-wider text-cream/70">
                                <div>
                                  <span className="block text-cream/40 text-xs uppercase mb-1">Date</span>
                                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gold-400" /> {ticket.event_date}</span>
                                </div>
                                <div>
                                  <span className="block text-cream/40 text-xs uppercase mb-1">Time</span>
                                  <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gold-400" /> {ticket.event_time}</span>
                                </div>
                                <div>
                                  <span className="block text-cream/40 text-xs uppercase mb-1">Area</span>
                                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gold-400" /> {ticket.seating_area}</span>
                                </div>
                                <div>
                                  <span className="block text-cream/40 text-xs uppercase mb-1">Guests</span>
                                  <span className="flex items-center"><User className="w-4 h-4 mr-2 text-gold-400" /> {ticket.guest_count} Guest(s)</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-cream/10 flex justify-between items-center">
                              <span className="text-gold-400 font-serif text-lg">¥ {ticket.total_price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 border border-dashed border-cream/20">
                      <Ticket className="w-12 h-12 text-cream/20 mx-auto mb-4" />
                      <p className="text-cream/50 font-sans tracking-wider">You have no reservations yet.</p>
                      <Link to="/#reservation" className="inline-block mt-6 text-gold-400 text-sm tracking-widest uppercase hover:text-gold-300 transition-colors">Browse Schedule</Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SAVED EVENTS TAB */}
              {activeTab === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-end mb-8 border-b border-cream/10 pb-4">
                    <h2 className="font-serif text-2xl text-cream tracking-wider">Saved Performances</h2>
                    <span className="text-cream/40 text-sm font-sans tracking-widest">{savedEvents.length} Events</span>
                  </div>
                  
                  {loadingData ? (
                    <div className="text-center py-20">
                      <svg className="animate-spin h-8 w-8 text-gold-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : savedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {savedEvents.map(fav => (
                        <div key={fav.id} className="group cursor-pointer">
                          <div className="relative overflow-hidden aspect-[4/3] mb-4">
                            <img 
                              src={fav.events?.hero_image || 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=400&auto=format&fit=crop'} 
                              alt={fav.events?.title || 'Saved Event'} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                            />
                            <button className="absolute top-4 right-4 w-10 h-10 bg-dark/50 backdrop-blur-md flex items-center justify-center rounded-full text-gold-400 hover:bg-gold-400 hover:text-dark transition-colors z-10">
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                            <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-gold-400 text-xs tracking-[0.2em] uppercase mb-2 block">{fav.events?.genre || 'Jazz'}</span>
                              <h3 className="font-serif text-xl text-cream group-hover:text-gold-400 transition-colors mb-2">{fav.events?.title || 'Event'}</h3>
                              <p className="text-cream/50 font-sans text-sm tracking-wider flex items-center">
                                <Calendar className="w-4 h-4 mr-2" /> Saved on {new Date(fav.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 border border-dashed border-cream/20">
                      <Heart className="w-12 h-12 text-cream/20 mx-auto mb-4" />
                      <p className="text-cream/50 font-sans tracking-wider">You haven't saved any performances yet.</p>
                      <Link to="/#upcoming" className="inline-block mt-6 text-gold-400 text-sm tracking-widest uppercase hover:text-gold-300 transition-colors">Explore Upcoming Shows</Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* MEMBERSHIP TAB */}
              {activeTab === 'membership' && (
                <motion.div
                  key="membership"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-serif text-2xl text-cream tracking-wider mb-8 border-b border-cream/10 pb-4">Membership Status</h2>
                  
                  <div className="bg-gradient-to-br from-darker to-dark border border-gold-400/30 p-8 md:p-12 relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div>
                        <span className="text-cream/50 text-xs tracking-[0.2em] uppercase mb-2 block">Current Tier</span>
                        <h3 className="font-serif text-4xl text-gold-400 mb-2">{tierLabel}</h3>
                        <p className="text-cream/70 font-sans tracking-wider text-sm">Earn points with every booking.</p>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="text-cream/50 text-xs tracking-[0.2em] uppercase mb-2 block">Reward Points</span>
                        <div className="font-logo text-5xl text-cream">{(profile?.reward_points || 0).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gold-400/20">
                      <h4 className="font-sans text-sm text-cream tracking-widest uppercase mb-6">Tier Perks</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm text-cream/70 tracking-wider">
                        <li className="flex items-center"><Play className="w-3 h-3 text-gold-400 mr-3" /> Priority Booking Access</li>
                        <li className="flex items-center"><Play className="w-3 h-3 text-gold-400 mr-3" /> Complimentary Welcome Drink</li>
                        <li className="flex items-center"><Play className="w-3 h-3 text-gold-400 mr-3" /> Access to VIP Secret Shows</li>
                        <li className="flex items-center"><Play className="w-3 h-3 text-gold-400 mr-3" /> Dedicated Concierge Line</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-serif text-2xl text-cream tracking-wider mb-8 border-b border-cream/10 pb-4">Account Settings</h2>
                  
                  <form className="space-y-8 max-w-2xl" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-cream/60">Display Name</label>
                        <input type="text" defaultValue={profile?.display_name || ''} className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-cream/60">Phone Number</label>
                        <input type="tel" defaultValue={profile?.phone || ''} className="w-full bg-darker border border-cream/20 focus:border-gold-400 text-cream px-4 py-3 outline-none transition-colors" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs uppercase tracking-widest text-cream/60">Email Address</label>
                        <input type="email" defaultValue={user?.email || ''} disabled className="w-full bg-darker border border-cream/20 text-cream/50 px-4 py-3 outline-none cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="pt-8">
                      <button type="submit" className="bg-gold-400 text-dark px-8 py-3 font-serif text-sm tracking-[0.2em] uppercase hover:bg-gold-300 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────
export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-gold-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return user ? <AuthenticatedProfile /> : <GuestProfileLanding />;
}
