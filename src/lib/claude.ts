
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateScript(topic: string) {
    const kurzgesagtSystemPrompt = `You are an expert scriptwriter specializing in the **Kurzgesagt – In a Nutshell** style for short-form vertical videos (60-120 seconds).

## CRITICAL RULES:
- Scripts MUST be 150-250 words maximum
- Use "We" perspective (never "You" or "I")
- Start with MAXIMUM INTENSITY (terrifying fact, massive number, or "What if?")
- Include Visual Analogy: Biology=War, Physics=Traffic, Society=Ant Colonies
- End with Optimistic Turn (hope after cosmic dread)
- Output ONLY valid JSON, no markdown tables in primary output

## PHILOSOPHY: Optimistic Nihilism
The universe is vast and indifferent, but that means we are free to create meaning.

## STRUCTURE (Strict):
1. **0:00-0:10 HOOK** (20-40 words): Terrifying fact or massive number. NO intro.
2. **0:10-0:50 SIMPLIFICATION** (60-100 words): Explain with vivid metaphor
3. **0:50-1:10 COSMIC_ZOOM** (30-50 words): Make viewer feel cosmically small
4. **1:10-1:30 HOPE** (40-60 words): Human agency and wonder

## VISUAL STYLE:
- Cute vector birds/blobs with neon outlines
- Juxtapose cute + deadly ("Smiling cell commits suicide")
- Flat design, bold colors (purple, cyan, orange)

## EXAMPLES:
"The immune system is not a shield; it is a police state. Billions of cells patrol your blood, checking IDs. If a virus shows the wrong ID, the heavy guard arrives. Neutrophils come—suicide bombers of your body. They vomit deadly chemicals, killing the virus, healthy cells, and themselves. It is a massacre happening inside you right now."

"If the universe is a book, humanity is the last letter on the last page. We are a thin film of mold on a rock hurtling through the void. But we are the only part that knows it exists. That is not small; that is everything."`;

    const userPrompt = `Create a viral short-form script about: "${topic}"

Output ONLY valid JSON with this EXACT structure:
{
  "title": "Short punchy title (under 6 words)",
  "scenes": [
    {
      "text": "Narration text (Kurzgesagt style)",
      "visual_cue": "Specific visual description (e.g. 'Cute neutrophil cell vomits neon acid')",
      "duration_estimate": 3.5
    }
  ]
}

Requirements:
- 4-6 scenes total
- Total word count: 150-250 words
- Follow Kurzgesagt structure (Hook → Simplification → Cosmic Zoom → Hope)
- Use "We" perspective
- Visual cues must describe vector art style`;

    // Try Claude API first, fallback to demo script if models are deprecated
    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 2000,
            temperature: 0.8,
            system: kurzgesagtSystemPrompt,
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": userPrompt
                        }
                    ]
                }
            ]
        });

        //Extract the text content from the response
        const contentBlock = msg.content[0];

        if (contentBlock.type === 'text') {
            try {
                // Try to extract JSON from markdown code blocks if present
                let jsonText = contentBlock.text;
                const jsonMatch = jsonText.match(/```json\n?([\s\S]*?)\n?```/) ||
                    jsonText.match(/```\n?([\s\S]*?)\n?```/);
                if (jsonMatch) {
                    jsonText = jsonMatch[1];
                }

                const parsed = JSON.parse(jsonText);

                // Validate the response has required fields
                if (!parsed.title || !parsed.scenes || !Array.isArray(parsed.scenes)) {
                    throw new Error("Invalid script structure");
                }

                console.log('✅ Claude generated Kurzgesagt-style script:', parsed.title);
                return parsed;
            } catch (e) {
                console.error("Failed to parse JSON from Claude:", contentBlock.text);
                throw new Error("Invalid JSON response from AI");
            }
        } else {
            throw new Error("Unexpected response format from Claude");
        }
    } catch (error) {
        console.warn("Claude API failed, using fallback Kurzgesagt-style demo script:", error);

        // Return a Kurzgesagt-style demo script
        return {
            title: `${topic.substring(0, 30)}`,
            scenes: [
                {
                    text: `Right now, something incredible is happening with ${topic}. And we are completely blind to it.`,
                    visual_cue: "Neon warning symbol pulses over cosmic void",
                    duration_estimate: 4.5
                },
                {
                    text: "We live in a universe that is vast and indifferent. But this makes it personal.",
                    visual_cue: "Cute vector bird floats in space, looking confused",
                    duration_estimate: 3.5
                },
                {
                    text: "Think of it like this: Imagine the entire timeline of existence as a highway. We are not even a car on it. We are a single photon in a headlight.",
                    visual_cue: "Highway stretches to infinity, tiny glowing particle appears",
                    duration_estimate: 5.0
                },
                {
                    text: "But here is the beautiful part: We are the only part of the universe that knows it exists. Dead matter evolved into something that can feel awe.",
                    visual_cue: "Blob of atoms transforms into smiling conscious being, stars reflect in its eyes",
                    duration_estimate: 5.5
                },
                {
                    text: "So while we are here, let's make it count. Because the universe won't do it for us.",
                    visual_cue: "Vector birds build colorful structure in the void, neon trails behind them",
                    duration_estimate: 4.0
                }
            ]
        };
    }
}
