import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './service/openai.service';
import { TextInputDto } from './dto/text-input.dto';

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
  async getOpenAIResponse(@Body() textInputDto: TextInputDto): Promise<{ response: string }> {
    const response = await this.openAIService.generateResponse(textInputDto.text);
    return { response };
  }
}
