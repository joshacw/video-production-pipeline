import { VideoRequest, VideoSpec, BrandConfig, AudioTrack } from '../types';
import { OpenAIService } from '../services/openai';
import { AssetSourcer } from './assetSourcer';
import { CompositionBuilder } from './compositionBuilder';

export interface PipelineConfig {
  openaiApiKey: string;
  unsplashApiKey?: string;
  pexelsApiKey?: string;
}

export class VideoPipeline {
  private openai: OpenAIService;
  private assetSourcer: AssetSourcer;
  private compositionBuilder: CompositionBuilder;

  constructor(config: PipelineConfig) {
    this.openai = new OpenAIService(config.openaiApiKey);
    this.assetSourcer = new AssetSourcer({
      unsplashApiKey: config.unsplashApiKey,
      pexelsApiKey: config.pexelsApiKey,
    });
    this.compositionBuilder = new CompositionBuilder();
  }

  async generateVideo(
    request: VideoRequest,
    branding: BrandConfig
  ): Promise<VideoSpec> {
    console.log('🎬 Starting video generation pipeline...');

    // Step 1: Generate Script
    console.log('📝 Generating script...');
    const script = await this.openai.generateScript(request);
    console.log(`✅ Script generated: "${script.title}"`);

    // Step 2: Source Assets (parallel)
    console.log('🖼️  Sourcing assets...');
    const [images, videos, music] = await Promise.all([
      this.assetSourcer.sourceImagesForScript(script, 5),
      this.assetSourcer.sourceVideosForScript(script, 2),
      this.assetSourcer.sourceBackgroundMusic(request.style),
    ]);

    const allAssets = [...images, ...videos].filter(Boolean);
    console.log(`✅ Sourced ${allAssets.length} assets`);

    // Step 3: Generate Voiceover (if enabled)
    let voiceover: AudioTrack | undefined;
    if (request.options?.includeVoiceover) {
      console.log('🎤 Generating voiceover...');
      const voiceoverPath = `/audio/voiceover-${Date.now()}.mp3`;
      await this.openai.generateVoiceover(script.narration, voiceoverPath);

      voiceover = {
        id: 'voiceover',
        url: voiceoverPath,
        type: 'voiceover',
        duration: script.duration,
        volume: 1,
        startFrom: 0,
      };
      console.log('✅ Voiceover generated');
    }

    // Step 4: Generate Captions (if enabled)
    let captions;
    if (request.options?.includeCaptions && voiceover) {
      console.log('📝 Generating captions...');
      // Captions would be generated from voiceover
      // For now, create basic captions from script segments
      captions = script.segments.map((seg) => ({
        text: seg.text,
        startTime: seg.startTime,
        endTime: seg.endTime,
      }));
      console.log(`✅ Generated ${captions.length} captions`);
    }

    // Step 5: Build Music Track
    let musicTrack: AudioTrack | undefined;
    if (request.options?.includeMusic && music) {
      musicTrack = {
        id: 'background-music',
        url: music.url,
        type: 'music',
        duration: music.metadata.duration || script.duration,
        volume: 0.3, // Lower volume for background
        startFrom: 0,
      };
    }

    // Step 6: Build Video Composition
    console.log('🎨 Building video composition...');
    let videoSpec = this.compositionBuilder.buildVideoSpec(
      request,
      script,
      allAssets,
      voiceover,
      musicTrack,
      captions,
      branding
    );

    // Step 7: Optimize for Platform
    videoSpec = this.compositionBuilder.optimizeForPlatform(videoSpec);

    // Step 8: Add Branding
    videoSpec = this.compositionBuilder.addBrandingElements(videoSpec, branding);

    console.log('✅ Video specification complete!');
    console.log(`   Duration: ${videoSpec.duration}s`);
    console.log(`   Scenes: ${videoSpec.scenes.length}`);
    console.log(`   Assets: ${Object.keys(videoSpec.assets).length}`);

    return videoSpec;
  }

  async generateMultipleVariants(
    baseRequest: VideoRequest,
    branding: BrandConfig,
    variantCount: number = 3
  ): Promise<VideoSpec[]> {
    console.log(`🎬 Generating ${variantCount} video variants...`);

    const variants = await Promise.all(
      Array.from({ length: variantCount }).map(async (_, index) => {
        console.log(`\n📹 Generating variant ${index + 1}/${variantCount}...`);
        const request = {
          ...baseRequest,
          customPrompt: `${baseRequest.customPrompt || ''} Variant ${index + 1}: Use a different creative angle.`,
        };
        return this.generateVideo(request, branding);
      })
    );

    console.log(`\n✅ All ${variantCount} variants generated!`);
    return variants;
  }
}
