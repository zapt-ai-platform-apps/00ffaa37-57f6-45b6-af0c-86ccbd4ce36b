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
    
    const { app, platform } = req.body;
    
    if (!app || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('Generating social content for app:', app.name);
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const platformGuidelines = {
      linkedin: "Professional, business-focused, highlight value proposition and benefits. Include a call for referrals.",
      twitter: "Concise, catchy, use hashtags, include link. Character limit of 280.",
      facebook: "Conversational, engaging for friends and network, personal touch. Ask for shares and comments.",
      whatsapp: "Direct and personal message for individual sharing, conversational. Keep it brief but compelling."
    };
    
    const prompt = `
      Create an engaging social media post for the platform ${platform} about this app:
      
      App Name: ${app.name}
      App Description: ${app.description || "An app that helps users track their progress"}
      User Count: ${app.userCount || 0}
      Revenue: $${app.revenue || 0}
      
      Guidelines for ${platform} platform: ${platformGuidelines[platform] || "Professional and engaging"}
      
      Make the post personal, authentic, and include:
      1. A clear statement of the problem the app solves
      2. Who would benefit most from the app
      3. A direct call to action asking readers to think of specific people who might need this
      4. Any success metrics to build credibility (if available)
      5. The app link: ${app.domain || 'https://zapt.ai'}
      
      The message should be engaging, specific to the platform's style, and persuasive.
      Only provide the message content without any explanations or formatting instructions.
    `;
    
    console.log('Sending prompt to AI for platform:', platform);
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    
    const generatedContent = response.content[0].text.trim();
    
    console.log('Social content generated successfully');
    return res.status(200).json({ content: generatedContent });
    
  } catch (error) {
    console.error('Error generating social content:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message || 'An error occurred while generating social content' });
  }
}