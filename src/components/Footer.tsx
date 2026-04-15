import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-dark pt-16 pb-8 overflow-hidden relative border-t border-gold-400/20">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-32">
          {/* Left: Newsletter */}
          <div className="w-full lg:w-1/3 max-w-md">
            <div className="mb-6">
              <h4 className="font-serif text-gold-400 text-lg tracking-wider mb-3">The YORU Dispatch</h4>
              <p className="font-sans text-cream/70 text-sm tracking-wider leading-relaxed">
                A curated weekly newsletter featuring upcoming performances, exclusive artist interviews, and behind-the-scenes stories from the heart of Tokyo's vintage jazz scene.
              </p>
            </div>
            <form className="mb-4" onSubmit={e => e.preventDefault()}>
              <div className="relative flex items-center border-b border-cream/30 focus-within:border-gold-400 transition-colors pb-2">
                <input 
                  type="email" 
                  placeholder="Subscribe the newsletter" 
                  className="w-full bg-transparent text-cream text-sm px-2 py-2 focus:outline-none font-sans tracking-wider placeholder:text-cream/30" 
                />
                <button 
                  type="submit" 
                  className="text-gold-400 hover:text-cream px-4 flex items-center justify-center transition-colors uppercase tracking-widest text-xs font-sans whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="font-sans text-cream/50 text-xs tracking-wider leading-relaxed px-2">
              By clicking Subscribe you agree to our <a href="#" className="underline hover:text-gold-400 transition-colors">Terms and Conditions</a>.
            </p>
          </div>

          {/* Right: Links */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h4 className="font-serif text-cream text-lg tracking-wider mb-8">Explore</h4>
              <ul className="space-y-5 font-sans text-sm text-cream/70 tracking-wider">
                <li><a href="/#schedule" className="hover:text-gold-400 transition-colors">Schedule</a></li>
                <li><a href="/#upcoming" className="hover:text-gold-400 transition-colors">Upcoming</a></li>
                <li><a href="/#reservation" className="hover:text-gold-400 transition-colors">Reservation</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Map Overview</a></li>
                <li><a href="#faq" className="hover:text-gold-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-cream text-lg tracking-wider mb-8">Contact</h4>
              <ul className="space-y-5 font-sans text-sm text-cream/70 tracking-wider">
                <li><a href="tel:0354850088" className="hover:text-gold-400 transition-colors">03-5485-0088</a></li>
                <li><a href="mailto:vip@yoru-jazz.com" className="hover:text-gold-400 transition-colors">vip@yoru-jazz.com</a></li>
                <li><span className="block">8-Chome, Ginza,</span><span className="block">Chuo City, Tokyo</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-cream text-lg tracking-wider mb-8">Beyond YORU</h4>
              <ul className="space-y-5 font-sans text-sm text-cream/70 tracking-wider">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Merch</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center font-sans text-xs text-cream/50 tracking-wider gap-4">
          <div className="hover:text-cream transition-colors cursor-pointer">Site by YORU</div>
          <div className="hover:text-cream transition-colors cursor-pointer">©2026 YORU. All rights reserved.</div>
          <div className="hover:text-cream transition-colors cursor-pointer">Privacy Policy</div>
          <div className="hover:text-cream transition-colors cursor-pointer">Terms of Service</div>
          <div className="hover:text-cream transition-colors cursor-pointer">Cookies Settings</div>
        </div>
      </div>
    </footer>
  );
}
