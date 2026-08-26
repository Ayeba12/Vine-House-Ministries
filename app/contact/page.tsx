'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  Building, 
  FileText, 
  HelpCircle,
  MessageSquare,
  ArrowUpRight,
  Compass,
  Users
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MinistryCmsDrawer } from '@/components/MinistryCmsDrawer';
import { SanctuaryInteractiveMap } from '@/components/SanctuaryInteractiveMap';
import { INITIAL_SERMONS, INITIAL_EVENTS, INITIAL_RSVPS, INITIAL_SUBSCRIBERS } from '@/lib/data';

export default function ContactPage() {
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Form Type: 'general' | 'prayer' | 'sacraments' | 'charity'
  const [formCategory, setFormCategory] = useState<'general' | 'prayer' | 'sacraments' | 'charity'>('general');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: 'Greater London',
    subject: '',
    message: '',
    isConfidential: true,
    preferredContact: 'email'
  });

  const [submissionSuccess, setSubmissionSuccess] = useState<null | {
    refCode: string;
    category: string;
    name: string;
    email: string;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const ref = `VHM-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmissionSuccess({
      refCode: ref,
      category: formCategory === 'general' ? 'General Ministry Enquiry'
        : formCategory === 'prayer' ? 'Confidential Prayer & Pastoral Care'
        : formCategory === 'sacraments' ? 'Sacred Rites & Pastoral Request'
        : 'Charity Commission & Governance Enquiry',
      name: formData.name,
      email: formData.email
    });
  };

  return (
    <main className="min-h-screen bg-[#F9F7F2] text-[#1E242B] selection:bg-[#2C3E2D] selection:text-[#F9F7F2] pb-16">
      {/* Top Navigation */}
      <Navbar 
        onOpenCms={() => setIsCmsOpen(true)}
      />

      {/* Hero Header Section */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto arch-grid border-x border-[#2C3E2D]/10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#8A9A86] mb-6">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-semibold">Contact &amp; Ministry Office</span>
        </div>

        {/* Monumental Header with Photographic Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <Mail className="w-4 h-4 text-[#D4A373]" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
                Charity Office &amp; Pastoral Care
              </span>
            </div>

            <h1 className="font-anton text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] uppercase tracking-tight text-[#2C3E2D] break-words">
              Get In Touch <br />
              <span className="text-[#1E242B]">&amp; Pastoral Enquiries</span>
            </h1>

            <p className="mt-6 font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
              Whether you are seeking pastoral prayer, requesting sacramental rites, contacting our ministry office, or enquiring about our charity outreach across Greater London &amp; Essex, we welcome your correspondence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#8A9A86]/30 shadow-md group"
          >
            <Image
              src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80"
              alt="Vine House Pastoral Ministry Team"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white font-sans">
              <span className="px-2 py-0.5 bg-[#D4A373] text-[#1E242B] text-[10px] font-bold uppercase rounded inline-block mb-1">
                Pastoral Care Team
              </span>
              <h4 className="font-anton text-xl uppercase tracking-tight">
                Here to Listen, Pray, &amp; Guide
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                Pastoral office response guaranteed within 24 hours
              </p>
            </div>
          </motion.div>
        </div>

        {/* Charity Registration Status Banner */}
        <div className="mt-10 p-5 bg-white rounded-xl border border-[#8A9A86]/25 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#2C3E2D] text-[#D4A373] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-bold text-[#2C3E2D] uppercase tracking-wider">
                  Vine House Ministries
                </span>
                <span className="px-2 py-0.5 bg-[#F3EFE6] text-[#2C3E2D] text-[10px] font-sans font-bold uppercase rounded">
                  Charity Commission Registered
                </span>
              </div>
              <p className="font-sans text-xs text-[#1E242B]/75 mt-0.5">
                Registered Charity in England &amp; Wales • Charity No: <strong>1148977</strong> • Serving Greater London &amp; Essex
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans shrink-0">
            <span className="text-[#8A9A86]">Looking to attend Sunday Liturgy?</span>
            <Link 
              href="/visit" 
              className="font-bold text-[#2C3E2D] hover:text-[#D4A373] underline flex items-center gap-1"
            >
              <span>Plan a Visit Guide</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Key Department Channels Grid with Photography */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Department 1: General Enquiries */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden group hover:border-[#2C3E2D] transition-all flex flex-col justify-between">
            <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Ministry Office Administration"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Administration
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                Ministry Office &amp; Administration
              </h4>
              <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                For general administrative enquiries, charity governance, venue information, and volunteering opportunities.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 space-y-1 font-sans text-xs">
                <div className="text-[#2C3E2D] font-bold">enquiries@vinehouseministries.org.uk</div>
                <div className="text-[#8A9A86]">Mon – Fri: 9:00 AM – 5:00 PM GMT</div>
              </div>
            </div>
          </div>

          {/* Department 2: Pastoral Care & Prayer */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden group hover:border-[#2C3E2D] transition-all flex flex-col justify-between">
            <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                alt="Pastoral Care and Prayer"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Pastoral Care
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                Pastoral Care &amp; Prayer Team
              </h4>
              <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                For confidential prayer requests, hospital or home visitations, pastoral counseling appointments, and bereavement support.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 space-y-1 font-sans text-xs">
                <div className="text-[#2C3E2D] font-bold">pastoral@vinehouseministries.org.uk</div>
                <div className="text-[#8A9A86]">Confidential Response within 24 Hours</div>
              </div>
            </div>
          </div>

          {/* Department 3: Sacred Rites & Sacraments */}
          <div className="bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs overflow-hidden group hover:border-[#2C3E2D] transition-all flex flex-col justify-between">
            <div className="relative h-44 w-full bg-[#1E242B] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80"
                alt="Sacred Rites Baptisms and Dedications"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-10" />
              <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-[#2C3E2D] text-[#D4A373] text-[10px] font-sans font-bold uppercase rounded">
                Sacred Rites
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h4 className="font-anton text-xl uppercase tracking-tight text-[#2C3E2D]">
                Sacred Rites &amp; Partnerships
              </h4>
              <p className="font-sans text-xs text-[#1E242B]/75 leading-relaxed">
                For water baptisms, infant/child dedications, Christian wedding blessings, and community charity partnerships in London &amp; Essex.
              </p>
              <div className="pt-3 border-t border-[#8A9A86]/15 space-y-1 font-sans text-xs">
                <div className="text-[#2C3E2D] font-bold">sacraments@vinehouseministries.org.uk</div>
                <div className="text-[#8A9A86]">Greater London &amp; Essex Area</div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Contact & Enquiry Hub */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Suite */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#8A9A86]/30 shadow-xs">
            
            {/* Category Selector Pills */}
            <div className="mb-6 pb-6 border-b border-[#8A9A86]/15">
              <label className="block text-xs font-sans font-bold text-[#1E242B] mb-2.5 uppercase tracking-wider">
                Select Enquiry Purpose
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'general', label: 'General Enquiry' },
                  { id: 'prayer', label: 'Pastoral & Prayer' },
                  { id: 'sacraments', label: 'Sacred Rites' },
                  { id: 'charity', label: 'Charity & Trust' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFormCategory(tab.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 text-center cursor-pointer ${
                      formCategory === tab.id
                        ? 'bg-[#2C3E2D] text-[#F9F7F2] shadow-xs'
                        : 'bg-[#F9F7F2] border border-[#8A9A86]/30 text-[#1E242B] hover:border-[#2C3E2D] hover:text-[#2C3E2D] hover:bg-white shadow-2xs'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {!submissionSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Sterling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@example.co.uk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">
                      Contact Telephone (UK)
                    </label>
                    <input
                      type="tel"
                      placeholder="020 8553 0000 or +44 7000 000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">
                      Region / Area
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#2C3E2D] font-semibold focus:outline-none focus:border-[#2C3E2D]"
                    >
                      <option value="Greater London">Greater London (East / Central / North)</option>
                      <option value="Essex">Essex (Ilford, Romford, Brentwood, Chelmsford)</option>
                      <option value="Other UK">Other Region in England &amp; Wales</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder={
                      formCategory === 'prayer' ? 'e.g. Prayer for family health / pastoral consultation' :
                      formCategory === 'sacraments' ? 'e.g. Water baptism enquiry / child dedication' :
                      formCategory === 'charity' ? 'e.g. Charity partnership / trustee correspondence' :
                      'e.g. Question regarding ministry activities'
                    }
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#1E242B] mb-1">
                    Your Message / Prayer Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please share details of your enquiry or prayer request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#2C3E2D]/15 rounded-lg text-xs font-sans text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                {formCategory === 'prayer' && (
                  <div className="p-3 bg-[#F9F7F2] rounded-lg border border-[#8A9A86]/20 text-xs font-sans text-[#1E242B]/80 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4A373] shrink-0" />
                    <span>Pastoral discretion guaranteed: All prayer requests are held in strict pastoral confidence.</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="group w-full sm:w-auto px-8 py-3.5 bg-[#2C3E2D] hover:bg-[#1E242B] text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Send Ministry Message</span>
                    <Send className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#D4A373] mx-auto" />
                <h4 className="font-anton text-2xl uppercase tracking-tight text-[#2C3E2D]">
                  Message Received by Ministry Office
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submissionSuccess.name}</strong>. Your enquiry (Ref: <strong className="text-[#2C3E2D]">{submissionSuccess.refCode}</strong>) has been routed to our team. A confirmation has been sent to <strong>{submissionSuccess.email}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        area: 'Greater London',
                        subject: '',
                        message: '',
                        isConfidential: true,
                        preferredContact: 'email'
                      });
                    }}
                    className="px-5 py-2.5 bg-white border border-[#2C3E2D]/30 hover:border-[#2C3E2D] hover:bg-[#2C3E2D] text-[#2C3E2D] hover:text-[#F9F7F2] font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Office Address, Charity Details, Office Hours */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Charity Registration Card */}
            <div className="p-6 bg-[#2C3E2D] text-[#F9F7F2] rounded-2xl border border-[#8A9A86]/30 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold">
                  Legal &amp; Charity Registration
                </span>
              </div>

              <h4 className="font-anton text-xl uppercase tracking-tight text-[#F9F7F2]">
                Vine House Ministries
              </h4>

              <div className="space-y-2 font-sans text-xs text-[#F9F7F2]/80 border-t border-white/15 pt-3">
                <div className="flex justify-between">
                  <span>Charity Commission No:</span>
                  <strong className="text-[#D4A373]">1148977</strong>
                </div>
                <div className="flex justify-between">
                  <span>Jurisdiction:</span>
                  <strong className="text-[#F9F7F2]">England &amp; Wales</strong>
                </div>
                <div className="flex justify-between">
                  <span>Operational Area:</span>
                  <strong className="text-[#F9F7F2]">Greater London / Essex</strong>
                </div>
                <div className="flex justify-between">
                  <span>Governing Document:</span>
                  <strong className="text-[#F9F7F2]">Constitution (Trustees)</strong>
                </div>
              </div>
            </div>

            {/* Postal Address & Telephone */}
            <div className="p-6 bg-white rounded-2xl border border-[#8A9A86]/25 shadow-2xs space-y-4 font-sans text-xs">
              <h5 className="font-anton text-lg uppercase tracking-tight text-[#2C3E2D]">
                Ministry Office &amp; Address
              </h5>

              <div className="space-y-3 text-[#1E242B]/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#2C3E2D]">Vine House Ministries</strong>
                    <span>Sanctuary Hall, Greater London &amp; Essex Region</span>
                    <span className="block text-[#8A9A86]">United Kingdom</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-[#8A9A86]/15">
                  <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <div>
                    <strong className="block text-[#2C3E2D]">Ministry Telephone</strong>
                    <span>+44 (0)20 8553 1188</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-[#8A9A86]/15">
                  <Clock className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <div>
                    <strong className="block text-[#2C3E2D]">Office Hours</strong>
                    <span>Monday – Friday: 9:00 AM – 5:00 PM GMT</span>
                    <span className="block text-[#8A9A86]">Sunday Services: 10:00 AM &amp; 12:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Link Card */}
            <div className="p-5 bg-[#F3EFE6] rounded-xl border border-[#2C3E2D]/15 space-y-2 font-sans text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#2C3E2D]">
                <Compass className="w-4 h-4 text-[#D4A373]" />
                <span>Planning to Visit This Sunday?</span>
              </div>
              <p className="text-[#1E242B]/75 leading-relaxed">
                If you are planning to attend our Sunday morning liturgy, reserve a visitor welcome pass, or check transit routes:
              </p>
              <Link
                href="/visit"
                className="inline-flex items-center gap-1 font-bold text-[#2C3E2D] hover:text-[#D4A373] pt-1"
              >
                <span>Go to Plan Your Visit &rarr;</span>
              </Link>
            </div>

          </div>

        </div>

        {/* Interactive Map & Sanctuary Directions Section */}
        <div className="mt-16 pt-12 border-t border-[#8A9A86]/20">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#D4A373]" />
                <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
                  Interactive Sanctuary Map &amp; Transit Guide
                </span>
              </div>
              <h2 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#2C3E2D]">
                Find Sanctuary Hall
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#1E242B]/80 max-w-2xl mt-1">
                Explore our location in the Greater London &amp; Essex corridor. Use the interactive layer controls, calculate estimated travel times, or open turn-by-turn directions in your preferred navigation app.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Vine+House+Ministries,+Sanctuary+Hall,+Greater+London"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#2C3E2D] hover:bg-[#1E242B] text-[#F9F7F2] font-sans font-bold text-xs rounded-md transition-all shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>Open in Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D4A373]" />
              </a>
            </div>
          </div>

          {/* Render the Interactive Map Component */}
          <SanctuaryInteractiveMap showTransitGuide={true} />
        </div>

      </section>

      {/* Footer */}
      <Footer 
        onSubscribe={() => {}}
        onOpenCms={() => setIsCmsOpen(true)}
        onPlanVisit={() => {}}
      />

      {/* CMS Drawer */}
      <MinistryCmsDrawer
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        sermons={INITIAL_SERMONS}
        onAddSermon={() => {}}
        onDeleteSermon={() => {}}
        events={INITIAL_EVENTS}
        onAddEvent={() => {}}
        rsvps={INITIAL_RSVPS}
        onToggleCheckIn={() => {}}
        subscribers={INITIAL_SUBSCRIBERS}
      />
    </main>
  );
}
