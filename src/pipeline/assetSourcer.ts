import { Asset, Script } from '../types';
import { UnsplashService } from '../services/unsplash';
import { PexelsService } from '../services/pexels';

export interface AssetSourcerConfig {
  unsplashApiKey?: string;
  pexelsApiKey?: string;
}

export class AssetSourcer {
  private unsplash?: UnsplashService;
  private pexels?: PexelsService;

  constructor(config: AssetSourcerConfig) {
    if (config.unsplashApiKey) {
      this.unsplash = new UnsplashService(config.unsplashApiKey);
    }
    if (config.pexelsApiKey) {
      this.pexels = new PexelsService(config.pexelsApiKey);
    }
  }

  async sourceImagesForScript(
    script: Script,
    count: number = 5
  ): Promise<Asset[]> {
    const images: Asset[] = [];

    // Collect images from all available sources
    const promises: Promise<Asset[]>[] = [];

    if (this.unsplash) {
      promises.push(
        this.unsplash.searchImages(script.keywords.join(' '), Math.ceil(count / 2))
      );
    }

    if (this.pexels) {
      promises.push(
        this.pexels.searchImages(script.keywords.join(' '), Math.ceil(count / 2))
      );
    }

    if (promises.length === 0) {
      throw new Error('No asset sources configured');
    }

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        images.push(...result.value);
      }
    });

    // Return unique images up to count
    const uniqueImages = Array.from(
      new Map(images.map((img) => [img.id, img])).values()
    );

    return uniqueImages.slice(0, count);
  }

  async sourceVideosForScript(
    script: Script,
    count: number = 3
  ): Promise<Asset[]> {
    if (!this.pexels) {
      console.warn('Pexels not configured, skipping video sourcing');
      return [];
    }

    try {
      return await this.pexels.searchVideos(script.keywords.join(' '), count);
    } catch (error) {
      console.error('Error sourcing videos:', error);
      return [];
    }
  }

  async sourceImagesByKeywords(keywords: string[]): Promise<Asset[]> {
    const allImages: Asset[] = [];

    for (const keyword of keywords) {
      try {
        if (this.unsplash) {
          const images = await this.unsplash.searchImages(keyword, 2);
          allImages.push(...images);
        }
      } catch (error) {
        console.error(`Error fetching images for keyword "${keyword}":`, error);
      }
    }

    return allImages;
  }

  async sourceBackgroundMusic(style: string): Promise<Asset | null> {
    // Placeholder for music sourcing
    // In production, integrate with Epidemic Sound, AudioJungle, etc.

    const musicLibrary: Record<string, string> = {
      modern: 'https://example.com/music/modern-upbeat.mp3',
      corporate: 'https://example.com/music/corporate-inspiring.mp3',
      energetic: 'https://example.com/music/energetic-electronic.mp3',
      minimal: 'https://example.com/music/minimal-ambient.mp3',
      playful: 'https://example.com/music/playful-fun.mp3',
      elegant: 'https://example.com/music/elegant-classical.mp3',
      bold: 'https://example.com/music/bold-rock.mp3',
    };

    const url = musicLibrary[style] || musicLibrary.modern;

    return {
      id: `music-${style}`,
      type: 'audio',
      url,
      metadata: {
        duration: 120, // Placeholder
        keywords: [style, 'background-music'],
        license: 'Royalty Free',
      },
    };
  }
}
