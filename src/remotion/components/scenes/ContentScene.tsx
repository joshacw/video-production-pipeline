import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  Video,
} from 'remotion';
import { BrandConfig, Asset } from '../../../types';

interface ContentSceneProps {
  text: string;
  asset?: Asset;
  branding: BrandConfig;
  layout?: 'image-with-text' | 'full-screen-text' | 'split-screen';
}

export const ContentScene: React.FC<ContentSceneProps> = ({
  text,
  asset,
  branding,
  layout = 'image-with-text',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in animation
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Text slide up
  const textTranslateY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: 'clamp',
  });

  // Image zoom
  const imageScale = interpolate(frame, [0, 60], [1, 1.1], {
    extrapolateRight: 'clamp',
  });

  const renderAsset = () => {
    if (!asset) return null;

    const assetStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      transform: `scale(${imageScale})`,
    };

    if (asset.type === 'image') {
      return <Img src={asset.url} style={assetStyle} />;
    }

    if (asset.type === 'video') {
      return <Video src={asset.url} style={assetStyle} />;
    }

    return null;
  };

  if (layout === 'full-screen-text') {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: branding.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
          opacity,
        }}
      >
        {/* Gradient Background */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${branding.colors.primary}30 0%, ${branding.colors.secondary}30 100%)`,
          }}
        />

        {/* Text */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <h2
            style={{
              fontFamily: branding.fonts.primary,
              fontSize: 64,
              fontWeight: 700,
              color: branding.colors.text,
              textAlign: 'center',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {text}
          </h2>
        </div>
      </AbsoluteFill>
    );
  }

  if (layout === 'split-screen') {
    return (
      <AbsoluteFill style={{ backgroundColor: branding.colors.background }}>
        {/* Left: Asset */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            opacity,
          }}
        >
          {renderAsset()}
        </div>

        {/* Right: Text */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 60,
            background: `linear-gradient(135deg, ${branding.colors.primary}20 0%, ${branding.colors.secondary}20 100%)`,
          }}
        >
          <h2
            style={{
              fontFamily: branding.fonts.primary,
              fontSize: 48,
              fontWeight: 700,
              color: branding.colors.text,
              textAlign: 'left',
              lineHeight: 1.4,
              margin: 0,
              transform: `translateY(${textTranslateY}px)`,
              opacity,
            }}
          >
            {text}
          </h2>
        </div>
      </AbsoluteFill>
    );
  }

  // Default: image-with-text
  return (
    <AbsoluteFill style={{ backgroundColor: branding.colors.background }}>
      {/* Background Asset */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          opacity: opacity * 0.7,
        }}
      >
        {renderAsset()}
        {/* Dark overlay for better text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      {/* Text Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '80px 60px',
          zIndex: 10,
          transform: `translateY(${textTranslateY}px)`,
          opacity,
        }}
      >
        <h2
          style={{
            fontFamily: branding.fonts.primary,
            fontSize: 56,
            fontWeight: 700,
            color: branding.colors.text,
            textAlign: 'center',
            lineHeight: 1.3,
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {text}
        </h2>
      </div>
    </AbsoluteFill>
  );
};
