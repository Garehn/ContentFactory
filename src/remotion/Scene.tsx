
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img } from 'remotion';

export const Scene: React.FC<{
    text: string;
    visual_cue?: string;
    imageUrl?: string;
}> = ({ text, visual_cue, imageUrl }) => {
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
                backgroundColor: 'black', // Fallback background
            }}
        >
            {/* Background Image */}
            {imageUrl && (
                <>
                    <Img
                        src={imageUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    {/* Dark overlay for text readability */}
                    <AbsoluteFill
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    />
                </>
            )}

            {/* Text Content */}
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
                    zIndex: 10,
                    textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
                }}
            >
                {text}
            </h1>
            {visual_cue && (
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    fontSize: 20,
                    color: imageUrl ? '#ccc' : '#666',
                    fontStyle: 'italic',
                    zIndex: 10,
                }}>
                    [Visual: {visual_cue}]
                </div>
            )}
        </AbsoluteFill>
    );
};
