import { authenticateUser } from './_apiUtils.js';
import * as Sentry from '@sentry/node';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  try {
    // Get user from authentication
    const user = await authenticateUser(req);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { appName, appDescription, userCount, revenue, actions } = req.body;
    
    if (!appName || !appDescription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('Generating next action for app:', appName);
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Format actions for the prompt if available
    let actionsText = '';
    if (actions && Array.isArray(actions) && actions.length > 0) {
      const completedActions = actions.filter(a => a.completed).map(a => a.text);
      const pendingActions = actions.filter(a => !a.completed).map(a => a.text);
      
      if (completedActions.length > 0) {
        actionsText += "\nCompleted actions:\n";
        completedActions.forEach((action, i) => {
          actionsText += `- ${action}\n`;
        });
      }
      
      if (pendingActions.length > 0) {
        actionsText += "\nPending actions:\n";
        pendingActions.forEach((action, i) => {
          actionsText += `- ${action}\n`;
        });
      }
    }
    
    const prompt = `
      I have an app called "${appName}" with the following description: "${appDescription}".
      Currently, it has ${userCount || 0} users and has generated $${revenue || 0} in revenue.
      ${actionsText}
      
      Based on this information and any actions already completed or in progress, please suggest a single, specific next action I should take to grow my app's user base or revenue.
      
      The action should be:
      - Specific and actionable (something I can actually do)
      - Achievable within 1-2 days at most
      - Small in scope with clear completion criteria
      - Realistic for a small team or solo developer
      - Likely to help drive measurable growth
      - Concise (under 30 words)
      
      Examples of good actions:
      - "Create 3 social media posts showcasing your app's core features"
      - "Reach out to 5 potential users for feedback via email"
      - "Add a prominent call-to-action button on your landing page"
      
      Give me just the action as a direct statement, without any introduction or explanation.
    `;
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    
    console.log('Next action generated successfully');
    return res.status(200).json({ action: response.content[0].text.trim() });
    
  } catch (error) {
    console.error('Error generating next action:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message || 'An error occurred while generating next action' });
  }
}