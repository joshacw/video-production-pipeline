import React from 'react';
import { AbsoluteFill, Audio, Sequence } from 'remotion';
import { VideoSpec } from '../../types';
import { IntroScene } from '../components/scenes/IntroScene';
import { ContentScene } from '../components/scenes/ContentScene';
import { OutroScene } from '../components/scenes/OutroScene';

export const ExplainerVideo: React.FC<VideoSpec> = (props) => {
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

      {/* Render Scenes */}
      {scenes.map((scene) => {
        const durationInFrames = Math.round(scene.duration * fps);
        const fromFrame = Math.round(scene.startTime * fps);

        // Get asset for this scene
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

            {(scene.type === 'content' ||
              scene.type === 'image-with-text' ||
              scene.type === 'full-screen-text' ||
              scene.type === 'split-screen') && (
              <ContentScene
                text={scene.text || ''}
                asset={asset}
                branding={branding}
                layout={scene.type === 'content' ? 'image-with-text' : scene.type}
              />
            )}

            {(scene.type === 'outro' || scene.type === 'cta') && (
              <OutroScene
                callToAction={scene.text || 'Learn More'}
                branding={branding}
                logo={branding.logo}
                subtitle="Visit our website"
              />
            )}
          </Sequence>
        );
      })}

      {/* Captions Overlay - Could be added as a separate component */}
      {/* <CaptionsOverlay captions={captions} branding={branding} /> */}
    </AbsoluteFill>
  );
};
