import { Sermon, ChurchEvent, GatheringPillar, Subscriber, Message } from './types';

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
    audioUrl: '',
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
    audioUrl: '',
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
    audioUrl: '',
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
    audioUrl: '',
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
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80'
  },
  {
    number: '02',
    title: 'Midweek Scripture Lab',
    subtitle: 'Theology & Dialogue',
    timing: 'Wednesdays at 7:00 PM',
    location: 'Library & Online Portal',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    number: '03',
    title: 'Vine Youth & Young Adults',
    subtitle: 'Authentic Community',
    timing: 'Fridays at 7:30 PM',
    location: 'The Loft Commons',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80'
  },
  {
    number: '04',
    title: 'Communal Care & Outreach',
    subtitle: 'Faith in Action',
    timing: 'Saturdays at 9:00 AM',
    location: 'Community Action Hub',
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

/** The journal. Becomes standard WordPress posts in migration phase 3. */
export const MESSAGES: Message[] = [
  {
    id: 'msg-01',
    slug: 'on-being-found-in-the-vine',
    title: 'On Being Found in the Vine',
    category: 'Pastoral Letter',
    excerpt: 'A letter for anyone who arrived at church this month tired. You do not have to produce anything here. You have to stay connected.',
    date: 'September 18, 2026',
    readTime: '5 min read',
    author: 'Pastor Mercy Yerifor',
    authorRole: 'Lead Pastor & Spiritual Director',
    scripture: 'John 15:4',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1800&q=80',
    imageAlt: 'Vineyard rows in evening light',
    body: [
      'Dear friends, I have noticed something over the last few Sundays. More of you are arriving tired. Not the ordinary tiredness of a long week, but the deeper kind that comes from carrying something for months without setting it down. I want to write to you about that, because I think the Vine has a word for it.',
      'When Jesus said “abide in me,” he was not giving an instruction about productivity. The branch does not strain to produce grapes. It stays attached, and the fruit comes because of the connection, not because of the effort. I find that most of us have the order reversed. We try to bear fruit in order to feel connected, when the whole of John 15 says it works the other way round.',
      'So here is what I would ask of you this month. Do not come to the sanctuary to perform your faith. Come to be joined to something. Sit in the pew. Let the liturgy carry you for an hour. Receive the bread and the cup without deciding whether you have earned them. You have not, and neither have I, and that is the point of the table.',
      'The pruning seasons are real. Some of you are in one now, and I will not pretend they are gentle. But a gardener prunes what is alive, not what is dead. If God is cutting something back in your life, it is because he intends more from it, not less.',
      'We will keep the doors open at ten and twelve. Come as you are. Stay as long as you need. You are not a project to be finished here. You are a branch, and you are held.',
    ],
    pullQuote: 'The branch does not strain to produce grapes. It stays attached, and the fruit comes because of the connection.',
    tags: ['Abiding', 'Rest', 'Grace'],
  },
  {
    id: 'msg-02',
    slug: 'the-quiet-before-the-word',
    title: 'The Quiet Before the Word',
    category: 'Reflection',
    excerpt: 'Why our liturgy begins with ninety seconds of silence, and what happens to a room when it learns to keep them.',
    date: 'September 11, 2026',
    readTime: '4 min read',
    author: 'Minister David K. Sterling',
    authorRole: 'Associate Minister of Liturgy & Teaching',
    scripture: 'Psalm 46:10',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1800&q=80',
    imageAlt: 'Light falling across an empty sanctuary',
    body: [
      'Visitors sometimes ask about the silence. Our services open with the call to worship, and then, before a single hymn, the room goes quiet for a minute and a half. On the first Sunday it can feel like a mistake. By the fourth it is the part people miss most when they are away.',
      'The silence is not empty. It is the moment the room stops being a crowd and becomes a congregation. Phones go into pockets. Shoulders come down. The people who rushed in from the car park arrive, properly, a minute after they sat down.',
      'Elijah did not meet God in the wind or the earthquake or the fire. He met him in the sound of sheer silence, and I have come to believe that most of us are simply too loud, inwardly, to notice when God speaks. The ninety seconds are not a ritual for its own sake. They are a rehearsal for the rest of the week.',
      'If you are new, you do not have to do anything with the quiet. Do not try to pray well. Just let it be quiet, and see what surfaces. What surfaces is usually what you needed to bring.',
    ],
    pullQuote: 'The silence is the moment the room stops being a crowd and becomes a congregation.',
    tags: ['Liturgy', 'Silence', 'Prayer'],
  },
  {
    id: 'msg-03',
    slug: 'reading-romans-eight-slowly',
    title: 'Reading Romans Eight Slowly',
    category: 'Teaching',
    excerpt: 'Notes to accompany the Grounded Grace series: how to read the most quoted chapter in the New Testament as though you had never heard it.',
    date: 'September 4, 2026',
    readTime: '7 min read',
    author: 'Pastor Mercy Yerifor',
    authorRole: 'Lead Pastor & Spiritual Director',
    scripture: 'Romans 8:31–39',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80',
    imageAlt: 'An open Bible on a wooden table',
    body: [
      'Romans 8 has a problem, and the problem is that everyone knows it. “Nothing can separate us from the love of God” is printed on cards and sung in choruses, and familiarity has sanded the edges off a passage that was written to people facing real danger. These notes are an attempt to read it slowly, as the Roman church would have heard it read aloud for the first time.',
      'Start with the question in verse 31: “If God is for us, who can be against us?” Paul is not saying nobody is against them. The list that follows — tribulation, distress, persecution, famine, nakedness, danger, sword — is not hypothetical. He is saying the opposition is real and it is outmatched.',
      'Notice, too, that the chapter is not about feeling secure. It is about being secure. Paul writes “I am persuaded,” which is a conclusion reached after argument, not a mood. There will be Sundays when you do not feel any of this. The passage holds on those Sundays as well.',
      'In the Midweek Scripture Lab we will read verses 18 to 30 first, because 31 to 39 is the conclusion of an argument that begins with groaning — creation groaning, believers groaning, the Spirit interceding with groans too deep for words. The confidence at the end is earned by the honesty at the start.',
      'Read it aloud this week. Read it to someone. The chapter was written to be heard by a room, and it still does its best work that way.',
    ],
    pullQuote: '“I am persuaded” is a conclusion reached after argument, not a mood.',
    tags: ['Romans', 'Scripture', 'Assurance'],
  },
  {
    id: 'msg-04',
    slug: 'what-saturday-mornings-taught-us',
    title: 'What Saturday Mornings Taught Us',
    category: 'Community',
    excerpt: 'Four years of food distribution across London and Essex, and the lessons a church learns when it stops being the host and starts being a neighbour.',
    date: 'August 28, 2026',
    readTime: '5 min read',
    author: 'Marcus Thorne',
    authorRole: 'Director of Community Mercy & Charity Outreach',
    scripture: 'Matthew 25:40',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1800&q=80',
    imageAlt: 'Volunteers packing food parcels',
    body: [
      'When we started the Saturday distributions in 2022, we thought of ourselves as the ones giving. Four years and several thousand warm meals later, I would put it differently. We are the ones who turn up, and turning up has taught us more than we expected to learn.',
      'The first lesson was about names. In the early months we knew people by their situations. Now we know them by their names, their children, which of them takes sugar. Mercy that does not learn names is a service. Mercy that does is a friendship, and friendship is what Jesus was describing in Matthew 25.',
      'The second lesson was about dignity. We stopped calling them care packages and started calling them shopping, because that is what they are, and because nobody should have to feel like a recipient on a Saturday morning. Small words carry weight.',
      'The third is that this is not a programme the church runs. It is the church. The volunteers who pack at eight and the neighbours who arrive at nine are, for that hour, the most honest picture of Vine House that exists.',
      'If you have never come, come once. Bring nothing but yourself. There will be a job for you, and by ten o’clock you will know at least three names you did not know before.',
    ],
    pullQuote: 'Mercy that does not learn names is a service. Mercy that does is a friendship.',
    tags: ['Outreach', 'Mercy', 'London & Essex'],
  },
  {
    id: 'msg-05',
    slug: 'sabbath-in-a-city-that-never-stops',
    title: 'Sabbath in a City That Never Stops',
    category: 'Reflection',
    excerpt: 'The fourth commandment was given to people who had just left slavery. What it asks of people who have chosen a schedule that looks a lot like it.',
    date: 'August 21, 2026',
    readTime: '6 min read',
    author: 'Pastor Mercy Yerifor',
    authorRole: 'Lead Pastor & Spiritual Director',
    scripture: 'Exodus 20:8',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=80',
    imageAlt: 'A quiet dinner table set for guests',
    body: [
      'London does not stop, and most of us have made peace with that by not stopping either. I want to suggest that the fourth commandment was written for exactly this. It was given to a people fresh out of Egypt, who had never in living memory been allowed a day off. Rest had to be commanded because nobody would have believed it was permitted.',
      'Sabbath is not primarily about church attendance, though I am glad you come. It is about a weekly, deliberate declaration that the world will carry on without your effort for one day, and that God is not anxious about the gap. Every seventh day is a small act of trust that the universe is held by someone other than you.',
      'Practically, I would begin smaller than a whole day. Choose an evening. Put the phone in a drawer at seven. Eat with people. Do not plan. Notice how much of your restlessness is not tiredness but habit, and how quickly a body remembers how to rest once it is allowed to.',
      'The house groups have been trying this together on Tuesday and Thursday nights, and the reports are the same everywhere: it is awkward for two weeks and then it is the best evening of the week. That pattern, awkward then essential, is what the presence of God usually feels like from the inside.',
    ],
    pullQuote: 'Every seventh day is a small act of trust that the universe is held by someone other than you.',
    tags: ['Sabbath', 'Rest', 'Daily Life'],
  },
];
