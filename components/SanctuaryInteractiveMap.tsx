'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Train, 
  Bus, 
  Accessibility, 
  Copy, 
  Check, 
  ExternalLink, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Clock, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface SanctuaryInteractiveMapProps {
  className?: string;
  showTransitGuide?: boolean;
}

export function SanctuaryInteractiveMap({ 
  className = '', 
  showTransitGuide = true 
}: SanctuaryInteractiveMapProps) {
  const [activeLayer, setActiveLayer] = useState<'sanctuary' | 'transit' | 'parking'>('sanctuary');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('stratford');

  const sanctuaryFullLocation = "Vine House Ministries, Sanctuary Hall, Cranbrook & Eastern Gateway, Greater London & Essex, IG1 4TZ";
  const latitude = 51.5590;
  const longitude = 0.0740;

  // Travel Origins estimates
  const travelOrigins: Record<string, { name: string; time: string; method: string; route: string; tips: string }> = {
    stratford: {
      name: 'Stratford / East London',
      time: '12 – 14 mins',
      method: 'Elizabeth Line / Central Line',
      route: 'Direct Elizabeth Line eastbound to station (2 stops), followed by a 4-minute gentle walk along Cranbrook Rd.',
      tips: 'Step-free lift access available at Stratford and local station.'
    },
    central: {
      name: 'Central London (Liverpool St / Tottenham Ct Rd)',
      time: '18 – 22 mins',
      method: 'Elizabeth Line Direct',
      route: 'Take the Elizabeth Line directly eastbound from Liverpool Street or Paddington without changing trains.',
      tips: 'Fastest route on Sunday mornings with air-conditioned walkthrough carriages.'
    },
    essex: {
      name: 'Essex (Romford, Brentwood & Shenfield)',
      time: '10 – 16 mins',
      method: 'Elizabeth Line Westbound / A12',
      route: 'Take Elizabeth Line westbound towards Central London or drive via A12 / Eastern Avenue directly to our free car park.',
      tips: 'Dedicated free on-site church parking reserved for visitors.'
    },
    chelmsford: {
      name: 'Mid & North Essex (Chelmsford / Colchester)',
      time: '35 – 45 mins',
      method: 'Greater Anglia Rail / A12',
      route: 'Greater Anglia mainline to Shenfield/Stratford connection or direct A12 motorway link south.',
      tips: 'Free car park opens from 8:30 AM every Sunday morning.'
    },
    canary: {
      name: 'Canary Wharf & South London',
      time: '20 – 25 mins',
      method: 'Elizabeth Line / Jubilee Line',
      route: 'Elizabeth Line north to Whitechapel/Stratford, continuing eastbound to the sanctuary hall.',
      tips: 'Smooth journey with full mobile coverage and step-free platforms.'
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(sanctuaryFullLocation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Construct Google Maps Search / Directions URLs
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(sanctuaryFullLocation)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent("Vine House Ministries")}&ll=${latitude},${longitude}`;
  const citymapperUrl = `https://citymapper.com/directions?endcoord=${latitude}%2C${longitude}&endname=${encodeURIComponent("Vine House Ministries Sanctuary Hall")}`;

  // OpenStreetMap embed URL with interactive marker
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=0.0450%2C51.5450%2C0.1050%2C51.5730&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className={`space-y-6 font-sans ${className}`} id="sanctuary-map-container">
      
      {/* Main Map Box */}
      <div className={`bg-white rounded-xl border border-[#8A9A86]/30 shadow-xs overflow-hidden transition-all duration-300 ${
        isExpanded ? 'ring-4 ring-[#2C3E2D]/20 shadow-2xl' : ''
      }`}>
        
        {/* Header Bar above Map */}
        <div className="p-5 sm:p-6 bg-[#2C3E2D] text-[#F9F7F2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[#D4A373] text-[#1E242B] flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-anton text-lg sm:text-xl uppercase tracking-tight text-[#F9F7F2] leading-tight">
                  Sanctuary Location &amp; Regional Hub
                </h3>
                <span className="px-2.5 py-0.5 bg-[#F3EFE6] text-[#2C3E2D] text-xs font-sans font-bold uppercase rounded-md shrink-0">
                  London &amp; Essex
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#F9F7F2]/80 mt-1 leading-relaxed">
                Greater London &amp; Essex Corridor • Registered Charity No: <strong>1148977</strong>
              </p>
            </div>
          </div>

          {/* Layer Switcher & Expand */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0">
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1 bg-white/10 rounded-lg border border-white/15 text-xs font-sans flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => setActiveLayer('sanctuary')}
                className={`px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  activeLayer === 'sanctuary' ? 'bg-[#D4A373] text-[#1E242B] shadow-2xs' : 'text-[#F9F7F2] hover:bg-white/10'
                }`}
                title="Sanctuary Hall view"
              >
                <span>Sanctuary</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('transit')}
                className={`px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeLayer === 'transit' ? 'bg-[#D4A373] text-[#1E242B] shadow-2xs' : 'text-[#F9F7F2] hover:bg-white/10'
                }`}
                title="Transit and rail lines"
              >
                <Train className="w-3.5 h-3.5 shrink-0" />
                <span>Transit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('parking')}
                className={`px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeLayer === 'parking' ? 'bg-[#D4A373] text-[#1E242B] shadow-2xs' : 'text-[#F9F7F2] hover:bg-white/10'
                }`}
                title="Free on-site parking"
              >
                <Car className="w-3.5 h-3.5 shrink-0" />
                <span>Parking</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-lg bg-white/10 text-[#F9F7F2] hover:bg-white/20 border border-white/15 transition-all active:scale-95 shrink-0 cursor-pointer"
              title={isExpanded ? "Collapse map height" : "Expand map view"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Map Frame Container with Overlays */}
        <div className={`relative w-full bg-[#E5E3DF] ${isExpanded ? 'h-[520px]' : 'h-[390px] sm:h-[430px]'} transition-all duration-300`}>
          
          {/* Interactive OSM Map Iframe */}
          <iframe
            title="Vine House Ministries Sanctuary Location Map"
            src={osmEmbedUrl}
            className="w-full h-full border-0 filter contrast-105"
            loading="lazy"
          />

          {/* Floating Venue Information Badge Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-auto max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#2C3E2D]/20 shadow-lg text-[#1E242B] space-y-2 z-10"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-[#2C3E2D] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                  <span>Vine House Ministries</span>
                </div>
                <h4 className="font-anton text-base sm:text-lg uppercase tracking-tight text-[#2C3E2D] mt-0.5">
                  Sanctuary Hall &amp; Charity Office
                </h4>
              </div>
              <span className="px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-xs font-sans font-bold uppercase rounded-md shrink-0">
                UK Registered
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 leading-snug">
              Sanctuary Hall, Greater London &amp; Essex Corridor, Postcode: <strong>IG1 4TZ</strong>
            </p>

            <div className="pt-2 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs sm:text-sm font-sans gap-2">
              <span className="text-[#8A9A86] flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>Sunday: 10:00 AM &amp; 12:00 PM</span>
              </span>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="font-bold text-[#2C3E2D] hover:text-[#D4A373] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Postcode</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Mode Highlights Banner on Map Bottom */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-[#1E242B]/95 backdrop-blur-md text-[#F9F7F2] p-3.5 rounded-xl border border-white/15 text-xs sm:text-sm font-sans shadow-md">
            <div className="flex items-center gap-2">
              {activeLayer === 'sanctuary' && (
                <>
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm leading-snug">Main entrance via step-free welcome lobby with reception stewards.</span>
                </>
              )}
              {activeLayer === 'transit' && (
                <>
                  <Train className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span className="text-xs sm:text-sm leading-snug">Direct Elizabeth Line &amp; Central Line connections (step-free lifts).</span>
                </>
              )}
              {activeLayer === 'parking' && (
                <>
                  <Car className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span className="text-xs sm:text-sm leading-snug">60+ Free visitor bays &amp; accessible blue badge parking on-site.</span>
                </>
              )}
            </div>

            {/* Quick External Navigation Triggers */}
            <div className="flex items-center justify-end">
              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-[#D4A373] hover:bg-[#c49262] text-[#1E242B] font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

        </div>

        {/* Quick Launch Action Ribbon */}
        <div className="p-4 bg-[#F9F7F2] border-t border-[#8A9A86]/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs sm:text-sm font-sans font-bold">
          
          <a
            href={googleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-lg border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all flex items-center justify-center gap-2 text-center text-[#2C3E2D] shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#D4A373]" />
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto sm:ml-0" />
          </a>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-lg border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all flex items-center justify-center gap-2 text-center text-[#2C3E2D] shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#D4A373]" />
            <span>Apple Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto sm:ml-0" />
          </a>

          <a
            href={citymapperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-lg border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all flex items-center justify-center gap-2 text-center text-[#2C3E2D] shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <Train className="w-4 h-4 text-[#D4A373]" />
            <span>Citymapper / TfL</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto sm:ml-0" />
          </a>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="p-3 bg-white rounded-lg border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] hover:text-[#F9F7F2] transition-all flex items-center justify-center gap-2 text-center text-[#2C3E2D] shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied Full Address</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D4A373]" />
                <span>Copy Full Address</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Transit & Accessibility Guide Pillars */}
      {showTransitGuide && (
        <div className="space-y-6">
          
          {/* 4 Pillars of Arrival */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* 01: Rail & Elizabeth Line */}
            <div className="group relative p-6 bg-white rounded-xl border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden">
              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-lg bg-[#2C3E2D] text-[#D4A373] group-hover:bg-[#1E242B] group-hover:scale-105 group-hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-xs">
                    <Train className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#2C3E2D] bg-[#F3EFE6] px-2.5 py-1 rounded-md border border-[#2C3E2D]/10">
                    01 / RAIL
                  </span>
                </div>

                <div>
                  <h5 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors">
                    Rail &amp; Elizabeth Line
                  </h5>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#D4A373]">
                    <Check className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                    <span>Elizabeth &amp; Central Line</span>
                  </div>
                </div>

                <p className="font-sans text-sm text-[#1E242B]/85 leading-relaxed">
                  Direct high-frequency links. 12 mins from Stratford, 18 mins from Liverpool St with step-free elevators and easy street access.
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs sm:text-sm font-sans relative z-10">
                <span className="text-[#8A9A86] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>4-min gentle walk</span>
                </span>
                <span className="font-bold text-[#2C3E2D] bg-[#F3EFE6] px-2 py-0.5 rounded text-xs">Step-Free</span>
              </div>
            </div>

            {/* 02: Free On-Site Parking */}
            <div className="group relative p-6 bg-white rounded-xl border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden">
              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-lg bg-[#F3EFE6] text-[#2C3E2D] group-hover:bg-[#2C3E2D] group-hover:text-[#D4A373] group-hover:scale-105 group-hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-xs border border-[#2C3E2D]/10">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#2C3E2D] bg-[#F3EFE6] px-2.5 py-1 rounded-md border border-[#2C3E2D]/10">
                    02 / PARKING
                  </span>
                </div>

                <div>
                  <h5 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors">
                    Free On-Site Parking
                  </h5>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#D4A373]">
                    <Check className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                    <span>60+ Dedicated Bays</span>
                  </div>
                </div>

                <p className="font-sans text-sm text-[#1E242B]/85 leading-relaxed">
                  Complimentary parking on church grounds with parking steward greeting, designated Blue Badge bays, and EV charging points.
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs sm:text-sm font-sans relative z-10">
                <span className="text-[#8A9A86] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                  <span>Opens 8:30 AM</span>
                </span>
                <span className="font-bold text-[#2C3E2D] bg-[#F3EFE6] px-2 py-0.5 rounded text-xs">Free Pass</span>
              </div>
            </div>

            {/* 03: Regional Bus Links */}
            <div className="group relative p-6 bg-white rounded-xl border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden">
              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-lg bg-[#F3EFE6] text-[#2C3E2D] group-hover:bg-[#2C3E2D] group-hover:text-[#D4A373] group-hover:scale-105 group-hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-xs border border-[#2C3E2D]/10">
                    <Bus className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#2C3E2D] bg-[#F3EFE6] px-2.5 py-1 rounded-md border border-[#2C3E2D]/10">
                    03 / BUS
                  </span>
                </div>

                <div>
                  <h5 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors">
                    Local Bus Routes
                  </h5>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#D4A373]">
                    <Check className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                    <span>Lines 86, 128, 145, 150</span>
                  </div>
                </div>

                <p className="font-sans text-sm text-[#1E242B]/85 leading-relaxed">
                  TfL and regional buses stop directly opposite Sanctuary Hall at Church Gate shelter with covered seating and real-time boards.
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs sm:text-sm font-sans relative z-10">
                <span className="text-[#8A9A86] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3–5 min intervals</span>
                </span>
                <span className="font-bold text-[#2C3E2D] bg-[#F3EFE6] px-2 py-0.5 rounded text-xs">Church Gate</span>
              </div>
            </div>

            {/* 04: Step-Free & Accessibility */}
            <div className="group relative p-6 bg-white rounded-xl border border-[#8A9A86]/25 hover:border-[#2C3E2D] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 overflow-hidden">
              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-lg bg-[#2C3E2D] text-[#D4A373] group-hover:bg-[#1E242B] group-hover:scale-105 group-hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-xs">
                    <Accessibility className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#2C3E2D] bg-[#F3EFE6] px-2.5 py-1 rounded-md border border-[#2C3E2D]/10">
                    04 / ACCESS
                  </span>
                </div>

                <div>
                  <h5 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D] group-hover:text-[#1E242B] transition-colors">
                    Full Accessibility
                  </h5>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#D4A373]">
                    <Check className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                    <span>Step-Free &amp; Induction Loop</span>
                  </div>
                </div>

                <p className="font-sans text-sm text-[#1E242B]/85 leading-relaxed">
                  Zero-threshold entry from street level, designated wheelchair sanctuary bays, T-coil hearing loop, and a calm family nursing lounge.
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#8A9A86]/15 flex items-center justify-between text-xs sm:text-sm font-sans relative z-10">
                <span className="text-[#8A9A86] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>DDA Compliant</span>
                </span>
                <span className="font-bold text-[#2C3E2D] bg-[#F3EFE6] px-2 py-0.5 rounded text-xs">All Levels</span>
              </div>
            </div>

          </div>

          {/* Interactive Travel Time Estimator & Transit Route Calculator */}
          <div className="p-6 bg-white rounded-xl border border-[#8A9A86]/30 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#8A9A86]/15">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#D4A373]" />
                  <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                    Journey Time &amp; Route Estimator
                  </h4>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#1E242B]/75 mt-1">
                  Select your departure area across Greater London &amp; Essex to calculate optimal Sunday travel:
                </p>
              </div>

              {/* Origin Selector (No pill shapes) */}
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(travelOrigins).map(([key, orig]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedOrigin(key)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                      selectedOrigin === key
                        ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-2xs'
                        : 'bg-[#F9F7F2] text-[#1E242B]/75 hover:text-[#2C3E2D]'
                    }`}
                  >
                    {orig.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Origin Details Banner */}
            {travelOrigins[selectedOrigin] && (
              <motion.div
                key={selectedOrigin}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-[#F3EFE6] rounded-xl border border-[#2C3E2D]/15 grid grid-cols-1 md:grid-cols-12 gap-4 items-center font-sans"
              >
                <div className="md:col-span-4 space-y-1.5">
                  <div className="text-xs uppercase tracking-wider text-[#8A9A86] font-bold">
                    From {travelOrigins[selectedOrigin].name}
                  </div>
                  <div className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#2C3E2D]">
                    ~ {travelOrigins[selectedOrigin].time}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2C3E2D] text-[#D4A373] text-xs font-bold uppercase rounded-md">
                    {travelOrigins[selectedOrigin].method}
                  </div>
                </div>

                <div className="md:col-span-5 text-xs sm:text-sm text-[#1E242B]/85 leading-relaxed space-y-1 border-t md:border-t-0 md:border-l border-[#8A9A86]/20 md:pl-5 pt-3 md:pt-0">
                  <strong className="block text-[#2C3E2D]">Recommended Transit Route:</strong>
                  <p>{travelOrigins[selectedOrigin].route}</p>
                </div>

                <div className="md:col-span-3 text-xs sm:text-sm space-y-2 border-t md:border-t-0 md:border-l border-[#8A9A86]/20 md:pl-5 pt-3 md:pt-0">
                  <div className="p-2.5 bg-white rounded-lg border border-[#8A9A86]/20 text-xs text-[#1E242B]/80">
                    <strong className="text-[#2C3E2D] block mb-0.5">Traveler Tip:</strong>
                    {travelOrigins[selectedOrigin].tips}
                  </div>
                  <a
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2C3E2D] hover:text-[#D4A373] cursor-pointer"
                  >
                    <span>View Live Traffic / Rail Status &rarr;</span>
                  </a>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
