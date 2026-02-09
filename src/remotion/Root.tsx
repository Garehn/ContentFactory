
import { Composition } from 'remotion';
import { MyVideo, myVideoSchema } from './Main';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MyExplainer"
                component={MyVideo}
                durationInFrames={30 * 60} // Default 60 seconds
                fps={30}
                width={1080}
                height={1920}
                schema={myVideoSchema}
                defaultProps={{
                    title: "The Future of AI Content",
                    scenes: [
                        {
                            text: "Imagine an AI that creates videos for you.",
                            visual_cue: "Futuristic text animation",
                            duration_estimate: 4
                        },
                        {
                            text: "It writes the script, generates the voice, and edits the clips.",
                            visual_cue: "Digital brain processing",
                            duration_estimate: 5
                        }
                    ]
                }}
            />
        </>
    );
};
