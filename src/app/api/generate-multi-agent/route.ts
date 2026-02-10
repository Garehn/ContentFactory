import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Types for our multi-agent system
interface Script {
    title: string;
    scenes: Array<{
        text: string;
        visual_cue: string;
        duration_estimate: number;
    }>;
    wordCount?: number;
}

interface QualityAssessment {
    scores: {
        hookStrength: number;
        emotionalArc: number;
        pacing: number;
        kurzgesagtMechanisms: number;
        clarity: number;
        viralPotential: number;
    };
    overallScore: number;
    decision: 'APPROVED' | 'REVISE' | 'ESCALATE';
    revisionRequests?: string[];
}

interface GenerationProgress {
    stage: 'strategist' | 'investigator' | 'scribe' | 'refiner' | 'complete' | 'error';
    percentage: number;
    currentAgent: string;
    output?: any;
    error?: string;
}

export async function POST(req: NextRequest) {
    console.log('🚀 Multi-agent generation started');

    // Parse request body BEFORE creating the stream
    let topic: string;
    let audience: string;
    let cta: string;

    try {
        const body = await req.json();
        topic = body.topic;
        audience = body.audience;
        cta = body.cta;

        if (!topic) {
            console.error('❌ No topic provided');
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        console.log(`📝 Topic: "${topic}"`);
        console.log(`👥 Audience: "${audience || 'default'}"`);
        console.log(`🎯 CTA: "${cta || 'none'}"`);

    } catch (error) {
        console.error('❌ Failed to parse request body:', error);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const defaultAudience = audience || "Curious generalists aged 18-35 who love science/philosophy content";
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // Helper to send progress updates
            const sendProgress = (stage: GenerationProgress['stage'], percentage: number, currentAgent: string, output?: any, error?: string) => {
                const progress: GenerationProgress = { stage, percentage, currentAgent, output, error };
                const message = `data: ${JSON.stringify(progress)}\n\n`;
                console.log(`📊 Progress: ${percentage}% - ${currentAgent}`);
                controller.enqueue(encoder.encode(message));
            };

            try {
                // AGENT 1: THE STRATEGIST
                console.log('🎯 Starting Agent 1: Strategist');
                sendProgress('strategist', 10, 'Agent 1: Strategist analyzing audience and crafting angle...');

                const strategicBrief = await runStrategist(topic, defaultAudience);
                console.log(`✅ Strategist complete (${strategicBrief.length} chars)`);
                sendProgress('strategist', 25, 'Agent 1: Strategic Brief complete', { brief: strategicBrief });

                // AGENT 2: THE INVESTIGATOR
                console.log('🔍 Starting Agent 2: Investigator');
                sendProgress('investigator', 30, 'Agent 2: Investigator gathering counterintuitive facts...');

                const researchDossier = await runInvestigator(topic, strategicBrief);
                console.log(`✅ Investigator complete (${researchDossier.length} chars)`);
                sendProgress('investigator', 50, 'Agent 2: Research Dossier complete', { dossier: researchDossier });

                // AGENT 3: THE SCRIBE (Initial Draft)
                console.log(' Starting Agent 3: Scribe');
                sendProgress('scribe', 55, 'Agent 3: Scribe writing initial draft...');

                let script = await runScribe(topic, strategicBrief, researchDossier, cta);
                console.log(`✅ Scribe complete: "${script.title}" with ${script.scenes.length} scenes`);
                sendProgress('scribe', 70, 'Agent 3: Draft script complete', { script });

                // AGENT 4: THE REFINER (Revision Loop)
                console.log('🔬 Starting Agent 4: Refiner');
                let revisionCount = 0;
                let assessment: QualityAssessment;

                do {
                    console.log(`🔬 Refiner evaluation round ${revisionCount + 1}`);
                    sendProgress('refiner', 75 + (revisionCount * 10), `Agent 4: Refiner evaluating (Round ${revisionCount + 1})...`);

                    assessment = await runRefiner(strategicBrief, researchDossier, script);
                    console.log(`📊 Assessment: ${assessment.decision} (${assessment.overallScore}/60)`);
                    sendProgress('refiner', 80 + (revisionCount * 10), `Agent 4: Assessment complete`, { assessment });

                    if (assessment.decision === 'REVISE' && revisionCount < 2) {
                        console.log(`🔄 Revision required. Sending back to Scribe...`);
                        sendProgress('scribe', 85 + (revisionCount * 5), `Agent 3: Revising script (Round ${revisionCount + 1})...`);
                        script = await runScribe(topic, strategicBrief, researchDossier, cta, assessment.revisionRequests);
                        console.log(`✅ Revision ${revisionCount + 1} complete`);
                        revisionCount++;
                    } else {
                        break;
                    }
                } while (assessment.decision === 'REVISE' && revisionCount < 2);

                // Final output
                console.log(`🎉 Generation complete! Decision: ${assessment.decision}`);
                sendProgress('complete', 100, 'Production ready!', {
                    script,
                    assessment,
                    strategicBrief,
                    researchDossier,
                    revisionCount
                });

                controller.close();

            } catch (error: any) {
                console.error('❌ Multi-agent orchestration error:', error);
                console.error('Error stack:', error.stack);

                sendProgress('error', 0, 'Generation failed', undefined, error.message || 'Unknown error');
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

// AGENT 1: STRATEGIST
async function runStrategist(topic: string, audience: string): Promise<string> {
    console.log('🎯 Strategist: Calling Claude API...');

    const systemPrompt = `You are THE STRATEGIST — a master audience psychologist and creative director.

Your ONLY job: Create a Strategic Brief that gives the Investigator and Scribe everything they need to create a viral Kurzgesagt-style video.

MINDSET:
- Think like a Hollywood pitch meeting
- Ask: "What angle makes this UNMISSABLE?"
- Find the perspective shift that makes people say "No way!"

Do NOT write the script. Do NOT do research yet. ONLY create the strategic foundation.

Quality over speed. Use as many tokens as needed to get this right.`;

    const userPrompt = `Create a strategic brief for a Kurzgesagt-style video about: "${topic}"

Target Audience: ${audience}

Output a detailed strategic brief covering:
1. Audience Profile (who they are, what they believe, emotional needs)
2. Emotional Journey Map (wonder → tension → hope)
3. The Perspective Bomb moment (the mind-blowing reveal)
4. Success Criteria
5. Kurzgesagt Mechanisms to employ

Be specific and actionable. This brief will guide all subsequent agents.`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 3000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const result = msg.content[0].type === 'text' ? msg.content[0].text : '';
        console.log(`✅ Strategist: Received ${result.length} characters`);
        return result;
    } catch (error: any) {
        console.error('❌ Strategist failed:', error.message);
        throw error;
    }
}

// AGENT 2: INVESTIGATOR
async function runInvestigator(topic: string, strategicBrief: string): Promise<string> {
    console.log('🔍 Investigator: Calling Claude API...');

    const systemPrompt = `You are THE INVESTIGATOR — a research ninja who finds facts that blow minds.

Your ONLY job: Build a Research Dossier with counterintuitive facts, metaphors, and the hope angle.

MINDSET:
- Find facts that make people pause and re-read
- Build metaphors that animators will LOVE
- Always end with hope (Kurzgesagt never does pure doom)

Do NOT write the script yet. ONLY gather evidence.

Quality over speed. Use as many tokens as needed to get this right.`;

    const userPrompt = `Based on this Strategic Brief, gather research for: "${topic}"

STRATEGIC BRIEF:
${strategicBrief}

Output a research dossier with:
1. 3-5 Counterintuitive Facts (with surprise factor & visual potential)
2. Timeline & Historical Context
3. Future Implications (near-term, mid-term, long-term)
4. The Hope Angle (solutions, progress, human agency)
5. Visual Metaphor Bank (2-3 animation-ready comparisons)

Be specific with visual descriptions. Think: "What would look amazing animated?"`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 3000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const result = msg.content[0].type === 'text' ? msg.content[0].text : '';
        console.log(`✅ Investigator: Received ${result.length} characters`);
        return result;
    } catch (error: any) {
        console.error('❌ Investigator failed:', error.message);
        throw error;
    }
}

// AGENT 3: SCRIBE
async function runScribe(
    topic: string,
    strategicBrief: string,
    researchDossier: string,
    cta?: string,
    revisionRequests?: string[]
): Promise<Script> {
    console.log('✍️ Scribe: Calling Claude API...');

    const systemPrompt = `You are THE SCRIBE — a master storyteller who writes in the Kurzgesagt voice.

Your job: Write a FULL-LENGTH educational video script (8-15 minutes, approximately 1,500-3,000 words).

MINDSET:
- Take the time to fully explore the topic - this is NOT a short video
- Every word must earn its place
- Read it aloud — does it flow?
- Think: "Would I watch this?"

Follow the Kurzgesagt voice rules EXACTLY:
- Collective "we/us" (never "you")
- Short punchy sentences
- No jargon without translation
- Optimistic framing
- Seamless CTA integration (if provided)

Quality over speed. Use as many tokens as needed to get this right.`;

    const ctaGuidance = cta ? `

CALL-TO-ACTION INTEGRATION (MANDATORY):
The video must end with a natural transition to: "${cta}"

The CTA must:
1. Feel like a natural extension of the video's theme
2. NOT sound like an advertisement
3. Use "we" language to stay collaborative
4. Connect to the journey we just took
5. Be the logical next step for the viewer

Example CTA transitions:
- "Understanding [topic] is just the beginning. If you want to actually master these concepts through interactive problem-solving, check out [CTA]..."
- "The science of [topic] evolves every day. To stay informed as we figure this out together, [CTA]..."
- "Videos like this take weeks to create. If you want to help us keep exploring the nature of reality, [CTA]..."

The CTA should be in the final 30-45 seconds of the video.` : '';

    let userPrompt = `Write a FULL-LENGTH (8-15 minute) Kurzgesagt-style script about: "${topic}"

STRATEGIC BRIEF:
${strategicBrief}

RESEARCH DOSSIER:
${researchDossier}
${ctaGuidance}
${revisionRequests ? `\n\nREVISION REQUESTS FROM REFINER:\n${revisionRequests.join('\n')}` : ''}

Output ONLY valid JSON with this structure:
{
  "title": "Punchy title (3-8 words)",
  "total_duration_estimate": "11:30",
  "scenes": [
    {
      "text": "Scene narration",
      "visual_cue": "Detailed Kurzgesagt-style visual (include colors, characters, particle effects)",
      "duration_estimate": "30s",
      "visual_category": "hook"
    }
  ],
  "wordCount": 2250
}

Structure (8-12 minute video):
- ACT 1 (0:00-2:00): Hook + Setup (~500 words, 4-5 scenes)
- ACT 2 (2:00-10:00): Deep Dive (~1500 words, 12-15 scenes)
- ACT 3 (10:00-11:30): Cosmic Zoom-Out (~300 words, 2-3 scenes)
- ACT 4 (11:30-13:00): Optimistic Turn + CTA (~400 words, 3-4 scenes)

Total: 20-25 scenes, 1,500-3,000 words

Visual categories: hook, explanation, scale, juxtaposition, transition, cta

Use "we" voice. Include DETAILED visual cues (hex colors, particle effects, character actions).`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4096, // Haiku's max limit
            temperature: 0.8,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const responseText = msg.content[0].type === 'text' ? msg.content[0].text : '';
        console.log(`✅ Scribe: Received ${responseText.length} characters`);

        // Extract JSON
        let jsonText = responseText;
        const jsonMatch = jsonText.match(/```json\n?([\s\S]*?)\n?```/) ||
            jsonText.match(/```\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }

        const parsed = JSON.parse(jsonText);
        console.log(`✅ Scribe: Parsed script with ${parsed.scenes?.length || 0} scenes`);
        return parsed;
    } catch (error: any) {
        console.error('❌ Scribe failed:', error.message);
        throw error;
    }
}

// AGENT 4: REFINER
async function runRefiner(
    strategicBrief: string,
    researchDossier: string,
    script: Script
): Promise<QualityAssessment> {
    console.log('🔬 Refiner: Calling Claude API...');

    const systemPrompt = `You are THE REFINER — a ruthless quality assurance specialist.

Your ONLY job: Score the script and provide specific revision requests if needed.

MINDSET:
- Be brutally honest
- Every metric must be ≥8 or request revisions
- Give SPECIFIC, actionable feedback (not vague criticism)

SCORING RULES:
- 10/10 = Exceptional, ready for prime time
- 8-9/10 = Good, minor polish only
- 6-7/10 = Needs revision
- <6/10 = Major issues

Quality over speed. Use as many tokens as needed to get this right.`;

    const userPrompt = `Evaluate this script and provide quality scores.

STRATEGIC BRIEF:
${strategicBrief}

RESEARCH DOSSIER:
${researchDossier}

SCRIPT TO EVALUATE:
${JSON.stringify(script, null, 2)}

Output ONLY valid JSON with this structure:
{
  "scores": {
    "hookStrength": 8,
    "emotionalArc": 9,
    "pacing": 8,
    "kurzgesagtMechanisms": 9,
    "clarity": 8,
    "viralPotential": 8
  },
  "overallScore": 50,
  "decision": "APPROVED",
  "revisionRequests": ["Specific fix 1", "Specific fix 2"]
}

Score each metric 1-10. If ANY score < 8, set decision to "REVISE" and provide SPECIFIC revision requests.
If all scores ≥ 8, set decision to "APPROVED".`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 2000,
            temperature: 0.3,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const responseText = msg.content[0].type === 'text' ? msg.content[0].text : '';
        console.log(`✅ Refiner: Received ${responseText.length} characters`);

        // Extract JSON
        let jsonText = responseText;
        const jsonMatch = jsonText.match(/```json\n?([\s\S]*?)\n?```/) ||
            jsonText.match(/```\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }

        const parsed = JSON.parse(jsonText);
        console.log(`✅ Refiner: Decision = ${parsed.decision}, Score = ${parsed.overallScore}/60`);
        return parsed;
    } catch (error: any) {
        console.error('❌ Refiner failed:', error.message);
        throw error;
    }
}
