export const translations = {
  en: {
    // Nav
    nav: {
      about: 'about',
      projects: 'experience',
      services: 'services',
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
      tagline: 'scaling fintech to 19M+ users. teaching AI. building digital products.',
      subtitle: 'Head of Digital Acquisition & Telesales | AI Educator | Growth Executive',
      cta: {
        projects: 'explore experience',
        contact: 'get in touch',
      },
    },

    // About
    about: {
      command: '> whoami',
      title: '~/about',
      bio: `Head of Digital Acquisition & Telesales at TBC Uzbekistan & Payme. 17 years in B2C marketing, fintech, and digital banking. Scaled products to 19.4M+ registered users and 50% population penetration in Uzbekistan. Managing 300+ person team and $15M+ annual budgets. AI educator and growth executive. Based in Tbilisi, working across Central Asia and the Caucasus.`,
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
      command: '> ls career/',
      title: '~/experience',
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
      command: '> cat services.txt',
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
          description: 'Harbour.Space University, Toulouse BS, Digitalhub.edu.ge instructor. Performance Marketing newsletter with 1,800+ subscribers.',
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
          topic: "Master's in Digital Marketing",
          description: "Faculty member teaching in the Master's in Digital Marketing program. Modules on acquisition, analytics, and growth.",
        },
        {
          name: 'Performance Marketing Insights',
          date: 'Ongoing',
          topic: 'Newsletter',
          description: 'Weekly newsletter covering performance marketing, AI in marketing, and growth strategies. 1,800+ subscribers.',
        },
      ],
    },

    // Lab
    lab: {
      command: '> ls ~/lab/',
      title: '~/lab',
      subtitle: 'side projects & ideas I build in my free time',
      statusLabels: {
        live: 'live',
        building: 'building',
        idea: 'idea',
      },
      items: [
        {
          slug: 'ai-literacy',
          name: 'AI Literacy Platform',
          description: 'Practice-first AI education. Learn by doing, not watching.',
          status: 'building' as const,
          progress: 60,
        },
        {
          slug: 'automation-templates',
          name: 'Automation Templates',
          description: 'n8n workflow templates for marketers and growth teams.',
          status: 'building' as const,
          progress: 30,
        },
        {
          slug: 'newsletter-analytics',
          name: 'Newsletter Analytics',
          description: 'Performance marketing insights dashboard.',
          status: 'idea' as const,
          progress: 0,
        },
        {
          slug: 'growth-playbook',
          name: 'Growth Playbook',
          description: 'Open-source acquisition frameworks for emerging markets.',
          status: 'idea' as const,
          progress: 0,
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
      cta: 'try it',
      backHome: 'cd ~/',
      items: [
        {
          slug: 'claude',
          name: 'Claude',
          category: 'AI',
          description: 'AI assistant for writing, coding, analysis, and research. My primary AI tool.',
          url: '#',
        },
        {
          slug: 'cursor',
          name: 'Cursor',
          category: 'AI',
          description: 'AI-powered code editor. The fastest way to build with AI assistance.',
          url: '#',
        },
        {
          slug: 'n8n',
          name: 'n8n',
          category: 'Automation',
          description: 'Workflow automation platform. Connect anything to everything.',
          url: '#',
        },
        {
          slug: 'vercel',
          name: 'Vercel',
          category: 'Hosting',
          description: 'Frontend cloud platform. Deploy Next.js apps in seconds.',
          url: '#',
        },
        {
          slug: 'neon',
          name: 'Neon',
          category: 'Database',
          description: 'Serverless PostgreSQL. Scales to zero, branches like git.',
          url: '#',
        },
        {
          slug: 'figma',
          name: 'Figma',
          category: 'Design',
          description: 'Collaborative design tool for UI/UX and prototyping.',
          url: '#',
        },
        {
          slug: 'linear',
          name: 'Linear',
          category: 'Productivity',
          description: 'Project management built for speed. Track issues and ship faster.',
          url: '#',
        },
        {
          slug: 'notion',
          name: 'Notion',
          category: 'Productivity',
          description: 'All-in-one workspace for docs, wikis, and project management.',
          url: '#',
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
        github: 'open github',
        email: 'mail irakli',
        twitter: 'open twitter',
      },
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
      services: 'სერვისები',
      speaking: 'გამოსვლები',
      lab: 'ლაბი',
      tools: 'ხელსაწყოები',
      contact: 'კონტაქტი',
    },

    // Hero
    hero: {
      boot: [
        'irakli.md იტვირთება...',
        'გამოცდილების ჩატვირთვა... 17 წელი ნაპოვნი',
        'მომხმარებლების ჩატვირთვა... 19.4M რეგისტრირებული',
        'შემოსავლის ჩატვირთვა... $152M გენერირებული',
        'სტატუსი: growth executive | AI educator | builder',
        'მზადაა.',
      ],
      tagline: 'ფინტექის მასშტაბირება 19M+ მომხმარებლამდე. AI სწავლება. ციფრული პროდუქტები.',
      subtitle: 'ციფრული შეძენისა და ტელესეილზის ხელმძღვანელი | AI განათლება | Growth Executive',
      cta: {
        projects: 'გამოცდილების ნახვა',
        contact: 'დაკავშირება',
      },
    },

    // About
    about: {
      command: '> whoami',
      title: '~/about',
      bio: `TBC Uzbekistan-ისა და Payme-ის ციფრული შეძენისა და ტელესეილზის ხელმძღვანელი. B2C მარკეტინგში 17 წლიანი გამოცდილება, ფინტექი და ციფრული ბანკინგი. პროდუქტების მასშტაბირება 19.4M+ რეგისტრირებულ მომხმარებლამდე და უზბეკეთის მოსახლეობის 50%-იანი პენეტრაცია. 300+ კაციანი გუნდის მართვა, $15M+ წლიური ბიუჯეტები. AI განმანათლებელი და growth executive. ბაზირებული თბილისში, მუშაობა ცენტრალურ აზიასა და კავკასიაში.`,
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
      command: '> ls career/',
      title: '~/გამოცდილება',
      viewCase: 'დეტალების ნახვა',
      items: [
        {
          slug: 'tbc-payme',
          name: 'TBC Uzbekistan & Payme',
          description: 'ციფრული შეძენისა და ტელესეილზის ხელმძღვანელი. 16M+ რეგისტრირებული მომხმარებელი, $626M სასესხო პორტფელი (+103%), $152M შემოსავალი (+93% YoY), 5.9M MAU (+38%). 300+ კაციანი გუნდი.',
          tags: ['ფინტექი', 'ზრდა', 'ლიდერობა'],
          metric: '2024–დღემდე',
        },
        {
          slug: 'space-international',
          name: 'Space International / CDMO',
          description: 'მომხმარებელთა ბაზის ზრდა 4M-დან 16M+-მდე. კონვერსიის 40%-იანი გაუმჯობესება. მარკეტინგის ავტომატიზაცია 2 ქვეყანაში.',
          tags: ['ფინტექი', 'ავტომატიზაცია', 'სტრატეგია'],
          metric: '2022–2024',
        },
        {
          slug: 'space-neobank',
          name: 'Space ნეობანკის გაშვება',
          description: 'საქართველოს პირველი სრულად ციფრული ბანკის გაშვება. 100K მომხმარებელი პირველ 6 თვეში. ციფრული შეძენის არხების აშენება ნულიდან.',
          tags: ['ნეობანკი', 'გაშვება', 'ციფრული'],
          metric: '2018–2020',
        },
        {
          slug: 'digitalhub',
          name: 'DigitalHub სააგენტო',
          description: 'ციფრული სააგენტოს დაფუძნება. Enterprise კლიენტები: Pepsico (Lay\'s), Avis, ფინტექ კომპანიები.',
          tags: ['სააგენტო', 'Enterprise', 'დამფუძნებელი'],
          metric: '2014–2018',
        },
        {
          slug: 'ogilvy',
          name: 'Ogilvy Caucasus',
          description: 'MD / ანგარიშის დირექტორი საქართველოში, სომხეთსა და აზერბაიჯანში. BAT და საერთაშორისო კლიენტების პორტფელი.',
          tags: ['რეკლამა', 'საერთაშორისო', 'მენეჯმენტი'],
          metric: '2009–2014',
        },
      ],
    },

    // Services
    services: {
      command: '> cat services.txt',
      title: '~/სერვისები',
      items: [
        {
          name: 'ზრდის სტრატეგია და ციფრული შეძენა',
          description: 'მონაცემებზე დაფუძნებული ზრდა მასშტაბით. $15M+ ბიუჯეტის მართვა, performance მარკეტინგი, ფასიანი სოციალური, ძიება და პროგრამატიკი.',
        },
        {
          name: 'AI იმპლემენტაცია და ავტომატიზაცია',
          description: 'n8n სამუშაო პროცესები, ავტომატიზირებული ანგარიშგება (-60% ხელით მუშაობა), AI-ზე დაფუძნებული QA სისტემები, ორგანიზაციული AI ტრანსფორმაცია.',
        },
        {
          name: 'გუნდის აშენება და ლიდერობა',
          description: 'გუნდების 300+-მდე მასშტაბირება, ტელესეილზის ოპერაციები, QA სისტემები, ქვეყნებს შორის გუნდის მართვა.',
        },
        {
          name: 'განათლება და Thought Leadership',
          description: 'Harbour.Space უნივერსიტეტი, Toulouse BS, Digitalhub.edu.ge ინსტრუქტორი. Performance Marketing ნიუსლეთერი 1,800+ გამომწერით.',
        },
      ],
    },

    // Speaking
    speaking: {
      command: '> history --talks',
      title: '~/გამოსვლები',
      items: [
        {
          name: 'Digitalhub.edu.ge',
          date: '2024',
          topic: 'სოციალური მედიის რეკლამა',
          description: 'სოციალური მედიის რეკლამის კურსის ინსტრუქტორი. პრაქტიკული კურიკულუმი ფასიანი სოციალური სტრატეგიისა და შესრულების შესახებ.',
        },
        {
          name: 'Toulouse Business School Barcelona',
          date: '2018',
          topic: 'ციფრული მარკეტინგის სტუმარი ლექცია',
          description: 'სტუმარი ლექტორი ციფრული მარკეტინგის სტრატეგიისა და განვითარებად ბაზრებზე ზრდის შესახებ.',
        },
        {
          name: "Harbour.Space უნივერსიტეტი",
          date: '2017–2018',
          topic: 'ციფრული მარკეტინგის მაგისტრატურა',
          description: 'ციფრული მარკეტინგის მაგისტრატურის ფაკულტეტის წევრი. მოდულები შეძენის, ანალიტიკისა და ზრდის შესახებ.',
        },
        {
          name: 'Performance Marketing Insights',
          date: 'მიმდინარე',
          topic: 'ნიუსლეთერი',
          description: 'ყოველკვირეული ნიუსლეთერი performance მარკეტინგის, მარკეტინგში AI-ისა და ზრდის სტრატეგიების შესახებ. 1,800+ გამომწერი.',
        },
      ],
    },

    // Lab
    lab: {
      command: '> ls ~/lab/',
      title: '~/ლაბი',
      subtitle: 'გვერდითი პროექტები და იდეები, რომლებსაც თავისუფალ დროს ვაშენებ',
      statusLabels: {
        live: 'live',
        building: 'შენდება',
        idea: 'იდეა',
      },
      items: [
        {
          slug: 'ai-literacy',
          name: 'AI წიგნიერების პლატფორმა',
          description: 'პრაქტიკაზე ორიენტირებული AI განათლება. ისწავლე კეთებით, არა ყურებით.',
          status: 'building' as const,
          progress: 60,
        },
        {
          slug: 'automation-templates',
          name: 'ავტომატიზაციის შაბლონები',
          description: 'n8n სამუშაო პროცესის შაბლონები მარკეტერებისა და growth გუნდებისთვის.',
          status: 'building' as const,
          progress: 30,
        },
        {
          slug: 'newsletter-analytics',
          name: 'ნიუსლეთერის ანალიტიკა',
          description: 'Performance მარკეტინგის ინსაითების დეშბორდი.',
          status: 'idea' as const,
          progress: 0,
        },
        {
          slug: 'growth-playbook',
          name: 'Growth Playbook',
          description: 'ღია კოდის შეძენის ფრეიმვორკები განვითარებადი ბაზრებისთვის.',
          status: 'idea' as const,
          progress: 0,
        },
      ],
    },

    // Blog (hidden but kept for component compatibility)
    blog: {
      command: '> cat blog/latest',
      title: '~/ბლოგი',
      viewAll: 'ყველა პოსტის ნახვა',
      comingSoon: 'ბლოგ პოსტები მალე. გამოიწერეთ შეტყობინებისთვის.',
      posts: [] as { slug: string; title: string; date: string; excerpt: string }[],
    },

    // Tools
    tools: {
      command: '> cat ~/tools/stack.txt',
      title: '~/ხელსაწყოები',
      subtitle: 'ხელსაწყოები, რომლებსაც ყოველდღიურად ვიყენებ აშენებისთვის, ავტომატიზაციისა და გაშვებისთვის.',
      cta: 'სცადე',
      backHome: 'cd ~/',
      items: [
        {
          slug: 'claude',
          name: 'Claude',
          category: 'AI',
          description: 'AI ასისტენტი წერისთვის, კოდისთვის, ანალიზისა და კვლევისთვის.',
          url: '#',
        },
        {
          slug: 'cursor',
          name: 'Cursor',
          category: 'AI',
          description: 'AI-ზე მომუშავე კოდის რედაქტორი. ყველაზე სწრაფი გზა AI-ით აშენებისთვის.',
          url: '#',
        },
        {
          slug: 'n8n',
          name: 'n8n',
          category: 'ავტომატიზაცია',
          description: 'სამუშაო პროცესების ავტომატიზაციის პლატფორმა. დააკავშირე ყველაფერი ყველაფერთან.',
          url: '#',
        },
        {
          slug: 'vercel',
          name: 'Vercel',
          category: 'ჰოსტინგი',
          description: 'Frontend ღრუბლოვანი პლატფორმა. Next.js აპების დეპლოი წამებში.',
          url: '#',
        },
        {
          slug: 'neon',
          name: 'Neon',
          category: 'მონაცემთა ბაზა',
          description: 'Serverless PostgreSQL. სკეილდება ნულამდე, ბრენჩავს git-ის მსგავსად.',
          url: '#',
        },
        {
          slug: 'figma',
          name: 'Figma',
          category: 'დიზაინი',
          description: 'კოლაბორაციული დიზაინის ხელსაწყო UI/UX-ისა და პროტოტიპისთვის.',
          url: '#',
        },
        {
          slug: 'linear',
          name: 'Linear',
          category: 'პროდუქტიულობა',
          description: 'პროექტის მართვა სისწრაფისთვის. ტრექინგი და სწრაფი მიწოდება.',
          url: '#',
        },
        {
          slug: 'notion',
          name: 'Notion',
          category: 'პროდუქტიულობა',
          description: 'ყველაფერი-ერთში სამუშაო სივრცე დოკუმენტებისთვის, ვიკისა და პროექტის მართვისთვის.',
          url: '#',
        },
      ],
    },

    // Contact
    contact: {
      command: '> contact --reach-me',
      title: '~/კონტაქტი',
      cta: 'მოდი, რაღაც ერთად შევქმნათ.',
      links: {
        linkedin: 'open linkedin',
        github: 'open github',
        email: 'mail irakli',
        twitter: 'open twitter',
      },
    },

    // Footer
    footer: {
      left: 'irakli.md v1.0',
      right: 'შექმნილია',
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKeys = (typeof translations)[Language];
