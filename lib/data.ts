import { Sermon, ChurchEvent, GatheringPillar, RSVPRecord, Subscriber } from './types';

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 'sermon-01',
    title: 'Abiding in the Sacred Vine',
    series: 'The True Vine Series',
    speaker: 'Pastor Mercy Yerifor',
    speakerRole: 'Lead Pastor & Spiritual Director',
    date: 'August 16, 2026',
    duration: '38 mins',
    audioDurationSeconds: 2280,
    scripture: 'John 15:1–8',
    summary: 'An exploration of what it means to live connected to Christ in an era of constant distraction, finding spiritual grounding, fruitful peace, and enduring strength.',
    keyTakeaways: [
      'Remaining in Christ is an intentional surrender of hurry.',
      'Fruitfulness flows naturally from intimacy, not exhausted striving.',
      'Pruning seasons are not punitive; they are restorative preparation for deeper life.'
    ],
    audioUrl: 'https://cdn.freesound.org/previews/557/557117_11861866-lq.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    transcriptSnippet: 'When Jesus spoke of the vine and the branches, He was not giving an agricultural metaphor for productivity. He was giving a sanctuary of being. "Without me, you can do nothing." In our modern culture of endless doing, the sanctuary invites us back into sacred being...',
    tags: ['Spiritual Growth', 'Abiding', 'Peace', 'Grace']
  },
  {
    id: 'sermon-02',
    title: 'The Architecture of Silence & Solitude',
    series: 'Quiet Wilderness',
    speaker: 'Pastor Mercy Yerifor',
    speakerRole: 'Lead Pastor & Spiritual Director',
    date: 'August 09, 2026',
    duration: '42 mins',
    audioDurationSeconds: 2520,
    scripture: '1 Kings 19:11–13',
    summary: 'Discovering God not in the earthquake or the consuming fire, but in the gentle, reverent stillness of modern contemplative prayer.',
    keyTakeaways: [
      'Silence is not the absence of sound, but the presence of holy attention.',
      'Learning to quiet internal noise before entering communal liturgy.',
      'Building regular Sabbath rhythms in modern city life.'
    ],
    audioUrl: 'https://cdn.freesound.org/previews/563/563812_11861866-lq.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    transcriptSnippet: 'God passed by—not in the tearing wind, not in the shattered rocks, but in the sound of sheer silence. When we create space for silence, we discover that God has been speaking all along...',
    tags: ['Prayer', 'Contemplation', 'Sabbath', 'Quietness']
  },
  {
    id: 'sermon-03',
    title: 'Grounded Grace: Living Without Pretense',
    series: 'Grounded Grace',
    speaker: 'Pastor Mercy Yerifor',
    speakerRole: 'Lead Pastor & Spiritual Director',
    date: 'August 02, 2026',
    duration: '35 mins',
    audioDurationSeconds: 2100,
    scripture: 'Romans 8:31–39',
    summary: 'A call to strip away spiritual facades and encounter God’s unwavering love with genuine vulnerability and community fellowship.',
    keyTakeaways: [
      'Grace meets us in reality, not our curated religious projections.',
      'True fellowship requires the courage to be seen and loved.',
      'Nothing can sever the branch firmly grafted into the living Vine.'
    ],
    audioUrl: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    transcriptSnippet: 'For I am convinced that neither death nor life, neither angels nor demons... will be able to separate us from the love of God. We are held by grace that does not waver with our performance...',
    tags: ['Grace', 'Assurance', 'Fellowship', 'Vulnerability']
  },
  {
    id: 'sermon-04',
    title: 'Liturgies for the Modern City',
    series: 'Modern Faith',
    speaker: 'Minister David K. Sterling',
    speakerRole: 'Associate Minister of Liturgy & Teaching',
    date: 'July 26, 2026',
    duration: '40 mins',
    audioDurationSeconds: 2400,
    scripture: 'Colossians 3:12–17',
    summary: 'How everyday habits, communal table fellowship, and workplace vocations can become sacred acts of worship in modern society.',
    keyTakeaways: [
      'Every space we inhabit is holy ground when surrendered to God.',
      'Transforming routine interactions into conduits of mercy and peace.',
      'Singing psalms and spiritual hymns in the rhythm of daily commutes.'
    ],
    audioUrl: 'https://cdn.freesound.org/previews/495/495539_11861866-lq.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    transcriptSnippet: 'Whatever you do, whether in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through Him. Our daily work is liturgy in action...',
    tags: ['Vocation', 'Culture', 'Worship', 'Daily Life']
  }
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: 'event-01',
    title: 'Night of Sacred Ascent & Acoustic Worship',
    category: 'Worship',
    date: 'Friday, August 28, 2026',
    time: '7:30 PM – 9:30 PM',
    location: 'Vine House Main Sanctuary',
    room: 'Sanctuary Hall A (The Stone Room)',
    capacity: 120,
    rsvpdCount: 94,
    description: 'An immersive candlelit evening of reverent acoustic praise, communal prayers of intercession, scripture immersion, and quiet communion.',
    host: 'Pastor Mercy Yerifor & Worship Ensemble',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Candlelit Sanctuary Setting', 'Communal Bread & Cup', 'Personal Prayer Ministry', 'Live Acoustic Hymns']
  },
  {
    id: 'event-02',
    title: 'First-Timers & Seekers Welcome Brunch',
    category: 'Fellowship',
    date: 'Sunday, September 06, 2026',
    time: '11:45 AM – 1:00 PM',
    location: 'Vine House Fellowship Commons',
    room: 'The Glass Atrium Garden',
    capacity: 45,
    rsvpdCount: 32,
    description: 'A relaxed, warm gathering for anyone new to Vine House or exploring faith. Meet Pastor Mercy, connect with fellow seekers, and enjoy artisanal pastries & pour-over coffee.',
    host: 'Mercy Yerifor & Welcome Team',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Artisan Coffee & Light Brunch', 'Meet Pastoral Leadership', 'No Pressure Dialogue', 'Welcome Gift Pack']
  },
  {
    id: 'event-03',
    title: 'Scripture Lab: The Gospel of John In-Depth',
    category: 'Study',
    date: 'Wednesday, September 09, 2026',
    time: '7:00 PM – 8:30 PM',
    location: 'Vine House Library & Online Stream',
    room: 'Room 204 & Stream Hall',
    capacity: 60,
    rsvpdCount: 48,
    description: 'An interactive theological study dissecting the theological architecture of John’s Gospel, examining historical context, ancient Greek nuances, and transformative life applications.',
    host: 'Rev. David K. Sterling',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Printed Study Notes & Greek Lexicon Guides', 'Interactive Q&A Session', 'Breakout Discussion Circles', 'Complimentary Herbal Teas']
  },
  {
    id: 'event-04',
    title: 'Vineyard Community Outreach & Food Pantry Drive',
    category: 'Outreach',
    date: 'Saturday, September 12, 2026',
    time: '9:00 AM – 1:00 PM',
    location: 'Community Commons & Urban Route',
    room: 'South Courtyard Logistics Bay',
    capacity: 80,
    rsvpdCount: 65,
    description: 'Joining hands with local shelters and family support centers to pack, bless, and distribute fresh organic groceries and warm care packages to over 300 neighborhood families.',
    host: 'Community Care Action Board',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Direct Neighborhood Care', 'Family-Friendly Volunteer Roles', 'Breakfast Provided for Volunteers', 'Community Blessing Circle']
  }
];

export const GATHERING_PILLARS: GatheringPillar[] = [
  {
    number: '01',
    title: 'Sunday Sanctuary Worship',
    subtitle: 'Reverence & Word',
    timing: '10:00 AM & 12:00 PM',
    location: 'Main Sanctuary Hall',
    description: 'Our weekly gathering centered around reverent modern liturgy, acoustic and choral praise, deep Christ-centered biblical exposition, and weekly communion.',
    tags: ['Weekly Liturgy', 'All Generations', 'Communion', 'Kids Sanctuary'],
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80'
  },
  {
    number: '02',
    title: 'Midweek Scripture Lab',
    subtitle: 'Theology & Dialogue',
    timing: 'Wednesdays at 7:00 PM',
    location: 'Library & Online Portal',
    description: 'A thoughtful, conversational space to dissect Biblical texts, ask honest intellectual and theological questions, and engage in intentional prayer circles.',
    tags: ['Deep Exegesis', 'Interactive Q&A', 'Contemplative Prayer'],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    number: '03',
    title: 'Vine Youth & Young Adults',
    subtitle: 'Authentic Community',
    timing: 'Fridays at 7:30 PM',
    location: 'The Loft Commons',
    description: 'A vibrant, raw space for high school, university students, and young professionals navigating faith, career, relationships, and calling in modern culture.',
    tags: ['Dinner Together', 'Live Music', 'Mentorship Rhythms'],
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80'
  },
  {
    number: '04',
    title: 'Communal Care & Outreach',
    subtitle: 'Faith in Action',
    timing: 'Saturdays at 9:00 AM',
    location: 'Community Action Hub',
    description: 'Extending Christ’s hands through food justice, elderly visitations, counseling support scholarships, and active neighborhood renewal initiatives.',
    tags: ['Food Relief', 'Community Advocacy', 'Compassion Fund'],
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80'
  }
];

export const INITIAL_RSVPS = [
  {
    id: 'RSVP-101',
    eventId: 'event-01',
    eventTitle: 'Night of Sacred Ascent & Acoustic Worship',
    name: 'Samuel Adebayo',
    email: 'samuel.adebayo@example.com',
    phone: '+1 (555) 234-5678',
    guestsCount: 2,
    isFirstTimeVisitor: false,
    notes: 'Looking forward to the contemplative worship time.',
    createdAt: '2026-08-20 14:22',
    qrPassCode: 'VH-PASS-9081-W',
    checkedIn: false
  },
  {
    id: 'RSVP-102',
    eventId: 'event-02',
    eventTitle: 'First-Timers & Seekers Welcome Brunch',
    name: 'Claire Jenkins',
    email: 'claire.j@example.com',
    phone: '+1 (555) 876-5432',
    guestsCount: 1,
    isFirstTimeVisitor: true,
    notes: 'Recently moved to the neighborhood and looking for a spiritually grounded church.',
    createdAt: '2026-08-21 09:15',
    qrPassCode: 'VH-PASS-9082-B',
    checkedIn: false
  }
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    quote: 'Vine House Ministries gave me a sanctuary where faith feels deep, reverent, and completely free from performance or noise.',
    author: 'Elena Rossi',
    role: 'Member & Designer',
    tag: 'Community Life',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-2',
    quote: 'Finding a contemporary church that honors biblical depth, architectural serenity, and genuine human warmth transformed our family’s rhythm.',
    author: 'Marcus & Jessica Vance',
    role: 'Young Family & Volunteers',
    tag: 'Family Sanctuary',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'test-3',
    quote: 'Pastor Mercy’s teaching is thoughtful, deeply rooted in Christ, and profoundly refreshing for anyone fatigued by superficial religion.',
    author: 'David Chen',
    role: 'University Lecturer',
    tag: 'Theology & Growth',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'elena.rossi@designstudio.org',
    subscribedAt: 'August 18, 2026',
    frequency: 'Weekly Devotional'
  },
  {
    id: 'sub-2',
    email: 'marcus.vance@familycare.io',
    subscribedAt: 'August 19, 2026',
    frequency: 'Weekly Devotional'
  },
  {
    id: 'sub-3',
    email: 'david.chen@columbia.edu',
    subscribedAt: 'August 20, 2026',
    frequency: 'Event Announcements'
  }
];
