export const sampleApps = [
  {
    id: "sample-app-1",
    name: "TaskMaster Pro",
    description: "AI-powered task management application that helps teams organize and prioritize work.",
    domain: "taskmasterpro.app",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    userCount: 215,
    revenue: 719.25,
    actions: [
      { id: "action-1-1", text: "Launch Product Hunt campaign", completed: true },
      { id: "action-1-2", text: "Implement referral program for teams", completed: true },
      { id: "action-1-3", text: "Create content marketing strategy focusing on productivity", completed: false },
      { id: "action-1-4", text: "Partner with productivity influencers for promotion", completed: false }
    ]
  },
  {
    id: "sample-app-2",
    name: "HealthTrack",
    description: "Personal health monitoring dashboard that connects with wearable devices and provides insights.",
    domain: "healthtrack.io",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    userCount: 123,
    revenue: 492.50,
    actions: [
      { id: "action-2-1", text: "Create fitness challenge marketing campaign", completed: true },
      { id: "action-2-2", text: "Partner with fitness influencers for app promotion", completed: true },
      { id: "action-2-3", text: "Launch Facebook ad campaign targeting health enthusiasts", completed: true },
      { id: "action-2-4", text: "Create content series on health benefits with app", completed: false },
      { id: "action-2-5", text: "Implement SEO strategy for health tracking keywords", completed: false }
    ]
  },
  {
    id: "sample-app-3",
    name: "ContentCanvas",
    description: "AI-powered content creation platform with templates, editing tools, and automated publishing.",
    domain: "contentcanvas.app",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    userCount: 345,
    revenue: 1520.00,
    actions: [
      { id: "action-3-1", text: "Launch beta program for content creators", completed: true },
      { id: "action-3-2", text: "Create YouTube tutorial series on content creation", completed: true },
      { id: "action-3-3", text: "Launch social media contest to increase brand visibility", completed: false },
      { id: "action-3-4", text: "Sponsor marketing podcast to reach target audience", completed: false },
      { id: "action-3-5", text: "Create affiliate program for marketing agencies", completed: false }
    ]
  },
  {
    id: "sample-app-4",
    name: "InvoiceGenius",
    description: "Automated invoicing system for freelancers and small businesses with payment tracking.",
    domain: "invoicegenius.com",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
    userCount: 185,
    revenue: 834.75,
    actions: [
      { id: "action-4-1", text: "Create case studies with successful freelancers", completed: true },
      { id: "action-4-2", text: "Launch Google Ads campaign targeting small businesses", completed: true },
      { id: "action-4-3", text: "Develop SEO-optimized landing pages for organic traffic growth", completed: true },
      { id: "action-4-4", text: "Partner with accounting software for integration promotion", completed: true },
      { id: "action-4-5", text: "Create educational webinar series for freelance finances", completed: false }
    ]
  }
];