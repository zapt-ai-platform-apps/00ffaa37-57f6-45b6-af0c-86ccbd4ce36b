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
    
    console.log('Generating strategy for app:', appName);
    
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
      
      Please provide a single, highly focused and actionable traction strategy for the next 7 days.
      The strategy should be specific, measurable, and achievable within one week.
      Keep your response under 200 words and focus on practical steps that will help grow users or revenue.
      Don't include any introductory or concluding phrases - just provide the strategy directly.
    `;
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    
    console.log('Strategy generated successfully');
    return res.status(200).json({ strategy: response.content[0].text });
    
  } catch (error) {
    console.error('Error generating strategy:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message || 'An error occurred while generating strategy' });
  }
}