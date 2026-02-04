import {
  VideoSpec,
  Script,
  Asset,
  Scene,
  AudioTrack,
  Caption,
  BrandConfig,
  VideoRequest,
  PLATFORM_SPECS,
} from '../types';

export class CompositionBuilder {
  buildVideoSpec(
    request: VideoRequest,
    script: Script,
    assets: Asset[],
    voiceover: AudioTrack | undefined,
    music: AudioTrack | undefined,
    captions: Caption[] | undefined,
    branding: BrandConfig
  ): VideoSpec {
    const platformSpec = PLATFORM_SPECS[request.platform];

    // Create asset map
    const assetMap: Record<string, Asset> = {};
    assets.forEach((asset) => {
      assetMap[asset.id] = asset;
    });

    // Build scenes from script segments
    const scenes = this.buildScenes(script, assets);

    const videoSpec: VideoSpec = {
      id: `video-${Date.now()}`,
      title: script.title,
      description: script.description,
      style: request.style,
      duration: script.duration,
      platform: request.platform,
      dimensions: {
        width: platformSpec.width,
        height: platformSpec.height,
      },
      fps: 30,
      scenes,
      assets: assetMap,
      music,
      voiceover,
      captions,
      branding,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    return videoSpec;
  }

  private buildScenes(script: Script, assets: Asset[]): Scene[] {
    const scenes: Scene[] = [];
    let assetIndex = 0;

    script.segments.forEach((segment, index) => {
      const sceneAssets: string[] = [];

      // Assign assets to scenes
      if (assets[assetIndex]) {
        sceneAssets.push(assets[assetIndex].id);
        assetIndex = (assetIndex + 1) % assets.length;
      }

      // Determine scene type and animation based on segment
      let sceneType: Scene['type'] = 'content';
      let animation = 'fadeIn';
      let transition = 'fade';

      switch (segment.sceneType) {
        case 'intro':
          sceneType = 'intro';
          animation = 'zoomIn';
          break;
        case 'outro':
          sceneType = 'outro';
          animation = 'fadeOut';
          break;
        case 'cta':
          sceneType = 'cta';
          animation = 'slideUp';
          break;
        case 'transition':
          sceneType = 'title';
          transition = 'wipe';
          break;
        default:
          sceneType = assets[assetIndex - 1]?.type === 'video'
            ? 'video-overlay'
            : 'image-with-text';
      }

      scenes.push({
        id: segment.id,
        type: sceneType,
        duration: segment.endTime - segment.startTime,
        startTime: segment.startTime,
        assets: sceneAssets,
        text: segment.text,
        animation,
        transition: index < script.segments.length - 1 ? transition : undefined,
      });
    });

    return scenes;
  }

  calculateSceneTiming(
    duration: number,
    segmentCount: number
  ): Array<{ startTime: number; duration: number }> {
    const timings: Array<{ startTime: number; duration: number }> = [];

    // Intro: 10% of duration
    // Content: 75% of duration divided among segments
    // Outro: 15% of duration

    const introDuration = duration * 0.1;
    const outroDuration = duration * 0.15;
    const contentDuration = duration * 0.75;
    const segmentDuration = contentDuration / Math.max(1, segmentCount - 2);

    let currentTime = 0;

    // Intro
    timings.push({ startTime: currentTime, duration: introDuration });
    currentTime += introDuration;

    // Content segments
    for (let i = 0; i < segmentCount - 2; i++) {
      timings.push({ startTime: currentTime, duration: segmentDuration });
      currentTime += segmentDuration;
    }

    // Outro
    timings.push({ startTime: currentTime, duration: outroDuration });

    return timings;
  }

  optimizeForPlatform(videoSpec: VideoSpec): VideoSpec {
    const platformSpec = PLATFORM_SPECS[videoSpec.platform];

    // Adjust dimensions
    videoSpec.dimensions = {
      width: platformSpec.width,
      height: platformSpec.height,
    };

    // Trim duration if exceeds platform max
    if (videoSpec.duration > platformSpec.maxDuration) {
      console.warn(
        `Duration ${videoSpec.duration}s exceeds platform max ${platformSpec.maxDuration}s, trimming...`
      );
      videoSpec.duration = platformSpec.maxDuration;

      // Recalculate scene timings
      const scaleFactor = platformSpec.maxDuration / videoSpec.duration;
      videoSpec.scenes = videoSpec.scenes.map((scene) => ({
        ...scene,
        duration: scene.duration * scaleFactor,
        startTime: scene.startTime * scaleFactor,
      }));
    }

    return videoSpec;
  }

  addBrandingElements(videoSpec: VideoSpec, branding: BrandConfig): VideoSpec {
    // Add logo overlay to intro
    const introScene = videoSpec.scenes.find((s) => s.type === 'intro');
    if (introScene && branding.logo) {
      // Logo will be rendered by the Intro component
    }

    // Add branded CTA at end if not present
    const hasOutro = videoSpec.scenes.some((s) => s.type === 'outro' || s.type === 'cta');
    if (!hasOutro) {
      const lastScene = videoSpec.scenes[videoSpec.scenes.length - 1];
      const ctaStart = lastScene.startTime + lastScene.duration;

      videoSpec.scenes.push({
        id: 'cta-outro',
        type: 'cta',
        duration: 3,
        startTime: ctaStart,
        assets: [],
        text: 'Learn More',
        animation: 'slideUp',
      });

      videoSpec.duration += 3;
    }

    return videoSpec;
  }
}
