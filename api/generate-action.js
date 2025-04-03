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
    
    console.log('Generating actions for app:', appName);
    
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
      
      Based on this information and any actions already completed or in progress, please suggest THREE DISTINCT specific next actions I should take to grow my app's user base or revenue.
      
      Each action should be:
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
      
      Format your answer as a JSON array with exactly 3 items, like this:
      ["Action 1", "Action 2", "Action 3"]
      
      Just provide the JSON array directly without any explanation or additional text.
    `;
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    
    // Extract the JSON array from the response
    const actionsMatch = response.content[0].text.match(/\[.*\]/s);
    let generatedActions = [];
    
    if (actionsMatch) {
      try {
        generatedActions = JSON.parse(actionsMatch[0]);
      } catch (error) {
        console.error('Error parsing actions from AI response:', error);
        console.log('Raw AI response:', response.content[0].text);
        
        // Fallback to basic parsing if JSON.parse fails
        const text = response.content[0].text.trim();
        const lines = text.split('\n').filter(line => line.trim().startsWith('-'));
        generatedActions = lines.slice(0, 3).map(line => line.trim().replace(/^-\s*/, ''));
      }
    } else {
      // Fallback parsing for non-compliant format
      const text = response.content[0].text.trim();
      const lines = text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./));
      generatedActions = lines.slice(0, 3).map(line => line.trim().replace(/^-\s*/, '').replace(/^\d+\.\s*/, ''));
    }
    
    // Ensure we have exactly 3 actions
    while (generatedActions.length < 3) {
      generatedActions.push(`Action idea ${generatedActions.length + 1} (AI had trouble generating this one)`);
    }
    
    generatedActions = generatedActions.slice(0, 3); // Limit to exactly 3 actions
    
    console.log('Actions generated successfully:', generatedActions);
    return res.status(200).json({ actions: generatedActions });
    
  } catch (error) {
    console.error('Error generating actions:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message || 'An error occurred while generating actions' });
  }
}