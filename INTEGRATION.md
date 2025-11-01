# Frontend-Backend Integration Guide

This document explains how the frontend and backend are connected in the HalloFright application.

## Architecture Overview

```
Frontend (Next.js)          Backend (NestJS)
Port: 3001                  Port: 3000
│                           │
├── Pages                   ├── Controllers
├── Components              ├── Services  
├── API Calls              └── DTOs
└── Type Definitions
        │
        │ HTTP POST
        ▼
    /story endpoint
```

## Data Flow

### 1. User Input Flow

**Frontend** (`app/page.tsx`):
```typescript
BookGenerationRequest {
  title: string;      // → Backend: text
  ageRange: number;   // → Backend: age
  story: string;      // → Backend: paragraph
}
```

**Transformation** in `app/page.tsx`:
```typescript
body: JSON.stringify({
  text: data.title,        // Maps title to text
  paragraph: data.story,   // Maps story to paragraph
  age: data.ageRange,      // Maps ageRange to age
})
```

### 2. Backend Processing

**Backend** (`app.controller.ts`):
- Receives `TextInputDto` with: `text`, `paragraph`, `age`
- Calls `OpenAIService.generateResponse()`
- Returns `StoryResponse` with 5 pages

**Backend** (`dto/story-response.dto.ts`):
```typescript
StoryResponse {
  story_title: string;
  target_age: number;
  style: string;
  pages: StoryPage[];  // Array of 5 pages
}

StoryPage {
  page_number: number;
  title: string;
  text: string;
  emotion: string;
  image_prompt: string;
}
```

### 3. Response Transformation

**Frontend** (`app/page.tsx`):
```typescript
BookOutput {
  id: string;              // Generated timestamp ID
  title: string;           // From story_title
  ageRange: number;        // From target_age
  generatedAt: string;     // Current timestamp
  coverImage?: string;     // undefined for now
  pages: BookPage[];       // Transformed from StoryPage[]
}

BookPage {
  pageNumber: number;      // From page_number
  content: string;         // Combined title + text
  imageUrl?: string;       // undefined for now
}
```

## API Configuration

### Frontend Configuration (`config/api.ts`)
```typescript
export const API_CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
};
```

### Environment Variables

**Backend** (`.env`):
```
OPENAI_API_KEY=your_openai_key_here
PORT=3000  # optional, defaults to 3000
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## CORS Configuration

**Backend** (`main.ts`):
```typescript
app.enableCors({
  origin: 'http://localhost:3001',  // Frontend URL
  credentials: true,
});
```

This allows the frontend running on port 3001 to make requests to the backend on port 3000.

## API Service Layer

The frontend includes a reusable API service in `lib/api.ts` that:
1. Transforms frontend types to backend types
2. Makes the HTTP request
3. Transforms backend response to frontend types
4. Handles errors

**Current Implementation**: The integration is currently in `app/page.tsx` but can be refactored to use `lib/api.ts` for better separation of concerns.

## Testing the Integration

### Manual Test
1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to http://localhost:3001
4. Fill in the form and click "Generate my Story"
5. Verify the book is generated with 5 pages

### Expected Behavior
- Loading page shows progress
- Backend receives POST request to `/story`
- OpenAI processes the request
- Frontend receives JSON response with 5 pages
- Output page displays the transformed book

## Error Handling

**Frontend Error Flow**:
```typescript
try {
  const response = await fetch(...);
  if (!response.ok) throw new Error(`Backend error: ${response.status}`);
  // Process response
} catch (error) {
  console.error("Failed to generate book:", error);
  setCurrentPage("landing");  // Return to form
}
```

**Backend Error Handling**:
- Validation errors caught by ValidationPipe
- OpenAI errors propagated as HTTP 500
- DTO validation ensures required fields

## Future Enhancements

1. **Refactor to use API service**: Move fetch logic from `app/page.tsx` to `lib/api.ts`
2. **Add retry logic**: Implement retry for transient failures
3. **Add loading states**: Show specific error messages to users
4. **Add caching**: Cache generated stories
5. **Image generation**: Implement image generation from `image_prompt`
6. **Progress updates**: Use Server-Sent Events for real-time progress

## Common Issues

### CORS Errors
**Symptom**: `Access-Control-Allow-Origin` error
**Solution**: Verify backend CORS origin matches frontend URL

### Connection Refused
**Symptom**: `fetch failed` or `ECONNREFUSED`
**Solution**: Ensure backend is running on port 3000

### OpenAI API Errors
**Symptom**: 500 error from backend
**Solution**: Check `.env` file has valid `OPENAI_API_KEY`

### Type Mismatches
**Symptom**: Runtime errors in transformation
**Solution**: Verify field mappings between frontend/backend types

## Debugging Tips

1. **Backend logs**: Check NestJS console for incoming requests
2. **Frontend console**: Check browser DevTools for fetch errors
3. **Network tab**: Inspect request/response in Chrome DevTools
4. **Backend testing**: Use Postman/curl to test `/story` endpoint directly

## Example curl Request

```bash
curl -X POST http://localhost:3000/story \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The Brave Little Hero",
    "paragraph": "Once upon a time, there was a hero...",
    "age": 5
  }'
```

