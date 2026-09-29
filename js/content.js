/* ------------------------------------------------------------------
   ALL SITE CONTENT LIVES HERE.
   Edit text, links and dates in this file only - no HTML needed.
   `shared` is used by both modes; `academic` / `industry` are per-mode.
------------------------------------------------------------------- */
window.CONTENT = {
  shared: {
    name: "Foyzul Hoque",
    location: "Dhaka, Bangladesh",
    email: "foyzul.aman@gmail.com",
    githubPrivateRepos: null,          // GitHub only reveals public repos to visitors. Type your private repo count here (e.g. 12) to show it.
    phone: "+880-1713490790",          // shown publicly; delete this line to hide it everywhere
    links: {
      github: "https://github.com/FoyzulHoque",
      linkedin: "https://www.linkedin.com/in/foyzul-hoque-8b5277184/",
      orcid: "https://orcid.org/0009-0009-5132-6477",
      researchgate: "https://www.researchgate.net/profile/Foyzul-Hoque",
      ieee: "https://ieeexplore.ieee.org/author/37090024105"
    },
    education: [
      { title: "B.Sc. in Computer Science & Engineering", org: "Independent University, Bangladesh (IUB)", when: "2019 – 2024", note: "CGPA 3.08 / 4.00" },
      { title: "A-Levels (Science)", org: "Willes Little Flower School & College", when: "2019", note: "" },
      { title: "O-Levels (Science)", org: "Willes Little Flower School & College", when: "2016", note: "" }
    ],
    awards: [
      { title: "Question MindMap (QMM)", note: "Prepared the workshop “Developing an Engineering Thinking Mindset”", when: "Jul 2022", url: "https://www.linkedin.com/in/foyzul-hoque-8b5277184/details/honors/1740936589442/single-media-viewer/?profileId=ACoAACt3Q0kB9YCBZi9OcMoS6OybAy7KKVr1auQ" },
      { title: "HUAWEI Training", note: "The future of the mobile app industry", when: "Dec 2021", url: "https://www.linkedin.com/in/foyzul-hoque-8b5277184/overlay/1635555444258/single-media-viewer/?profileId=ACoAACt3Q0kB9YCBZi9OcMoS6OybAy7KKVr1auQ" },
      { title: "Cisco CCNAv7: Introduction to Networks", note: "Cisco Networking Academy", when: "Oct 2022", url: "https://www.linkedin.com/in/foyzul-hoque-8b5277184/overlay/certifications/896392311/multiple-media-viewer/?profileId=ACoAACt3Q0kB9YCBZi9OcMoS6OybAy7KKVr1auQ" }
    ],
    volunteer: [
      { title: "Event Coordinator", org: "Korean Club, IUB", when: "Mar 2020", note: "Organised the activities, décor and programme of the Korean Fest." },
      { title: "Logistics Management", org: "Division of Student Activities, IUB", when: "Oct 2019", note: "Managed inventory, shipments and transport coordination for campus events." }
    ],
    /* Certificates gallery. Add a new one: drop two images in assets/certs/ and add a row here. */
    certificates: [
      { title: "CCNAv7: Introduction to Networks", by: "Cisco Networking Academy · IUB", when: "Oct 2022", kind: "Certification", img: "ccnav7-2022" },
      { title: "Internship Completion", by: "Fortis Group (TORR)", when: "Sep 2024", kind: "Industry", img: "fortis-internship-2024" },
      { title: "QMM Workshop Volunteer", by: "Independent University, Bangladesh", when: "Jul 2022", kind: "Volunteering", img: "qmm-workshop-2022" },
      { title: "The Future of Mobile App Industry", by: "HUAWEI Developers", when: "Dec 2021", kind: "Training", img: "huawei-webinar-2021" },
      { title: "Korean Festival 2020", by: "IUB Korean Club", when: "Mar 2020", kind: "Extra-curricular", img: "korean-festival-2020" },
      { title: "Club Carnival 2019", by: "IUB Division of Student Affairs", when: "Oct 2019", kind: "Extra-curricular", img: "club-carnival-2019" }
    ],
    /* Official IUB letters: student ID is blacked out and images are watermarked in assets/letters/. Never add the original PDFs to this repo. */
    letters: [
      { title: "Medium of Instruction Certificate", by: "Registrar, Independent University, Bangladesh", when: "Dec 2024", kind: "Official letter", img: "medium-of-instruction" },
      { title: "Migration Certificate", by: "Registrar, Independent University, Bangladesh", when: "Dec 2024", kind: "Official letter", img: "migration-certificate" },
      { title: "To Whom It May Concern", by: "Registrar, Independent University, Bangladesh", when: "Dec 2024", kind: "Enrolment & CGPA letter", img: "to-whom-it-may-concern" }
    ],
    languages: "English (fluent) · Bangla (native) · Hindi (verbal)"
  },

  /* ============================ ACADEMIC ============================ */
  academic: {
    tag: "Researcher · Deep Learning",
    photoTags: ["Deep Learning", "Applied AI", "PhD applicant"],
    cv: { label: "Download academic CV", href: "assets/cv/Foyzul_Hoque_Academic_CV.pdf", file: "Foyzul_Hoque_Academic_CV.pdf" },
    headline: "Building AI that <em>explains itself</em> and solves real problems.",
    intro: "B.Sc. CSE graduate with a background in image processing and data clustering. My research spans deep learning and neural architectures, vision transformers, AI for finance and bioinformatics, and human-AI collaboration in software engineering. I am looking for a PhD position.",
    ctaPrimary: { label: "See publications", href: "#publications" },
    ctaSecondary: { label: "Get in touch", href: "#contact" },
    stats: [
      { n: "6", l: "Publications" },
      { n: "3", l: "Papers in preparation" },
      { n: "4", l: "Research projects" }
    ],
    now: "Open to PhD positions across AI and deep learning: neural architectures, vision transformers, finance and bioinformatics, and human-AI collaboration in software engineering.",
    interests: [
      { icon: "🧠", t: "Deep Learning & Neural Architectures" },
      { icon: "🧬", t: "AI in Finance & Bioinformatics" },
      { icon: "👁️", t: "Vision Transformers & Image Classification" },
      { icon: "🤝", t: "Human-AI Collaboration in Software Engineering" }
    ],
    publicationGroups: [
      {
        group: "Peer-reviewed",
        items: [
          { title: "Decoding Stock Trends: A Comparative Study of GRU, LSTM, and Transformer Models in Tech Sector Prediction", authors: "Asaad Sendi, Foyzul Hoque, Md Tamjidul Hoque", venue: "Transactions on Engineering and Computing Sciences (ISSN 2054-7390)", year: "2025", summary: "Benchmarks GRU, LSTM and Transformer models for tech-stock prediction; GRU achieved the best MAE.", url: "https://journals.scholarpublishing.org/index.php/TMLAI/article/view/18843", tag: "Finance · Time series" },
          { title: "PPILS: Protein-protein interaction prediction with language of biological coding", authors: "Nayan Howladar, Md Wasi Ul Kabir, Foyzul Hoque, Ataur Katebi, Md Tamjidul Hoque", venue: "Computers in Biology and Medicine, Elsevier", year: "2025", summary: "Integrates transformer-based language modelling with biological sequence encoding to improve protein-protein interaction prediction.", url: "https://www.sciencedirect.com/science/article/abs/pii/S0010482525000289?via%3Dihub", tag: "Bioinformatics · NLP" },
          { title: "Solar Powered Water Trash Collector Robot", authors: "Sanjana Raquib Bijoya, Tahseen Ahmed Bhuiyan, Foyzul Hoque, Mehadi Hassan Khan, Mahady Hasan, Mohammad Rejwan Uddin", venue: "IHMSC 2023, IEEE", year: "2023", summary: "A solar-powered aquatic robot for autonomous waste collection using sensor-based navigation and planning.", url: "https://ieeexplore.ieee.org/document/10261550", tag: "Robotics" }
        ]
      },
      {
        group: "Preprints",
        items: [
          { title: "Analysis of Convolution and Transformer-based Neural Network for Husk Image Classification", authors: "Saiyara Raquib Oishy, Maha Murshed, Foyzul Hoque", venue: "ResearchGate preprint", year: "2024", summary: "Compares CNN and Vision Transformer models for crop image classification; ViT generalised better.", url: "https://www.researchgate.net/publication/379980352_Analysis_of_Convolution_and_Transformer-based_Neural_Network_for_Husk_Image_Classification", tag: "Computer vision" },
          { title: "AI based solutions for Software Engineering", authors: "Nahiyan Ibn Ershad, Rafia Shehnil, Foyzul Hoque, Mahib Sadman, Sanjana Raquib Bijoya", venue: "ResearchGate preprint", year: "2024", summary: "Proposes a Collaborative Data Validation Framework to improve data quality in AI-driven software development.", url: "https://www.researchgate.net/publication/387219249_AI_based_solutions_for_Software_Engineering", tag: "SE + AI" }
        ]
      }
    ],
    inPreparation: [
      { t: "Self-Supervised Architectures for Low-Resource Medical Imaging", d: "Masked autoencoders and contrastive learning for few-shot image segmentation." },
      { t: "Fusion of CNN and ViT for Agricultural Image Tasks", d: "Combining convolutional and attention-based models to improve classification accuracy." },
      { t: "Explainable AI Approaches in Software Engineering Tools", d: "SHAP and attention maps for more interpretable AI development tools." }
    ],
    projects: [
      { name: "TrashBot", year: "2023", d: "An autonomous solar-powered robot for waste collection.", tags: ["Robotics", "Sensors"] },
      { name: "PPILS", year: "2025", d: "A transformer-based biological sequence model for protein-protein interactions.", tags: ["Transformers", "Bioinformatics"] },
      { name: "AgroVision", year: "2024", d: "Husk classification with CNN and ViT using transfer learning.", tags: ["CNN", "ViT"] },
      { name: "StockTrends", year: "2025", d: "Financial forecasting using RNN and Transformer models.", tags: ["GRU", "LSTM"] }
    ],
    experience: [
      { role: "Research Assistant (part-time)", org: "Independent University, Bangladesh", url: "https://iub.ac.bd/", when: "Sep 2021 – Dec 2023", where: "Dhaka", d: "Built network topology simulations with NS3 and Mininet in C++, including hybrid topologies, and evaluated performance under varying parameters to optimise operational efficiency." },
      { role: "Senior Mobile App Developer (part-time, remote)", org: "Cuebites", url: "https://cuebites.com.au/", when: "Dec 2025 – Present", where: "Sydney, Australia", d: "Owned the full mobile app lifecycle from concept to App Store and Play Store release, with automated CI/CD." },
      { role: "App Developer → Team Leader", org: "Betopia Group", url: "https://betopiagroup.com/", when: "Dec 2024 – Jul 2026", where: "Dhaka", d: "Delivered client apps with Agile practices and later led the app team." },
      { role: "Software Engineer (intern)", org: "Fortis Group", url: "https://fortisgroupbd.com/", when: "May – Aug 2024", where: "Dhaka", d: "Prototyped an internal communication app in Flutter and iterated on stakeholder feedback." }
    ],
    skills: [
      { g: "ML & Concepts", items: ["Transfer Learning", "LSTM / GRU / Transformer", "CNN / ViT", "NLP", "Data Augmentation", "MCP"] },
      { g: "Frameworks", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "FastAPI"] },
      { g: "Languages", items: ["Python", "C++", "Dart", "Java", "PHP"] },
      { g: "Research tools", items: ["LaTeX", "Google Colab", "Kaggle", "NS3", "Mininet", "GitHub"] }
    ],
    contactTitle: "Seeking PhD supervision",
    contactLine: "I am looking for a supervisor to guide my PhD. If my research interests (deep learning and neural architectures, vision transformers, AI for finance and bioinformatics, human-AI collaboration in software engineering) fit your group, I would be grateful to hear from you.",
  },

  /* ============================ INDUSTRY ============================ */
  industry: {
    tag: "Mobile Engineer · Team Lead",
    photoTags: ["Flutter", "Team Lead", "Store-ready"],
    cv: { label: "Download CV", href: "assets/cv/Foyzul_Hoque_Industry_CV.pdf", file: "Foyzul_Hoque_Industry_CV.pdf" },
    headline: "I ship <em>robust apps</em> — not just screens.",
    intro: "Software engineer and Flutter specialist. I take products from wireframe to App Store and Play Store, lead the team behind them, and keep them fast, stable and shippable.",
    ctaPrimary: { label: "View my work", href: "#projects" },
    ctaSecondary: { label: "Hire me", href: "#contact" },
    stats: [
      { n: "5+", l: "Apps shipped" },
      { n: "2", l: "Store platforms" },
      { n: "1", l: "Team led" }
    ],
    now: "Senior Mobile App Developer at Cuebites (Sydney, remote) · open to new opportunities.",
    interests: [
      { icon: "📱", t: "Flutter & cross-platform mobile" },
      { icon: "🚀", t: "CI/CD & store releases" },
      { icon: "🧩", t: "Scalable app architecture" },
      { icon: "🤖", t: "AI-powered product features" }
    ],
    publicationGroups: [],
    publicationsShort: [
      { title: "Decoding Stock Trends (GRU / LSTM / Transformer)", venue: "TECS · 2025", url: "https://journals.scholarpublishing.org/index.php/TMLAI/article/view/18843" },
      { title: "PPILS: protein-protein interaction prediction", venue: "Computers in Biology and Medicine · 2025", url: "https://www.sciencedirect.com/science/article/abs/pii/S0010482525000289?via%3Dihub" },
      { title: "Solar Powered Water Trash Collector Robot", venue: "IEEE IHMSC · 2023", url: "https://ieeexplore.ieee.org/document/10261550" }
    ],
    projects: [
      { name: "Together", kind: "Social networking · worldwide", d: "Project manager and lead developer for the full Agile rebuild of a legacy app. Re-architected from scratch and added AI conversation starters, biometric liveness checks, real-time map integration, native in-app purchases, subscriptions and multilingual support.", tags: ["Flutter", "AI", "IAP", "Maps"], links: [{ l: "Play Store", u: "https://play.google.com/store/apps/details?id=com.togetherapps.together&pcampaignid=web_share" }], size: "lg" },
      { name: "wecare", kind: "News · France", d: "French-market news app published on the Apple App Store. Owned the full lifecycle from requirements to deployment against strict international standards.", tags: ["Flutter", "iOS", "App Store"], links: [{ l: "App Store", u: "https://apps.apple.com/eg/app/wecare-no-more-greenwashing/id6747533569" }], size: "md" },
      { name: "FirstDate", kind: "AI dating", d: "Crafts the perfect first message and picks the top 5 activity and restaurant options located between two users, based on shared interests and food preferences.", tags: ["AI", "Mobile"], links: [], size: "md" },
      { name: "Ubhayam", kind: "Donations", d: "Temple discovery, transparent need-based support (including completed causes), personalised temple selection and a collaborative cause-suggestion system.", tags: ["Flutter", "Firebase"], links: [], size: "md" },
      { name: "Fortis HRIS", kind: "HR · factory workers", d: "Digitises leave and outside-visit approvals, tracks attendance and shows employee details, designed for staff without computer access.", tags: ["Flutter", "HR"], links: [], size: "md" }
    ],
    experience: [
      { role: "Senior Mobile App Developer (part-time, remote)", org: "Cuebites", url: "https://cuebites.com.au/", when: "Dec 2025 – Present", where: "Sydney, Australia", d: "Full-stack mobile engineer with total ownership of the app lifecycle: concept and wireframes through to App Store and Play Store deployment. Architected a scalable codebase for high performance and crash-free sessions, handled complex API integrations and local data sync, aligned technical roadmaps with business goals, and set up automated CI/CD." },
      { role: "App Developer (Team Leader)", org: "Betopia Group (formerly BdCalling IT Ltd)", url: "https://betopiagroup.com/", when: "May 2025 – Jul 2026", where: "Dhaka, Bangladesh", d: "Promoted to team leader. Directed all app development operations: planning, resource optimisation and stakeholder management. Removed technical blockers and defined clear scopes to deliver mobile apps on time." },
      { role: "App Developer", org: "BdCalling IT Ltd", url: "https://bdcalling.com/", when: "Dec 2024 – May 2025", where: "Dhaka, Bangladesh", d: "Worked with international clients on requirements analysis and scoping, delivering iteratively with Agile." },
      { role: "Software Engineer (intern)", org: "Fortis Group", url: "https://fortisgroupbd.com/", when: "May – Aug 2024", where: "Dhaka, Bangladesh", d: "Designed an intuitive internal-communication app, built a Flutter prototype, tested for performance and iterated on stakeholder feedback." }
    ],
    skills: [
      { g: "Mobile", items: ["Flutter", "Dart", "React Native", "Swift", "Firebase"] },
      { g: "Backend & data", items: ["FastAPI", "PHP", "MySQL", "Supabase", "Neon", "Aiven"] },
      { g: "Ship & operate", items: ["Codemagic", "Shorebird", "Fly", "Vercel", "Play Console", "App Store Connect", "Postman"] },
      { g: "Design", items: ["Figma", "Adobe XD", "Canva"] },
      { g: "Leadership", items: ["Project management", "Client management", "Agile", "Communication", "Problem solving"] },
      { g: "Also", items: ["Python", "C++", "Java", "Arduino", "NodeMCU"] }
    ],
    contactTitle: "Get in touch",
    contactLine: "Have a product to build or a team to strengthen? Let's talk."
  }
};
