import { useCurrentFrame, interpolate } from 'remotion';

interface KenBurnsProps {
    durationInFrames: number;
    zoomIntensity?: 'subtle' | 'medium' | 'strong';
    panDirection?: 'left' | 'right' | 'up' | 'down' | 'diagonal-tl' | 'diagonal-tr';
}

export const useKenBurns = ({
    durationInFrames,
    zoomIntensity = 'medium',
    panDirection = 'right'
}: KenBurnsProps) => {
    const frame = useCurrentFrame();

    // Variable zoom based on scene duration
    const isShortScene = durationInFrames < 150; // < 5 seconds
    const zoomRanges = {
        subtle: [1.0, 1.05],
        medium: isShortScene ? [1.0, 1.15] : [1.0, 1.08],
        strong: isShortScene ? [1.0, 1.25] : [1.0, 1.12]
    };

    const scale = interpolate(
        frame,
        [0, durationInFrames],
        zoomRanges[zoomIntensity],
        { extrapolateRight: 'clamp' }
    );

    // Pan distance based on scene duration
    const panDistance = isShortScene ? 40 : 20;

    // Calculate pan based on direction
    const panX = (() => {
        switch (panDirection) {
            case 'left': return interpolate(frame, [0, durationInFrames], [0, panDistance], { extrapolateRight: 'clamp' });
            case 'right': return interpolate(frame, [0, durationInFrames], [0, -panDistance], { extrapolateRight: 'clamp' });
            case 'diagonal-tl': return interpolate(frame, [0, durationInFrames], [0, panDistance / 2], { extrapolateRight: 'clamp' });
            case 'diagonal-tr': return interpolate(frame, [0, durationInFrames], [0, -panDistance / 2], { extrapolateRight: 'clamp' });
            default: return 0;
        }
    })();

    const panY = (() => {
        switch (panDirection) {
            case 'up': return interpolate(frame, [0, durationInFrames], [0, panDistance], { extrapolateRight: 'clamp' });
            case 'down': return interpolate(frame, [0, durationInFrames], [0, -panDistance], { extrapolateRight: 'clamp' });
            case 'diagonal-tl': return interpolate(frame, [0, durationInFrames], [0, panDistance / 2], { extrapolateRight: 'clamp' });
            case 'diagonal-tr': return interpolate(frame, [0, durationInFrames], [0, panDistance / 2], { extrapolateRight: 'clamp' });
            default: return 0;
        }
    })();

    // Slight rotation for dynamic feel (only on longer scenes)
    const rotation = interpolate(
        frame,
        [0, durationInFrames],
        [0, isShortScene ? 0 : 0.5],
        { extrapolateRight: 'clamp' }
    );

    return {
        transform: `scale(${scale}) translate(${panX}px, ${panY}px) rotate(${rotation}deg)`,
        scale,
        panX,
        panY,
        rotation
    };
};
