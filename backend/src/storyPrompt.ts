/**
 * 
 *
 *    Ultra-optimized, syntax-checked prompt builder for story generation.
 *
 *Defines title, paragraph, and age cleanly and minimizes token usage.*/
export const storybookPrompt = (title: string, story: string, age: number, character?: string): string => {
  return `
Write a five-page story for a ${age}-year-old child.

Use very simple words so the child can read alone.

Title: "${title}"
Story: """${story}"""

Each page must have:
- title (2–4 easy words)
- text (2–3 short sentences)
- emotion (happy, brave, silly, etc.)
- image_prompt (same main character and setting each page)

Tone: fun, kind, gentle.

Keep story simple and warm.

Art style:
- Disney-Pixar × Looney Toons
- Keep the same character look and colors in every image
- The same child or animal should appear throughout the story
${character ? `Use this character as the main one: ${character}` : ''}

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
