export const translations = {
  en: {
    // Nav
    nav: {
      about: 'about',
      projects: 'experience',
      services: 'skills',
      speaking: 'speaking',
      lab: 'lab',
      tools: 'tools',
      contact: 'contact',
    },

    // Hero
    hero: {
      boot: [
        'initializing irakli.md...',
        'loading experience... 17 years found',
        'loading users... 19.4M registered',
        'loading revenue... $152M generated',
        'status: growth executive | AI educator | builder',
        'ready.',
      ],
      tagline: 'Leading AI-driven acquisition teams. Teaching AI. Scaling fintech growth.',
      subtitle: 'Head of Digital Acquisition & Telesales | AI Educator | Growth Executive',
      cta: {
        chat: 'Talk to my AI Agent',
        projects: 'explore experience',
        contact: 'get in touch',
      },
    },

    // About
    about: {
      command: '> whoami',
      title: '~/about',
      role: 'Head of Digital Acquisition & Telesales',
      company: 'TBC UZ / Payme',
      location: 'Tbilisi, Georgia',
      bio: [
        '17 years in B2C marketing, fintech, and digital banking',
        'Scaled products to 19.4M+ registered users in Uzbekistan',
        '50% population penetration across TBC UZ & Payme',
        'Managing 300+ person team and $15M+ annual budgets',
        'AI educator and growth executive',
        'Working across Central Asia and the Caucasus',
      ],
      stats: {
        command: '> stats --summary',
        items: [
          { key: 'registered_users', value: '19.4M+' },
          { key: 'team_size', value: '300+' },
          { key: 'annual_budget', value: '$15M+' },
          { key: 'years_experience', value: '17' },
          { key: 'languages', value: '4 (EN, KA, RU, DE)' },
        ],
      },
    },

    // Projects (now Experience / Career)
    projects: {
      command: '> career/',
      title: '~/experience',
      bannerDesc: '17 years across fintech, neobanking, and digital marketing. From Ogilvy to TBC/Payme.',
      viewCase: 'view details',
      items: [
        {
          slug: 'tbc-payme',
          name: 'TBC Uzbekistan & Payme',
          description: 'Head of Digital Acquisition & Telesales. Scaled to 16M+ registered users, $626M loan portfolio (+103%), $152M revenue (+93% YoY), 5.9M MAU (+38%). Managing 300+ person team.',
          tags: ['Fintech', 'Growth', 'Leadership'],
          metric: '2024–Present',
        },
        {
          slug: 'space-international',
          name: 'Space International / CDMO',
          description: 'Grew user base from 4M to 16M+. Achieved 40% conversion rate improvement. Led marketing automation across 2 countries.',
          tags: ['Fintech', 'Automation', 'Strategy'],
          metric: '2022–2024',
        },
        {
          slug: 'space-neobank',
          name: 'Space Neobank Launch',
          description: "Launched Georgia's first fully digital bank. Acquired 100K users in first 6 months. Built digital-first acquisition channels from zero.",
          tags: ['Neobank', 'Launch', 'Digital'],
          metric: '2018–2020',
        },
        {
          slug: 'digitalhub',
          name: 'DigitalHub Agency',
          description: 'Founded digital agency. Enterprise clients: Pepsico (Lay\'s), Avis, fintech companies. Full-service digital marketing.',
          tags: ['Agency', 'Enterprise', 'Founder'],
          metric: '2014–2018',
        },
        {
          slug: 'ogilvy',
          name: 'Ogilvy Caucasus',
          description: 'MD / Account Director across Georgia, Armenia, Azerbaijan. Managed BAT and international client portfolio.',
          tags: ['Advertising', 'International', 'Management'],
          metric: '2009–2014',
        },
      ],
    },

    // Services
    services: {
      command: '> cat skills.txt',
      title: '~/services',
      items: [
        {
          name: 'Growth Strategy & Digital Acquisition',
          description: 'Data-driven growth at scale. $15M+ budget management, performance marketing, paid social, search, and programmatic across channels.',
        },
        {
          name: 'AI Implementation & Automation',
          description: 'n8n workflows, automated reporting (-60% manual work), AI-powered QA systems, and organizational AI transformation.',
        },
        {
          name: 'Team Building & Leadership',
          description: 'Scaling teams to 300+, telesales operations, QA systems, cross-country team management, and organizational design.',
        },
        {
          name: 'Education & Thought Leadership',
          description: 'Harbour.Space University (alumni), Toulouse BS guest lecturer, Digitalhub.edu.ge instructor.',
        },
      ],
    },

    // Speaking
    speaking: {
      command: '> history --talks',
      title: '~/speaking',
      items: [
        {
          name: 'Digitalhub.edu.ge',
          date: '2024',
          topic: 'Social Media Advertising',
          description: 'Instructor for social media advertising course. Hands-on curriculum covering paid social strategy and execution.',
        },
        {
          name: 'Toulouse Business School Barcelona',
          date: '2018',
          topic: 'Digital Marketing Guest Lecture',
          description: 'Guest lecturer on digital marketing strategy and emerging market growth.',
        },
        {
          name: "Harbour.Space University",
          date: '2017–2018',
          topic: "Post-Graduate Diploma in Digital Marketing",
          description: "Post-Graduate Diploma in Digital Marketing, Digital Communication and Media/Multimedia.",
        },
      ],
    },

    // Lab
    lab: {
      command: '> ls ~/lab/',
      title: '~/lab',
      subtitle: 'things I build, break, and ship — mostly with AI',
      bannerDesc: '17 AI-powered projects — from acquisition copilots to video editors. Work tools and personal experiments.',
      workSubtitle: 'AI tools built for TBC UZ / Payme teams',
      personalSubtitle: 'hobby projects I build in my free time',
      statusLabels: {
        live: 'live',
        building: 'building',
        idea: 'idea',
      },
      workItems: [
        {
          slug: 'acquisition-copilot',
          name: 'Digital Acquisition Copilot',
          description: 'Agentic AI for acquisition teams. Connects Facebook Ads, SEO/ASO, AppsFlyer — spots anomalies, suggests budget moves, answers "why did CPI spike?" in natural language. Built on OpenClaw.',
          status: 'building' as const,
          progress: 40,
        },
        {
          slug: 'ai-ad-check',
          name: 'AI Ad Check',
          description: 'AI-powered ad creative review platform. Validates digital ad creatives against best practices — built for TBC UZ acquisition team.',
          status: 'live' as const,
          progress: 80,
        },
        {
          slug: 'competitive-intel',
          name: 'TBC Intell',
          description: 'AI-powered competitive monitoring. Tracks competitor ads, news, and Telegram channels — surfaces insights without manual monitoring.',
          status: 'live' as const,
          progress: 85,
        },
        {
          slug: 'ai-creative-tool',
          name: 'AI Creative Tool',
          description: 'Marketing content generation with Google Generative AI + OpenAI. Generate ad creatives and copy with AI assistance.',
          status: 'building' as const,
          progress: 50,
        },
        {
          slug: 'sales-mentor',
          name: 'Sales Mentor',
          description: 'Slack-based AI sales coaching bot. GPT-5.2 powered mentor that coaches reps and analyzes sales docs via n8n workflows.',
          status: 'live' as const,
          progress: 75,
        },
        {
          slug: 'voice-ai',
          name: 'Voice AI',
          description: 'Voice dialog analysis system for telesales call quality. Analyzes conversations and surfaces coaching insights.',
          status: 'building' as const,
          progress: 45,
        },
        {
          slug: 'seo-articles',
          name: 'SEO Articles',
          description: 'AI-assisted SEO content generation and storage for TBC Bank blog. Automated article creation pipeline.',
          status: 'live' as const,
          progress: 70,
        },
        {
          slug: 'n8n-automations',
          name: 'n8n Automations',
          description: 'AI-powered workflow collection — AppsFlyer data integration, ChatGPT conversion guides, shopping data parsing.',
          status: 'live' as const,
          progress: 75,
        },
      ],
      personalItems: [
        {
          slug: 'mypen',
          name: 'mypen.ge',
          description: 'Multi-model LLM chat platform for Georgian language. Wraps OpenAI, Anthropic, and more in one interface with Georgian UX, referral system, and subscription tiers.',
          status: 'live' as const,
          progress: 90,
        },
        {
          slug: 'whisper',
          name: 'Whisper (Mypen Voice)',
          description: 'macOS menu bar app — speak in Georgian, get transcribed and AI-enhanced text via Whisper API.',
          status: 'building' as const,
          progress: 60,
        },
        {
          slug: 'madcutter',
          name: 'Madcutter',
          description: 'AI video editor — extracts viral clips from long-form content. Auto-crops to vertical, generates subtitles, uses YOLOv8 for smart framing. Exports for TikTok/Reels/Shorts.',
          status: 'building' as const,
          progress: 50,
        },
        {
          slug: 'art-copilot',
          name: 'Art Copilot',
          description: 'AR-based iOS app — display artwork from your photo library on your wall in augmented reality before buying or hanging.',
          status: 'building' as const,
          progress: 30,
        },
        {
          slug: 'ai-literacy',
          name: 'AI Literacy Platform',
          description: 'Practice-first AI education with 60 scenarios and 4 certification stages. Learn by doing, not watching. AI-powered evaluation.',
          status: 'building' as const,
          progress: 60,
        },
        {
          slug: 'solon',
          name: 'Solon',
          description: 'Legal article platform with AI-powered smart search, recommendations, and reading analytics.',
          status: 'building' as const,
          progress: 35,
        },
        {
          slug: 'stock-forecast',
          name: 'Stock Forecast',
          description: 'Personal trading dashboard with AI/algorithmic forecasting and backtesting for stock trading decisions.',
          status: 'idea' as const,
          progress: 15,
        },
        {
          slug: 'chatkit',
          name: 'ChatKit',
          description: 'Self-hosted OpenAI ChatKit with custom agents, tools, and SQLite-based conversation storage.',
          status: 'live' as const,
          progress: 70,
        },
        {
          slug: 'librechat',
          name: 'LibreChat / FinPal',
          description: 'Self-hosted multi-model AI chat (Claude, GPT, Gemini) with streaming, code artifacts, web search, and image generation.',
          status: 'live' as const,
          progress: 80,
        },
      ],
    },

    // Blog (hidden but kept for component compatibility)
    blog: {
      command: '> cat blog/latest',
      title: '~/blog',
      viewAll: 'view all posts',
      comingSoon: 'Blog posts coming soon. Subscribe to get notified.',
      posts: [] as { slug: string; title: string; date: string; excerpt: string }[],
    },

    // Tools
    tools: {
      command: '> cat ~/tools/stack.txt',
      title: '~/tools',
      subtitle: 'tools I use daily to build, automate, and ship.',
      bannerDesc: 'Claude, Cursor, n8n, Vercel, Neon — the stack behind everything I build and ship.',
      cta: 'try it',
      backHome: 'cd ~/',
      highlightedTools: [
        {
          slug: 'openclaw',
          name: 'OpenClaw',
          tagline: 'Agentic AI Framework',
          description: 'Open-source agentic AI framework powering the Digital Acquisition Copilot. Build autonomous AI workflows.',
          url: 'https://openclaw.ai',
          label: 'open-source',
        },
        {
          slug: 'blokmd',
          name: 'Blok.md',
          tagline: 'Markdown Dev Tool',
          description: 'Developer tool for working with Markdown files \u2014 writing, structuring, and publishing. Built by Irakli.',
          url: 'https://blok.md',
          label: 'by irakli',
        },
      ],
      items: [
        {
          slug: 'claude',
          name: 'Claude',
          category: 'AI',
          description: 'AI assistant for writing, coding, analysis, and research. My primary AI tool.',
          url: 'https://claude.ai',
        },
        {
          slug: 'cursor',
          name: 'Cursor',
          category: 'AI',
          description: 'AI-powered code editor. The fastest way to build with AI assistance.',
          url: 'https://cursor.com',
        },
        {
          slug: 'openclaw',
          name: 'OpenClaw',
          category: 'Agentic AI',
          description: 'Open-source agentic AI framework. Powers the Digital Acquisition Copilot.',
          url: 'https://openclaw.ai',
        },
        {
          slug: 'n8n',
          name: 'n8n',
          category: 'Automation',
          description: 'Workflow automation platform. Connect anything to everything.',
          url: 'https://n8n.io',
        },
        {
          slug: 'vercel',
          name: 'Vercel',
          category: 'Hosting',
          description: 'Frontend cloud platform. Deploy Next.js apps in seconds.',
          url: 'https://vercel.com',
        },
        {
          slug: 'neon',
          name: 'Neon',
          category: 'Database',
          description: 'Serverless PostgreSQL. Scales to zero, branches like git.',
          url: 'https://neon.tech',
        },
        {
          slug: 'figma',
          name: 'Figma',
          category: 'Design',
          description: 'Collaborative design tool for UI/UX and prototyping.',
          url: 'https://figma.com',
        },
        {
          slug: 'linear',
          name: 'Linear',
          category: 'Productivity',
          description: 'Project management built for speed. Track issues and ship faster.',
          url: 'https://linear.app',
        },
        {
          slug: 'notion',
          name: 'Notion',
          category: 'Productivity',
          description: 'All-in-one workspace for docs, wikis, and project management.',
          url: 'https://notion.so',
        },
      ],
    },

    // Contact
    contact: {
      command: '> contact --reach-me',
      title: '~/contact',
      cta: "let's build something together.",
      links: {
        linkedin: 'open linkedin',
        twitter: 'open x / twitter',
      },
      form: {
        title: 'send a message',
        reasonPlaceholder: 'reason for reaching out',
        reasons: {
          consulting: 'consulting inquiry',
          speaking: 'speaking / guest lecture',
          collaboration: 'collaboration / partnership',
          other: 'other',
        },
        emailPlaceholder: 'your email',
        messagePlaceholder: 'your message...',
        send: 'send',
        sending: 'sending...',
        success: 'message sent! irakli will get back to you.',
        errorGeneric: 'something went wrong. please try again.',
      },
    },

    // AMI Start
    amiStart: {
      bootLines: [
        '> cd ~/ami-start',
        'loading pre-work checklist...',
        'found 6 accounts, 4 installs',
        'ready.',
      ],
      backHome: 'cd ~/',
      title: 'AI 360 — Pre-Work',
      subtitle: 'Please complete everything below before the first session. If you get stuck on anything, bring your questions — we\'ll troubleshoot together.',
      beforeHighlight: 'before',
      accounts: {
        title: 'accounts to create // required',
        signUp: 'sign up',
        items: [
          {
            name: 'Claude (Anthropic)',
            description: 'Our main AI tool for vibe coding and the agent',
            url: 'https://claude.ai',
            cost: '$100/mo recommended (min $20, ideal $200)',
            category: 'AI',
          },
          {
            name: 'GitHub',
            description: 'Where your code lives online',
            url: 'https://github.com',
            cost: 'Free',
            category: 'Code',
          },
          {
            name: 'Railway',
            description: 'Hosting — makes your website live on the internet',
            url: 'https://railway.app',
            cost: 'Free tier to start',
            category: 'Hosting',
          },
          {
            name: 'N8N Cloud',
            description: 'No-code automation platform',
            url: 'https://n8n.io',
            cost: 'Free trial available',
            category: 'Automation',
          },
          {
            name: 'Neon',
            description: 'Postgres database (for agent memory/knowledge base)',
            url: 'https://neon.tech',
            cost: 'Free tier available',
            category: 'Database',
          },
          {
            name: 'Google Account',
            description: 'For integrations (Google Sheets, Gmail) via N8N',
            url: 'https://google.com',
            cost: 'Free',
            category: 'Integration',
          },
        ],
      },
      optional: {
        title: 'nice to have // optional',
        items: [
          {
            name: 'Gemini (Google)',
            description: 'Alternative AI, good for comparison',
            cost: '$20/month',
          },
          {
            name: 'ChatGPT (OpenAI)',
            description: 'Alternative AI, Custom GPTs',
            cost: '$20/month',
          },
        ],
      },
      software: {
        title: 'software to download & install',
        items: [
          {
            name: 'VS Code',
            what: 'Your code workspace (like Word, but for code)',
            url: 'https://code.visualstudio.com/',
            verify: 'Install it, open it once to make sure it works',
          },
          {
            name: 'Claude Desktop App',
            what: 'Claude\'s desktop app — includes "Cowork," which gives you agentic AI power for non-technical tasks',
            url: 'https://claude.com/download',
            verify: 'Install it, sign in with your Claude account. Make sure you\'re on a paid plan to access Cowork',
          },
          {
            name: 'Node.js',
            what: 'A tool that runs behind the scenes — needed for many of our tools',
            url: 'https://nodejs.org/',
            verify: 'Install it, then open VS Code\'s terminal and type node --version to verify',
          },
          {
            name: 'Wispr Flow',
            what: 'AI voice-to-text dictation — speak naturally and it types for you. Works everywhere on your Mac.',
            url: 'https://ref.wisprflow.ai/irakli-chkheidze',
            verify: 'Install it, grant microphone access, and try dictating a sentence',
          },
        ],
      },
      checklist: {
        title: 'verification checklist',
        hint: 'click to check off items as you complete them:',
        items: [
          'I have a computer (Mac or Windows)',
          'I can open VS Code',
          'I can open the terminal inside VS Code (View > Terminal)',
          'node --version shows a version number in the terminal',
          'I can log in to Claude desktop app',
          'I have accounts on GitHub, Railway, N8N Cloud, and Neon',
          'I have a Google account ready',
        ],
      },
      costs: {
        title: 'about costs',
        claudeRecommended: 'Claude (recommended)',
        claudeMinimum: 'Claude (minimum)',
        everythingElse: 'Everything else',
        free: 'Free (free tiers)',
        totalRecommended: 'Total recommended',
        note: 'The $100 Claude plan gives you enough usage for vibe coding, the agent, and daily work. The $20 plan works but runs out fast when building things. If you can get the $200 plan, even better — you won\'t hit any limits.',
      },
      dontWorry: {
        title: 'what NOT to worry about',
        items: [
          'You don\'t need to know how to code',
          'You don\'t need to understand anything in VS Code yet',
          'You don\'t need to set up any projects',
          'Just install and create accounts — we\'ll do everything else together',
        ],
      },
      signOff: 'See you at the session!',
    },

    // Footer
    footer: {
      left: 'irakli.md v1.0',
      right: 'built with',
    },
  },

  ka: {
    // Nav
    nav: {
      about: 'ჩემ შესახებ',
      projects: 'გამოცდილება',
      services: 'უნარები',
      speaking: 'სპიკერობა',
      lab: 'ლაბორატორია',
      tools: 'ინსტრუმენტები',
      contact: 'კონტაქტი',
    },

    // Hero
    hero: {
      boot: [
        'irakli.md-ის ინიციალიზაცია...',
        'გამოცდილების ჩატვირთვა... 17 წელი ნაპოვნია',
        'მომხმარებლების ჩატვირთვა... 19.4M რეგისტრირებული',
        'შემოსავლის ჩატვირთვა... $152M გენერირებული',
        'სტატუსი: growth executive | AI educator | მშენებელი',
        'მზადაა.',
      ],
      tagline: 'ფინტექის გაფართოება 19M+ მომხმარებლამდე. AI-ის სწავლება. ციფრული პროდუქტების შექმნა.',
      subtitle: 'ციფრული აკვიზიციისა და ტელესეილის ხელმძღვანელი | AI Educator | Growth Executive',
      cta: {
        chat: 'Baski-სთან საუბარი',
        projects: 'გამოცდილების დათვალიერება',
        contact: 'დამიკავშირდით',
      },
    },

    // About
    about: {
      command: '> whoami',
      title: '~/about',
      role: 'ციფრული აკვიზიციისა და ტელესეილის ხელმძღვანელი',
      company: 'TBC UZ / Payme',
      location: 'თბილისი, საქართველო',
      bio: [
        '17 წელი B2C მარკეტინგში, ფინტექში და ციფრულ ბანკინგში',
        'პროდუქტების გაფართოება 19.4M+ რეგისტრირებულ მომხმარებლამდე უზბეკეთში',
        'მოსახლეობის 50%-იანი შეღწევადობა TBC UZ-სა და Payme-ში',
        '300+ კაციანი გუნდისა და $15M+ წლიური ბიუჯეტების მართვა',
        'AI educator და growth executive',
        'მუშაობა ცენტრალურ აზიასა და კავკასიაში',
      ],
      stats: {
        command: '> stats --summary',
        items: [
          { key: 'რეგისტრირებული_მომხმარებლები', value: '19.4M+' },
          { key: 'გუნდის_ზომა', value: '300+' },
          { key: 'წლიური_ბიუჯეტი', value: '$15M+' },
          { key: 'გამოცდილება_წლები', value: '17' },
          { key: 'ენები', value: '4 (EN, KA, RU, DE)' },
        ],
      },
    },

    // Projects (now Experience / Career)
    projects: {
      command: '> career/',
      title: '~/გამოცდილება',
      bannerDesc: '17 წელი ფინტექში, ნეობანკინგსა და ციფრულ მარკეტინგში. Ogilvy-დან TBC/Payme-მდე.',
      viewCase: 'დეტალების ნახვა',
      items: [
        {
          slug: 'tbc-payme',
          name: 'TBC Uzbekistan & Payme',
          description: 'ციფრული აკვიზიციისა და ტელესეილის ხელმძღვანელი. გაფართოვდა 16M+ რეგისტრირებულ მომხმარებლამდე, $626M სასესხო პორტფელი (+103%), $152M შემოსავალი (+93% წ/წ), 5.9M MAU (+38%). 300+ კაციანი გუნდის მართვა.',
          tags: ['ფინტექი', 'ზრდა', 'ლიდერობა'],
          metric: '2024–Present',
        },
        {
          slug: 'space-international',
          name: 'Space International / CDMO',
          description: 'მომხმარებელთა ბაზა გაიზარდა 4M-დან 16M+-მდე. მიღწეულია კონვერსიის მაჩვენებლის 40%-იანი გაუმჯობესება. ხელმძღვანელობდა მარკეტინგის ავტომატიზაციას 2 ქვეყანაში.',
          tags: ['ფინტექი', 'ავტომატიზაცია', 'სტრატეგია'],
          metric: '2022–2024',
        },
        {
          slug: 'space-neobank',
          name: 'Space Neobank Launch',
          description: 'საქართველოს პირველი სრულად ციფრული ბანკის გაშვება. პირველ 6 თვეში 100K მომხმარებლის მოზიდვა. ციფრული აკვიზიციის არხების შექმნა ნულიდან.',
          tags: ['ნეობანკი', 'გაშვება', 'ციფრული'],
          metric: '2018–2020',
        },
        {
          slug: 'digitalhub',
          name: 'DigitalHub Agency',
          description: 'ციფრული სააგენტოს დაარსება. კორპორატიული კლიენტები: Pepsico (Lay\'s), Avis, ფინტექ კომპანიები. სრული სერვისის ციფრული მარკეტინგი.',
          tags: ['სააგენტო', 'კორპორატიული', 'დამფუძნებელი'],
          metric: '2014–2018',
        },
        {
          slug: 'ogilvy',
          name: 'Ogilvy Caucasus',
          description: 'MD / Account Director საქართველოში, სომხეთსა და აზერბაიჯანში. მართავდა BAT-ის და საერთაშორისო კლიენტების პორტფოლიოს.',
          tags: ['რეკლამა', 'საერთაშორისო', 'მართვა'],
          metric: '2009–2014',
        },
      ],
    },

    // Services
    services: {
      command: '> cat skills.txt',
      title: '~/სერვისები',
      items: [
        {
          name: 'ზრდის სტრატეგია და ციფრული აკვიზიცია',
          description: 'მონაცემებზე დაფუძნებული ზრდა მასშტაბით. $15M+ ბიუჯეტის მართვა, performance marketing, ფასიანი სოციალური მედია, ძიება და პროგრამული რეკლამა სხვადასხვა არხზე.',
        },
        {
          name: 'AI-ის იმპლემენტაცია და ავტომატიზაცია',
          description: 'n8n workflow-ები, ავტომატიზებული რეპორტინგი (-60% ხელით შესრულებული სამუშაო), AI-ზე მომუშავე QA სისტემები და ორგანიზაციული AI ტრანსფორმაცია.',
        },
        {
          name: 'გუნდის მშენებლობა და ლიდერობა',
          description: 'გუნდების გაფართოება 300+-მდე, ტელესეილის ოპერაციები, QA სისტემები, საერთაშორისო გუნდის მართვა და ორგანიზაციული დიზაინი.',
        },
        {
          name: 'განათლება და აზროვნების ლიდერობა',
          description: 'Harbour.Space University (კურსდამთავრებული), Toulouse BS მოწვეული ლექტორი, Digitalhub.edu.ge ინსტრუქტორი.',
        },
      ],
    },

    // Speaking
    speaking: {
      command: '> history --talks',
      title: '~/სპიკერობა',
      items: [
        {
          name: 'Digitalhub.edu.ge',
          date: '2024',
          topic: 'სოციალური მედიის რეკლამა',
          description: 'სოციალური მედიის რეკლამის კურსის ინსტრუქტორი. პრაქტიკული სასწავლო პროგრამა, რომელიც მოიცავს ფასიანი სოციალური მედიის სტრატეგიასა და განხორციელებას.',
        },
        {
          name: 'Toulouse Business School Barcelona',
          date: '2018',
          topic: 'ციფრული მარკეტინგის მოწვეული ლექცია',
          description: 'მოწვეული ლექტორი ციფრული მარკეტინგის სტრატეგიისა და განვითარებადი ბაზრების ზრდის შესახებ.',
        },
        {
          name: "Harbour.Space University",
          date: '2017–2018',
          topic: 'ციფრული მარკეტინგის დიპლომისშემდგომი პროგრამა',
          description: 'დიპლომისშემდგომი პროგრამა ციფრულ მარკეტინგში, ციფრულ კომუნიკაციასა და მედია/მულტიმედიაში.',
        },
      ],
    },

    // Lab
    lab: {
      command: '> ls ~/lab/',
      title: '~/ლაბორატორია',
      subtitle: 'რასაც ვაშენებ, ვტეხავ და ვუშვებ — ძირითადად AI-ის დახმარებით',
      bannerDesc: '17 AI-ზე მომუშავე პროექტი — აკვიზიციის კოპილოტებიდან ვიდეო რედაქტორებამდე. სამუშაო ინსტრუმენტები და პირადი ექსპერიმენტები.',
      workSubtitle: 'AI ინსტრუმენტები შექმნილი TBC UZ / Payme გუნდებისთვის',
      personalSubtitle: 'ჰობის პროექტები, რომლებსაც თავისუფალ დროს ვაშენებ',
      statusLabels: {
        live: 'live',
        building: 'შენდება',
        idea: 'იდეა',
      },
      workItems: [
        {
          slug: 'acquisition-copilot',
          name: 'Digital Acquisition Copilot',
          description: 'Agentic AI აკვიზიციის გუნდებისთვის. აკავშირებს Facebook Ads-ს, SEO/ASO-ს, AppsFlyer-ს — აღმოაჩენს ანომალიებს, სთავაზობს ბიუჯეტის ცვლილებებს, პასუხობს „რატომ გაიზარდა CPI?" ბუნებრივ ენაზე. აგებულია OpenClaw-ზე.',
          status: 'building' as const,
          progress: 40,
        },
        {
          slug: 'ai-ad-check',
          name: 'AI Ad Check',
          description: 'AI-ზე მომუშავე სარეკლამო კრეატივების განხილვის პლატფორმა. ამოწმებს ციფრულ სარეკლამო კრეატივებს საუკეთესო პრაქტიკის მიხედვით — აგებულია TBC UZ-ის აკვიზიციის გუნდისთვის.',
          status: 'live' as const,
          progress: 80,
        },
        {
          slug: 'competitive-intel',
          name: 'TBC Intell',
          description: 'AI-ზე მომუშავე კონკურენტების მონიტორინგი. აკონტროლებს კონკურენტების რეკლამებს, სიახლეებს და Telegram არხებს — წარმოაჩენს ინსაიტებს ხელით მონიტორინგის გარეშე.',
          status: 'live' as const,
          progress: 85,
        },
        {
          slug: 'ai-creative-tool',
          name: 'AI Creative Tool',
          description: 'მარკეტინგული კონტენტის გენერაცია Google Generative AI + OpenAI-ის გამოყენებით. სარეკლამო კრეატივებისა და ტექსტების გენერაცია AI-ის დახმარებით.',
          status: 'building' as const,
          progress: 50,
        },
        {
          slug: 'sales-mentor',
          name: 'Sales Mentor',
          description: 'Slack-ზე დაფუძნებული AI გაყიდვების ქოუჩინგის ბოტი. GPT-5.2-ზე მომუშავე მენტორი, რომელიც წვრთნის წარმომადგენლებს და აანალიზებს გაყიდვების დოკუმენტებს n8n workflow-ების მეშვეობით.',
          status: 'live' as const,
          progress: 75,
        },
        {
          slug: 'voice-ai',
          name: 'Voice AI',
          description: 'ხმოვანი დიალოგის ანალიზის სისტემა ტელესეილის ზარების ხარისხისთვის. აანალიზებს საუბრებს და წარმოაჩენს ქოუჩინგის ინსაიტებს.',
          status: 'building' as const,
          progress: 45,
        },
        {
          slug: 'seo-articles',
          name: 'SEO Articles',
          description: 'AI-ის დახმარებით SEO კონტენტის გენერაცია და შენახვა TBC Bank-ის ბლოგისთვის. სტატიების შექმნის ავტომატიზებული პროცესი.',
          status: 'live' as const,
          progress: 70,
        },
        {
          slug: 'n8n-automations',
          name: 'n8n Automations',
          description: 'AI-ზე მომუშავე workflow-ების კოლექცია — AppsFlyer მონაცემთა ინტეგრაცია, ChatGPT კონვერსიის გიდები, სავაჭრო მონაცემების პარსინგი.',
          status: 'live' as const,
          progress: 75,
        },
      ],
      personalItems: [
        {
          slug: 'mypen',
          name: 'mypen.ge',
          description: 'მრავალმოდელური LLM ჩატის პლატფორმა ქართული ენისთვის. აერთიანებს OpenAI-ს, Anthropic-ს და სხვას ერთ ინტერფეისში ქართული UX-ით, რეფერალური სისტემით და სააბონენტო დონეებით. აგებულია LibreChat-ზე.',
          status: 'live' as const,
          progress: 90,
        },
        {
          slug: 'whisper',
          name: 'Whisper (Mypen Voice)',
          description: 'macOS მენიუს ზოლის აპლიკაცია — ისაუბრეთ ქართულად, მიიღეთ ტრანსკრიბირებული და AI-ით გაუმჯობესებული ტექსტი Whisper API-ის მეშვეობით.',
          status: 'building' as const,
          progress: 60,
        },
        {
          slug: 'madcutter',
          name: 'Madcutter',
          description: 'AI ვიდეო რედაქტორი — ამოიღებს ვირუსულ კლიპებს გრძელი ფორმატის კონტენტიდან. ავტომატურად ჭრის ვერტიკალურად, აგენერირებს სუბტიტრებს, იყენებს YOLOv8-ს ჭკვიანი კადრირებისთვის. ექსპორტი TikTok/Reels/Shorts-ისთვის.',
          status: 'building' as const,
          progress: 50,
        },
        {
          slug: 'art-copilot',
          name: 'Art Copilot',
          description: 'AR-ზე დაფუძნებული iOS აპლიკაცია — აჩვენეთ ხელოვნების ნიმუშები თქვენი ფოტო ბიბლიოთეკიდან თქვენს კედელზე გაფართოებულ რეალობაში ყიდვამდე ან დაკიდებამდე.',
          status: 'building' as const,
          progress: 30,
        },
        {
          slug: 'ai-literacy',
          name: 'AI Literacy Platform',
          description: 'პრაქტიკაზე ორიენტირებული AI განათლება 60 სცენარით და 4 სერტიფიცირების ეტაპით. ისწავლეთ კეთებით და არა ყურებით. AI-ზე მომუშავე შეფასება.',
          status: 'building' as const,
          progress: 60,
        },
        {
          slug: 'solon',
          name: 'Solon',
          description: 'იურიდიული სტატიების პლატფორმა AI-ზე მომუშავე ჭკვიანი ძიებით, რეკომენდაციებით და კითხვის ანალიტიკით.',
          status: 'building' as const,
          progress: 35,
        },
        {
          slug: 'stock-forecast',
          name: 'Stock Forecast',
          description: 'პირადი სავაჭრო დაფა AI/ალგორითმული პროგნოზირებით და უკან ტესტირებით საფონდო ვაჭრობის გადაწყვეტილებებისთვის.',
          status: 'idea' as const,
          progress: 15,
        },
        {
          slug: 'chatkit',
          name: 'ChatKit',
          description: 'თვითჰოსტინგური OpenAI ChatKit მორგებული აგენტებით, ინსტრუმენტებით და SQLite-ზე დაფუძნებული საუბრის შენახვით.',
          status: 'live' as const,
          progress: 70,
        },
        {
          slug: 'librechat',
          name: 'LibreChat / FinPal',
          description: 'თვითჰოსტინგური მრავალმოდელური AI ჩეთი (Claude, GPT, Gemini) სტრიმინგით, კოდის არტეფაქტებით, ვებ ძიებით და სურათების გენერაციით.',
          status: 'live' as const,
          progress: 80,
        },
      ],
    },

    // Blog (hidden but kept for component compatibility)
    blog: {
      command: '> cat blog/latest',
      title: '~/ბლოგი',
      viewAll: 'ყველა პოსტის ნახვა',
      comingSoon: 'ბლოგის პოსტები მალე გამოქვეყნდება. გამოიწერეთ შეტყობინებების მისაღებად.',
      posts: [] as { slug: string; title: string; date: string; excerpt: string }[],
    },

    // Tools
    tools: {
      command: '> cat ~/tools/stack.txt',
      title: '~/ინსტრუმენტები',
      subtitle: 'ინსტრუმენტები, რომლებსაც ყოველდღიურად ვიყენებ ასაშენებლად, ავტომატიზაციისთვის და გასაშვებად.',
      bannerDesc: 'Claude, Cursor, n8n, Vercel, Neon — სტეკი, რომლითაც ყველაფერს ვაშენებ და ვუშვებ.',
      cta: 'სცადეთ',
      backHome: 'cd ~/',
      highlightedTools: [
        {
          slug: 'openclaw',
          name: 'OpenClaw',
          tagline: 'აგენტური AI ფრეიმვორკი',
          description: 'ღია კოდის აგენტური AI ფრეიმვორკი, რომელიც ამუშავებს Digital Acquisition Copilot-ს. ავტონომიური AI სამუშაო პროცესების შექმნა.',
          url: 'https://openclaw.ai',
          label: 'ღია კოდი',
        },
        {
          slug: 'blokmd',
          name: 'Blok.md',
          tagline: 'Markdown დეველოპერის ინსტრუმენტი',
          description: 'დეველოპერის ინსტრუმენტი Markdown ფაილებთან სამუშაოდ \u2014 წერა, სტრუქტურირება და გამოქვეყნება. შექმნილი ირაკლის მიერ.',
          url: 'https://blok.md',
          label: 'ირაკლისგან',
        },
      ],
      items: [
        {
          slug: 'claude',
          name: 'Claude',
          category: 'AI',
          description: 'AI ასისტენტი წერისთვის, კოდირებისთვის, ანალიზისთვის და კვლევისთვის. ჩემი ძირითადი AI ინსტრუმენტი.',
          url: 'https://claude.ai',
        },
        {
          slug: 'cursor',
          name: 'Cursor',
          category: 'AI',
          description: 'AI-ზე მომუშავალი კოდის რედაქტორი. ყველაზე სწრაფი გზა AI-ის დახმარებით ასაშენებლად.',
          url: 'https://cursor.com',
        },
        {
          slug: 'openclaw',
          name: 'OpenClaw',
          category: 'Agentic AI',
          description: 'ღია კოდის აგენტური AI ფრეიმვორკი. ამუშავებს Digital Acquisition Copilot-ს.',
          url: 'https://openclaw.ai',
        },
        {
          slug: 'n8n',
          name: 'n8n',
          category: 'Automation',
          description: 'Workflow ავტომატიზაციის პლატფორმა. დააკავშირეთ ყველაფერი ყველაფერთან.',
          url: 'https://n8n.io',
        },
        {
          slug: 'vercel',
          name: 'Vercel',
          category: 'Hosting',
          description: 'ფრონტენდის ღრუბლოვანი პლატფორმა. Next.js აპლიკაციების გაშვება წამებში.',
          url: 'https://vercel.com',
        },
        {
          slug: 'neon',
          name: 'Neon',
          category: 'Database',
          description: 'Serverless PostgreSQL. ნულამდე მასშტაბირება, განშტოება git-ის მსგავსად.',
          url: 'https://neon.tech',
        },
        {
          slug: 'figma',
          name: 'Figma',
          category: 'Design',
          description: 'კოლაბორაციული დიზაინის ინსტრუმენტი UI/UX-ისთვის და პროტოტიპირებისთვის.',
          url: 'https://figma.com',
        },
        {
          slug: 'linear',
          name: 'Linear',
          category: 'Productivity',
          description: 'პროექტის მართვა სიჩქარეზე ორიენტირებული. პრობლემების თვალყურის დევნება და უფრო სწრაფად გაშვება.',
          url: 'https://linear.app',
        },
        {
          slug: 'notion',
          name: 'Notion',
          category: 'Productivity',
          description: 'ყველა-ერთში სამუშაო სივრცე დოკუმენტებისთვის, ვიკებისთვის და პროექტის მართვისთვის.',
          url: 'https://notion.so',
        },
      ],
    },

    // Contact
    contact: {
      command: '> contact --reach-me',
      title: '~/კონტაქტი',
      cta: 'მოდით, ერთად ავაშენოთ რამე.',
      links: {
        linkedin: 'open linkedin',
        twitter: 'open x / twitter',
      },
      form: {
        title: 'შეტყობინების გაგზავნა',
        reasonPlaceholder: 'დაკავშირების მიზეზი',
        reasons: {
          consulting: 'კონსულტაცია',
          speaking: 'სპიკერობა / მოწვეული ლექცია',
          collaboration: 'თანამშრომლობა / პარტნიორობა',
          other: 'სხვა',
        },
        emailPlaceholder: 'თქვენი ელფოსტა',
        messagePlaceholder: 'თქვენი შეტყობინება...',
        send: 'გაგზავნა',
        sending: 'იგზავნება...',
        success: 'შეტყობინება გაიგზავნა! ირაკლი დაგიკავშირდებათ.',
        errorGeneric: 'რაღაც შეცდომა მოხდა. გთხოვთ სცადოთ ხელახლა.',
      },
    },

    // AMI Start
    amiStart: {
      bootLines: [
        '> cd ~/ami-start',
        'წინასწარი დავალებების ჩატვირთვა...',
        'ნაპოვნია 6 ანგარიში, 4 ინსტალაცია',
        'მზადაა.',
      ],
      backHome: 'cd ~/',
      title: 'AI 360 — წინასწარი მომზადება',
      subtitle: 'გთხოვთ, შეასრულოთ ყველაფერი ქვემოთ მოცემული პირველ სესიამდე. თუ რამე შეფერხება გექნებათ, შეგიძლიათ ჰკითხოვთ იგივე კლოდს ან მოიტანეთ თქვენი კითხვები და ერთად მოვაგვარებთ.',
      beforeHighlight: 'პირველ სესიამდე',
      accounts: {
        title: 'შესაქმნელი ანგარიშები // სავალდებულო',
        signUp: 'რეგისტრაცია',
        items: [
          {
            name: 'Claude (Anthropic)',
            description: 'ჩვენი მთავარი AI ინსტრუმენტი vibe coding-ისა და აგენტისთვის',
            url: 'https://claude.ai',
            cost: 'რეკომენდებული $100/თვე (მინ $20, იდეალური $200)',
            category: 'AI',
          },
          {
            name: 'GitHub',
            description: 'სადაც თქვენი კოდი ინახება ონლაინ',
            url: 'https://github.com',
            cost: 'უფასო',
            category: 'Code',
          },
          {
            name: 'Railway',
            description: 'ჰოსტინგი — თქვენს ვებსაიტს ინტერნეტში აქვეყნებს',
            url: 'https://railway.app',
            cost: 'უფასო დონე დასაწყისისთვის',
            category: 'Hosting',
          },
          {
            name: 'N8N Cloud',
            description: 'No-code ავტომატიზაციის პლატფორმა',
            url: 'https://n8n.io',
            cost: 'უფასო საცდელი პერიოდი',
            category: 'Automation',
          },
          {
            name: 'Neon',
            description: 'Postgres მონაცემთა ბაზა (აგენტის მეხსიერებისა და ცოდნის ბაზისთვის)',
            url: 'https://neon.tech',
            cost: 'უფასო დონე ხელმისაწვდომია',
            category: 'Database',
          },
          {
            name: 'Google ანგარიში',
            description: 'ინტეგრაციებისთვის (Google Sheets, Gmail) N8N-ის მეშვეობით',
            url: 'https://google.com',
            cost: 'უფასო',
            category: 'Integration',
          },
        ],
      },
      optional: {
        title: 'სასურველი // არასავალდებულო',
        items: [
          {
            name: 'Gemini (Google)',
            description: 'ალტერნატიული AI, კარგია შედარებისთვის',
            cost: '$20/თვე',
          },
          {
            name: 'ChatGPT (OpenAI)',
            description: 'ალტერნატიული AI, Custom GPT-ები',
            cost: '$20/თვე',
          },
        ],
      },
      software: {
        title: 'ჩამოსატვირთი და დასაინსტალირებელი პროგრამები',
        items: [
          {
            name: 'VS Code',
            what: 'თქვენი კოდის სამუშაო გარემო (როგორც Word, მაგრამ კოდისთვის)',
            url: 'https://code.visualstudio.com/',
            verify: 'დააინსტალირეთ, გახსენით ერთხელ და დარწმუნდით რომ მუშაობს',
          },
          {
            name: 'Claude Desktop App',
            what: 'Claude-ის დესკტოპ აპლიკაცია — მოიცავს "Cowork"-ს, რომელიც გაძლევთ აგენტურ AI ძალას არატექნიკური ამოცანებისთვის',
            url: 'https://claude.com/download',
            verify: 'დააინსტალირეთ, შედით თქვენი Claude ანგარიშით. დარწმუნდით რომ ფასიან გეგმაზე ხართ Cowork-ის გამოსაყენებლად',
          },
          {
            name: 'Node.js',
            what: 'ინსტრუმენტი რომელიც კულისებში მუშაობს — საჭიროა ჩვენი ბევრი ხელსაწყოსთვის',
            url: 'https://nodejs.org/',
            verify: 'დააინსტალირეთ, შემდეგ VS Code-ის ტერმინალში ჩაწერეთ node --version შესამოწმებლად',
          },
          {
            name: 'Wispr Flow',
            what: 'AI ხმოვანი აკრეფა — ისაუბრეთ ბუნებრივად და ის თქვენს ნაცვლად აკრეფს. მუშაობს ყველგან Mac-ზე.',
            url: 'https://ref.wisprflow.ai/irakli-chkheidze',
            verify: 'დააინსტალირეთ, მიეცით მიკროფონზე წვდომა და სცადეთ წინადადების კარნახი',
          },
        ],
      },
      checklist: {
        title: 'გადამოწმების ჩამონათვალი',
        hint: 'დააწკაპუნეთ პუნქტებზე შესრულებისას:',
        items: [
          'მაქვს კომპიუტერი (Mac ან Windows)',
          'შემიძლია VS Code-ის გახსნა',
          'შემიძლია ტერმინალის გახსნა VS Code-ში (View > Terminal)',
          'node --version აჩვენებს ვერსიის ნომერს ტერმინალში',
          'შემიძლია Claude-ის დესკტოპ აპლიკაციაში შესვლა',
          'მაქვს ანგარიშები GitHub-ზე, Railway-ზე, N8N Cloud-ზე და Neon-ზე',
          'მაქვს Google ანგარიში მომზადებული',
        ],
      },
      costs: {
        title: 'ხარჯების შესახებ',
        claudeRecommended: 'Claude (რეკომენდებული)',
        claudeMinimum: 'Claude (მინიმალური)',
        everythingElse: 'ყველაფერი დანარჩენი',
        free: 'უფასო (უფასო დონეები)',
        totalRecommended: 'სულ რეკომენდებული',
        note: 'Claude-ის $100-იანი გეგმა საკმარისია vibe coding-ისთვის, აგენტისთვის და ყოველდღიური სამუშაოსთვის. $20-იანი გეგმა მუშაობს, მაგრამ სწრაფად იწურება პროექტების აშენებისას. თუ $200-იან გეგმას აიღებთ, კიდევ უკეთესი — არანაირ ლიმიტს არ მიაღწევთ.',
      },
      dontWorry: {
        title: 'რაზეც არ უნდა იდარდოთ',
        items: [
          'არ გჭირდებათ კოდის ცოდნა',
          'არ გჭირდებათ VS Code-ში რაიმეს გაგება ჯერჯერობით',
          'არ გჭირდებათ პროექტების დაყენება',
          'უბრალოდ დააინსტალირეთ და შექმენით ანგარიშები — ყველაფერ დანარჩენს ერთად გავაკეთებთ',
        ],
      },
      signOff: 'სესიაზე შევხვდებით!',
    },

    // Footer
    footer: {
      left: 'irakli.md v1.0',
      right: 'აშენებულია',
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = (typeof translations)[Language];
