import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Simple composition that works with the web UI generated specs
export interface SimpleVideoProps {
  script: {
    title: string;
    hook: string;
    content: string[];
    cta: string;
  };
  branding: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    fonts: {
      primary: string;
    };
  };
  timing: {
    intro: number;
    content: number;
    outro: number;
  };
}

export const SimpleVideo: React.FC<SimpleVideoProps> = ({
  script,
  branding,
  timing,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introEnd = timing.intro * fps;
  const contentEnd = introEnd + timing.content * fps;

  // Calculate which section we're in
  const inIntro = frame < introEnd;
  const inContent = frame >= introEnd && frame < contentEnd;
  const inOutro = frame >= contentEnd;

  // Animations
  const titleScale = spring({
    frame: frame,
    fps,
    config: {
      damping: 200,
    },
  });

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${branding.colors.background} 0%, ${branding.colors.primary}20 100%)`,
        fontFamily: branding.fonts.primary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        opacity: fadeIn,
      }}
    >
      {/* Brand Logo/Name */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          fontSize: 24,
          fontWeight: 'bold',
          color: branding.colors.text,
        }}
      >
        {branding.name}
      </div>

      {/* Intro Section */}
      {inIntro && (
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: branding.colors.text,
            textAlign: 'center',
            transform: `scale(${titleScale})`,
          }}
        >
          {script.title}
        </div>
      )}

      {/* Content Section */}
      {inContent && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: branding.colors.primary,
              marginBottom: 20,
            }}
          >
            {script.hook}
          </div>
          {script.content.map((point, index) => {
            const pointAppearFrame = introEnd + (index * timing.content * fps) / script.content.length;
            const pointOpacity = interpolate(
              frame,
              [pointAppearFrame, pointAppearFrame + 20],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );

            return (
              <div
                key={index}
                style={{
                  fontSize: 36,
                  color: branding.colors.text,
                  opacity: pointOpacity,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: branding.colors.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: branding.colors.text,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                {point}
              </div>
            );
          })}
        </div>
      )}

      {/* Outro Section */}
      {inOutro && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 30,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: branding.colors.primary,
              textAlign: 'center',
            }}
          >
            {script.cta}
          </div>
          <div
            style={{
              fontSize: 32,
              color: branding.colors.text,
            }}
          >
            {branding.name}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
