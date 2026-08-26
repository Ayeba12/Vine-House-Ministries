'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  Calendar, 
  MapPin, 
  Clock,
  Compass,
  Radio,
  Church,
  ChevronRight,
  Heart
} from 'lucide-react';

interface NavbarProps {
  onOpenCms: () => void;
  onOpenPlanVisit?: () => void;
  onPlanVisit?: () => void;
  isPlayingAudio?: boolean;
  onToggleAudio?: () => void;
  activeSermonTitle?: string;
  noticeBanner?: string;
}

export function Navbar({ 
  onOpenCms, 
  onOpenPlanVisit, 
  onPlanVisit,
  isPlayingAudio = false, 
  onToggleAudio,
  activeSermonTitle,
  noticeBanner
}: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showNotice, setShowNotice] = useState(true);

  const handlePlanVisit = () => {
    if (onPlanVisit) onPlanVisit();
    else if (onOpenPlanVisit) onOpenPlanVisit();
    else {
      const el = document.getElementById('visit');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/visit');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'About', href: '/about', num: '01' },
    { label: 'Sermons', href: '/sermons', num: '02' },
    { label: 'Gatherings', href: '/gatherings', num: '03' },
    { label: 'Events', href: '/events', num: '04' },
    { label: 'Visit', href: '/visit', num: '05' },
    { label: 'Contact', href: '/contact', num: '06' },
  ];

  return (
    <>
      {/* Top Sanctuary Live Notice Ribbon */}
      {noticeBanner && showNotice && (
        <aside 
          id="top-sanctuary-notice-bar"
          aria-label="Sanctuary Notice"
          className="bg-[#2C3E2D] text-[#F9F7F2] text-xs font-sans py-2 px-4 border-b border-[#D4A373]/30 relative z-50 transition-all"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 truncate">
              <Radio className="w-3.5 h-3.5 text-[#D4A373] animate-pulse shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[#D4A373] shrink-0 text-xs">
                LIVE SANCTUARY
              </span>
              <span className="truncate text-[#F9F7F2]/90 font-sans text-xs">
                {noticeBanner}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline font-sans text-xs text-[#F9F7F2]/60 border-l border-[#F9F7F2]/20 pl-3">
                LONDON GMT/BST
              </span>
              <button 
                id="btn-dismiss-notice-banner"
                onClick={() => setShowNotice(false)} 
                className="text-[#F9F7F2]/60 hover:text-[#D4A373] p-1 transition-colors"
                aria-label="Dismiss banner"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Sticky Header */}
      <header 
        id="main-navigation"
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#F9F7F2]/95 backdrop-blur-md shadow-xs border-b border-[#2C3E2D]/10 py-2.5 sm:py-3' 
            : 'bg-transparent border-0 shadow-none py-3 sm:py-4'
        } ${
          noticeBanner && showNotice ? 'top-[37px]' : 'top-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                id="nav-brand-logo"
                href="/" 
                className="group flex items-center gap-2.5 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-md bg-[#2C3E2D] flex items-center justify-center text-[#D4A373] shadow-xs group-hover:bg-[#1E242B] transition-colors shrink-0">
                  <span className="font-anton text-lg leading-none">V</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-anton text-lg sm:text-xl tracking-tight text-[#2C3E2D] uppercase leading-none group-hover:text-[#1E242B] transition-colors">
                    VINE HOUSE MINISTRIES
                  </span>
                  <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-semibold leading-tight">
                    Greater London &amp; Essex
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation Island (Hidden on Mobile & Tablet, visible on lg+) */}
            <nav 
              id="desktop-nav-menu" 
              className="hidden lg:flex items-center gap-1 xl:gap-2 px-3.5 py-1.5 bg-[#F3EFE6]/90 backdrop-blur-md border border-[#2C3E2D]/10 rounded-xl shadow-2xs shrink min-w-0" 
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  href={link.href}
                  className="group relative px-3 py-1 text-xs lg:text-sm font-sans font-semibold text-[#1E242B]/85 hover:text-[#2C3E2D] rounded-lg hover:bg-white/80 transition-all whitespace-nowrap"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Action Suite (Right CTA Buttons) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Ministry CMS Portal Button (Framed Border Button) */}
              <button
                id="btn-navbar-cms"
                onClick={onOpenCms}
                className="hidden xl:flex items-center gap-2 px-3.5 py-2 border border-[#8A9A86]/35 rounded-xl text-xs font-sans font-bold uppercase tracking-wider text-[#2C3E2D] bg-white/90 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all duration-200 shadow-2xs active:scale-[0.98] group cursor-pointer"
                title="Open Ministry Staff Portal"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A9A86] group-hover:text-[#D4A373] transition-colors" />
                <span>CMS</span>
              </button>

              {/* Plan a Visit CTA Button (Desktop & Tablet only, hidden on mobile) */}
              <button
                id="btn-navbar-plan-visit"
                onClick={handlePlanVisit}
                className="group hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 bg-[#2C3E2D] text-[#F9F7F2] hover:bg-[#1E242B] text-xs font-sans font-bold tracking-wider uppercase rounded-xl transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Plan A Visit</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
              </button>

              {/* Minimalist Animated Hamburger / Close Button (Mobile & Tablet) */}
              <button
                id="btn-navbar-mobile-toggle"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex lg:hidden flex-col items-center justify-center gap-1.5 p-2 text-[#2C3E2D] hover:bg-[#2C3E2D]/5 rounded-xl transition-colors focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                <span 
                  className={`w-5 h-[2px] bg-[#2C3E2D] rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''
                  }`} 
                />
                <span 
                  className={`w-5 h-[2px] bg-[#2C3E2D] rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Minimalist Borderless Mobile & Tablet Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-x-0 bottom-0 ${
              noticeBanner && showNotice ? 'top-[95px]' : 'top-[64px]'
            } z-30 bg-[#F9F7F2]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto lg:hidden p-6 sm:p-10`}
          >
            {/* Top architectural links list */}
            <div className="max-w-2xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between pb-2">
                <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
                  Sanctuary Navigation
                </span>
                <span className="font-sans text-xs text-[#2C3E2D] font-bold">
                  {currentTime}
                </span>
              </div>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 + 0.05, duration: 0.25 }}
                  >
                    <Link
                      id={`mobile-nav-${link.label.toLowerCase()}`}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 px-3 -mx-3 rounded-xl hover:bg-white/70 active:bg-white transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-sans text-xs font-bold text-[#D4A373]">
                          {link.num}
                        </span>
                        <span className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#D4A373] transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#8A9A86]/60 group-hover:text-[#2C3E2D] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Quick Actions in Drawer */}
              <div className="pt-4 space-y-3">
                <button
                  id="btn-mobile-plan-visit"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handlePlanVisit();
                  }}
                  className="group w-full py-3.5 bg-[#D4A373] text-[#1E242B] text-center font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 hover:bg-[#c69464] cursor-pointer"
                >
                  <span>Plan A Sunday Visit</span>
                  <ArrowUpRight className="w-4 h-4 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </button>

                <button
                  id="btn-mobile-cms"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCms();
                  }}
                  className="group w-full py-3 bg-white border border-[#8A9A86]/35 text-[#2C3E2D] hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] text-center font-sans font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#8A9A86] group-hover:text-[#D4A373] transition-colors" />
                  <span>Ministry Staff CMS &amp; RSVPs</span>
                </button>
              </div>
            </div>

            {/* Bottom Sanctuary Details */}
            <div className="max-w-2xl mx-auto w-full mt-8 p-5 bg-white/80 backdrop-blur-md rounded-2xl font-sans space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#2C3E2D]">
                <Church className="w-4 h-4 text-[#D4A373]" />
                <span className="font-bold text-xs">Vine House Ministries</span>
              </div>
              <p className="text-xs text-[#1E242B]/75 leading-relaxed">
                Greater London &amp; Essex • Registered Charity No: 1148977 (England &amp; Wales)
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-sans text-[#8A9A86]">
                <span>Sundays 10:00 AM &amp; 12:00 PM</span>
                <span className="text-[#2C3E2D] font-bold">In-Person &amp; Online</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
