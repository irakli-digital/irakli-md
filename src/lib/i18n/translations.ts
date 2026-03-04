export const translations = {
  en: {
    // Nav
    nav: {
      about: 'about',
      projects: 'projects',
      services: 'services',
      speaking: 'speaking',
      blog: 'blog',
      contact: 'contact',
    },

    // Hero
    hero: {
      boot: [
        'initializing irakli.md...',
        'loading profile... done',
        'loading projects... 12 found',
        'loading achievements... done',
        'status: builder | educator | strategist',
        'ready.',
      ],
      tagline: 'building products. teaching AI. scaling digital.',
      subtitle: 'Head of Digital Acquisition | AI Educator | Builder',
      cta: {
        projects: 'explore projects',
        contact: 'get in touch',
      },
    },

    // About
    about: {
      command: '> whoami',
      title: '~/about',
      bio: `Head of Digital Acquisition at TBC Uzbekistan & Payme, scaling products to 5M+ users. I build digital products, teach AI literacy, and help organizations navigate digital transformation. Based in Tbilisi, working across Central Asia and the Caucasus.`,
      stats: {
        command: '> stats --summary',
        items: [
          { key: 'products_scaled', value: '5M+ users' },
          { key: 'students_taught', value: '500+' },
          { key: 'years_in_digital', value: '10+' },
          { key: 'countries_worked', value: '3' },
          { key: 'languages_spoken', value: '4' },
        ],
      },
    },

    // Projects
    projects: {
      command: '> ls projects/',
      title: '~/projects',
      viewCase: 'view case study',
      items: [
        {
          slug: 'tbc-payme',
          name: 'TBC / Payme Digital Growth',
          description: 'Led digital acquisition strategy scaling TBC Uzbekistan & Payme from 0 to 5M+ users across digital channels.',
          tags: ['Growth', 'Fintech', 'Acquisition'],
          metric: '5M+ users acquired',
        },
        {
          slug: 'ai-literacy',
          name: 'AI Literacy Platform',
          description: 'Practice-first AI education platform. 60 scenarios, 4 certification stages, AI-powered evaluation.',
          tags: ['EdTech', 'AI', 'Next.js'],
          metric: '60 scenarios, 4 stages',
        },
        {
          slug: 'digital-transformation',
          name: 'Digital Transformation Course',
          description: 'Comprehensive digital transformation curriculum taught at Harbour Space and across educational institutions.',
          tags: ['Education', 'Curriculum', 'Digital'],
          metric: '500+ students',
        },
        {
          slug: 'space-international',
          name: 'Space International',
          description: 'Digital acquisition for one of the leading banking apps in the Uzbekistan market with 5M+ user base.',
          tags: ['Fintech', 'Mobile', 'Strategy'],
          metric: '5M+ user base',
        },
      ],
    },

    // Services
    services: {
      command: '> cat services.txt',
      title: '~/services',
      items: [
        {
          name: 'Digital Strategy & Acquisition',
          description: 'Data-driven growth strategies. Performance marketing, paid social, search, and programmatic across channels.',
        },
        {
          name: 'AI Implementation & Training',
          description: 'Practical AI literacy programs for teams. From prompt engineering to building AI-powered workflows.',
        },
        {
          name: 'Growth Marketing',
          description: 'Full-funnel acquisition, retention, and analytics. Scaling products from 0 to millions of users.',
        },
        {
          name: 'Digital Transformation Consulting',
          description: 'Helping organizations modernize their digital presence, processes, and team capabilities.',
        },
      ],
    },

    // Speaking
    speaking: {
      command: '> history --talks',
      title: '~/speaking',
      items: [
        {
          name: 'Month of AI',
          date: '2024',
          topic: 'AI Literacy & The Future of Work',
          description: 'Organized and spoke at Month of AI initiative, bringing together AI practitioners and learners.',
        },
        {
          name: 'Startup Ecosystem Georgia',
          date: '2024',
          topic: 'Digital Acquisition for Startups',
          description: 'Keynote on growth strategies for early-stage startups in emerging markets.',
        },
        {
          name: 'Harbour Space University',
          date: '2023-2024',
          topic: 'Digital Transformation',
          description: 'Guest lectures on digital transformation and AI integration in business.',
        },
        {
          name: 'TBC Tech Talks',
          date: '2023',
          topic: 'Scaling Digital Products',
          description: 'Internal talk on the journey of scaling Payme to millions of users.',
        },
      ],
    },

    // Blog
    blog: {
      command: '> cat blog/latest',
      title: '~/blog',
      viewAll: 'view all posts',
      comingSoon: 'Blog posts coming soon. Subscribe to get notified.',
      posts: [],
    },

    // Contact
    contact: {
      command: '> contact --reach-me',
      title: '~/contact',
      cta: "let's build something together.",
      subscribe: {
        placeholder: 'your@email.com',
        button: 'subscribe',
        note: 'No spam. Unsubscribe anytime.',
      },
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
      projects: 'პროექტები',
      services: 'სერვისები',
      speaking: 'გამოსვლები',
      blog: 'ბლოგი',
      contact: 'კონტაქტი',
    },

    // Hero
    hero: {
      boot: [
        'irakli.md იტვირთება...',
        'პროფილის ჩატვირთვა... მზადაა',
        'პროექტების ჩატვირთვა... 12 ნაპოვნი',
        'მიღწევების ჩატვირთვა... მზადაა',
        'სტატუსი: builder | educator | strategist',
        'მზადაა.',
      ],
      tagline: 'პროდუქტების შექმნა. AI სწავლება. ციფრული ზრდა.',
      subtitle: 'ციფრული შეძენის ხელმძღვანელი | AI განათლება | Builder',
      cta: {
        projects: 'პროექტების ნახვა',
        contact: 'დაკავშირება',
      },
    },

    // About
    about: {
      command: '> whoami',
      title: '~/about',
      bio: `TBC Uzbekistan-ისა და Payme-ის ციფრული შეძენის ხელმძღვანელი, პროდუქტების მასშტაბირება 5M+ მომხმარებლამდე. ვაშენებ ციფრულ პროდუქტებს, ვასწავლი AI წიგნიერებას და ვეხმარები ორგანიზაციებს ციფრულ ტრანსფორმაციაში.`,
      stats: {
        command: '> stats --summary',
        items: [
          { key: 'გაზრდილი_პროდუქტები', value: '5M+ მომხმარებელი' },
          { key: 'სტუდენტები', value: '500+' },
          { key: 'წლები_ციფრულში', value: '10+' },
          { key: 'ქვეყნები', value: '3' },
          { key: 'ენები', value: '4' },
        ],
      },
    },

    // Projects
    projects: {
      command: '> ls projects/',
      title: '~/projects',
      viewCase: 'ქეისის ნახვა',
      items: [
        {
          slug: 'tbc-payme',
          name: 'TBC / Payme ციფრული ზრდა',
          description: 'TBC Uzbekistan-ისა და Payme-ის ციფრული შეძენის სტრატეგია - 0-დან 5M+ მომხმარებლამდე.',
          tags: ['ზრდა', 'ფინტექი', 'შეძენა'],
          metric: '5M+ შეძენილი მომხმარებელი',
        },
        {
          slug: 'ai-literacy',
          name: 'AI წიგნიერების პლატფორმა',
          description: 'პრაქტიკაზე ორიენტირებული AI განათლების პლატფორმა. 60 სცენარი, 4 სერტიფიკაციის ეტაპი.',
          tags: ['EdTech', 'AI', 'Next.js'],
          metric: '60 სცენარი, 4 ეტაპი',
        },
        {
          slug: 'digital-transformation',
          name: 'ციფრული ტრანსფორმაციის კურსი',
          description: 'ყოვლისმომცველი ციფრული ტრანსფორმაციის კურიკულუმი Harbour Space-სა და სხვა საგანმანათლებლო დაწესებულებებში.',
          tags: ['განათლება', 'კურიკულუმი', 'ციფრული'],
          metric: '500+ სტუდენტი',
        },
        {
          slug: 'space-international',
          name: 'Space International',
          description: 'უზბეკეთის ბაზარზე ერთ-ერთი წამყვანი საბანკო აპლიკაციის ციფრული შეძენა 5M+ მომხმარებლით.',
          tags: ['ფინტექი', 'მობილური', 'სტრატეგია'],
          metric: '5M+ მომხმარებელი',
        },
      ],
    },

    // Services
    services: {
      command: '> cat services.txt',
      title: '~/services',
      items: [
        {
          name: 'ციფრული სტრატეგია და შეძენა',
          description: 'მონაცემებზე დაფუძნებული ზრდის სტრატეგიები. შესრულების მარკეტინგი, ფასიანი სოციალური, ძიება და პროგრამატიკი.',
        },
        {
          name: 'AI იმპლემენტაცია და ტრენინგი',
          description: 'პრაქტიკული AI წიგნიერების პროგრამები გუნდებისთვის. პრომპტ ინჟინერინგიდან AI სამუშაო პროცესებამდე.',
        },
        {
          name: 'ზრდის მარკეტინგი',
          description: 'სრული ფანელი: შეძენა, შენარჩუნება და ანალიტიკა. პროდუქტების მასშტაბირება 0-დან მილიონობით მომხმარებლამდე.',
        },
        {
          name: 'ციფრული ტრანსფორმაციის კონსულტაცია',
          description: 'ორგანიზაციების ციფრული პრეზენტაციის, პროცესებისა და გუნდის შესაძლებლობების მოდერნიზაცია.',
        },
      ],
    },

    // Speaking
    speaking: {
      command: '> history --talks',
      title: '~/speaking',
      items: [
        {
          name: 'AI-ის თვე',
          date: '2024',
          topic: 'AI წიგნიერება და მუშაობის მომავალი',
          description: 'AI-ის თვის ინიციატივის ორგანიზება და გამოსვლა, AI პრაქტიკოსებისა და სტუდენტების გაერთიანება.',
        },
        {
          name: 'სტარტაპ ეკოსისტემა საქართველო',
          date: '2024',
          topic: 'ციფრული შეძენა სტარტაპებისთვის',
          description: 'საკვანძო გამოსვლა ადრეული ეტაპის სტარტაპების ზრდის სტრატეგიებზე განვითარებად ბაზრებზე.',
        },
        {
          name: 'Harbour Space უნივერსიტეტი',
          date: '2023-2024',
          topic: 'ციფრული ტრანსფორმაცია',
          description: 'სტუმარი ლექციები ციფრულ ტრანსფორმაციასა და AI ინტეგრაციაზე ბიზნესში.',
        },
        {
          name: 'TBC ტექ თოქსი',
          date: '2023',
          topic: 'ციფრული პროდუქტების მასშტაბირება',
          description: 'შიდა გამოსვლა Payme-ის მილიონობით მომხმარებლამდე მასშტაბირების გზაზე.',
        },
      ],
    },

    // Blog
    blog: {
      command: '> cat blog/latest',
      title: '~/blog',
      viewAll: 'ყველა პოსტის ნახვა',
      comingSoon: 'ბლოგ პოსტები მალე. გამოიწერეთ შეტყობინებისთვის.',
      posts: [],
    },

    // Contact
    contact: {
      command: '> contact --reach-me',
      title: '~/contact',
      cta: 'მოდი, რაღაც ერთად შევქმნათ.',
      subscribe: {
        placeholder: 'your@email.com',
        button: 'გამოწერა',
        note: 'სპამი არ იქნება. გამოწერის გაუქმება ნებისმიერ დროს.',
      },
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
