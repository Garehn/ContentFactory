import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Kurzgesagt color palette
const KURZGESAGT_COLORS = {
    deepSpaceBlue: '#0A1128',
    vibrantPurple: '#7209B7',
    electricCyan: '#4CC9F0',
    warmOrange: '#F77F00',
    softPink: '#EF476F',
    limeGreen: '#06FFA5',
    goldenYellow: '#FFD60A',
};

/**
 * Enhances a basic visual cue into a detailed Kurzgesagt-style prompt
 */
function enhancePromptForKurzgesagt(visualCue: string, sceneText: string): string {
    // Detect scene category based on keywords
    const isSpace = /space|star|planet|galaxy|universe|cosmic/i.test(visualCue + sceneText);
    const isBio = /cell|body|organ|bacteria|virus|blood|DNA|immune/i.test(visualCue + sceneText);
    const isTech = /computer|data|network|AI|code|digital|algorithm/i.test(visualCue + sceneText);
    const isScale = /size|large|small|comparison|scale|vast|tiny/i.test(visualCue + sceneText);

    let baseStyle = `flat vector illustration, Kurzgesagt - In a Nutshell animation style, 
geometric simplified shapes, vibrant color palette, cute aesthetic with serious subject matter, 
thick neon outlines, soft glow effects, 16:9 aspect ratio, no text, clean minimalist design`;

    let sceneSpecific = '';
    let background = '';
    let effects = '';

    if (isSpace) {
        background = `deep purple-to-blue space gradient background (${KURZGESAGT_COLORS.deepSpaceBlue} to ${KURZGESAGT_COLORS.vibrantPurple}), 
surrounded by 200-300 tiny glowing stars (yellow and cyan dots with soft glow)`;
        effects = `neon purple outline (3-5px thick) with cyan glow aura, volumetric light rays from corner`;
        sceneSpecific = `cute stylized characters with dot eyes and simple expressions`;
    } else if (isBio) {
        background = `soft gradient background (${KURZGESAGT_COLORS.softPink} to deep red or purple), 
medical/biological aesthetic`;
        effects = `neon white or cyan outlines, holographic glow effects, cross-section cutaway view`;
        sceneSpecific = `cute blob-shaped cells or organisms with facial expressions (dot eyes, curved mouth), 
rounded geometric shapes, simplified anatomy`;
    } else if (isTech) {
        background = `hexagonal grid pattern background (${KURZGESAGT_COLORS.deepSpaceBlue}), 
digital/tech aesthetic`;
        effects = `neon cyan (${KURZGESAGT_COLORS.electricCyan}) and lime green (${KURZGESAGT_COLORS.limeGreen}) glowing lines, 
holographic shimmer, particle trail effects`;
        sceneSpecific = `geometric network visualization, interconnected nodes, data streams`;
    } else if (isScale) {
        background = `simple gradient background, measurement/comparison aesthetic`;
        effects = `dotted reference lines, size comparison indicators, neon outlines`;
        sceneSpecific = `cute simplified objects at dramatically different scales`;
    } else {
        background = `vibrant gradient background using Kurzgesagt color palette`;
        effects = `neon outlines, soft glow aura around main elements`;
        sceneSpecific = `cute geometric characters with simple facial features`;
    }

    // Build the complete prompt
    const enhancedPrompt = `${visualCue}, ${sceneSpecific}, ${background}, ${effects}, ${baseStyle}`;

    return enhancedPrompt;
}

/**
 * Generates negative prompt to avoid unwanted styles
 */
function getNegativePrompt(): string {
    return `realistic, photorealistic, 3D render, detailed textures, complex shading, 
gradient mesh, realistic lighting, human proportions, anatomically correct, detailed faces, 
cluttered composition, multiple fonts, watermarks, text overlays, 
dull colors, muted palette, earth tones only, sketch style, hand-drawn, painterly, 
low quality, blurry, pixelated`;
}

export async function POST(req: Request) {
    try {
        const { visualCue, sceneText } = await req.json();

        if (!visualCue) {
            return NextResponse.json({ error: 'Visual cue is required' }, { status: 400 });
        }

        console.log('🎨 Original visual cue:', visualCue);
        console.log('📝 Scene context:', sceneText);

        // Enhance prompt for Kurzgesagt style
        const enhancedPrompt = enhancePromptForKurzgesagt(visualCue, sceneText || '');
        const negativePrompt = getNegativePrompt();

        console.log('✨ Enhanced prompt:', enhancedPrompt.substring(0, 200) + '...');

        // Use Flux Schnell for fast generation with Kurzgesagt style
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: enhancedPrompt,
                    // Note: Flux Schnell doesn't support negative prompts, but Flux Pro does
                    // If quality is paramount, switch to "black-forest-labs/flux-pro"
                    aspect_ratio: "16:9",
                    output_format: "png",
                    output_quality: 95,
                    num_outputs: 1
                }
            }
        );

        // The output is an array with the image URL
        const imageUrl = Array.isArray(output) ? output[0] : output;

        console.log('✅ Image generated successfully');

        return NextResponse.json({
            success: true,
            imageUrl,
            visualCue,
            enhancedPrompt: enhancedPrompt.substring(0, 300) // Return sample for debugging
        });

    } catch (error) {
        console.error("❌ Image Generation Error:", error);
        return NextResponse.json({
            error: 'Image generation failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
