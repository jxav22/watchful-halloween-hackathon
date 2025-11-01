# API Documentation for Backend Integration

## Overview

This document describes the API contract between the frontend and backend services for the Watchful Halloween content validation app.

## Endpoint: POST `/api/validate`

### Purpose
Validates uploaded content (images or documents) for age-appropriateness and returns kid-friendly book recommendations.

### Request

**URL**: `/api/validate`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`

**Body Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | The uploaded file (image or PDF document) |

**Supported File Types**:
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Documents: `application/pdf`, `.doc`, `.docx`

**Example Request**:
```javascript
const formData = new FormData();
formData.append('file', fileObject);

const response = await fetch('/api/validate', {
  method: 'POST',
  body: formData,
});
```

### Response

**Success Response** (200 OK):

```typescript
{
  success: boolean;
  fileId: string;
  validation: {
    isApproved: boolean;           // Whether content is kid-friendly
    ageRating: string;              // e.g., "3+", "7+", "13+"
    safetyScore: number;            // 0-100 score
    contentWarnings: string[];      // List of warnings
    analysis?: {
      hasViolence?: boolean;
      hasScaryContent?: boolean;
      hasInappropriateContent?: boolean;
    };
    recommendations?: Array<{
      id: string;
      title: string;
      author?: string;
      ageRange: string;
      description: string;
      coverUrl?: string;
      halloweenThemed: boolean;
    }>;
  };
  message?: string;
}
```

**Example Success Response**:
```json
{
  "success": true,
  "fileId": "file-1698765432000",
  "validation": {
    "isApproved": true,
    "ageRating": "7+",
    "safetyScore": 85,
    "contentWarnings": ["Contains mild spooky imagery"],
    "analysis": {
      "hasViolence": false,
      "hasScaryContent": true,
      "hasInappropriateContent": false
    },
    "recommendations": [
      {
        "id": "1",
        "title": "Room on the Broom",
        "author": "Julia Donaldson",
        "ageRange": "4-8 years",
        "description": "A friendly witch and her cat share their broomstick with some unlikely friends.",
        "coverUrl": "https://example.com/cover.jpg",
        "halloweenThemed": true
      }
    ]
  },
  "message": "Content validated successfully"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "No file provided"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Validation failed"
}
```

## Implementation Notes

### For Backend Team

1. **File Processing**:
   - Parse the multipart/form-data request
   - Extract the uploaded file
   - Validate file type and size (recommended max: 10MB)

2. **Content Analysis**:
   - Use AI/ML models to analyze image content
   - For documents, extract and analyze text content
   - Assess for violence, scary content, and inappropriate material

3. **Age Rating Logic**:
   - Determine appropriate age rating based on content
   - Common ratings: "3+", "5+", "7+", "10+", "13+"

4. **Safety Score Calculation**:
   - Score from 0-100
   - Higher score = safer content
   - Suggested thresholds:
     - 80-100: Very safe
     - 60-79: Moderately safe
     - 0-59: Potentially inappropriate

5. **Book Recommendations**:
   - Based on content themes and age appropriateness
   - Prioritize Halloween-themed books
   - Include cover images when available

### TypeScript Types

The TypeScript types are available in `/types/index.ts`:
- `UploadFile`
- `ValidationResult`
- `BookRecommendation`
- `UploadResponse`

## Testing

### Mock Data
The frontend currently falls back to mock data if the API is not available. You can test the frontend independently before backend integration.

### Integration Testing
Once your backend is ready:
1. Update the API endpoint in `/app/api/validate/route.ts`
2. Test with various file types
3. Verify response format matches the contract

## Questions?

If you have questions about the API contract or need adjustments, please coordinate with the frontend team.

