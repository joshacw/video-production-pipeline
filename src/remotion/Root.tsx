import React from 'react';
import { Composition } from 'remotion';
import { ExplainerVideo } from './compositions/ExplainerVideo';
import { ProductShowcase } from './compositions/ProductShowcase';
import { SocialPost } from './compositions/SocialPost';
import { VideoSpec, VideoSpecSchema } from '../types';

export const RemotionRoot: React.FC = () => {
  // Default props for preview
  const defaultVideoSpec: VideoSpec = {
    id: 'preview-video',
    title: 'Sample Video',
    description: 'A sample video for preview',
    style: 'modern',
    duration: 30,
    platform: 'youtube-shorts',
    dimensions: { width: 1080, height: 1920 },
    fps: 30,
    scenes: [],
    assets: {},
    branding: {
      name: 'Sample Brand',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        background: '#1F2937',
        text: '#F9FAFB',
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Poppins',
      },
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  return (
    <>
      <Composition
        id="ExplainerVideo"
        component={ExplainerVideo}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        schema={VideoSpecSchema}
        defaultProps={defaultVideoSpec}
      />

      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        schema={VideoSpecSchema}
        defaultProps={defaultVideoSpec}
      />

      <Composition
        id="SocialPost"
        component={SocialPost}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1080}
        height={1080}
        schema={VideoSpecSchema}
        defaultProps={defaultVideoSpec}
      />
    </>
  );
};
