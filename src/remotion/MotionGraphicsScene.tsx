import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img } from 'remotion';
import { useKenBurns } from './effects/KenBurns';
import { ParticleSystem } from './effects/ParticleSystem';
import { ColorGrading } from './effects/ColorGrading';

interface MotionGraphicsSceneProps {
    text: string;
    visual_cue?: string;
    visual_category?: string;
    image_url?: string;
    durationInFrames: number;
}

export const MotionGraphicsScene: React.FC<MotionGraphicsSceneProps> = ({
    text,
    visual_cue,
    visual_category = 'default',
    image_url,
    durationInFrames
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Determine particle type and animation style based on content
    const getSceneType = (): 'space' | 'biology' | 'tech' | 'default' => {
        const content = (text + (visual_cue || '')).toLowerCase();
        if (/space|star|planet|galaxy|universe|cosmic|void|nebula|astronaut/.test(content)) return 'space';
        if (/cell|body|organ|bacteria|virus|blood|dna|immune|heart|brain|biology/.test(content)) return 'biology';
        if (/computer|data|network|ai|code|digital|algorithm|robot|chip|tech/.test(content)) return 'tech';
        return 'default';
    };

    const sceneType = getSceneType();

    // Ken Burns effect - direction varies by scene type
    const panDirection = (() => {
        switch (sceneType) {
            case 'space': return 'diagonal-tr'; // Drift through space
            case 'biology': return 'right'; // Explore organism
            case 'tech': return 'left'; // Scan data
            default: return 'right';
        }
    })();

    const kenBurns = useKenBurns({
        durationInFrames,
        zoomIntensity: durationInFrames < 150 ? 'medium' : 'subtle',
        panDirection
    });

    // Blur-to-focus reveal
    const blurAmount = interpolate(
        frame,
        [0, 20],
        [10, 0],
        { extrapolateRight: 'clamp' }
    );

    // Fade in
    const opacity = interpolate(
        frame,
        [0, 15],
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    // Vignette intensity
    const vignetteOpacity = interpolate(
        frame,
        [0, 30],
        [0, 0.4],
        { extrapolateRight: 'clamp' }
    );

    // Scene-specific overlay effects
    const renderSceneOverlay = () => {
        switch (sceneType) {
            case 'space':
                // Glowing nebula overlay
                return (
                    <AbsoluteFill
                        style={{
                            background: 'radial-gradient(circle at 30% 40%, rgba(114, 9, 183, 0.3) 0%, transparent 50%)',
                            mixBlendMode: 'screen',
                            opacity: interpolate(frame, [0, 60], [0, 0.6], { extrapolateRight: 'clamp' })
                        }}
                    />
                );

            case 'biology':
                // Organic pulse effect
                const pulseScale = 1 + Math.sin(frame / 20) * 0.02;
                return (
                    <AbsoluteFill
                        style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(239, 71, 111, 0.2) 0%, transparent 60%)',
                            transform: `scale(${pulseScale})`,
                            mixBlendMode: 'multiply'
                        }}
                    />
                );

            case 'tech':
                // Grid lines
                return (
                    <AbsoluteFill
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(76, 201, 240, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(76, 201, 240, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px',
                            opacity: 0.3
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <ColorGrading preset="kurzgesagt">
            <AbsoluteFill
                style={{
                    backgroundColor: '#0A1128', // Fallback dark blue background
                    opacity
                }}
            >
                {/* Main B-roll Image with Ken Burns */}
                {image_url ? (
                    <AbsoluteFill
                        style={{
                            filter: `blur(${blurAmount}px)`,
                        }}
                    >
                        <Img
                            src={image_url}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: kenBurns.transform,
                                transformOrigin: 'center center'
                            }}
                        />
                    </AbsoluteFill>
                ) : (
                    // Fallback gradient if no image
                    <AbsoluteFill
                        style={{
                            background: 'linear-gradient(135deg, #7209B7 0%, #0A1128 100%)'
                        }}
                    />
                )}

                {/* Scene-specific overlay effects */}
                {renderSceneOverlay()}

                {/* Particle System */}
                <ParticleSystem
                    type={sceneType}
                    density={sceneType === 'space' ? 150 : sceneType === 'tech' ? 80 : 60}
                />

                {/* Vignette Effect */}
                <AbsoluteFill
                    style={{
                        background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
                        opacity: vignetteOpacity,
                        pointerEvents: 'none'
                    }}
                />

                {/* Light rays for dramatic effect (space/dramatic scenes) */}
                {sceneType === 'space' && (
                    <AbsoluteFill
                        style={{
                            background: `
                                linear-gradient(
                                    ${interpolate(frame, [0, durationInFrames], [45, 65], { extrapolateRight: 'clamp' })}deg,
                                    transparent 0%,
                                    rgba(255, 214, 10, 0.15) 50%,
                                    transparent 100%
                                )
                            `,
                            mixBlendMode: 'screen',
                            opacity: Math.sin(frame / 40) * 0.3 + 0.3
                        }}
                    />
                )}
            </AbsoluteFill>
        </ColorGrading>
    );
};
