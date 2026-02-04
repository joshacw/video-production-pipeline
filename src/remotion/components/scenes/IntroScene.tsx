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

interface IntroSceneProps {
  title: string;
  branding: BrandConfig;
  logo?: string;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  branding,
  logo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Title animation - slides up after logo
  const titleTranslateY = interpolate(
    frame,
    [15, 30],
    [50, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const titleOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: branding.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${branding.colors.primary}20 0%, ${branding.colors.secondary}20 100%)`,
        }}
      />

      {/* Logo */}
      {logo && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={logo}
            style={{
              width: 200,
              height: 200,
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Brand Name or Title */}
      <div
        style={{
          position: 'absolute',
          top: logo ? '55%' : '50%',
          transform: `translateY(${titleTranslateY}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          padding: '0 60px',
        }}
      >
        <h1
          style={{
            fontFamily: branding.fonts.primary,
            fontSize: 72,
            fontWeight: 800,
            color: branding.colors.text,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Accent Line */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          width: interpolate(frame, [20, 35], [0, 300]),
          height: 4,
          backgroundColor: branding.colors.accent,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
