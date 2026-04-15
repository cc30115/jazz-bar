import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, Triangle, Menu, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 px-6 md:px-12 flex justify-between items-center ${scrolled ? 'bg-dark/90 backdrop-blur-md border-b border-gold-400/10 py-3' : 'py-4'}`}>
      <Link to="/" className="text-2xl font-logo tracking-[0.25em] font-bold text-cream cursor-pointer interactive">
        YORU
      </Link>
      <div className="hidden md:flex space-x-8 text-sm tracking-widest font-sans uppercase">
        <Link to="/#schedule" className="text-cream/70 hover:text-gold-400 transition-colors interactive">Schedule</Link>
        <Link to="/#upcoming" className="text-cream/70 hover:text-gold-400 transition-colors interactive">Upcoming</Link>
        <Link to="/#reservation" className="text-cream/70 hover:text-gold-400 transition-colors interactive">Reservation</Link>
      </div>
      <Link to="/#reservation" className="border border-gold-400 text-gold-400 px-5 py-2 text-sm tracking-widest hover:bg-gold-400 hover:text-dark transition-all interactive hidden md:block uppercase font-sans">
        Reserve
      </Link>
      <button className="md:hidden text-gold-400 text-xl interactive">
        <Menu />
      </button>
    </nav>
  );
}

export default function Editorial() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const galleryImages = [
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop"
  ];
  
  // Duplicate for infinite feel
  const extendedImages = [...galleryImages, ...galleryImages, ...galleryImages];

  return (
    <div className="min-h-screen bg-dark text-cream font-sans selection:bg-gold-400/30 selection:text-gold-400">
      {/* Navigation Bar */}
      <Navbar />

      <main className="pt-0">
        {/* A. 基本資訊區 & B. 主視覺區 */}
        <header className="relative w-full min-h-[70vh] flex flex-col justify-end pb-16 md:pb-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop" 
              alt="Summer Jazz Camp All Stars" 
              className="w-full h-full object-cover grayscale opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-gold-400 text-dark px-3 py-1 text-xs font-bold tracking-widest uppercase">Pick Up</span>
                <span className="text-cream/60 font-mono text-sm">2026.05.15</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream uppercase tracking-wider leading-tight mb-4">
                Summer Jazz Camp All Stars
              </h1>
              <p className="text-gold-400 font-sans text-lg md:text-xl tracking-widest uppercase">
                The Next Generation of Jazz Excellence
              </p>
            </motion.div>
          </div>
        </header>

        {/* C. 引言區 & D. 編輯資訊 */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20 border-b border-cream/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <p className="text-xl md:text-2xl text-cream/90 leading-relaxed font-serif italic mb-12 border-l-4 border-gold-400 pl-6">
              "Jazz is not just music, it's a way of life, a way of being, a way of thinking." 
              This summer, we bring together the most promising young talents from across the globe to redefine the boundaries of contemporary jazz.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-cream/50 font-mono border-t border-cream/10 pt-8 mt-12">
              <div className="mb-4 sm:mb-0">
                <span className="block text-cream/30 uppercase tracking-widest text-xs mb-1">Interview & Text</span>
                Kenji Takahashi
              </div>
              <div>
                <span className="block text-cream/30 uppercase tracking-widest text-xs mb-1">Cooperation</span>
                Tokyo Jazz Festival Committee
              </div>
            </div>
          </motion.div>
        </section>

        {/* E. 內容主體 */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <div className="space-y-16">
            {/* 1. 敘述段落 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl text-gold-400 tracking-widest uppercase mb-6">A New Era Begins</h2>
              <p className="text-cream/80 leading-relaxed text-lg mb-6">
                The Summer Jazz Camp has always been a crucible for raw talent, but this year's ensemble brings something entirely unprecedented to the stage. Selected from over 500 applicants worldwide, these five musicians represent the absolute vanguard of their respective instruments.
              </p>
              <p className="text-cream/80 leading-relaxed text-lg">
                What makes this group special isn't just their technical proficiency—which is staggering—but their deep understanding of the jazz tradition combined with a fearless approach to modern harmony and rhythm.
              </p>
            </motion.div>

            {/* 2. 多媒體嵌入 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full aspect-video bg-darker border border-cream/10 flex items-center justify-center relative overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=1000&auto=format&fit=crop" 
                alt="Band Rehearsal" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              />
              <div className="relative z-10 w-16 h-16 rounded-full bg-gold-400/90 flex items-center justify-center cursor-pointer hover:bg-gold-400 hover:scale-110 transition-all">
                <Triangle className="w-6 h-6 text-dark fill-current ml-1" />
              </div>
            </motion.div>

            {/* 3. 問答區塊 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="font-serif text-2xl text-gold-400 tracking-widest uppercase mb-8">In Conversation</h2>
              
              <div className="bg-cream/5 p-8 rounded-sm border border-cream/10">
                <p className="text-gold-400 font-bold mb-4 text-lg">Q: How did this specific group of musicians come together?</p>
                <p className="text-cream/80 leading-relaxed text-lg">
                  It was incredibly organic. We met during the first day of the camp's jam session. There was this immediate unspoken connection. We started playing a standard, but within minutes it morphed into this complex, polyrhythmic exploration. We just looked at each other and knew this was the group.
                </p>
              </div>

              <div className="bg-cream/5 p-8 rounded-sm border border-cream/10">
                <p className="text-gold-400 font-bold mb-4 text-lg">Q: What can the audience expect from your performance at YORU?</p>
                <p className="text-cream/80 leading-relaxed text-lg">
                  A journey. We're honoring the acoustic tradition of the club, but we're bringing our own compositions that reflect our diverse backgrounds—from classical Indian music to modern electronic influences, all filtered through the lens of acoustic jazz. It's going to be intimate, intense, and completely unrepeatable.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Horizontal Scroll Gallery */}
        <section className="py-16 border-t border-cream/10 overflow-hidden bg-dark">
          <div className="max-w-7xl mx-auto px-6 mb-10">
            <h2 className="font-serif text-2xl text-gold-400 tracking-widest uppercase">Gallery</h2>
          </div>
          <div className="relative w-full overflow-hidden">
            <motion.div 
              drag="x" 
              dragConstraints={{ left: -5000, right: 0 }}
              className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
            >
              {extendedImages.map((img, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[500px] aspect-[16/9] flex-shrink-0 relative group overflow-hidden border border-cream/10">
                  <img src={img} draggable={false} alt={`Gallery ${i+1}`} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-105" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* F. 導流區 */}
        <section className="bg-darker py-20 border-y border-gold-400/20">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 md:p-10 lg:p-12 border-t-2 border-t-gold-400 rounded-sm"
            >
              <div className="flex items-center justify-between mb-8 border-b border-gold-400/20 pb-4">
                <h2 className="font-serif text-2xl md:text-3xl text-gold-400 tracking-[0.2em] uppercase">Event Information</h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400"></span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
                <div>
                  <h3 className="text-xl md:text-2xl text-cream font-serif uppercase tracking-wider mb-6 leading-snug">Summer Jazz Camp All Stars Live at YORU</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Calendar className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Date</p>
                        <p className="text-cream/90 text-sm md:text-base">2026.06.15 (Fri) - 06.16 (Sat)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Time</p>
                        <p className="text-cream/90 text-sm md:text-base">1st Show: 19:00 / 2nd Show: 21:30</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Venue</p>
                        <p className="text-cream/90 text-sm md:text-base">YORU Tokyo Ginza</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Users className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-cream/50 text-xs uppercase tracking-widest mb-1">Line-up</p>
                        <p className="text-cream/90 text-sm md:text-base leading-relaxed">
                          Piano: Sarah Chen<br/>
                          Bass: Marcus Johnson<br/>
                          Drums: Yuki Tanaka
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gold-400/10 pt-8 md:pt-0 md:pl-12">
                  <div className="flex items-center justify-center sm:justify-start mb-4">
                    <div className="w-3 h-3 rounded-full bg-gold-400 mr-3 shadow-[0_0_8px_rgba(255,177,98,0.6)]"></div>
                    <p className="font-sans text-sm text-cream/70 tracking-[0.2em] uppercase">Online Booking</p>
                  </div>
                  <a href="#reservation" className="w-full bg-[#E5A960] hover:bg-[#F2B975] text-darker py-3.5 md:py-4 font-serif text-sm md:text-base tracking-[0.2em] interactive uppercase text-center font-bold shadow-[0_0_20px_rgba(229,169,96,0.3)] transition-all rounded-md mb-8">
                    Reserve Tickets
                  </a>

                  <p className="font-sans text-sm text-cream/60 tracking-[0.2em] uppercase mb-2 text-center sm:text-left">Phone Reservation</p>
                  <p className="font-serif text-2xl md:text-3xl text-gold-400 tracking-wider mb-3 cursor-pointer hover:text-gold-300 transition-colors text-center sm:text-left">03-5485-0088</p>
                  <div className="font-sans text-sm text-cream/50 tracking-wider leading-relaxed text-center sm:text-left space-y-1">
                    <p>12:00pm - 7:30pm (Mon.-Fri.)</p>
                    <p>12:00pm - 6:30pm (Sat., Sun. & Hol.)</p>
                  </div>
                </div>
              </div>

              {/* Ticket Prices */}
              <div className="pt-10 border-t border-gold-400/20 text-left">
                <h4 className="text-xl text-gold-400 font-serif uppercase tracking-wider mb-8 text-center">Ticket Prices</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="border border-cream/10 p-6 text-center bg-dark/50">
                    <p className="text-cream/50 text-sm uppercase tracking-widest mb-2">Standard</p>
                    <p className="text-cream font-serif text-2xl mb-2">¥8,000</p>
                    <p className="text-cream/40 text-xs">Table seating</p>
                  </div>
                  <div className="border border-gold-400/30 p-6 text-center bg-gold-400/5 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gold-400 text-dark text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Recommended</div>
                    <p className="text-gold-400 text-sm uppercase tracking-widest mb-2">Premium</p>
                    <p className="text-cream font-serif text-2xl mb-2">¥12,000</p>
                    <p className="text-cream/40 text-xs">Front row table + 1 Drink</p>
                  </div>
                  <div className="border border-cream/10 p-6 text-center bg-dark/50">
                    <p className="text-cream/50 text-sm uppercase tracking-widest mb-2">VIP Box</p>
                    <p className="text-cream font-serif text-2xl mb-2">¥25,000</p>
                    <p className="text-cream/40 text-xs">Private box (up to 4 pax)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* G. 作者 / 人物介紹 */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-b border-cream/10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img 
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" 
              alt="Author" 
              className="w-24 h-24 rounded-full object-cover grayscale"
            />
            <div className="text-center md:text-left">
              <h4 className="text-gold-400 font-serif text-xl tracking-wider mb-2">Kenji Takahashi</h4>
              <p className="text-cream/40 text-sm uppercase tracking-widest mb-4">Music Journalist / Critic</p>
              <p className="text-cream/70 leading-relaxed">
                Based in Tokyo, Kenji has been covering the international jazz scene for over two decades. His work focuses on the intersection of traditional acoustic jazz and modern improvisational movements.
              </p>
            </div>
          </div>
        </section>

        {/* H. 延伸內容 */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h3 className="font-serif text-2xl text-cream tracking-widest uppercase mb-10 text-center">Related Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "The Evolution of Ginza's Jazz Scene", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop" },
              { title: "Interview: The Blue Notes Quartet", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=500&auto=format&fit=crop" },
              { title: "Acoustic Perfection: Designing YORU", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop" }
            ].map((item, i) => (
              <Link to="/editorial/1" key={i} className="group block">
                <div className="aspect-[4/3] overflow-hidden mb-4 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105" />
                </div>
                <h4 className="text-cream/90 group-hover:text-gold-400 transition-colors font-serif text-lg tracking-wide leading-snug">{item.title}</h4>
              </Link>
            ))}
          </div>
        </section>

        {/* I. 導覽 */}
        <nav className="border-t border-cream/10 bg-darker">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
            <Link to="/editorial/prev" className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-cream/10 hover:bg-cream/5 transition-colors group flex flex-col items-start">
              <span className="text-cream/40 text-xs uppercase tracking-widest mb-3 flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </span>
              <span className="text-gold-400 font-serif text-xl tracking-wider group-hover:text-gold-300 transition-colors">The Blue Notes Quartet</span>
            </Link>
            <Link to="/editorial/next" className="flex-1 p-8 md:p-12 hover:bg-cream/5 transition-colors group flex flex-col items-end text-right">
              <span className="text-cream/40 text-xs uppercase tracking-widest mb-3 flex items-center">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </span>
              <span className="text-gold-400 font-serif text-xl tracking-wider group-hover:text-gold-300 transition-colors">Simon Phillips & Protocol 6</span>
            </Link>
          </div>
        </nav>
      </main>
      
      <Footer />
    </div>
  );
}
