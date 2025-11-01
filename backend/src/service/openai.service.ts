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
  ): Promise<StoryResponse> {
    try {
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
      return storyResponse;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
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

