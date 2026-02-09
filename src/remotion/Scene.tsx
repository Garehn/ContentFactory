
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const Scene: React.FC<{ text: string; visual_cue?: string }> = ({ text, visual_cue }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Simple scale-in animation
    const scale = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
        durationInFrames: 30,
    });

    // Calculate opacity based on frame
    const opacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black', // Default background
            }}
        >
            <h1
                style={{
                    color: 'white',
                    fontSize: 80,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transform: `scale(${scale})`,
                    opacity,
                    padding: 40,
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {text}
            </h1>
            {visual_cue && (
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    fontSize: 20,
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    [Visual: {visual_cue}]
                </div>
            )}
        </AbsoluteFill>
    );
};
