import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './service/openai.service';
import { TextInputDto } from './dto/text-input.dto';
import { StoryResponse } from './dto/story-response.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly openAIService: OpenAIService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('story')
  async getOpenAIResponse(@Body() textInputDto: TextInputDto): Promise<StoryResponse> {
    console.log('📥 Request received:', {
      text: textInputDto.text,
      paragraph: textInputDto.paragraph?.substring(0, 50),
      age: textInputDto.age,
      generate_images: textInputDto.generate_images,
    });
    
    // Default to true if undefined (always generate images unless explicitly disabled)
    const generateImages = textInputDto.generate_images !== false;
    console.log(`🖼️  Image generation: ${generateImages ? 'ENABLED' : 'DISABLED'}`);
    
    const response = await this.openAIService.generateResponse(
      textInputDto.text,
      textInputDto.paragraph,
      textInputDto.age,
      generateImages,
    );
    
    console.log('📤 Response ready with image URLs:', 
      response.pages.map(p => ({ page: p.page_number, hasUrl: !!p.image_url }))
    );
    
    return response;
  }
}
