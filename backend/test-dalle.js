/**
 * Simple script to test if your OpenAI API key has DALL-E access
 * 
 * Option 1: Set API key as environment variable
 *   OPENAI_API_KEY=your_key_here node test-dalle.js
 * 
 * Option 2: Install dotenv and run
 *   npm install dotenv
 *   node test-dalle.js
 * 
 * Option 3: Edit this file and set the API key directly (not recommended for production)
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay
}

const OpenAI = require('openai');

async function testDALLE() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found!');
    console.error('\nOptions:');
    console.error('  1. Set it: OPENAI_API_KEY=your_key node test-dalle.js');
    console.error('  2. Install dotenv: npm install dotenv');
    console.error('  3. Check your .env file exists and has OPENAI_API_KEY');
    process.exit(1);
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  console.log('🧪 Testing DALL-E 3 access...\n');

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'A cute cartoon cat',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (imageUrl) {
      console.log('✅ SUCCESS! DALL-E 3 is enabled for your API key');
      console.log('📷 Generated image URL:', imageUrl);
      console.log('\n🎉 You can now use image generation in your API');
    } else {
      console.log('⚠️  Response received but no image URL found');
    }
  } catch (error) {
    console.error('❌ Error testing DALL-E access:');
    console.error('Error message:', error.message);
    
    if (error.status === 401) {
      console.error('\n🔐 Authentication error - check if your API key is valid');
    } else if (error.status === 402) {
      console.error('\n💳 Payment required - ensure you have billing set up');
    } else if (error.message.includes('model') || error.message.includes('not found')) {
      console.error('\n🚫 DALL-E 3 model not available for your account');
      console.error('   This usually means:');
      console.error('   1. Your account needs a paid subscription');
      console.error('   2. DALL-E access needs to be enabled in your account settings');
      console.error('   3. Check https://platform.openai.com/account/billing');
    } else {
      console.error('\n📋 Full error:', error);
    }
    
    process.exit(1);
  }
}

testDALLE();

