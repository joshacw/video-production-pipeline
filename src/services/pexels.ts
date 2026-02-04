import axios from 'axios';
import { Asset } from '../types';

const PEXELS_API_URL = 'https://api.pexels.com/v1';
const PEXELS_VIDEO_API_URL = 'https://api.pexels.com/videos';

export class PexelsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchImages(query: string, count: number = 5): Promise<Asset[]> {
    try {
      const response = await axios.get(`${PEXELS_API_URL}/search`, {
        params: {
          query,
          per_page: count,
          orientation: 'landscape',
        },
        headers: {
          Authorization: this.apiKey,
        },
      });

      return response.data.photos.map((photo: any) => ({
        id: photo.id.toString(),
        type: 'image' as const,
        url: photo.src.large,
        metadata: {
          width: photo.width,
          height: photo.height,
          keywords: [query],
          license: 'Pexels License',
          attribution: `Photo by ${photo.photographer} on Pexels`,
        },
      }));
    } catch (error) {
      console.error('Error fetching images from Pexels:', error);
      throw new Error('Failed to fetch images from Pexels');
    }
  }

  async searchVideos(query: string, count: number = 5): Promise<Asset[]> {
    try {
      const response = await axios.get(`${PEXELS_VIDEO_API_URL}/search`, {
        params: {
          query,
          per_page: count,
          orientation: 'landscape',
        },
        headers: {
          Authorization: this.apiKey,
        },
      });

      return response.data.videos.map((video: any) => {
        // Get the HD video file
        const hdVideo = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];

        return {
          id: video.id.toString(),
          type: 'video' as const,
          url: hdVideo.link,
          metadata: {
            width: hdVideo.width,
            height: hdVideo.height,
            duration: video.duration,
            keywords: [query],
            license: 'Pexels License',
            attribution: `Video by ${video.user.name} on Pexels`,
          },
        };
      });
    } catch (error) {
      console.error('Error fetching videos from Pexels:', error);
      throw new Error('Failed to fetch videos from Pexels');
    }
  }
}
