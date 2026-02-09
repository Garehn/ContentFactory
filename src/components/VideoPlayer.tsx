'use client';

import { Player } from '@remotion/player';
// Wait, Root exports RemotionRoot, not the composition config directly.
// We need to mirror the props here or import the component directly.

import { MyVideo } from '../remotion/Main';

export default function VideoPlayer({ script, audioUrl }: { script: any; audioUrl?: string | null }) {

    if (!script) return null;

    return (
        <div className="aspect-video w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <Player
                component={MyVideo}
                durationInFrames={30 * 60} // Default length
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                controls
                autoPlay
                loop
                inputProps={{
                    title: script.title,
                    scenes: script.scenes,
                    audioSrc: audioUrl || undefined
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}
