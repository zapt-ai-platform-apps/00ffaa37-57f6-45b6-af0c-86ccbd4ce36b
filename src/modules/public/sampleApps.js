export const sampleApps = [
  {
    id: "sample-app-1",
    name: "TaskMaster Pro",
    description: "AI-powered task management application that helps teams organize and prioritize work.",
    domain: "taskmasterpro.app",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    userCount: 8720,
    revenue: 24590.75,
    actions: [
      { id: "action-1-1", text: "Implement email reminder system", completed: true },
      { id: "action-1-2", text: "Add team collaboration features", completed: true },
      { id: "action-1-3", text: "Create mobile app version", completed: false },
      { id: "action-1-4", text: "Integrate with popular calendar apps", completed: false }
    ]
  },
  {
    id: "sample-app-2",
    name: "HealthTrack",
    description: "Personal health monitoring dashboard that connects with wearable devices and provides insights.",
    domain: "healthtrack.io",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    userCount: 4350,
    revenue: 18750.50,
    actions: [
      { id: "action-2-1", text: "Add nutrition tracking features", completed: true },
      { id: "action-2-2", text: "Implement sleep quality analysis", completed: true },
      { id: "action-2-3", text: "Create data export functionality", completed: true },
      { id: "action-2-4", text: "Develop personalized recommendations", completed: false },
      { id: "action-2-5", text: "Integrate with additional fitness devices", completed: false }
    ]
  },
  {
    id: "sample-app-3",
    name: "CodeBuddy",
    description: "AI coding assistant that helps developers write better code faster with real-time suggestions.",
    domain: "codebuddy.dev",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    userCount: 12500,
    revenue: 56000.00,
    actions: [
      { id: "action-3-1", text: "Add support for additional programming languages", completed: true },
      { id: "action-3-2", text: "Improve code suggestion accuracy", completed: true },
      { id: "action-3-3", text: "Create VS Code plugin", completed: false },
      { id: "action-3-4", text: "Implement team collaboration features", completed: false },
      { id: "action-3-5", text: "Add security vulnerability scanning", completed: false }
    ]
  },
  {
    id: "sample-app-4",
    name: "InvoiceGenius",
    description: "Automated invoicing system for freelancers and small businesses with payment tracking.",
    domain: "invoicegenius.com",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
    userCount: 6200,
    revenue: 28310.25,
    actions: [
      { id: "action-4-1", text: "Add recurring invoice scheduling", completed: true },
      { id: "action-4-2", text: "Implement multi-currency support", completed: true },
      { id: "action-4-3", text: "Create financial reporting dashboard", completed: true },
      { id: "action-4-4", text: "Add time tracking integration", completed: true },
      { id: "action-4-5", text: "Develop client portal for invoice access", completed: false }
    ]
  }
];