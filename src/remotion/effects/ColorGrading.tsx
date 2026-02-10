import { AbsoluteFill } from 'remotion';

interface ColorGradingProps {
    preset?: 'kurzgesagt' | 'vibrant' | 'cinematic' | 'warm' | 'cool';
    children: React.ReactNode;
}

export const ColorGrading: React.FC<ColorGradingProps> = ({
    preset = 'kurzgesagt',
    children
}) => {
    const filters = {
        kurzgesagt: 'saturate(1.4) contrast(1.15) brightness(1.05) hue-rotate(-2deg)',
        vibrant: 'saturate(1.6) contrast(1.2) brightness(1.1)',
        cinematic: 'saturate(0.9) contrast(1.1) brightness(0.95) sepia(0.05)',
        warm: 'saturate(1.2) contrast(1.1) brightness(1.05) sepia(0.15)',
        cool: 'saturate(1.3) contrast(1.1) brightness(0.95) hue-rotate(10deg)'
    };

    return (
        <AbsoluteFill style={{ filter: filters[preset] }}>
            {children}
        </AbsoluteFill>
    );
};
