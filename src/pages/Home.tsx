import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ArrowRight, CalendarClock, Armchair, ChevronDown, ChevronLeft, ChevronRight, X, Triangle, Music, User, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select, .interactive')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      animate={{
        x: position.x - (isHovered ? 30 : 8),
        y: position.y - (isHovered ? 30 : 8),
        width: isHovered ? 60 : 16,
        height: isHovered ? 60 : 16,
        backgroundColor: isHovered ? 'rgba(255, 177, 98, 0.2)' : '#FFB162',
        border: isHovered ? '1px solid #FFB162' : 'none',
        backdropFilter: isHovered ? 'blur(2px)' : 'none',
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.3 }}
    />
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav className={`fixed w-full z-50 transition-all duration-500 px-6 md:px-12 flex justify-between items-center ${scrolled ? 'bg-dark/90 backdrop-blur-md border-b border-gold-400/10 py-3' : 'py-4'}`}>
      <div className="text-2xl font-logo tracking-[0.25em] font-bold text-cream cursor-pointer interactive" onClick={() => window.scrollTo(0,0)}>
        YORU
      </div>
      <div className="hidden md:flex space-x-8 text-sm tracking-widest font-sans uppercase">
        <a href="#schedule" className="text-cream/70 hover:text-gold-400 transition-colors interactive">Schedule</a>
        <a href="#upcoming" className="text-cream/70 hover:text-gold-400 transition-colors interactive">Upcoming</a>
        <a href="#reservation" className="text-cream/70 hover:text-gold-400 transition-colors interactive">Reservation</a>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <Link to="/profile" className="text-cream/70 hover:text-gold-400 transition-colors interactive flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-gold-400" />
            </div>
          </Link>
        ) : (
          <button onClick={() => setShowAuth(true)} className="text-cream/70 hover:text-gold-400 transition-colors interactive text-sm tracking-widest uppercase font-sans">
            Login
          </button>
        )}
        <a href="#reservation" className="border border-gold-400 text-gold-400 px-5 py-2 text-sm tracking-widest hover:bg-gold-400 hover:text-dark transition-all interactive uppercase font-sans">
          Reserve
        </a>
      </div>
      <div className="md:hidden flex items-center space-x-4">
        {user ? (
          <Link to="/profile" className="text-cream/70 hover:text-gold-400 transition-colors interactive">
            <div className="w-7 h-7 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-gold-400" />
            </div>
          </Link>
        ) : (
          <button onClick={() => setShowAuth(true)} className="text-cream/70 hover:text-gold-400 transition-colors interactive">
            <User className="w-5 h-5" />
          </button>
        )}
        <button className="text-gold-400 text-xl interactive">
          <Menu />
        </button>
      </div>
    </nav>
    <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

function TickerItem({ tag, title, img }: { tag: string, title: string, img: string }) {
  return (
    <Link to="/editorial/1" className="flex items-center space-x-4 interactive cursor-pointer group">
      <img src={img} className="w-9 h-9 object-cover grayscale group-hover:grayscale-0 transition-all border border-cream/10 rounded-sm" alt={title} />
      <div>
        <span className="text-gold-400 text-sm uppercase tracking-[0.2em] block mb-1 drop-shadow-md">{tag}</span>
        <span className="text-cream text-sm md:text-base tracking-widest uppercase group-hover:text-gold-400 transition-colors drop-shadow-md">{title}</span>
      </div>
    </Link>
  );
}

function Hero() {
  return (
    <>
      <header id="hero-section" className="relative w-full min-h-[85vh] pt-[112px] md:pt-[140px] flex flex-col justify-center bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/flagged/photo-1569231290377-072234d3ee57?q=80&w=2000&auto=format&fit=crop" alt="YORU Jazz Background" className="w-full h-full object-cover grayscale opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#001E3A_120%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-transparent to-dark"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 py-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-sans text-gold-400 tracking-[0.4em] text-sm md:text-base mb-6 uppercase drop-shadow-md text-center flex items-center justify-center"
          >
            <span className="hidden md:inline-block w-8 h-[1px] bg-gold-400/50 mr-4"></span>
            Tokyo Ginza Exclusive
            <span className="hidden md:inline-block w-8 h-[1px] bg-gold-400/50 ml-4"></span>
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream tracking-widest uppercase leading-[1.1] drop-shadow-2xl text-center"
          >
            The Soul <br/><span className="text-gold-400">Of The Night</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8 font-sans text-cream/70 text-sm md:text-base tracking-widest max-w-2xl text-center leading-relaxed"
          >
            Immerse yourself in the ultimate vintage jazz experience. Authentic sounds, absolute privacy, and exquisite taste.
          </motion.p>
        </div>
      </header>

      <section className="relative z-20 w-full bg-dark flex-shrink-0">
        <div className="relative w-full h-[1px] bg-gold-400/30">
          <div className="absolute right-[15%] md:right-[20%] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gold-400 rounded-full shadow-[0_0_12px_rgba(255,177,98,0.8)]"></div>
        </div>
        <div className="bg-dark/60 backdrop-blur-md border-b border-gold-400/20 py-3.5 flex items-center ticker-container overflow-hidden">
          <div className="flex w-max animate-marquee whitespace-nowrap items-center font-sans">
            {[1, 2].map((half) => (
              <div key={half} className="flex items-center gap-[100px] px-[50px]">
                {[1, 2, 3, 4].map((repeat) => (
                  <Fragment key={repeat}>
                    <TickerItem tag="[New Performance]" title="Summer Jazz Camp All Stars" img="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=150&auto=format&fit=crop" />
                    <TickerItem tag="[Special Guest]" title="Simon Phillips & Protocol 6" img="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=150&auto=format&fit=crop" />
                    <TickerItem tag="[Sold Out]" title="The Blue Notes Quartet" img="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=150&auto=format&fit=crop" />
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-10 md:py-14 flex-shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
            
            <div className="glass-panel p-6 md:p-8 flex flex-col justify-between rounded-sm">
              <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-gold-400/20 pb-4">
                <h2 className="font-serif text-xl md:text-2xl text-gold-400 tracking-[0.2em] uppercase">Tonight</h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 flex-grow items-center">
                <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gold-400/10 pb-6 sm:pb-0 sm:pr-8 h-full">
                  <p className="font-sans text-sm text-cream/60 tracking-[0.2em] uppercase mb-4 text-center sm:text-left">Featured Artist</p>
                  <div className="w-full aspect-square relative overflow-hidden border border-cream/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] group interactive">
                    <img src="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 transform group-hover:scale-105" alt="Tonight Performance" />
                  </div>
                </div>
                
                <div className="flex flex-col justify-center h-full sm:pl-2">
                  <p className="font-sans text-sm text-cream/60 tracking-[0.2em] uppercase mb-2 text-center sm:text-left">Live Performance</p>
                  <h3 className="font-serif text-xl md:text-2xl text-gold-400 tracking-wider mb-3 text-center sm:text-left leading-snug">Chikuzen Satō × Lagheads</h3>
                  <div className="font-sans text-sm text-cream/50 tracking-wider leading-relaxed text-center sm:text-left space-y-1">
                    <p className="text-cream/90">"Answer The Future"</p>
                    <p className="text-cream/40">Presented by YORU Tokyo</p>
                  </div>
                  <Link to="/editorial/1" className="mt-6 inline-flex items-center justify-center sm:justify-start text-cream/70 text-sm tracking-widest uppercase hover:text-gold-400 transition-colors pb-1 border-b border-transparent hover:border-gold-400 self-center sm:self-start">
                    More Information <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 md:p-8 flex flex-col justify-between rounded-sm">
              <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-gold-400/20 pb-4">
                <h2 className="font-serif text-xl md:text-2xl text-gold-400 tracking-[0.2em] uppercase">Reservation</h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 flex-grow items-center">
                <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gold-400/10 pb-6 sm:pb-0 sm:pr-8 h-full">
                  <div className="flex items-center justify-center sm:justify-start mb-4">
                    <div className="w-3 h-3 rounded-full bg-gold-400 mr-3 shadow-[0_0_8px_rgba(255,177,98,0.6)]"></div>
                    <p className="font-sans text-sm text-cream/70 tracking-[0.2em] uppercase">Online Booking</p>
                  </div>
                  <a href="#reservation" className="w-full bg-[#E5A960] hover:bg-[#F2B975] text-darker py-3.5 md:py-4 font-serif text-sm md:text-base tracking-[0.2em] interactive uppercase text-center font-bold shadow-[0_0_20px_rgba(229,169,96,0.3)] transition-all rounded-md">
                    Schedule
                  </a>
                </div>
                
                <div className="flex flex-col justify-center h-full sm:pl-2">
                  <p className="font-sans text-sm text-cream/60 tracking-[0.2em] uppercase mb-2 text-center sm:text-left">Phone Reservation</p>
                  <p className="font-serif text-2xl md:text-3xl text-gold-400 tracking-wider mb-3 cursor-pointer hover:text-gold-300 transition-colors text-center sm:text-left">03-5485-0088</p>
                  <div className="font-sans text-sm text-cream/50 tracking-wider leading-relaxed text-center sm:text-left space-y-1">
                    <p>12:00pm - 7:30pm (Mon.-Fri.)</p>
                    <p>12:00pm - 6:30pm (Sat., Sun. & Hol.)</p>
                    <p className="text-cream/30">12:00pm - 5:00pm (Private & No-show)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

function Schedule() {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [showAuth, setShowAuth] = useState(false);

  const handleSave = (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    toggleFavorite(eventId);
  };

const scheduleData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop",
    date: "Oct 24 Tue. ｜ 20:00 - 22:30",
    title: "The Blue Notes Quartet",
    genre: "Classic Jazz & Bebop",
    price: "¥ 4,500",
    status: "Limited Seats",
    highlight: true,
    colSpan: "col-span-1 md:col-span-2",
    minHeight: "min-h-[300px] md:min-h-[420px]"
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    date: "Oct 26 Thu.",
    title: "Yumi & The Velvet",
    genre: "Bossa Nova & Vocals",
    price: "¥ 3,850",
    status: "Sold Out",
    highlight: false,
    colSpan: "col-span-1",
    minHeight: "min-h-[240px] md:min-h-[280px]"
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1573220464670-658b4b7cde6c?q=80&w=800&auto=format&fit=crop",
    date: "Oct 31 Tue.",
    title: "Midnight Saxophone",
    genre: "Smooth Jazz & Soul",
    price: "¥ 5,500",
    status: "Available",
    highlight: false,
    colSpan: "col-span-1",
    minHeight: "min-h-[240px] md:min-h-[280px]"
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    date: "Nov 03 Fri.",
    title: "Tokyo Jazz Collective",
    genre: "Contemporary & Fusion",
    price: "¥ 4,200",
    status: "Few Left",
    highlight: false,
    colSpan: "col-span-1",
    minHeight: "min-h-[240px] md:min-h-[280px]"
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1549834125-81d3fd5ce85a?q=80&w=800&auto=format&fit=crop",
    date: "Nov 05 Sun.",
    title: "Sunday Soul Sessions",
    genre: "Soul, Funk & R&B",
    price: "¥ 3,500",
    status: "Available",
    highlight: false,
    colSpan: "col-span-1",
    minHeight: "min-h-[240px] md:min-h-[280px]"
  }
];

  return (
    <>
    <section id="schedule" className="py-24 relative bg-dark border-t border-cream/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-12"
        >
          <div>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-cream tracking-wider uppercase mb-2">Monthly Schedule</h2>
            <p className="text-gold-400 font-sans tracking-[0.3em] text-sm md:text-base">本月節目表</p>
          </div>
          <Link to="/editorial/1" className="text-cream/60 hover:text-gold-400 font-sans tracking-widest text-sm md:text-base uppercase pb-1 border-b border-gold-400/30 interactive transition-colors mt-6 md:mt-0">
            View Full Calendar
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {scheduleData.map((item, index) => (
            <Link 
              key={item.id}
              to="/editorial/1" 
              className={`${item.colSpan} relative w-full ${item.minHeight} overflow-hidden group interactive cursor-pointer shadow-md border border-cream/10 bg-dark block`}
            >
              <img src={item.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700 transform scale-100 group-hover:scale-105" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/50 to-transparent pointer-events-none"></div>
              
              <button 
                onClick={(e) => handleSave(e, `schedule-${item.id}`)}
                className={`absolute top-4 right-4 w-10 h-10 bg-dark/50 backdrop-blur-md flex items-center justify-center rounded-full transition-colors z-20 interactive ${
                  isFavorited(`schedule-${item.id}`) ? 'text-gold-400 bg-gold-400/20' : 'text-cream/50 hover:text-gold-400 hover:bg-gold-400/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited(`schedule-${item.id}`) ? 'fill-current' : ''}`} />
              </button>

              {item.highlight ? (
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between md:items-end z-10">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="bg-gold-400 text-dark px-3 py-1 text-sm font-sans font-bold tracking-[0.2em] uppercase">Highlight</span>
                      <span className="text-gold-400 font-sans text-sm md:text-base tracking-widest uppercase drop-shadow-md">{item.date}</span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream group-hover:text-gold-400 transition-colors uppercase tracking-wide drop-shadow-md mb-2">{item.title}</h3>
                    <p className="font-sans text-cream/80 text-base md:text-lg tracking-widest uppercase">{item.genre}</p>
                  </div>
                  <div className="mt-6 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end w-full md:w-auto">
                    <div className="text-left md:text-right mb-0 md:mb-3">
                      <span className="block text-gold-400 font-serif text-2xl md:text-3xl drop-shadow-md">{item.price}</span>
                      <span className="block text-cream/50 text-sm tracking-widest uppercase mt-1">Per Person</span>
                    </div>
                    <span className="px-4 py-1.5 border border-cream/20 text-cream/90 text-sm tracking-widest rounded-sm uppercase group-hover:border-gold-400 group-hover:text-gold-400 transition-colors backdrop-blur-sm">{item.status}</span>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 flex flex-col justify-end h-full z-10">
                  <div className="flex justify-between items-start mb-auto">
                    <span className={`px-2.5 py-1 text-sm tracking-widest uppercase rounded-sm border backdrop-blur-sm
                      ${item.status === 'Sold Out' ? 'bg-black/60 text-oatmeal border-oatmeal/20' : 
                        item.status === 'Available' ? 'bg-gold-400/10 text-gold-400 border-gold-400/30' : 
                        'bg-cream/5 text-cream/70 border-cream/20'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gold-400 font-sans text-sm tracking-widest uppercase block mb-1.5">{item.date}</span>
                    <h3 className="font-serif text-xl md:text-2xl text-cream group-hover:text-gold-400 transition-colors uppercase tracking-wider leading-tight mb-1">{item.title}</h3>
                    <div className="flex justify-between items-end mt-3">
                      <p className="font-sans text-cream/50 text-sm tracking-widest uppercase">{item.genre}</p>
                      <span className="block text-cream/90 font-serif text-base md:text-lg">{item.price}</span>
                    </div>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
    <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

function Upcoming() {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [showAuth, setShowAuth] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    toggleFavorite('upcoming-dee-dee');
  };
  return (
    <>
    <section id="upcoming" className="pt-24 pb-16 relative bg-dark">
      <div className="w-full px-6 md:px-12 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t-2 border-b-2 border-gold-400/30 py-3 mb-12 text-center max-w-7xl mx-auto"
        >
          <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-cream">Upcoming Shows</h2>
        </motion.div>
        
        <Link 
          to="/editorial/1" 
          className="block group interactive cursor-pointer w-full mb-8"
        >
          <div className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-[16/9] overflow-hidden bg-dark shadow-2xl border-y border-cream/10">
            <img src="https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105" alt="Dee Dee Bridgewater & Bill Charlap" />
            <button 
              onClick={handleSave}
              className={`absolute top-6 right-6 w-12 h-12 bg-dark/50 backdrop-blur-md flex items-center justify-center rounded-full transition-colors z-20 interactive ${
                isFavorited('upcoming-dee-dee') ? 'text-gold-400 bg-gold-400/20' : 'text-cream/50 hover:text-gold-400 hover:bg-gold-400/10'
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorited('upcoming-dee-dee') ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row gap-6 md:gap-12 px-6 md:px-0">
            <div className="md:w-1/3">
              <p className="font-sans text-gold-400 text-lg md:text-xl tracking-widest uppercase mb-2">2026 5.30 sat., 5.31 sun., 6.1 mon.</p>
              <h4 className="font-serif text-[32px] md:text-[40px] text-cream uppercase leading-snug tracking-wider group-hover:text-gold-400 transition-colors">Dee Dee Bridgewater & Bill Charlap</h4>
            </div>
            <div className="md:w-2/3 border-l md:border-l-2 border-gold-400/20 pl-0 md:pl-8 flex items-center">
              <p className="font-sans text-cream/70 text-lg md:text-xl leading-relaxed tracking-wider">
                Nominated for a Grammy Award for Best Jazz Vocal, this is a sublime world portrayed by a top vocalist and a master pianist. Experience the raw emotion and unparalleled artistry in an intimate setting tailored for true connoisseurs.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
    <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

function Reservation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{start: number | null, end: number | null}>({ start: 15, end: null });
  const [selectedShow, setSelectedShow] = useState<number | null>(0);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ["Classic Jazz", "Contemporary", "Blues", "Fusion", "Vocal Jazz"];

  const mockShows = Array.from({ length: 50 }).map((_, i) => {
    const images = [
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop"
    ];
    const titles = [
      "Dee Dee Bridgewater & Bill Charlap",
      "Summer Jazz Camp All Stars",
      "The Blue Notes Quartet",
      "Simon Phillips & Protocol 6",
      "Tokyo Jazz Collective"
    ];
    return {
      id: i,
      title: titles[i % titles.length] + (i > 4 ? ` Vol.${Math.floor(i/5) + 1}` : ''),
      date: (15 + i) % 30 || 30,
      month: 5 + Math.floor((15 + i) / 30),
      time: i % 2 === 0 ? "19:00" : "21:30",
      price: i % 3 === 0 ? "¥12,000" : "¥8,000",
      img: images[i % images.length],
      genre: genres[i % genres.length]
    };
  });

  const filteredShows = mockShows.filter(show => {
    const matchesGenre = selectedGenre === 'All' || show.genre === selectedGenre;
    let matchesDate = true;
    if (dateRange.start !== null && dateRange.end !== null) {
      const min = Math.min(dateRange.start, dateRange.end);
      const max = Math.max(dateRange.start, dateRange.end);
      matchesDate = show.date >= min && show.date <= max;
    } else if (dateRange.start !== null) {
      matchesDate = show.date === dateRange.start;
    }
    return matchesGenre && matchesDate;
  });

  const handleDateClick = (day: number) => {
    if (dateRange.start === null || (dateRange.start !== null && dateRange.end !== null)) {
      setDateRange({ start: day, end: null });
    } else {
      setDateRange({ start: dateRange.start, end: day });
    }
  };

  const areas = [
    { id: 'counter', name: 'Counter', desc: '*Shared', price: '¥ 0', disabled: true },
    { id: 'arena', name: 'Arena', desc: '*Shared', price: '¥ 2,200', disabled: false, multiplier: true },
    { id: 'box-center', name: 'Box Center', desc: '(4 seats)', price: '¥ 5,500', disabled: false, fixed: '× 4 ppl' },
    { id: 'side-sofa', name: 'Side Sofa', desc: '(2 seats)', price: '¥ 1,650', disabled: false, fixed: '× 2 ppl' }
  ];

  const handleCheckout = () => {
    const show = mockShows.find(s => s.id === selectedShow);
    const area = areas.find(a => a.id === selectedArea);
    
    if (!show || !area) {
      alert("Please select a performance and seating area.");
      return;
    }

    navigate('/checkout', {
      state: {
        show,
        area,
        dateRange
      }
    });
  };

  return (
    <section id="reservation" className="py-24 relative bg-dark overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-cream tracking-wider uppercase mb-2">Reservation</h2>
          <p className="text-gold-400 font-sans tracking-[0.3em] text-sm md:text-base">專屬座席預訂</p>
          <div className="w-10 h-[1px] bg-gold-400 mx-auto mt-6"></div>
        </motion.div>

        <div className="glass-panel p-6 md:p-10 lg:p-12 border-t-2 border-t-gold-400 rounded-sm">
          {/* Select Performance Section */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gold-400/30 pb-3 mb-6 gap-4">
              <div className="flex items-center space-x-3">
                <Music className="text-gold-400 w-5 h-5" />
                <h3 className="font-serif text-lg md:text-xl text-cream uppercase tracking-wide">Select Performance</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-wrap gap-2">
                  {['All', ...genres].map(genre => (
                    <button 
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`text-xs uppercase tracking-widest px-3 py-1 border transition-colors ${selectedGenre === genre ? 'border-gold-400 text-gold-400 bg-gold-400/10' : 'border-cream/20 text-cream/60 hover:border-gold-400/50 hover:text-gold-400'}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => { setDateRange({start: null, end: null}); setSelectedGenre('All'); }}
                  className="text-xs uppercase tracking-widest text-cream/40 hover:text-cream transition-colors underline underline-offset-4"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {filteredShows.length > 0 ? filteredShows.map(show => (
                <div 
                  key={show.id}
                  onClick={() => { setSelectedShow(show.id); setDateRange({start: show.date, end: null}); }}
                  className={`flex flex-col sm:flex-row sm:items-center p-4 cursor-pointer transition-all border ${selectedShow === show.id ? 'border-gold-400 bg-gold-400/10' : 'border-cream/10 hover:border-gold-400/50 bg-dark/50'}`}
                >
                  <img src={show.img} className={`w-full sm:w-20 h-32 sm:h-20 object-cover mb-4 sm:mb-0 sm:mr-6 transition-all duration-500 ${selectedShow === show.id ? 'grayscale-0' : 'grayscale opacity-70'}`} alt={show.title} />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-serif text-lg md:text-xl transition-colors ${selectedShow === show.id ? 'text-gold-400' : 'text-cream'}`}>{show.title}</h4>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if (!user) return; toggleFavorite(`show-${show.id}`); }}
                        className={`transition-colors interactive p-1 ${isFavorited(`show-${show.id}`) ? 'text-gold-400' : 'text-cream/30 hover:text-gold-400'}`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited(`show-${show.id}`) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="text-cream/50 text-sm font-sans tracking-widest uppercase">2026.{show.month.toString().padStart(2, '0')}.{show.date.toString().padStart(2, '0')} | {show.time}</p>
                      <span className="text-[10px] uppercase tracking-widest text-gold-400/70 border border-gold-400/30 px-2 py-0.5 rounded-sm">{show.genre}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="text-cream/40 text-xs uppercase tracking-widest mb-1">From</p>
                    <div className="text-gold-400 font-serif text-xl tracking-wider">
                      {show.price}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 border border-cream/10 bg-dark/50">
                  <p className="text-cream/50 font-sans tracking-widest uppercase">No performances found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-gold-400/30 pb-3 mb-8">
              <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                <CalendarClock className="text-gold-400 w-5 h-5" />
                <h3 className="font-serif text-lg md:text-xl text-cream uppercase tracking-wide">Select Date and Time</h3>
              </div>
              <div className="flex space-x-4 text-sm font-sans text-cream/70 uppercase tracking-widest">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-cream/20" strokeWidth="3"></circle></svg>
                  Available
                </span>
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-cream/20" strokeWidth="3"></circle>
                    <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-gold-400" strokeWidth="3" strokeDasharray="100" strokeDashoffset="40"></circle>
                  </svg>
                  Filling Up
                </span>
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-oatmeal" strokeWidth="3"></circle></svg>
                  Sold out
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row border border-gold-400/40 bg-dark items-stretch shadow-md">
                <div 
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="w-full md:w-1/4 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-cream/10 bg-gold-400/10 hover:bg-gold-400/20 transition-colors interactive cursor-pointer group"
                >
                  <span className="font-sans text-gold-400 text-sm uppercase tracking-widest mb-1 drop-shadow-sm flex items-center">
                    Selected <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${calendarOpen ? 'rotate-180' : ''}`} />
                  </span>
                  <span className="font-sans text-cream text-lg md:text-xl">2026 <span className="font-serif text-xl md:text-2xl text-gold-400 mx-1.5 drop-shadow-md">5.{dateRange.start || '--'}{dateRange.end ? ` - 5.${dateRange.end}` : ''}</span></span>
                </div>
                <div className="w-full md:w-3/4 p-2 flex flex-col md:flex-row gap-2">
                  <button className="flex-1 bg-cream/5 hover:bg-gold-400/10 p-3 flex justify-between items-center transition-colors interactive group border border-transparent hover:border-gold-400/50">
                    <div className="flex items-center">
                      <div className="bg-gold-400/20 text-gold-400 px-3 py-1.5 text-sm font-serif mr-4 uppercase">1st</div>
                      <div className="text-left font-sans text-sm text-cream/80 leading-relaxed uppercase tracking-wider">Open 5:00pm<br/>Start 6:00pm</div>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-truffle group-hover:bg-truffle/20 transition-colors shadow-sm"></span>
                  </button>
                  <button className="flex-1 bg-cream/5 hover:bg-gold-400/10 p-3 flex justify-between items-center transition-colors interactive group border border-transparent hover:border-gold-400/50">
                    <div className="flex items-center">
                      <div className="bg-gold-400/20 text-gold-400 px-3 py-1.5 text-sm font-serif mr-4 uppercase">2nd</div>
                      <div className="text-left font-sans text-sm text-cream/80 leading-relaxed uppercase tracking-wider">Open 7:45pm<br/>Start 8:30pm</div>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-gold-400 group-hover:bg-gold-400/20 transition-colors shadow-sm"></span>
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {calendarOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-dark/60 border border-gold-400/20 rounded-sm p-6 lg:p-8 mt-4 mb-4 shadow-lg max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6 px-4">
                      <button className="text-cream/40 hover:text-gold-400 interactive transition-colors text-lg uppercase font-sans tracking-widest flex items-center"><ChevronLeft className="w-4 h-4 mr-1" /> April</button>
                      <h4 className="font-serif text-xl md:text-2xl text-cream tracking-widest uppercase">May 2026</h4>
                      <button className="text-cream/40 hover:text-gold-400 interactive transition-colors text-lg uppercase font-sans tracking-widest flex items-center">June <ChevronRight className="w-4 h-4 ml-1" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-4 text-center font-sans text-sm md:text-base text-cream/40 uppercase tracking-widest border-b border-cream/10 pb-2">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-y-4 md:gap-y-6 text-center">
                      <div></div><div></div><div></div><div></div>
                      {Array.from({ length: 31 }).map((_, i) => {
                        const day = i + 1;
                        const isPast = day < 6 || day === 8 || day === 12 || day === 20;
                        const isSelected = day === dateRange.start || day === dateRange.end;
                        const isInRange = dateRange.start !== null && dateRange.end !== null && 
                                          day > Math.min(dateRange.start, dateRange.end) && 
                                          day < Math.max(dateRange.start, dateRange.end);
                        const offset = Math.floor(Math.random() * 80) + 10;
                        
                        if (isPast) {
                          return (
                            <div key={day} className="flex items-center justify-center opacity-40">
                              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-not-allowed">
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-oatmeal" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="0"></circle>
                                </svg>
                                <span className="relative z-10 font-sans text-sm md:text-base text-oatmeal">{day}</span>
                              </div>
                            </div>
                          );
                        }

                        if (isSelected) {
                          return (
                            <div key={day} onClick={() => handleDateClick(day)} className="flex items-center justify-center">
                              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group cursor-pointer interactive bg-gold-400/10 rounded-full shadow-[0_0_15px_rgba(255,177,98,0.3)]">
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-cream/10" strokeWidth="1.5"></circle>
                                  <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-gold-400 drop-shadow-md" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="50" strokeLinecap="round"></circle>
                                </svg>
                                <span className="relative z-10 font-sans text-sm md:text-base text-gold-400 font-bold">{day}</span>
                              </div>
                            </div>
                          );
                        }

                        if (isInRange) {
                          return (
                            <div key={day} onClick={() => handleDateClick(day)} className="flex items-center justify-center">
                              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group cursor-pointer interactive bg-gold-400/5 rounded-full">
                                <span className="relative z-10 font-sans text-sm md:text-base text-gold-400/70">{day}</span>
                              </div>
                            </div>
                          );
                        }

                        if (day > 21) {
                          return (
                            <div key={day} onClick={() => handleDateClick(day)} className="font-sans text-sm md:text-base text-cream/40 flex items-center justify-center cursor-pointer interactive hover:text-gold-400 transition-colors">{day}</div>
                          );
                        }

                        return (
                          <div key={day} className="flex items-center justify-center">
                            <div onClick={() => handleDateClick(day)} className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group cursor-pointer interactive">
                              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-cream/10 group-hover:stroke-gold-400/40 transition-colors" strokeWidth="1.5"></circle>
                                <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-gold-400" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset={offset} strokeLinecap="round"></circle>
                              </svg>
                              <span className="relative z-10 font-sans text-sm md:text-base text-cream group-hover:text-gold-400 transition-colors">{day}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="border-b border-gold-400/30 pb-3 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Armchair className="text-gold-400 w-5 h-5" />
                <h3 className="font-serif text-lg md:text-xl text-cream uppercase tracking-wide">Select Seating Area & Map Overview</h3>
              </div>
              <p className="font-sans text-sm text-cream/50 leading-relaxed mt-3 uppercase tracking-widest max-w-2xl">
                Please select your preferred seating area referencing the map below.<br/>
                <span className="text-gold-400 mt-1 block tracking-normal lowercase">* Seating locations will be adjusted by us based on the number of people/order of reservations.</span>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-[40%] grid grid-cols-2 gap-2">
                {areas.map(area => (
                  <div 
                    key={area.id}
                    onClick={() => !area.disabled && setSelectedArea(area.id)}
                    onMouseEnter={() => !area.disabled && setSelectedArea(area.id)}
                    className={`area-card p-3 flex flex-col justify-between min-h-[75px] transition-all
                      ${area.disabled ? 'bg-black/40 border border-cream/10 opacity-40 cursor-not-allowed' : 'bg-cream/5 border interactive cursor-pointer group'}
                      ${selectedArea === area.id ? 'ring-2 ring-gold-400 bg-gold-400/20 border-gold-400' : 'border-gold-400/30 hover:border-gold-400'}
                    `}
                  >
                    <div className="text-sm font-sans text-cream/90 mb-2 uppercase tracking-wider">{area.name} <span className="lowercase text-cream/50">{area.desc}</span></div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center space-x-1">
                        <span className={`text-sm md:text-base font-serif ${area.disabled ? 'text-cream/50' : 'text-gold-400'}`}>{area.price}</span>
                        {area.multiplier && (
                          <>
                            <span className="text-sm text-cream/50 px-1">×</span>
                            <select className="bg-dark border border-cream/20 text-cream text-sm py-0.5 px-1 focus:border-gold-400 outline-none interactive appearance-none text-center">
                              <option>1</option><option>2</option>
                            </select>
                          </>
                        )}
                        {area.fixed && <span className="text-sm text-cream/50 ml-1">{area.fixed}</span>}
                      </div>
                      {area.disabled ? <X className="text-oatmeal w-3.5 h-3.5" /> : 
                       area.id === 'box-center' ? <Triangle className="text-gold-400 w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> :
                       <span className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-[1.5px] border-truffle group-hover:bg-truffle/20 transition-colors"></span>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-[60%] flex flex-col border border-gold-400/20 bg-dark/90 rounded-sm overflow-hidden group">
                <div className="bg-gold-400/10 py-2 text-center border-b border-gold-400/20 flex justify-between items-center px-4">
                  <span className="font-sans text-gold-400 text-sm uppercase tracking-[0.2em] flex items-center justify-center">Map Overview</span>
                  <span className="font-sans text-cream/40 text-sm uppercase tracking-widest">Click to Select Area</span>
                </div>
                <div className="relative w-full h-full min-h-[250px] flex items-center justify-center p-4 lg:p-6 bg-[#001226]">
                  <svg viewBox="0 0 800 500" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="seat-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="2" y="2" width="16" height="16" rx="2" fill="currentColor" opacity="0.4"/>
                      </pattern>
                      <pattern id="counter-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="15" cy="15" r="8" fill="currentColor" opacity="0.4"/>
                      </pattern>
                    </defs>
                    
                    <g>
                      <rect x="250" y="20" width="300" height="60" rx="4" fill="rgba(238, 233, 223, 0.05)" stroke="#EEE9DF" strokeOpacity="0.2" strokeWidth="2"/>
                      <text x="400" y="55" fill="#EEE9DF" fontFamily="sans-serif" fontSize="20" fontWeight="bold" textAnchor="middle" letterSpacing="4" opacity="0.7">STAGE</text>
                    </g>

                    <g className="opacity-50 pointer-events-none">
                      <rect x="190" y="100" width="40" height="170" rx="2" fill="rgba(238, 233, 223, 0.1)" stroke="#EEE9DF" strokeOpacity="0.2"/>
                      <text x="210" y="185" fill="#EEE9DF" fontFamily="sans-serif" fontSize="12" textAnchor="middle" transform="rotate(90, 210, 185)" letterSpacing="1">PAIR L</text>
                      <rect x="570" y="100" width="40" height="170" rx="2" fill="rgba(238, 233, 223, 0.1)" stroke="#EEE9DF" strokeOpacity="0.2"/>
                      <text x="590" y="185" fill="#EEE9DF" fontFamily="sans-serif" fontSize="12" textAnchor="middle" transform="rotate(90, 590, 185)" letterSpacing="1">PAIR R</text>
                      <rect x="130" y="100" width="40" height="260" rx="2" fill="rgba(238, 233, 223, 0.1)" stroke="#EEE9DF" strokeOpacity="0.2"/>
                      <rect x="630" y="100" width="40" height="260" rx="2" fill="rgba(238, 233, 223, 0.1)" stroke="#EEE9DF" strokeOpacity="0.2"/>
                      <rect x="250" y="235" width="300" height="40" rx="2" fill="rgba(238, 233, 223, 0.1)" stroke="#EEE9DF" strokeOpacity="0.2"/>
                    </g>

                    <g 
                      onMouseEnter={() => setSelectedArea('arena')}
                      onClick={() => setSelectedArea('arena')}
                      className="interactive cursor-pointer group"
                    >
                      <rect x="250" y="100" width="300" height="120" rx="4" fill={selectedArea === 'arena' ? 'rgba(255, 177, 98, 0.4)' : 'rgba(255, 177, 98, 0.1)'} stroke="#FFB162" strokeOpacity="0.4" strokeWidth={selectedArea === 'arena' ? 3 : 1} className="transition-all duration-300"/>
                      <rect x="250" y="100" width="300" height="120" fill="url(#seat-pattern)" className="text-gold-400 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"/>
                      <text x="400" y="165" fill="#EEE9DF" fontFamily="sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="2" className="pointer-events-none drop-shadow-md">ARENA</text>
                    </g>

                    <g 
                      onMouseEnter={() => setSelectedArea('box-center')}
                      onClick={() => setSelectedArea('box-center')}
                      className="interactive cursor-pointer group"
                    >
                      <rect x="250" y="290" width="300" height="70" rx="4" fill={selectedArea === 'box-center' ? 'rgba(255, 177, 98, 0.4)' : 'rgba(255, 177, 98, 0.1)'} stroke="#FFB162" strokeOpacity="0.4" strokeWidth={selectedArea === 'box-center' ? 3 : 1} className="transition-all duration-300"/>
                      <rect x="250" y="290" width="300" height="70" fill="url(#seat-pattern)" className="text-gold-400 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"/>
                      <text x="400" y="330" fill="#EEE9DF" fontFamily="sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="2" className="pointer-events-none drop-shadow-md">BOX CENTER</text>
                    </g>

                    <g 
                      onMouseEnter={() => setSelectedArea('side-sofa')}
                      onClick={() => setSelectedArea('side-sofa')}
                      className="interactive cursor-pointer group"
                    >
                      <rect x="50" y="80" width="60" height="280" rx="4" fill={selectedArea === 'side-sofa' ? 'rgba(255, 177, 98, 0.4)' : 'rgba(255, 177, 98, 0.1)'} stroke="#FFB162" strokeOpacity="0.4" strokeWidth={selectedArea === 'side-sofa' ? 3 : 1} className="transition-all duration-300"/>
                      <rect x="50" y="80" width="60" height="280" fill="url(#seat-pattern)" className="text-gold-400 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"/>
                      <text x="80" y="220" fill="#EEE9DF" fontFamily="sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="2" transform="rotate(-90, 80, 220)" className="pointer-events-none drop-shadow-md">SIDE SOFA</text>
                      
                      <rect x="700" y="80" width="60" height="280" rx="4" fill={selectedArea === 'side-sofa' ? 'rgba(255, 177, 98, 0.4)' : 'rgba(255, 177, 98, 0.1)'} stroke="#FFB162" strokeOpacity="0.4" strokeWidth={selectedArea === 'side-sofa' ? 3 : 1} className="transition-all duration-300"/>
                      <rect x="700" y="80" width="60" height="280" fill="url(#seat-pattern)" className="text-gold-400 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"/>
                      <text x="730" y="220" fill="#EEE9DF" fontFamily="sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="2" transform="rotate(90, 730, 220)" className="pointer-events-none drop-shadow-md">SIDE SOFA</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center border-t border-gold-400/20 pt-8">
              <button 
                type="button" 
                onClick={handleCheckout}
                className="bg-gold-400 text-dark px-12 py-4 font-serif text-sm md:text-base tracking-[0.2em] hover:bg-gold-300 transition-colors interactive uppercase shadow-[0_0_20px_rgba(255,177,98,0.4)]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Is there a dress code?", a: "Yes, we strictly enforce a smart casual dress code to maintain the elegant atmosphere of YORU Tokyo. Gentlemen are encouraged to wear collared shirts or blazers. Athletic wear, shorts, and sandals are not permitted." },
    { q: "Are there age restrictions?", a: "As we serve premium alcoholic beverages and aim to provide an undisturbed adult experience, all guests must be 20 years of age or older. Valid identification may be required upon entry." },
    { q: "How does shared seating work?", a: "For specific seating areas designated as \"*Shared\", you may be seated alongside other guests at a communal table or counter. If you prefer absolute privacy, we highly recommend reserving a Box Center or Side Sofa seat." }
  ];

  return (
    <section id="faq" className="py-24 relative bg-dark border-t border-cream/5">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-cream tracking-wider uppercase mb-2">FAQ</h2>
          <p className="text-gold-400 font-sans tracking-[0.3em] text-sm md:text-base">常見問題</p>
          <div className="w-10 h-[1px] bg-gold-400 mx-auto mt-6"></div>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="border-b border-gold-400/20 pb-4 group interactive cursor-pointer">
              <h4 className="font-serif text-cream text-lg tracking-wide uppercase mb-2 flex items-center justify-between">
                {faq.q}
                <ChevronDown className={`text-gold-400 w-5 h-5 transition-transform duration-400 ${openIndex === idx ? 'rotate-180' : 'group-hover:translate-y-1'}`} />
              </h4>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden text-cream/50 font-sans text-lg leading-relaxed tracking-wider"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="relative">
      <div className="noise-overlay"></div>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Schedule />
      <Upcoming />
      <Reservation />
      <FAQ />
      <Footer />
    </div>
  );
}
