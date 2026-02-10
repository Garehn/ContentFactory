import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
}

interface ParticleSystemProps {
    type: 'space' | 'biology' | 'tech' | 'default';
    density?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
    type,
    density = 100
}) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Generate particles with consistent seed
    const particles: Particle[] = Array.from({ length: density }, (_, i) => {
        const seed = i * 12345; // Consistent seed per particle
        const random = (offset: number) => {
            const x = Math.sin(seed + offset) * 10000;
            return x - Math.floor(x);
        };

        return {
            x: random(0) * width,
            y: random(1) * height,
            size: type === 'space' ? random(2) * 3 + 1 : random(2) * 5 + 2,
            speed: random(3) * 0.5 + 0.2,
            opacity: random(4) * 0.5 + 0.3
        };
    });

    const renderParticle = (particle: Particle, index: number) => {
        // Animate particle movement
        const yOffset = interpolate(
            frame,
            [0, 300],
            [0, particle.speed * 100],
            { extrapolateRight: 'extend' }
        );

        const y = (particle.y + yOffset) % height;

        const style: React.CSSProperties = {
            position: 'absolute',
            left: particle.x,
            top: y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            pointerEvents: 'none'
        };

        // Different particle styles per type
        switch (type) {
            case 'space':
                // Stars - glowing dots
                return (
                    <div
                        key={index}
                        style={{
                            ...style,
                            borderRadius: '50%',
                            backgroundColor: index % 3 === 0 ? '#4CC9F0' : '#FFD60A',
                            boxShadow: `0 0 ${particle.size * 2}px ${index % 3 === 0 ? '#4CC9F0' : '#FFD60A'}`
                        }}
                    />
                );

            case 'biology':
                // Organic cells with dot patterns
                return (
                    <div
                        key={index}
                        style={{
                            ...style,
                            borderRadius: '50%',
                            backgroundColor: '#EF476F',
                            background: `radial-gradient(circle at 30% 30%, #EF476F, #7209B7)`,
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    />
                );

            case 'tech':
                // Digital particles - squares and lines
                return (
                    <div
                        key={index}
                        style={{
                            ...style,
                            width: particle.size,
                            height: 1,
                            backgroundColor: index % 2 === 0 ? '#4CC9F0' : '#06FFA5',
                            boxShadow: `0 0 ${particle.size}px ${index % 2 === 0 ? '#4CC9F0' : '#06FFA5'}`,
                            transform: `rotate(${(frame + index) % 360}deg)`
                        }}
                    />
                );

            default:
                // Subtle ambient particles
                return (
                    <div
                        key={index}
                        style={{
                            ...style,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        }}
                    />
                );
        }
    };

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 5 }}>
            {particles.map((particle, i) => renderParticle(particle, i))}
        </AbsoluteFill>
    );
};
