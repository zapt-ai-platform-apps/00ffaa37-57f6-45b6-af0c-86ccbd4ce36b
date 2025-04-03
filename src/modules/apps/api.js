// Mock data for development
let mockedApps = [
  {
    id: '1',
    name: 'Productivity Tracker',
    description: 'A simple app to track your daily productivity and habits',
    userCount: 45,
    revenue: 120,
    createdAt: new Date().toISOString(),
    strategy: 'Focus on content marketing with weekly articles about productivity',
    actions: [
      { id: '1', text: 'Create 3 blog posts about productivity tips', completed: true },
      { id: '2', text: 'Share on 5 relevant Reddit communities', completed: true },
      { id: '3', text: 'Launch 2-week Product Hunt campaign', completed: false },
      { id: '4', text: 'Reach out to 10 productivity influencers', completed: false }
    ]
  },
  {
    id: '2',
    name: 'Finance Calculator',
    description: 'Calculate investments, loans, and savings with ease',
    userCount: 67,
    revenue: 230,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    strategy: 'Partner with financial bloggers to promote the app',
    actions: [
      { id: '1', text: 'Create demo videos for 5 main features', completed: true },
      { id: '2', text: 'Reach out to 15 financial bloggers', completed: true },
      { id: '3', text: 'Offer affiliate program to partners', completed: false },
      { id: '4', text: 'Create comparison landing page', completed: false }
    ]
  }
];

// In a real implementation, these would be API calls to a backend server
export const getApps = async () => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockedApps];
};

export const getAppById = async (id) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  const app = mockedApps.find(app => app.id === id);
  
  if (!app) {
    throw new Error('App not found');
  }
  
  return { ...app };
};

export const createApp = async (appData) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newApp = {
    id: Date.now().toString(),
    ...appData,
    createdAt: new Date().toISOString(),
    actions: []
  };
  
  mockedApps.push(newApp);
  return { ...newApp };
};

export const updateApp = async (id, appData) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const appIndex = mockedApps.findIndex(app => app.id === id);
  
  if (appIndex === -1) {
    throw new Error('App not found');
  }
  
  const updatedApp = {
    ...mockedApps[appIndex],
    ...appData,
    id // Ensure ID doesn't change
  };
  
  mockedApps[appIndex] = updatedApp;
  return { ...updatedApp };
};

export const deleteApp = async (id) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const appIndex = mockedApps.findIndex(app => app.id === id);
  
  if (appIndex === -1) {
    throw new Error('App not found');
  }
  
  mockedApps = mockedApps.filter(app => app.id !== id);
  return true;
};