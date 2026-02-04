import { VideoPipeline } from '../pipeline/videoPipeline';
import { VideoRequest, BrandConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();

// Example brand configuration
const exampleBrand: BrandConfig = {
  name: 'TechCo',
  logo: 'https://example.com/logo.png',
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
};

async function generateSingleVideo() {
  console.log('🎬 Video Production Pipeline Demo\n');

  // Initialize pipeline
  const pipeline = new VideoPipeline({
    openaiApiKey: process.env.OPENAI_API_KEY!,
    unsplashApiKey: process.env.UNSPLASH_API_KEY,
    pexelsApiKey: process.env.PEXELS_API_KEY,
  });

  // Define video request
  const request: VideoRequest = {
    topic: 'How AI is revolutionizing video production',
    duration: 30,
    style: 'modern',
    platform: 'youtube-shorts',
    options: {
      includeVoiceover: true,
      includeCaptions: true,
      includeMusic: true,
      autoPublish: false,
    },
  };

  try {
    // Generate video specification
    const videoSpec = await pipeline.generateVideo(request, exampleBrand);

    console.log('\n📊 Video Specification Generated!');
    console.log('================================');
    console.log(`Title: ${videoSpec.title}`);
    console.log(`Description: ${videoSpec.description}`);
    console.log(`Duration: ${videoSpec.duration}s`);
    console.log(`Platform: ${videoSpec.platform}`);
    console.log(`Dimensions: ${videoSpec.dimensions.width}x${videoSpec.dimensions.height}`);
    console.log(`Scenes: ${videoSpec.scenes.length}`);
    console.log(`Assets: ${Object.keys(videoSpec.assets).length}`);

    console.log('\n🎬 Scene Breakdown:');
    videoSpec.scenes.forEach((scene, i) => {
      console.log(`  ${i + 1}. ${scene.type} (${scene.duration}s) - "${scene.text?.substring(0, 50)}..."`);
    });

    // Save to file for use with Remotion
    const fs = require('fs');
    const outputPath = './output/video-spec.json';
    fs.mkdirSync('./output', { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(videoSpec, null, 2));

    console.log(`\n✅ Video spec saved to: ${outputPath}`);
    console.log('\n🎥 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Load the video spec in Remotion Studio');
    console.log('   3. Preview and render your video!');

    return videoSpec;
  } catch (error) {
    console.error('❌ Error generating video:', error);
    throw error;
  }
}

async function generateMultipleVariants() {
  console.log('🎬 Generating Multiple Video Variants\n');

  const pipeline = new VideoPipeline({
    openaiApiKey: process.env.OPENAI_API_KEY!,
    unsplashApiKey: process.env.UNSPLASH_API_KEY,
    pexelsApiKey: process.env.PEXELS_API_KEY,
  });

  const request: VideoRequest = {
    topic: 'Boost your productivity with these 3 simple tips',
    duration: 15,
    style: 'energetic',
    platform: 'instagram-reels',
    options: {
      includeVoiceover: true,
      includeCaptions: true,
      includeMusic: true,
      autoPublish: false,
    },
  };

  try {
    const variants = await pipeline.generateMultipleVariants(
      request,
      exampleBrand,
      3
    );

    console.log(`\n✅ Generated ${variants.length} variants!`);

    variants.forEach((variant, i) => {
      console.log(`\nVariant ${i + 1}:`);
      console.log(`  Title: ${variant.title}`);
      console.log(`  Scenes: ${variant.scenes.length}`);
      console.log(`  Assets: ${Object.keys(variant.assets).length}`);
    });

    return variants;
  } catch (error) {
    console.error('❌ Error generating variants:', error);
    throw error;
  }
}

// Example batch processing for multiple topics
async function batchGenerate() {
  console.log('🎬 Batch Video Generation\n');

  const topics = [
    'Top 3 productivity hacks for 2024',
    'Why AI will change everything',
    'The future of remote work',
  ];

  const pipeline = new VideoPipeline({
    openaiApiKey: process.env.OPENAI_API_KEY!,
    unsplashApiKey: process.env.UNSPLASH_API_KEY,
    pexelsApiKey: process.env.PEXELS_API_KEY,
  });

  const videos = await Promise.all(
    topics.map((topic) =>
      pipeline.generateVideo(
        {
          topic,
          duration: 30,
          style: 'modern',
          platform: 'youtube-shorts',
          options: {
            includeVoiceover: true,
            includeCaptions: true,
            includeMusic: true,
            autoPublish: false,
          },
        },
        exampleBrand
      )
    )
  );

  console.log(`\n✅ Generated ${videos.length} videos!`);
  return videos;
}

// Run demo
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'single':
      generateSingleVideo();
      break;
    case 'variants':
      generateMultipleVariants();
      break;
    case 'batch':
      batchGenerate();
      break;
    default:
      console.log('Usage:');
      console.log('  npm run demo single   - Generate a single video');
      console.log('  npm run demo variants - Generate multiple variants');
      console.log('  npm run demo batch    - Batch generate multiple videos');
  }
}

export { generateSingleVideo, generateMultipleVariants, batchGenerate };
