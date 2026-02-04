import OpenAI from 'openai';
import { Script, ScriptSegment, VideoRequest } from '../types';

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateScript(request: VideoRequest): Promise<Script> {
    const prompt = `Create a compelling ${request.duration}-second video script about "${request.topic}".

Style: ${request.style}
Platform: ${request.platform}
${request.customPrompt ? `Additional instructions: ${request.customPrompt}` : ''}

Generate a JSON response with:
1. A catchy title
2. A brief description
3. Full narration text (to be spoken)
4. Breakdown into segments with timing, text, and scene type
5. 5-7 relevant keywords for asset sourcing
6. Visual direction for each segment

The script should be engaging, concise, and optimized for ${request.platform}.
Segments should include: intro (hook), content (main message), and outro (call-to-action).

Return ONLY valid JSON matching this structure:
{
  "title": "string",
  "description": "string",
  "duration": number,
  "narration": "string",
  "keywords": ["string"],
  "segments": [
    {
      "id": "string",
      "text": "string",
      "startTime": number,
      "endTime": number,
      "sceneType": "intro|content|transition|outro|cta",
      "visualDirection": "string"
    }
  ]
}`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video scriptwriter. Generate engaging, concise scripts optimized for short-form video. Always return valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content generated');
      }

      const script = JSON.parse(content);
      return script as Script;
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  }

  async generateVoiceover(text: string, outputPath: string): Promise<string> {
    try {
      const mp3 = await this.client.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      // In production, save to storage service
      // For now, return a placeholder URL
      return outputPath;
    } catch (error) {
      console.error('Error generating voiceover:', error);
      throw new Error('Failed to generate voiceover');
    }
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    try {
      // Fetch audio file
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const transcription = await this.client.audio.transcriptions.create({
        file: audioBlob as any,
        model: 'whisper-1',
        response_format: 'text',
      });

      return transcription;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async generateCaptions(audioUrl: string, duration: number) {
    try {
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const transcription = await this.client.audio.transcriptions.create({
        file: audioBlob as any,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['word'],
      });

      // Convert to caption format
      return transcription;
    } catch (error) {
      console.error('Error generating captions:', error);
      throw new Error('Failed to generate captions');
    }
  }
}
