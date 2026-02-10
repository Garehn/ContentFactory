
import { Series, Audio } from 'remotion';
import { Scene } from './Scene';
import { z } from 'zod';

export const myVideoSchema = z.object({
    title: z.string(),
    scenes: z.array(z.object({
        text: z.string(),
        visual_cue: z.string(),
        duration_estimate: z.union([z.number(), z.string()]), // Accept both string and number
    })),
    audioSrc: z.string().optional(),
    sceneImages: z.record(z.string()).optional(),
});

export type MyVideoProps = z.infer<typeof myVideoSchema>;

// Helper: Convert duration string/number to frames (30 fps)
function parseDurationToFrames(duration: string | number): number {
    // If already a number, assume it's seconds and convert to frames
    if (typeof duration === 'number') {
        return Math.floor(duration * 30);
    }

    // Parse string formats: "30s", "1:30", "90", etc.
    const str = duration.trim();

    // Format: "1:30" (minutes:seconds)
    if (str.includes(':')) {
        const [mins, secs] = str.split(':').map(Number);
        if (!isNaN(mins) && !isNaN(secs)) {
            return Math.floor((mins * 60 + secs) * 30);
        }
    }

    // Format: "30s" (seconds with 's' suffix)
    if (str.endsWith('s')) {
        const seconds = parseFloat(str.slice(0, -1));
        if (!isNaN(seconds)) {
            return Math.floor(seconds * 30);
        }
    }

    // Format: "90" (plain number as string)
    const seconds = parseFloat(str);
    if (!isNaN(seconds)) {
        return Math.floor(seconds * 30);
    }

    // Fallback: 3 seconds (90 frames) if parsing fails
    console.warn(`Failed to parse duration: "${duration}", using default 3s`);
    return 90;
}

export const MyVideo: React.FC<MyVideoProps> = ({ title, scenes, audioSrc, sceneImages = {} }) => {
    return (
        <>
            {audioSrc && <Audio src={audioSrc} />}
            <Series>
                {/* Title Scene */}
                <Series.Sequence durationInFrames={90}> {/* 3 seconds for title */}
                    <Scene text={title} visual_cue="Title Card" />
                </Series.Sequence>

                {scenes.map((scene, i) => {
                    const durationInFrames = parseDurationToFrames(scene.duration_estimate);
                    const imageUrl = sceneImages?.[i.toString()];
                    return (
                        <Series.Sequence key={i} durationInFrames={durationInFrames}>
                            <Scene
                                text={scene.text}
                                visual_cue={scene.visual_cue}
                                imageUrl={imageUrl}
                            />
                        </Series.Sequence>
                    );
                })}
            </Series>
        </>
    );
};
