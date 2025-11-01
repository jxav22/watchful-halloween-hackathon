export interface StoryPage {
  page_number: number;
  title: string;
  text: string;
  emotion: string;
  image_prompt: string;
  image_url?: string | null;
}

export interface StoryResponse {
  story_title: string;
  target_age: number;
  style: string;
  pages: StoryPage[];
}

