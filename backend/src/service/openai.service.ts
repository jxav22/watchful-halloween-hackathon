import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { storybookPrompt } from '../storyPrompt';
import { StoryResponse } from '../dto/story-response.dto';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateResponse(
    text: string,
    paragraph: string,
    age: number,
    generateImages = true,
  ): Promise<StoryResponse> {
    try {
      console.log('Generating story...');
      
      const prompt = storybookPrompt(text, paragraph, age);
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content || '';
      const storyResponse = this.parseJsonResponse(content);
      
      console.log(`Story generated with ${storyResponse.pages.length} pages`);
      console.log(`generateImages flag: ${generateImages}`);

      // Generate images for each page if requested
      if (generateImages && storyResponse.pages?.length) {
        console.log('Starting image generation for all pages...');
        await this.generateImagesForStory(storyResponse, text, paragraph);
      } else {
        console.log('Image generation skipped');
      }

      // Verify final image URLs
      const pagesWithImages = storyResponse.pages.filter((p) => p.image_url).length;
      console.log(`Final check: ${pagesWithImages}/${storyResponse.pages.length} pages have image URLs`);

      return storyResponse;
    } catch (error) {
      console.error('Error in generateResponse:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Sanitize image prompt to ensure it's safe for children's content
   */
  private sanitizeImagePrompt(prompt: string): string {
    // Remove any potentially problematic words (case-insensitive)
    let sanitized = prompt.replace(/\b(scary|dark|fear|violence|weapon|fight|attack|danger|threat|horror|creepy)\b/gi, '');
    
    // Clean up extra spaces
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    // Ensure it starts with positive, child-friendly language if needed
    const lowerPrompt = sanitized.toLowerCase();
    if (!lowerPrompt.startsWith('a friendly') && 
        !lowerPrompt.startsWith('a cute') && 
        !lowerPrompt.startsWith('a happy') &&
        !lowerPrompt.startsWith('an adorable')) {
      sanitized = `A friendly ${sanitized}`;
    }
    
    return sanitized;
  }

  /**
   * Enhance image prompt with illustration direction style and character consistency
   * Matches the exact art style defined in storyPrompt.ts (lines 26-30)
   * Emphasizes kid-friendly appearance and character consistency
   * Structured to pass OpenAI safety filters for children's content
   */
  private enhanceImagePrompt(
    imagePrompt: string,
    storyTitle: string,
    storyText: string,
    pageNumber: number,
  ): string {
    // Sanitize the original prompt first
    const sanitizedPrompt = this.sanitizeImagePrompt(imagePrompt);
    // Start with explicit children's book context for safety
    const bookContext = `A safe, appropriate, innocent illustration for a children's storybook page`;
    
    // Emphasize Disney character features for kids
    const disneyCharacterFeatures = `Character must have classic Disney character features for children: large expressive eyes (like Disney princesses and animals), soft rounded face shape, warm friendly smile, gentle features, cute adorable appearance, Disney's signature character design style from classic animated films`;
    
    // Kid-friendly visual requirements
    const kidFriendly = `Friendly cartoon character with soft rounded features, bright cheerful colors, happy expression, safe and warm environment, suitable for young children`;
    
    // Art style from storyPrompt.ts lines 26-30, with emphasis on Disney
    const artStyleInstructions = `Art style: Disney-Pixar × Looney Toons animation. Strong emphasis on Disney character design for kids: Disney classic animation character features, expressive large eyes like Disney characters, warm friendly appearance like Disney animals and characters. Character could also be inspired by Bugs Bunny from Looney Toons`;
    
    // Character consistency instructions (worded carefully)
    const consistencyNote = pageNumber === 1 
      ? `This is page 1. Design one main character with specific features: face shape, eye color, fur or skin color, size, clothing style, and distinctive features. This character design will appear on all 5 pages of the storybook`
      : `This character must match exactly the character from page 1: same face, same eye color, same fur or skin color, same size, same clothing, same distinctive features. Show the same character from page 1 in this new scene`;
    
    // Complete enhanced prompt - structured to be safe and clear, with Disney emphasis
    return `${bookContext}. ${sanitizedPrompt}. ${disneyCharacterFeatures}. ${kidFriendly}. ${artStyleInstructions}. ${consistencyNote}`;
  }

  /**
   * Process enhanced prompt through GPT to rewrite it for guaranteed safety
   * Ensures the prompt is safe for children's picture books according to strict safety rules
   */
  private async processPromptForSafety(enhancedPrompt: string): Promise<string> {
    try {
      const safetyProcessingPrompt = `Your task is to rewrite image prompts so they are guaranteed safe for a children's picture book.

Rules:
- Absolutely no references to harm, fear, danger, violence, sadness, death, injury, illness, or anything frightening.
- Replace any phrase that could imply gore, severed body parts, "heads" without bodies, or frightening expressions.
- Replace any "eating" description with "smiling while holding" or "taking a small friendly bite."
- Do not use "eyes closed" in emotional scenes (replace with "smiling gently").
- If characters are non-human (e.g., pumpkins), describe them as "friendly characters with full bodies and happy expressions."
- Always maintain a warm, playful, child-friendly tone.

Output:
A single, clean rewritten prompt that is cheerful, gentle, friendly, and safe.

Rewrite this image prompt:
${enhancedPrompt}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: safetyProcessingPrompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent, safe rewrites
      });

      const processedPrompt = completion.choices[0]?.message?.content?.trim() || enhancedPrompt;
      
      // Fallback to original if processing fails or returns empty
      return processedPrompt || enhancedPrompt;
    } catch (error) {
      console.warn('⚠ Warning: Failed to process prompt for safety, using original enhanced prompt:', error instanceof Error ? error.message : String(error));
      // Return original prompt if processing fails
      return enhancedPrompt;
    }
  }

  /**
   * Generate images for all pages in the story using DALL-E
   * Uses cheapest settings: standard quality, 1024x1024 size
   * Generates sequentially to maintain character consistency (page 1 first, then others reference it)
   */
  private async generateImagesForStory(
    storyResponse: StoryResponse,
    storyTitle: string,
    storyText: string,
  ): Promise<void> {
    try {
      console.log(`Generating ${storyResponse.pages.length} images using DALL-E (cheapest settings)...`);
      console.log(`Story: "${storyTitle}" - maintaining character consistency across all pages`);

      // Generate page 1 first to establish character design
      const page1 = storyResponse.pages.find((p) => p.page_number === 1);
      if (page1 && page1.image_prompt && page1.image_prompt.trim() !== '') {
        try {
          console.log(`[Page 1] Generating first image (establishing character design)...`);
          const enhancedPrompt1 = this.enhanceImagePrompt(page1.image_prompt, storyTitle, storyText, 1);
          console.log(`[Page 1] Enhanced prompt: ${enhancedPrompt1.substring(0, 150)}...`);
          
          // Process the enhanced prompt for safety
          console.log(`[Page 1] Processing prompt for safety...`);
          const processedPrompt1 = await this.processPromptForSafety(enhancedPrompt1);
          console.log(`[Page 1] Processed prompt: ${processedPrompt1.substring(0, 150)}...`);
          
          const image1 = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: processedPrompt1,
            size: '1024x1024',
            quality: 'standard',
          });

          page1.image_url = image1.data?.[0]?.url || null;
          if (page1.image_url) {
            console.log(`✓ [Page 1] Character design established: ${page1.image_url.substring(0, 50)}...`);
          } else {
            console.warn(`⚠ [Page 1] No image URL returned`);
            page1.image_url = null;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          // Check if it's a safety system rejection
          if (errorMessage.includes('safety') || errorMessage.includes('rejected') || errorMessage.includes('policy')) {
            console.warn(`⚠ [Page 1] Content safety rejection. This may be due to story content.`);
            console.warn(`⚠ Original prompt was: ${page1.image_prompt?.substring(0, 100)}`);
          } else {
            console.error(`✗ [Page 1] Failed to generate image:`, errorMessage);
          }
          
          page1.image_url = null;
        }
      }

      // Extract character details from page 1's image_prompt for consistency
      const page1CharacterHint = page1?.image_prompt 
        ? `The main character description from page 1: "${page1.image_prompt.substring(0, 100)}"`
        : '';

      // Generate remaining pages sequentially for better consistency (even though slower)
      const remainingPages = storyResponse.pages
        .filter((p) => p.page_number > 1)
        .sort((a, b) => a.page_number - b.page_number);

      for (const page of remainingPages) {
        try {
          console.log(`[Page ${page.page_number}] Generating image (maintaining character consistency)...`);
          
          if (!page.image_prompt || page.image_prompt.trim() === '') {
            console.warn(`[Page ${page.page_number}] No image_prompt found`);
            page.image_url = null;
            continue;
          }
          
          // Enhance prompt with character consistency instructions and page 1 reference
          let enhancedPrompt = this.enhanceImagePrompt(page.image_prompt, storyTitle, storyText, page.page_number);
          
          // Add explicit reference to page 1 character if available
          if (page1CharacterHint) {
            enhancedPrompt = `${enhancedPrompt}. ${page1CharacterHint}`;
          }
          
          console.log(`[Page ${page.page_number}] Enhanced prompt: ${enhancedPrompt.substring(0, 200)}...`);
          
          // Process the enhanced prompt for safety
          console.log(`[Page ${page.page_number}] Processing prompt for safety...`);
          const processedPrompt = await this.processPromptForSafety(enhancedPrompt);
          console.log(`[Page ${page.page_number}] Processed prompt: ${processedPrompt.substring(0, 200)}...`);
          
          const image = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: processedPrompt,
            size: '1024x1024',
            quality: 'standard',
          });

          const imageUrl = image.data?.[0]?.url || null;
          page.image_url = imageUrl;
          
          if (imageUrl) {
            console.log(`✓ [Page ${page.page_number}] DALL-E image generated: ${imageUrl.substring(0, 50)}...`);
          } else {
            console.warn(`⚠ [Page ${page.page_number}] No URL in response`);
            page.image_url = null;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          // Check if it's a safety system rejection
          if (errorMessage.includes('safety') || errorMessage.includes('rejected') || errorMessage.includes('policy')) {
            console.warn(`⚠ [Page ${page.page_number}] Content safety rejection. This may be due to story content.`);
            console.warn(`⚠ Original prompt was: ${page.image_prompt?.substring(0, 100)}`);
          } else {
            console.error(`✗ [Page ${page.page_number}] Failed to generate image:`, errorMessage);
          }
          
          page.image_url = null;
        }
      }

      const dalleImageCount = storyResponse.pages.filter(
        (p) => p.image_url
      ).length;
      const failedCount = storyResponse.pages.length - dalleImageCount;
      console.log(`✅ Image generation complete: ${dalleImageCount}/${storyResponse.pages.length} DALL-E image(s) generated${failedCount > 0 ? `, ${failedCount} failed` : ''}`);
    } catch (error) {
      console.error('❌ Critical error generating images:', error);
    }
  }

  private parseJsonResponse(content: string): StoryResponse {
    try {
      // Try to extract JSON from the response (in case it's wrapped in markdown or text)
      let jsonString = content.trim();

      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\n?/g, '');
      }

      // Try to find JSON object in the string
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonString);
      return parsed as StoryResponse;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response from OpenAI: ${error.message}. Response: ${content.substring(0, 200)}`,
      );
    }
  }
}

