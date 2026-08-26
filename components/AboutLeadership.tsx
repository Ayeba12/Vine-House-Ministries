'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, BookOpen, Compass, ChevronDown, ArrowUpRight } from 'lucide-react';

export function AboutLeadership({ onPlanVisit }: { onPlanVisit: () => void }) {
  const [activeDoctrine, setActiveDoctrine] = useState<number | null>(0);

  const doctrines = [
    {
      title: 'The Centrality of Christ (The True Vine)',
      scripture: 'John 15:5',
      summary: 'We believe Jesus Christ is the living center of all faith and life. As branches connected to the true Vine, our spiritual vitality, fruitfulness, and identity flow directly from abiding in Him, not through religious performance.'
    },
    {
      title: 'Biblical Authority & Thoughtful Exegesis',
      scripture: '2 Timothy 3:16–17',
      summary: 'We hold the Holy Scriptures as God-inspired, timeless truth that guides our doctrine, ethics, and daily living. We encourage intellectual curiosity, rigorous contextual study, and transformative personal application.'
    },
    {
      title: 'Sacred Liturgy & Weekly Communion',
      scripture: '1 Corinthians 11:23–26',
      summary: 'Our gatherings prioritize contemplative prayer, acoustic praise, and the weekly sharing of the Lord’s Table — a tangible means of grace where all who seek Christ are welcomed to feast in unity.'
    },
    {
      title: 'Radical Hospitality & Active Compassion',
      scripture: 'Micah 6:8 / Matthew 25:40',
      summary: 'True spirituality is expressed in how we love our neighbors. We actively invest in food security, restorative justice, youth mentorship, and open-door community care across our city.'
    }
  ];

  return (
    <section 
      id="about-leadership" 
      className="py-24 sm:py-32 px-5 sm:px-8 lg:px-12 max-w-7xl mx-auto border-x border-[#2C3E2D]/15 arch-grid font-sans"
    >
      {/* Section Header */}
      <div className="pb-10 border-b border-[#2C3E2D]/15">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold">
            Pastoral Leadership &amp; Ethos
          </span>
          <div className="flex-1 h-px bg-[#2C3E2D]/15"></div>
        </div>

        <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-[#2C3E2D]">
          THE SHEPHERD &amp; VISION
        </h2>
      </div>

      {/* Pastoral Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 pt-12 items-center">
        
        {/* Left: Monolithic Editorial Portrait */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-[#8A9A86]/30 bg-[#1E242B] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
              alt="Pastor Mercy Yerifor - Lead Pastor of Vine House Ministries"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E242B] via-transparent to-transparent opacity-85" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-sans text-xs uppercase tracking-widest text-[#D4A373] font-bold block mb-1">
                Lead Pastor &amp; Spiritual Director
              </span>
              <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#F9F7F2]">
                Mercy Yerifor
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#F9F7F2]/80 mt-1">
                Vine House Ministries • Ordained Shepherd
              </p>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 p-4 bg-white border border-[#8A9A86]/30 rounded-xl shadow-lg hidden sm:block">
            <span className="font-sans text-xs text-[#8A9A86] font-bold uppercase block">Ministry Calling</span>
            <span className="font-anton text-base sm:text-lg uppercase text-[#2C3E2D]">Reverent Spiritual Grounding</span>
          </div>
        </motion.div>

        {/* Right: Pastoral Philosophy & Pastoral Letter */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold block mb-2">
              A Letter From Pastor Mercy
            </span>
            <h3 className="font-anton text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#2C3E2D] leading-tight">
              &ldquo;We built Vine House Ministries for those seeking depth, peace, and unvarnished truth.&rdquo;
            </h3>
          </div>

          <p className="font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
            In our fast-paced modern world, it is easy to find entertainment, but remarkably difficult 
            to find genuine spiritual sanctuary. At Vine House Ministries, our mission is simple: to create a warm, 
            sacred space where individuals and families can encounter Christ, be nourished by sound biblical 
            exegesis, and find authentic community.
          </p>

          <p className="font-sans text-base sm:text-lg text-[#1E242B]/85 leading-relaxed">
            Whether you are a lifelong follower of Christ, a curious seeker, or someone returning to faith 
            after years away, you are welcome here. We don’t ask for perfection or performance — just an open 
            heart to abide in the Vine.
          </p>

          {/* Key Theological Commitments Accordion */}
          <div className="pt-4 space-y-3">
            <span className="font-sans text-xs uppercase tracking-widest text-[#8A9A86] font-bold block mb-1">
              Our Core Doctrinal Anchors:
            </span>

            {doctrines.map((doc, idx) => (
              <div 
                key={idx}
                className="border border-[#8A9A86]/25 rounded-xl overflow-hidden bg-white shadow-2xs"
              >
                <button
                  onClick={() => setActiveDoctrine(activeDoctrine === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#F3EFE6]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-xs font-bold text-[#8A9A86]">0{idx + 1}.</span>
                    <span className="font-anton text-lg uppercase text-[#2C3E2D] tracking-wide">{doc.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#8A9A86] transition-transform ${activeDoctrine === idx ? 'rotate-180' : ''}`} />
                </button>

                {activeDoctrine === idx && (
                  <div className="px-4 pb-4 pt-1 font-sans text-sm text-[#1E242B]/85 border-t border-[#8A9A86]/15 bg-[#F3EFE6]/30">
                    <span className="font-sans text-xs font-bold text-[#D4A373] block mb-1">
                      Scripture Anchor: {doc.scripture}
                    </span>
                    <p className="leading-relaxed">{doc.summary}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onPlanVisit}
              className="group px-6 py-3.5 bg-[#D4A373] hover:bg-[#c69464] text-[#1E242B] font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <span>Meet With Pastoral Team</span>
              <ArrowUpRight className="w-4 h-4 text-[#1E242B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" />
            </button>
            <span className="font-sans text-xs sm:text-sm text-[#8A9A86]">Pastoral Care &amp; Counseling Available</span>
          </div>

        </div>

      </div>
    </section>
  );
}
