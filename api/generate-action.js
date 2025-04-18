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
    
    const { appName, appDescription, userCount, revenue, actions, context } = req.body;
    
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
    
    // Add additional context if available
    let contextText = '';
    if (context && context.trim()) {
      contextText = `\nAdditional context about the app:\n${context}\n`;
    }
    
    // Include stats section explicitly to highlight them
    const statsSection = `\nApp Statistics:\n- User count: ${userCount || 0}\n- Revenue: $${revenue || 0}`;
    
    const prompt = `
      I have an app called "${appName}" with the following description: "${appDescription}".
      ${statsSection}
      ${actionsText}
      ${contextText}
      
      Based on this information and any actions already completed or in progress, please suggest THREE DISTINCT specific next actions I should take EXCLUSIVELY to gain traction for my app. Traction means directly growing my app's user base or revenue.
      
      Important traction strategy guidance to follow, ranked from most to least effective:
      
      1. Email people you already know (highest impact)
         - Use your existing network: friends, classmates, ex-colleagues — anyone who could benefit
         - Ensure they actually use the product and ideally pay if you're charging
         - Early customers should feel the value directly
      
      2. Targeted cold outreach
         - Do specific research to find the right people
         - Send personal, direct messages (not mass emails)
         - A good campaign typically converts 2-3% of contacts
      
      3. Social media and press
         - Requires consistency to be effective
         - One article or post won't carry you far
         - Follow Airbnb's example: create your own headlines/content regularly
      
      4. Paid ads (least effective for early traction)
         - No breakout startup got its first 100 users this way
         - Consider only after other channels are working
      
      Remember: The first 100 users don't come from scale. They come from direct effort, focus, and doing things that don't scale.
      
      Each action should be:
      - SOLELY focused on gaining traction (user acquisition, retention, or revenue)
      - Specific and actionable (something I can actually do)
      - Achievable within 1-2 days at most
      - Small in scope with clear completion criteria
      - Realistic for a small team or solo developer
      - Directly tied to measurable traction metrics (users or revenue)
      - Concise (under 30 words)
      
      DO NOT suggest actions related to:
      - Internal app improvements not directly tied to traction
      - General feature development not specifically for user acquisition
      - Team management or operational tasks
      - Long-term strategy without immediate traction impact
      
      Examples of good traction-focused actions:
      - "Create 3 social media posts showcasing your app's core features"
      - "Set up a Google Ads campaign targeting your app's primary audience"
      - "Add a referral system offering rewards for user invites"
      - "Email existing users about your premium features with a time-limited discount"
      - "Add prominent customer testimonials to your landing page"
      
      Format your answer as a JSON array with exactly 3 items, like this:
      ["Action 1", "Action 2", "Action 3"]
      
      Just provide the JSON array directly without any explanation or additional text.
    `;
    
    console.log('Sending prompt to AI with context:', context ? 'Yes' : 'No');
    
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