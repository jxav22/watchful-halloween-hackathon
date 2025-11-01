/**
 * 
 *
 *    Ultra-optimized, syntax-checked prompt builder for story generation.
 *
 *Defines title, paragraph, and age cleanly and minimizes token usage.*/
export const storybookPrompt = (title: string, story: string, age: number): string => {
  return `
Create a five-page illustrated children's storybook based on the story below.

Title: "${title}"
Age: ${age} years old
Story: """${story}"""

Each page must include:
- "title": 2–5 words
- "text": 2–4 short sentences (max 70 words)
- "emotion": one simple feeling (e.g., happy, brave, curious)
- "image_prompt": a clear visual description for an illustration

Use warm, imaginative storytelling suitable for a ${age}-year-old
in New Zealand or Australia. Avoid fear, violence, or adult themes.

Keep the tone friendly and curious, encouraging themes of kindness, friendship,
and discovery.

Illustration direction:
- Disney-Pixar × Looney Toons style
- Bright colors, rounded shapes, expressive characters, playful energy.

Return JSON only in this exact format:

{
  "story_title": "${title}",
  "target_age": ${age},
  "style": "Disney-Pixar and Looney Toons inspired",
  "pages": [
    { "page_number": 1, "title": "", "text": "", "emotion": "", "image_prompt": "" },
    { "page_number": 2, "title": "", "text": "", "emotion": "", "image_prompt": "" },
    { "page_number": 3, "title": "", "text": "", "emotion": "", "image_prompt": "" },
    { "page_number": 4, "title": "", "text": "", "emotion": "", "image_prompt": "" },
    { "page_number": 5, "title": "", "text": "", "emotion": "", "image_prompt": "" }
  ]
}
`;
};
