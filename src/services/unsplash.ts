import axios from 'axios';
import { Asset } from '../types';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

export class UnsplashService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchImages(query: string, count: number = 5): Promise<Asset[]> {
    try {
      const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
        params: {
          query,
          per_page: count,
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${this.apiKey}`,
        },
      });

      return response.data.results.map((photo: any) => ({
        id: photo.id,
        type: 'image' as const,
        url: photo.urls.regular,
        metadata: {
          width: photo.width,
          height: photo.height,
          keywords: photo.tags?.map((t: any) => t.title) || [],
          license: 'Unsplash License',
          attribution: `Photo by ${photo.user.name} on Unsplash`,
        },
      }));
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
      throw new Error('Failed to fetch images from Unsplash');
    }
  }

  async getRandomImage(query?: string): Promise<Asset> {
    try {
      const response = await axios.get(`${UNSPLASH_API_URL}/photos/random`, {
        params: query ? { query } : {},
        headers: {
          Authorization: `Client-ID ${this.apiKey}`,
        },
      });

      const photo = response.data;
      return {
        id: photo.id,
        type: 'image' as const,
        url: photo.urls.regular,
        metadata: {
          width: photo.width,
          height: photo.height,
          keywords: photo.tags?.map((t: any) => t.title) || [],
          license: 'Unsplash License',
          attribution: `Photo by ${photo.user.name} on Unsplash`,
        },
      };
    } catch (error) {
      console.error('Error fetching random image:', error);
      throw new Error('Failed to fetch random image');
    }
  }
}
