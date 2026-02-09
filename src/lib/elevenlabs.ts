
import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

export async function generateSpeech(text: string) {
    try {
        const audioStream = await elevenlabs.generate({
            voice: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
            text,
            model_id: "eleven_monolingual_v1"
        });

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const content = Buffer.concat(chunks);
        return content;
    } catch (error) {
        console.error("ElevenLabs Error:", error);
        throw new Error("Failed to generate speech");
    }
}
