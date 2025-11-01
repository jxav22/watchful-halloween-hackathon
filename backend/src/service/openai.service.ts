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
        console.log('Image generation skipped, using static placeholders');
        // Assign static image URLs if image generation is disabled
        this.assignStaticImageUrls(storyResponse);
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
   * Enhance image prompt with illustration direction style and character consistency
   * Matches the exact art style defined in storyPrompt.ts (lines 26-30)
   * Emphasizes kid-friendly appearance and character consistency
   */
  private enhanceImagePrompt(
    imagePrompt: string,
    storyTitle: string,
    storyText: string,
    pageNumber: number,
  ): string {
    // Kid-friendly requirements
    const kidFriendly = `Kid-friendly children's book illustration: friendly faces, soft rounded features, bright cheerful colors, safe happy environment, non-threatening, warm and inviting, age-appropriate`;
    
    // Art style from storyPrompt.ts lines 26-30, with Bugs Bunny reference
    const artStyleInstructions = `Art style: Disney-Pixar × Looney Toons. The character could look like Bugs Bunny from Looney Toons with expressive large friendly eyes`;
    
    // Strong character consistency instructions
    const consistencyNote = pageNumber === 1 
      ? `Establish ONE main character with very specific design: same face shape, same eye color, same fur/skin color, same size, same clothing style, same distinctive features. This exact character design MUST be repeated identically in all 5 pages`
      : `CRITICAL: Use the EXACT SAME character from page 1: identical face, identical eye color, identical fur/skin color, identical size, identical clothing, identical distinctive features. The character must look exactly the same as page 1, just in a different scene or pose`;
    
    // Complete enhanced prompt
    return `${imagePrompt}. ${kidFriendly}. ${artStyleInstructions}. ${consistencyNote}`;
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
          
          const image1 = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: enhancedPrompt1,
            size: '1024x1024',
            quality: 'standard',
          });

          page1.image_url = image1.data?.[0]?.url || null;
          if (page1.image_url) {
            console.log(`✓ [Page 1] Character design established: ${page1.image_url.substring(0, 50)}...`);
          }
        } catch (error) {
          console.error(`✗ [Page 1] Failed:`, error);
          this.assignStaticImageUrl(page1, 0);
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
            console.warn(`[Page ${page.page_number}] No image_prompt found, using static placeholder`);
            this.assignStaticImageUrl(page, page.page_number - 1);
            continue;
          }
          
          // Enhance prompt with character consistency instructions and page 1 reference
          let enhancedPrompt = this.enhanceImagePrompt(page.image_prompt, storyTitle, storyText, page.page_number);
          
          // Add explicit reference to page 1 character if available
          if (page1CharacterHint) {
            enhancedPrompt = `${enhancedPrompt}. ${page1CharacterHint}`;
          }
          
          console.log(`[Page ${page.page_number}] Enhanced prompt: ${enhancedPrompt.substring(0, 200)}...`);
          
          const image = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: enhancedPrompt,
            size: '1024x1024',
            quality: 'standard',
          });

          const imageUrl = image.data?.[0]?.url || null;
          page.image_url = imageUrl;
          
          if (imageUrl) {
            console.log(`✓ [Page ${page.page_number}] DALL-E image generated: ${imageUrl.substring(0, 50)}...`);
          } else {
            console.warn(`⚠ [Page ${page.page_number}] No URL in response, using static placeholder`);
            this.assignStaticImageUrl(page, page.page_number - 1);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`✗ [Page ${page.page_number}] Failed to generate image:`, errorMessage);
          console.log(`[Page ${page.page_number}] Falling back to static placeholder`);
          this.assignStaticImageUrl(page, page.page_number - 1);
        }
      }

      const dalleImageCount = storyResponse.pages.filter(
        (p) => p.image_url && !p.image_url.includes('placeholder')
      ).length;
      const staticCount = storyResponse.pages.length - dalleImageCount;
      console.log(`✅ Image generation complete: ${dalleImageCount} DALL-E image(s) + ${staticCount} static placeholder(s)`);
    } catch (error) {
      console.error('❌ Critical error generating images:', error);
    }
  }

  /**
   * Assign static image URL to a single page
   */
  private assignStaticImageUrl(page: StoryResponse['pages'][0], index: number): void {
    const colors = ['4A90E2', '50C878', 'FF6B6B', 'FFD93D', '6C5CE7'];
    const color = colors[index % colors.length];
    page.image_url = `https://via.placeholder.com/1024x1024/${color}/FFFFFF?text=Page+${page.page_number}`;
    console.log(`[Page ${page.page_number}] Assigned static placeholder URL`);
  }

  /**
   * Assign static image URLs to each page
   * Using placeholder.com service as fallback
   */
  private assignStaticImageUrls(storyResponse: StoryResponse): void {
    storyResponse.pages.forEach((page, index) => {
      // Using placeholder.com with different colors for each page
      const colors = ['4A90E2', '50C878', 'FF6B6B', 'FFD93D', '6C5CE7'];
      const color = colors[index % colors.length];
      
      // Static placeholder image URL (1024x1024)
      page.image_url = `https://via.placeholder.com/1024x1024/${color}/FFFFFF?text=Page+${page.page_number}`;
      
      console.log(`Assigned static image URL for page ${page.page_number}`);
    });
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

