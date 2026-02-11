'use client';

import { Player } from '@remotion/player';
import { MyVideo } from '../remotion/Main';

// Helper to calculate total duration from script
function calculateDurationInFrames(scenes: any[]): number {
    return scenes.reduce((total, scene) => {
        const duration = scene.duration_estimate;
        let frames = 90; // default 3s

        if (typeof duration === 'number') {
            frames = Math.floor(duration * 30);
        } else if (typeof duration === 'string') {
            const str = duration.trim();
            if (str.includes(':')) {
                const [mins, secs] = str.split(':').map(Number);
                if (!isNaN(mins) && !isNaN(secs)) {
                    frames = Math.floor((mins * 60 + secs) * 30);
                }
            } else if (str.endsWith('s')) {
                const seconds = parseFloat(str.slice(0, -1));
                if (!isNaN(seconds)) {
                    frames = Math.floor(seconds * 30);
                }
            } else {
                const seconds = parseFloat(str);
                if (!isNaN(seconds)) {
                    frames = Math.floor(seconds * 30);
                }
            }
        }

        return total + frames;
    }, 0);
}

export default function VideoPlayer({
    script,
    audioUrl,
    sceneImages
}: {
    script: any;
    audioUrl?: string | null;
    sceneImages?: Record<number, string>;
}) {

    if (!script) return null;

    // Calculate actual duration from script scenes
    const totalDuration = calculateDurationInFrames(script.scenes || []);
    console.log(`📹 VideoPlayer: Calculated duration = ${totalDuration} frames (${Math.floor(totalDuration / 30)}s)`);

    return (
        <div className="aspect-video w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <Player
                component={MyVideo}
                durationInFrames={totalDuration} // ✅ DYNAMIC DURATION - no more 60s cap
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                controls
                autoPlay
                loop
                inputProps={{
                    title: script.title,
                    scenes: script.scenes,
                    audioSrc: audioUrl || undefined,
                    sceneImages: sceneImages || {}
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
