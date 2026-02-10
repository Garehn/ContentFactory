import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { topic, audience } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: ' is required' }, { status: 400 });
        }

        const defaultAudience = audience || "Curious generalists aged 18-35 who love science/philosophy content";

        console.log(`🎯 Testing Strategist with topic: "${topic}"`);

        const systemPrompt = `You are THE STRATEGIST — a master audience psychologist and creative director.

Your ONLY job: Create a Strategic Brief that gives the Investigator and Scribe everything they need to create a viral Kurzgesagt-style video.

MINDSET:
- Think like a Hollywood pitch meeting
- Ask: "What angle makes this UNMISSABLE?"
- Find the perspective shift that makes people say "No way!"

Do NOT write the script. Do NOT do research yet. ONLY create the strategic foundation.

Quality over speed. Use as many tokens as needed to get this right.`;

        const userPrompt = `Create a strategic brief for a Kurzgesagt-style video about: "${topic}"

Target Audience: ${defaultAudience}

Output a detailed strategic brief covering:
1. Audience Profile (who they are, what they believe, emotional needs)
2. Emotional Journey Map (wonder → tension → hope)
3. The Perspective Bomb moment (the mind-blowing reveal)
4. Success Criteria
5. Kurzgesagt Mechanisms to employ

Be specific and actionable. This brief will guide all subsequent agents.`;

        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 3000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const result = msg.content[0].type === 'text' ? msg.content[0].text : '';

        console.log(`✅ Strategist test successful: ${result.length} characters`);

        return NextResponse.json({
            success: true,
            agent: 'strategist',
            output: result,
            length: result.length
        });

    } catch (error: any) {
        console.error('❌ Strategist test failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
