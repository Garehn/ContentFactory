
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateScript(topic: string) {
    const prompt = `
    You are an expert video scriptwriter for short-form social media content (Instagram Reels / TikTok).
    Write a 30-60 second script about: "${topic}".
    
    Format the output strictly as a JSON object with this structure:
    {
      "title": "Short Catchy Title",
      "scenes": [
        {
          "text": "Spoken text for this segment",
          "visual_cue": "Description of visual (e.g., 'Neon text popping up')",
          "duration_estimate": 3.5
        }
      ]
    }
    Minimize narration to be punchy. Focus on high-retention hook at the start.
  `;

    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 0.7,
        system: "You are a creative director for a viral content agency. Output valid JSON only.",
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    });

    // Extract the text content from the response
    const contentBlock = msg.content[0];

    if (contentBlock.type === 'text') {
        try {
            return JSON.parse(contentBlock.text);
        } catch (e) {
            console.error("Failed to parse JSON from Claude:", contentBlock.text);
            throw new Error("Invalid JSON response from AI");
        }
    } else {
        throw new Error("Unexpected response format from Claude");
    }
}
