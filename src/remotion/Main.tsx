
import { Series, Audio } from 'remotion';
import { Scene } from './Scene';
import { z } from 'zod';

export const myVideoSchema = z.object({
    title: z.string(),
    scenes: z.array(z.object({
        text: z.string(),
        visual_cue: z.string(),
        duration_estimate: z.number(),
    })),
    audioSrc: z.string().optional(),
    sceneImages: z.record(z.string()).optional(),
});

export type MyVideoProps = z.infer<typeof myVideoSchema>;

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
                    const durationInFrames = Math.floor(scene.duration_estimate * 30);
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
