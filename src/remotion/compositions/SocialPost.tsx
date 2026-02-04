import React from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { VideoSpec } from '../../types';
import { IntroScene } from '../components/scenes/IntroScene';
import { ContentScene } from '../components/scenes/ContentScene';

export const SocialPost: React.FC<VideoSpec> = (props) => {
  const { scenes, assets, branding, music, voiceover, fps = 30 } = props;
  const frame = useCurrentFrame();

  // Quick, snappy animations for social media
  const bgScale = interpolate(frame, [0, 30], [1.2, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: branding.colors.background,
        transform: `scale(${bgScale})`,
      }}
    >
      {/* Background Music */}
      {music && (
        <Audio
          src={music.url}
          volume={music.volume * 0.5} // Lower for social
          startFrom={music.startFrom * fps}
        />
      )}

      {/* Voiceover */}
      {voiceover && (
        <Audio
          src={voiceover.url}
          volume={voiceover.volume}
          startFrom={voiceover.startFrom * fps}
        />
      )}

      {/* Render Scenes - Optimized for quick social consumption */}
      {scenes.map((scene) => {
        const durationInFrames = Math.round(scene.duration * fps);
        const fromFrame = Math.round(scene.startTime * fps);

        const asset = scene.assets[0] ? assets[scene.assets[0]] : undefined;

        return (
          <Sequence
            key={scene.id}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            {scene.type === 'intro' && (
              <IntroScene
                title={scene.text || props.title}
                branding={branding}
                logo={branding.logo}
              />
            )}

            {scene.type === 'content' && (
              <ContentScene
                text={scene.text || ''}
                asset={asset}
                branding={branding}
                layout="full-screen-text"
              />
            )}

            {/* Social posts often end with strong CTAs */}
            {(scene.type === 'outro' || scene.type === 'cta') && (
              <AbsoluteFill
                style={{
                  backgroundColor: branding.colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 60,
                }}
              >
                <h1
                  style={{
                    fontFamily: branding.fonts.primary,
                    fontSize: 96,
                    fontWeight: 900,
                    color: branding.colors.text,
                    textAlign: 'center',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  {scene.text || '👆 Follow'}
                </h1>
              </AbsoluteFill>
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
