import React from 'react';
import { AbsoluteFill, Audio, Sequence } from 'remotion';
import { VideoSpec } from '../../types';
import { IntroScene } from '../components/scenes/IntroScene';
import { ContentScene } from '../components/scenes/ContentScene';
import { OutroScene } from '../components/scenes/OutroScene';

export const ProductShowcase: React.FC<VideoSpec> = (props) => {
  const { scenes, assets, branding, music, voiceover, fps = 30 } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: branding.colors.background }}>
      {/* Background Music */}
      {music && (
        <Audio
          src={music.url}
          volume={music.volume}
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

      {/* Render Scenes - Product Showcase optimized */}
      {scenes.map((scene, index) => {
        const durationInFrames = Math.round(scene.duration * fps);
        const fromFrame = Math.round(scene.startTime * fps);

        const asset = scene.assets[0] ? assets[scene.assets[0]] : undefined;

        // Alternate between split-screen and full layouts for visual variety
        const layout = index % 2 === 0 ? 'split-screen' : 'image-with-text';

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
                layout={layout}
              />
            )}

            {(scene.type === 'outro' || scene.type === 'cta') && (
              <OutroScene
                callToAction={scene.text || 'Buy Now'}
                branding={branding}
                logo={branding.logo}
                subtitle="Limited Time Offer"
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
