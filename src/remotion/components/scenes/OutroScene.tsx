import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
} from 'remotion';
import { BrandConfig } from '../../../types';

interface OutroSceneProps {
  callToAction: string;
  branding: BrandConfig;
  logo?: string;
  subtitle?: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  callToAction,
  branding,
  logo,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA animation - scale in
  const ctaScale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const ctaOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const subtitleTranslateY = interpolate(frame, [10, 20], [20, 0], {
    extrapolateRight: 'clamp',
  });

  // Logo fade in
  const logoOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Pulsing animation for CTA
  const pulse = Math.sin((frame / 30) * Math.PI * 2) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: branding.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Gradient Background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, ${branding.colors.primary}40 0%, ${branding.colors.background} 70%)`,
        }}
      />

      {/* Animated Particles/Shapes */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${branding.colors.accent}20, transparent)`,
          transform: `scale(${interpolate(frame, [0, 90], [0.5, 2])}) rotate(${frame * 2}deg)`,
          opacity: 0.3,
        }}
      />

      {/* Call to Action */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          transform: `scale(${ctaScale * pulse})`,
          opacity: ctaOpacity,
          textAlign: 'center',
          padding: '0 80px',
        }}
      >
        <h1
          style={{
            fontFamily: branding.fonts.primary,
            fontSize: 84,
            fontWeight: 900,
            color: branding.colors.text,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {callToAction}
        </h1>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            transform: `translateY(${subtitleTranslateY}px)`,
            opacity: subtitleOpacity,
            textAlign: 'center',
            padding: '0 100px',
          }}
        >
          <p
            style={{
              fontFamily: branding.fonts.secondary,
              fontSize: 36,
              fontWeight: 500,
              color: branding.colors.text,
              opacity: 0.9,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>
      )}

      {/* Brand Logo */}
      {logo && (
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            opacity: logoOpacity,
          }}
        >
          <Img
            src={logo}
            style={{
              width: 120,
              height: 120,
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Bottom Accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 8,
          background: `linear-gradient(90deg, ${branding.colors.primary}, ${branding.colors.accent}, ${branding.colors.secondary})`,
        }}
      />
    </AbsoluteFill>
  );
};
