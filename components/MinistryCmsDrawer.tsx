'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  CheckCircle2, 
  Users, 
  Radio, 
  Mail, 
  Calendar, 
  BookOpen, 
  Search, 
  HelpCircle,
  FileSpreadsheet,
  Megaphone,
  Save,
  Check
} from 'lucide-react';
import { Sermon, ChurchEvent, RSVPRecord, Subscriber } from '@/lib/types';

interface MinistryCmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sermons: Sermon[];
  onAddSermon: (sermon: Sermon) => void;
  onDeleteSermon: (id: string) => void;
  events: ChurchEvent[];
  onAddEvent: (event: ChurchEvent) => void;
  rsvps: RSVPRecord[];
  onToggleCheckIn: (rsvpId: string) => void;
  subscribers: Subscriber[];
  noticeBanner?: string;
  onUpdateNoticeBanner?: (text: string) => void;
}

export function MinistryCmsDrawer({
  isOpen,
  onClose,
  sermons,
  onAddSermon,
  onDeleteSermon,
  events,
  onAddEvent,
  rsvps,
  onToggleCheckIn,
  subscribers,
  noticeBanner = 'LIVE SANCTUARY: Sunday Morning Liturgy & Eucharist begins at 10:00 AM GMT • In-Person & Streaming',
  onUpdateNoticeBanner = () => {}
}: MinistryCmsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'sermons' | 'events' | 'subscribers' | 'notice' | 'guide'>('rsvps');

  // Search & Filter
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('All');

  // New Sermon Form State
  const [isAddingSermon, setIsAddingSermon] = useState(false);
  const [newSermon, setNewSermon] = useState({
    title: '',
    series: 'The True Vine Series',
    speaker: 'Pastor Mercy Yerifor',
    speakerRole: 'Lead Pastor & Spiritual Director',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    duration: '35 mins',
    scripture: '',
    summary: '',
    audioUrl: 'https://cdn.freesound.org/previews/557/557117_11861866-lq.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    tags: 'Faith, Worship, Grace'
  });

  // New Event Form State
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Worship' as const,
    date: 'Friday, September 18, 2026',
    time: '7:30 PM – 9:00 PM',
    location: 'Vine House Main Sanctuary',
    room: 'Sanctuary Hall A',
    capacity: 100,
    description: '',
    host: 'Pastor Mercy Yerifor',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
  });

  // Notice banner state
  const [bannerInput, setBannerInput] = useState(noticeBanner);
  const [bannerSaved, setBannerSaved] = useState(false);

  if (!isOpen) return null;

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
      r.qrPassCode.toLowerCase().includes(rsvpSearch.toLowerCase());
    const matchesEvent = selectedEventFilter === 'All' || r.eventId === selectedEventFilter;
    return matchesSearch && matchesEvent;
  });

  const handleExportRsvpCsv = () => {
    const headers = 'Pass ID,Event Title,Attendee Name,Email,Phone,Guests,First Time Visitor,Date Created,Checked In\n';
    const rows = filteredRsvps.map(r => 
      `"${r.qrPassCode}","${r.eventTitle}","${r.name}","${r.email}","${r.phone}",${r.guestsCount},${r.isFirstTimeVisitor ? 'Yes' : 'No'},"${r.createdAt}",${r.checkedIn ? 'Yes' : 'No'}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Vine_House_RSVP_Manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveBanner = () => {
    onUpdateNoticeBanner(bannerInput);
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2500);
  };

  const handleCreateSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSermon.title || !newSermon.scripture) return;

    const sermonObj: Sermon = {
      id: `sermon-${Date.now()}`,
      title: newSermon.title,
      series: newSermon.series,
      speaker: newSermon.speaker,
      speakerRole: newSermon.speakerRole,
      date: newSermon.date,
      duration: newSermon.duration,
      audioDurationSeconds: 2100,
      scripture: newSermon.scripture,
      summary: newSermon.summary || 'A transformative message delivered to the congregation.',
      keyTakeaways: ['Living in divine alignment with Christ.', 'Walking in daily spiritual communion.'],
      audioUrl: newSermon.audioUrl,
      imageUrl: newSermon.imageUrl,
      transcriptSnippet: `Scripture passage: ${newSermon.scripture}. We are reminded that in the sanctuary of God, peace transcends our circumstances.`,
      tags: newSermon.tags.split(',').map(t => t.trim())
    };

    onAddSermon(sermonObj);
    setIsAddingSermon(false);
    setNewSermon({
      title: '',
      series: 'The True Vine Series',
      speaker: 'Pastor Mercy Yerifor',
      speakerRole: 'Lead Pastor & Spiritual Director',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      duration: '35 mins',
      scripture: '',
      summary: '',
      audioUrl: 'https://cdn.freesound.org/previews/557/557117_11861866-lq.mp3',
      imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
      tags: 'Faith, Worship, Grace'
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const eventObj: ChurchEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      room: newEvent.room,
      capacity: Number(newEvent.capacity),
      rsvpdCount: 0,
      description: newEvent.description || 'Join us for a sacred gathering of worship and fellowship.',
      host: newEvent.host,
      imageUrl: newEvent.imageUrl,
      highlights: ['Communal Fellowship', 'Pastoral Blessing', 'Hospitality Provided']
    };

    onAddEvent(eventObj);
    setIsAddingEvent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#F9F7F2] text-[#1E242B] w-full max-w-5xl h-[90vh] rounded-2xl border border-[#8A9A86]/30 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#2C3E2D] text-[#F9F7F2] flex items-center justify-between border-b border-[#F9F7F2]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F9F7F2]/10 rounded-xl">
              <SlidersHorizontal className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-anton text-xl uppercase tracking-wide">Vine House Ministry Portal</h3>
                <span className="text-xs font-sans bg-[#8A9A86]/30 text-[#F9F7F2] px-2 py-0.5 rounded-lg border border-[#8A9A86]/40">
                  Staff v2.6
                </span>
              </div>
              <p className="text-xs text-[#F9F7F2]/75 font-sans">
                Simplified Ministry Dashboard for Pastor Mercy Yerifor &amp; Leadership
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#F9F7F2]/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-[#EBE7DF] border-b border-[#8A9A86]/20 overflow-x-auto shrink-0 text-xs font-sans font-medium">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'rsvps' ? 'bg-[#2C3E2D] text-[#F9F7F2] font-semibold shadow-xs' : 'text-[#1E242B]/80 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Event RSVPs ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sermons')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'sermons' ? 'bg-[#2C3E2D] text-[#F9F7F2] font-semibold shadow-xs' : 'text-[#1E242B]/80 hover:bg-white/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sermons &amp; Podcasts ({sermons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'events' ? 'bg-[#2C3E2D] text-[#F9F7F2] font-semibold shadow-xs' : 'text-[#1E242B]/80 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Events ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'subscribers' ? 'bg-[#2C3E2D] text-[#F9F7F2] font-semibold shadow-xs' : 'text-[#1E242B]/80 hover:bg-white/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Newsletter Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notice')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'notice' ? 'bg-[#2C3E2D] text-[#F9F7F2] font-semibold shadow-xs' : 'text-[#1E242B]/80 hover:bg-white/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Alert Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ml-auto ${
              activeTab === 'guide' ? 'bg-[#2C3E2D] text-[#F9F7F2] font-semibold shadow-xs' : 'text-[#1E242B]/80 hover:bg-white/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Handover Guide (1-Click)</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#F9F7F2]">
          
          {/* 1. RSVPS TAB */}
          {activeTab === 'rsvps' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#8A9A86]/20">
                <div>
                  <h4 className="font-anton text-2xl uppercase text-[#2C3E2D]">Event RSVP Manifest</h4>
                  <p className="text-xs text-[#1E242B]/70">Track and check in guests at the sanctuary entrance</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportRsvpCsv}
                    className="px-4 py-2.5 bg-white border border-[#8A9A86]/35 hover:border-[#2C3E2D] hover:bg-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xs text-[#1E242B] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#2C3E2D]" />
                    <span>Export CSV Manifest</span>
                  </button>
                </div>
              </div>

              {/* Search & Event filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8A9A86] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search attendee by name, email, or pass ID..."
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#8A9A86]/30 rounded-xl text-xs text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                  />
                </div>

                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8A9A86]/30 rounded-xl text-xs text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                >
                  <option value="All">All Events</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              {/* RSVP Table */}
              <div className="bg-white rounded-2xl border border-[#8A9A86]/20 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3EFE6] border-b border-[#8A9A86]/20 text-[#1E242B]/75 font-sans uppercase text-xs">
                    <tr>
                      <th className="p-3">Pass ID</th>
                      <th className="p-3">Attendee</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Party Size</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Entrance Check-In</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8A9A86]/10 font-sans">
                    {filteredRsvps.map((r) => (
                      <tr key={r.id} className="hover:bg-[#F9F7F2] transition-colors">
                        <td className="p-3 font-sans font-bold text-[#D4A373]">{r.qrPassCode}</td>
                        <td className="p-3">
                          <p className="font-semibold text-[#1E242B]">{r.name}</p>
                          <p className="text-xs text-[#1E242B]/60 font-sans">{r.email}</p>
                        </td>
                        <td className="p-3 font-medium text-[#1E242B]/85 max-w-xs truncate">{r.eventTitle}</td>
                        <td className="p-3 font-sans text-[#1E242B]/70">{r.guestsCount} Guest(s)</td>
                        <td className="p-3">
                          {r.isFirstTimeVisitor ? (
                            <span className="px-2 py-0.5 bg-[#D4A373]/20 text-[#1E242B] font-semibold rounded-md font-sans text-xs">
                              First Timer
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-[#8A9A86]/20 text-[#2C3E2D] rounded-md font-sans text-xs">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onToggleCheckIn(r.id)}
                            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all inline-flex items-center gap-1.5 active:scale-95 ${
                              r.checkedIn
                                ? 'bg-[#2C3E2D] text-[#F9F7F2]'
                                : 'bg-[#F3EFE6] text-[#1E242B] hover:bg-[#2C3E2D] hover:text-[#F9F7F2]'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{r.checkedIn ? 'Checked In' : 'Admit / Check In'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. SERMONS TAB */}
          {activeTab === 'sermons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#8A9A86]/20">
                <div>
                  <h4 className="font-anton text-2xl uppercase text-[#2C3E2D]">Sermon &amp; Podcast Manager</h4>
                  <p className="text-xs text-[#1E242B]/70">Publish or archive teaching messages</p>
                </div>
                <button
                  onClick={() => setIsAddingSermon(!isAddingSermon)}
                  className="px-4 py-2 bg-[#D4A373] text-[#1E242B] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#c69464] flex items-center gap-2 shadow-xs transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingSermon ? 'Cancel' : 'Add New Sermon'}</span>
                </button>
              </div>

              {/* Add Sermon Form Drawer */}
              {isAddingSermon && (
                <form onSubmit={handleCreateSermon} className="p-5 bg-white rounded-2xl border border-[#8A9A86]/30 shadow-md space-y-3 text-xs">
                  <h5 className="font-anton text-lg uppercase text-[#2C3E2D]">Publish New Sermon Episode</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Sermon Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Walking in Quiet Strength"
                        value={newSermon.title}
                        onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Scripture Passage *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Psalm 23:1-6"
                        value={newSermon.scripture}
                        onChange={(e) => setNewSermon({ ...newSermon, scripture: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Series</label>
                      <input
                        type="text"
                        value={newSermon.series}
                        onChange={(e) => setNewSermon({ ...newSermon, series: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Speaker</label>
                      <input
                        type="text"
                        value={newSermon.speaker}
                        onChange={(e) => setNewSermon({ ...newSermon, speaker: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Duration</label>
                      <input
                        type="text"
                        value={newSermon.duration}
                        onChange={(e) => setNewSermon({ ...newSermon, duration: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Message Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of the theological message..."
                      value={newSermon.summary}
                      onChange={(e) => setNewSermon({ ...newSermon, summary: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2C3E2D] text-[#F9F7F2] font-semibold uppercase text-xs rounded-xl hover:bg-[#1E242B] transition-colors active:scale-95"
                  >
                    Publish Sermon to Website
                  </button>
                </form>
              )}

              {/* Sermons List */}
              <div className="space-y-2">
                {sermons.map((s) => (
                  <div key={s.id} className="p-4 bg-white rounded-xl border border-[#8A9A86]/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2C3E2D] text-[#D4A373] flex items-center justify-center font-sans text-xs font-bold shrink-0">
                        EP
                      </div>
                      <div>
                        <h5 className="font-anton text-lg uppercase text-[#2C3E2D]">{s.title}</h5>
                        <p className="text-xs font-sans text-[#1E242B]/70">{s.scripture} • {s.speaker} • {s.date}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteSermon(s.id)}
                      className="p-2 text-[#1E242B]/40 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete sermon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#8A9A86]/20">
                <div>
                  <h4 className="font-anton text-2xl uppercase text-[#2C3E2D]">Event Calendar Manager</h4>
                  <p className="text-xs text-[#1E242B]/70">Schedule services, worship nights, and outreach</p>
                </div>
                <button
                  onClick={() => setIsAddingEvent(!isAddingEvent)}
                  className="px-4 py-2 bg-[#D4A373] text-[#1E242B] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#c69464] flex items-center gap-2 shadow-xs transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingEvent ? 'Cancel' : 'Create Event'}</span>
                </button>
              </div>

              {isAddingEvent && (
                <form onSubmit={handleCreateEvent} className="p-5 bg-white rounded-2xl border border-[#8A9A86]/30 shadow-md space-y-3 text-xs">
                  <h5 className="font-anton text-lg uppercase text-[#2C3E2D]">Schedule New Church Program</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Event Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Prayer & Fasting Vigil"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Category</label>
                      <select
                        value={newEvent.category}
                        onChange={(e: any) => setNewEvent({ ...newEvent, category: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      >
                        <option value="Worship">Worship</option>
                        <option value="Fellowship">Fellowship</option>
                        <option value="Study">Study</option>
                        <option value="Outreach">Outreach</option>
                        <option value="Youth">Youth</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Date</label>
                      <input
                        type="text"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Time</label>
                      <input
                        type="text"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase text-[#1E242B]/70 font-semibold block mb-1">Seating Capacity</label>
                      <input
                        type="number"
                        value={newEvent.capacity}
                        onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#F9F7F2] border border-[#8A9A86]/30 rounded-xl text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2C3E2D] text-[#F9F7F2] font-semibold uppercase text-xs rounded-xl hover:bg-[#1E242B] transition-colors active:scale-95"
                  >
                    Save & Publish Event
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 bg-white rounded-xl border border-[#8A9A86]/20 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-sans uppercase bg-[#8A9A86]/20 text-[#2C3E2D] px-2 py-0.5 rounded-md font-bold">
                        {ev.category}
                      </span>
                      <h5 className="font-anton text-xl uppercase text-[#2C3E2D] mt-2">{ev.title}</h5>
                      <p className="text-xs font-sans text-[#1E242B]/70 mt-1">{ev.date} • {ev.time}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#8A9A86]/10 flex justify-between items-center text-xs">
                      <span className="font-sans text-[#1E242B]/70">{ev.rsvpdCount}/{ev.capacity} RSVPs</span>
                      <span className="font-sans text-[#D4A373] font-bold">Active Registration</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUBSCRIBERS TAB */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#8A9A86]/20">
                <div>
                  <h4 className="font-anton text-2xl uppercase text-[#2C3E2D]">Newsletter Subscribers</h4>
                  <p className="text-xs text-[#1E242B]/70">Captured community emails ready for Mailchimp / Brevo export</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#8A9A86]/20 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3EFE6] border-b border-[#8A9A86]/20 text-[#1E242B]/75 font-sans uppercase text-xs">
                    <tr>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Preference</th>
                      <th className="p-3">Subscribed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8A9A86]/10 font-sans">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#F9F7F2]">
                        <td className="p-3 font-semibold text-[#1E242B]">{sub.email}</td>
                        <td className="p-3 font-sans text-[#1E242B]/70">{sub.frequency}</td>
                        <td className="p-3 font-sans text-[#1E242B]/60">{sub.subscribedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. NOTICE BANNER TAB */}
          {activeTab === 'notice' && (
            <div className="space-y-4 max-w-xl">
              <div className="pb-4 border-b border-[#8A9A86]/20">
                <h4 className="font-anton text-2xl uppercase text-[#2C3E2D]">Sanctuary Live Alert Banner</h4>
                <p className="text-xs text-[#1E242B]/70">Update top announcement (e.g. Livestream broadcast, inclement weather, holiday times)</p>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase text-[#1E242B]/70 font-semibold mb-1">Banner Announcement Text</label>
                <input
                  type="text"
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  placeholder="e.g. Join Us This Sunday 10:00 AM • Sanctuary Hall A • Livestream Online"
                  className="w-full p-3 bg-white border border-[#8A9A86]/30 rounded-xl text-sm text-[#1E242B] focus:outline-none focus:border-[#2C3E2D]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveBanner}
                  className="px-6 py-2.5 bg-[#2C3E2D] text-[#F9F7F2] font-semibold uppercase text-xs rounded-xl hover:bg-[#1E242B] flex items-center gap-2 transition-colors active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Banner</span>
                </button>
                {bannerSaved && (
                  <span className="text-xs font-sans text-[#2C3E2D] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A373]" /> Banner updated live!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 6. GUIDE TAB (For 1/5 Tech Proficiency Client) */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-2xl font-sans text-xs sm:text-sm text-[#1E242B]/85 leading-relaxed">
              <div className="pb-4 border-b border-[#8A9A86]/20">
                <h4 className="font-anton text-2xl uppercase text-[#2C3E2D]">Staff Quick-Start Guide (Zero Tech Jargon)</h4>
                <p className="text-xs text-[#1E242B]/70">Prepared specifically for Pastor Mercy Yerifor & Ministry Volunteers</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#8A9A86]/20 space-y-3">
                <h5 className="font-anton text-base uppercase text-[#2C3E2D]">1. Managing Sunday RSVPs</h5>
                <p>
                  When visitors sign up for events or services, their name immediately appears under the <strong>Event RSVPs</strong> tab. At the church entrance, volunteers can click <strong>&ldquo;Admit / Check In&rdquo;</strong> to verify arrivals.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#8A9A86]/20 space-y-3">
                <h5 className="font-anton text-base uppercase text-[#2C3E2D]">2. Publishing Sunday Sermons</h5>
                <p>
                  Click <strong>&ldquo;Add New Sermon&rdquo;</strong> in the Sermons tab. Enter the message title, scripture reference, and paste your audio link. The podcast player and study notes will update on the live site automatically.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#8A9A86]/20 space-y-3">
                <h5 className="font-anton text-base uppercase text-[#2C3E2D]">3. Exporting Email Lists</h5>
                <p>
                  Click <strong>&ldquo;Export CSV Manifest&rdquo;</strong> anytime to download a spreadsheet file for your Mailchimp or church records.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#EBE7DF] border-t border-[#8A9A86]/20 flex items-center justify-between text-xs text-[#1E242B]/70 font-sans shrink-0">
          <span>Vine House Contemporary Sanctuary CMS</span>
          <button
            onClick={onClose}
            className="font-bold text-[#2C3E2D] uppercase hover:underline"
          >
            Close Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
