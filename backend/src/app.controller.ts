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
    const response = await this.openAIService.generateResponse(
      textInputDto.text,
      textInputDto.paragraph,
      textInputDto.age,
    );
    return response;
  }
}
