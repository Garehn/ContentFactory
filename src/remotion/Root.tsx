
import { Composition } from 'remotion';
import { MyVideo, myVideoSchema } from './Main';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MyExplainer"
                component={MyVideo}
                // NO HARDCODED DURATION - calculated from scene durations
                calculateMetadata={({ props }) => {
                    // Calculate total duration from all scenes
                    const totalFrames = props.scenes.reduce((total: number, scene: any) => {
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

                    return {
                        durationInFrames: totalFrames,
                        fps: 30,
                        width: 1920,
                        height: 1080
                    };
                }}
                fps={30}
                width={1920}
                height={1080}
                schema={myVideoSchema}
                defaultProps={{
                    title: "The Future of AI Content",
                    scenes: [
                        {
                            text: "Imagine an AI that creates videos for you.",
                            visual_cue: "Futuristic abstract background with digital particles",
                            duration_estimate: "4s",
                            visual_category: "hook"
                        },
                        {
                            text: "It writes the script, generates the visuals, and syncs everything perfectly.",
                            visual_cue: "Digital brain processing data with neon networks",
                            duration_estimate: "5s",
                            visual_category: "explanation"
                        }
                    ]
                }}
            />
        </>
    );
};
