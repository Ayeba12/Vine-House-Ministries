'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { NoticeBar } from '@/components/NoticeBar';

interface NavbarProps {
  onOpenPlanVisit?: () => void;
  onPlanVisit?: () => void;
  isPlayingAudio?: boolean;
  onToggleAudio?: () => void;
  activeSermonTitle?: string;
  noticeBanner?: string;
}

const NAV_LINKS = [
  { label: 'About', href: '/about', num: '01' },
  { label: 'Sermons', href: '/sermons', num: '02' },
  { label: 'Messages', href: '/messages', num: '03' },
  { label: 'Events', href: '/events', num: '04' },
  { label: 'Contact', href: '/contact', num: '05' },
];

export function Navbar({
  onOpenPlanVisit,
  onPlanVisit,
  // TODO: the navbar does not yet reflect playback state; two pages pass this.
  isPlayingAudio: _isPlayingAudio = false,
  noticeBanner,
}: NavbarProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  const handlePlanVisit = () => {
    if (onPlanVisit) onPlanVisit();
    else if (onOpenPlanVisit) onOpenPlanVisit();
    else router.push('/visit');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const noticeVisible = Boolean(noticeBanner && showNotice);

  return (
    <>
      {noticeVisible && noticeBanner && <NoticeBar text={noticeBanner} onDismiss={() => setShowNotice(false)} />}

      <header
        id="main-navigation"
        className={`fixed inset-x-0 z-40 transition-[background-color,border-color,padding] duration-300 ${
          noticeVisible ? 'top-[37px]' : 'top-0'
        } ${
          isScrolled
            ? 'border-b border-hairline bg-surface/95 py-3 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
          <Link id="nav-brand-logo" href="/" className="group flex items-center gap-3">
            {/* The emblem, green on the sand ground: see DESIGN.md §2.5. */}
            <Image
              src="/brand/vine-house-emblem-green.png"
              alt=""
              width={44}
              height={44}
              priority
              className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
            />
            <span className="font-anton text-[1.35rem] uppercase leading-none text-ink-strong transition-colors group-hover:text-ink sm:text-2xl">
              Vine House Ministries
            </span>
          </Link>

          <nav
            id="desktop-nav-menu"
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                id={`nav-link-${link.label.toLowerCase()}`}
                href={link.href}
                className="group inline-flex items-center gap-1 font-sans text-sm font-medium text-ink transition-colors hover:text-ink-strong"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-3 w-3 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-5">
            <button
              id="btn-navbar-plan-visit"
              onClick={handlePlanVisit}
              className="link-arrow hidden text-ink-strong sm:inline-flex"
            >
              <span>Plan a visit</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <button
              id="btn-navbar-mobile-toggle"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-ink-strong lg:hidden"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`h-px w-6 bg-current transition-transform duration-300 ${
                  mobileMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-6 bg-current transition-transform duration-300 ${
                  mobileMenuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-x-0 bottom-0 z-30 flex flex-col justify-between overflow-y-auto bg-surface px-5 pb-8 pt-10 sm:px-8 lg:hidden ${
              noticeVisible ? 'top-[37px]' : 'top-0'
            }`}
          >
            <nav className="mt-16 flex flex-col divide-y divide-hairline border-y border-hairline">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  id={`mobile-nav-${link.label.toLowerCase()}`}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center justify-between py-4"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="meta text-ink-muted">{link.num}</span>
                    <span className="font-anton scale-step-h4 uppercase text-ink-strong transition-colors group-hover:text-accent">
                      {link.label}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>

            <div className="mt-10 flex flex-col gap-6">
              <button
                id="btn-mobile-plan-visit"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePlanVisit();
                }}
                className="btn btn-primary w-full"
              >
                <span>Plan a Sunday visit</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <dl className="meta grid grid-cols-2 gap-x-6 gap-y-2 text-ink-muted">
                <dt>Sundays</dt>
                <dd className="text-ink">10:00 &amp; 12:00</dd>
                <dt>Charity No.</dt>
                <dd className="text-ink">1148977</dd>
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
