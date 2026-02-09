
import { NextResponse } from 'next/server';
import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const audioStream = await elevenlabs.generate({
            voice: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
            text,
            model_id: "eleven_monolingual_v1"
        });

        // Handle stream response from ElevenLabs SDK
        // The SDK returns a Node stream or proprietary stream object.
        // We need to convert it to a ReadableStream for Next.js Response if possible, or buffer it.
        // Buffering is safer for now.

        const chunks: Uint8Array[] = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("Voice Generation Error:", error);
        return NextResponse.json({ error: 'Voice generation failed' }, { status: 500 });
    }
}
