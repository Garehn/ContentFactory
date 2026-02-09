import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
    try {
        const { visualCue, sceneText } = await req.json();

        if (!visualCue) {
            return NextResponse.json({ error: 'Visual cue is required' }, { status: 400 });
        }

        // Enhanced prompt for better b-roll style images
        const enhancedPrompt = `Professional high-quality b-roll footage style image: ${visualCue}. Cinematic, vibrant colors, 16:9 aspect ratio, sharp focus, modern aesthetic, suitable for social media video content.`;

        console.log('Generating image for:', enhancedPrompt);

        // Use Flux Schnell for fast generation
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: enhancedPrompt,
                    aspect_ratio: "16:9",
                    output_format: "png",
                    output_quality: 90
                }
            }
        );

        // The output is an array with the image URL
        const imageUrl = Array.isArray(output) ? output[0] : output;

        return NextResponse.json({
            success: true,
            imageUrl,
            visualCue
        });

    } catch (error) {
        console.error("Image Generation Error:", error);
        return NextResponse.json({
            error: 'Image generation failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
