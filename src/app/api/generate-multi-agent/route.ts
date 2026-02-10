import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Types for our multi-agent system
interface StrategicBrief {
    audienceProfile: string;
    emotionalJourney: string;
    perspectiveBomb: string;
    successCriteria: string[];
    kurzgesagtMechanisms: string[];
}

interface ResearchDossier {
    counterintuitiveFacts: Array<{ fact: string; source: string; visualPotential: string }>;
    timeline: string;
    futureImplications: string;
    hopeAngle: string;
    metaphors: Array<{ metaphor: string; visual: string }>;
}

interface Script {
    title: string;
    scenes: Array<{
        text: string;
        visual_cue: string;
        duration_estimate: number;
    }>;
    wordCount: number;
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
    stage: 'strategist' | 'investigator' | 'scribe' | 'refiner' | 'complete';
    percentage: number;
    currentAgent: string;
    output?: any;
}

export async function POST(req: Request) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const { topic, audience } = await req.json();

                if (!topic) {
                    controller.close();
                    return;
                }

                const defaultAudience = audience || "Curious generalists aged 18-35 who love science/philosophy content";

                // Helper to send progress updates
                const sendProgress = (stage: GenerationProgress['stage'], percentage: number, currentAgent: string, output?: any) => {
                    const progress: GenerationProgress = { stage, percentage, currentAgent, output };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(progress)}\n\n`));
                };

                // AGENT 1: THE STRATEGIST
                sendProgress('strategist', 10, 'Agent 1: Strategist analyzing audience and crafting angle...');

                const strategicBrief = await runStrategist(topic, defaultAudience);
                sendProgress('strategist', 25, 'Agent 1: Strategic Brief complete', { brief: strategicBrief });

                // AGENT 2: THE INVESTIGATOR
                sendProgress('investigator', 30, 'Agent 2: Investigator gathering counterintuitive facts...');

                const researchDossier = await runInvestigator(topic, strategicBrief);
                sendProgress('investigator', 50, 'Agent 2: Research Dossier complete', { dossier: researchDossier });

                // AGENT 3: THE SCRIBE (Initial Draft)
                sendProgress('scribe', 55, 'Agent 3: Scribe writing initial draft...');

                let script = await runScribe(topic, strategicBrief, researchDossier);
                sendProgress('scribe', 70, 'Agent 3: Draft script complete', { script });

                // AGENT 4: THE REFINER (Revision Loop)
                let revisionCount = 0;
                let assessment: QualityAssessment;

                do {
                    sendProgress('refiner', 75 + (revisionCount * 10), `Agent 4: Refiner evaluating (Round ${revisionCount + 1})...`);

                    assessment = await runRefiner(strategicBrief, researchDossier, script);
                    sendProgress('refiner', 80 + (revisionCount * 10), `Agent 4: Assessment complete`, { assessment });

                    if (assessment.decision === 'REVISE' && revisionCount < 2) {
                        sendProgress('scribe', 85 + (revisionCount * 5), `Agent 3: Revising script (Round ${revisionCount + 1})...`);
                        script = await runScribe(topic, strategicBrief, researchDossier, assessment.revisionRequests);
                        revisionCount++;
                    } else {
                        break;
                    }
                } while (assessment.decision === 'REVISE' && revisionCount < 2);

                // Final output
                sendProgress('complete', 100, 'Production ready!', {
                    script,
                    assessment,
                    strategicBrief,
                    researchDossier,
                    revisionCount
                });

                controller.close();

            } catch (error) {
                console.error('Multi-agent orchestration error:', error);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Generation failed' })}\n\n`));
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

    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 3000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
    });

    return msg.content[0].type === 'text' ? msg.content[0].text : '';
}

// AGENT 2: INVESTIGATOR
async function runInvestigator(topic: string, strategicBrief: string): Promise<string> {
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

    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 3000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
    });

    return msg.content[0].type === 'text' ? msg.content[0].text : '';
}

// AGENT 3: SCRIBE
async function runScribe(
    topic: string,
    strategicBrief: string,
    researchDossier: string,
    revisionRequests?: string[]
): Promise<Script> {
    const systemPrompt = `You are THE SCRIBE — a master storyteller who writes in the Kurzgesagt voice.

Your ONLY job: Write a 250-300 word script following the 3-Act structure.

MINDSET:
- Every word must earn its place
- Read it aloud — does it flow?
- Think: "Would I watch this?"

Follow the Kurzgesagt voice rules EXACTLY:
- Collective "we/us" (never "you")
- Short punchy sentences
- No jargon without translation
- Optimistic framing

Quality over speed. Use as many tokens as needed to get this right.`;

    let userPrompt = `Write a 250-300 word Kurzgesagt-style script about: "${topic}"

STRATEGIC BRIEF:
${strategicBrief}

RESEARCH DOSSIER:
${researchDossier}

${revisionRequests ? `\nREVISION REQUESTS FROM REFINER:\n${revisionRequests.join('\n')}` : ''}

Output ONLY valid JSON with this structure:
{
  "title": "Short punchy title (under 6 words)",
  "scenes": [
    {
      "text": "Scene narration",
      "visual_cue": "Detailed visual description for animators",
      "duration_estimate": 4.5
    }
  ],
  "wordCount": 280
}

Structure:
- ACT 1 (0:00-0:20): Hook with counterintuitive fact
- ACT 2 (0:20-1:30): Journey with metaphors, perspective bomb
- ACT 3 (1:30-2:00): Resolution with hope/agency

Use "we" voice. Include clear [VISUAL] cues in scenes.`;

    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 3000,
        temperature: 0.8,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
    });

    const responseText = msg.content[0].type === 'text' ? msg.content[0].text : '';

    // Extract JSON
    let jsonText = responseText;
    const jsonMatch = jsonText.match(/```json\n?([\s\S]*?)\n?```/) ||
        jsonText.match(/```\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
        jsonText = jsonMatch[1];
    }

    return JSON.parse(jsonText);
}

// AGENT 4: REFINER
async function runRefiner(
    strategicBrief: string,
    researchDossier: string,
    script: Script
): Promise<QualityAssessment> {
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

    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 2000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
    });

    const responseText = msg.content[0].type === 'text' ? msg.content[0].text : '';

    // Extract JSON
    let jsonText = responseText;
    const jsonMatch = jsonText.match(/```json\n?([\s\S]*?)\n?```/) ||
        jsonText.match(/```\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
        jsonText = jsonMatch[1];
    }

    return JSON.parse(jsonText);
}
