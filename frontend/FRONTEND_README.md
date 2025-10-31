# Watchful Halloween - Frontend

A Halloween-themed content validation app built with Next.js, TypeScript, and shadcn/ui components.

## 🎃 Features

- **File Upload**: Drag-and-drop interface for images and documents
- **Content Validation**: Age rating and safety score analysis
- **Book Recommendations**: Kid-friendly Halloween book suggestions
- **Beautiful UI**: Halloween-themed with dark mode support
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── validate/
│   │       └── route.ts          # API endpoint (placeholder for backend)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── progress.tsx
│   ├── FileUpload.tsx           # File upload component
│   ├── ResultsDisplay.tsx       # Validation results display
│   └── LoadingState.tsx         # Loading animation
├── lib/
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
└── public/                      # Static assets
```

## 🔧 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 🎨 Components

### FileUpload
Drag-and-drop file upload component with preview.

**Props**:
- `onFileSelect: (file: UploadFile) => void`
- `selectedFile?: UploadFile | null`
- `onClear: () => void`

### ResultsDisplay
Displays validation results with safety scores and recommendations.

**Props**:
- `result: ValidationResult`

### LoadingState
Shows animated loading state during validation.

**Props**:
- `message?: string`

## 🔌 Backend Integration

The frontend is ready for backend integration. See [`API_DOCS.md`](./API_DOCS.md) for the complete API contract.

### Quick Start for Backend Team

1. The frontend calls `POST /api/validate` with the uploaded file
2. Implement your validation logic in `/app/api/validate/route.ts`
3. Return the response in the specified format (see API_DOCS.md)

**Example**:
```typescript
// Update this in /app/api/validate/route.ts
const backendResponse = await fetch('http://your-backend-url/validate', {
  method: 'POST',
  body: formData,
});
const data = await backendResponse.json();
return NextResponse.json(data);
```

## 🎨 Customization

### Theme Colors
Edit Tailwind colors in `tailwind.config.ts` and CSS variables in `app/globals.css`.

### Halloween Theme
Current theme uses:
- Orange (#f97316) - Primary accent
- Purple (#9333ea) - Secondary accent
- Gradients for a spooky yet friendly feel

### Adding Components

```bash
# Add more shadcn components
npx shadcn@latest add [component-name]
```

## 📱 Responsive Design

The app is fully responsive:
- Mobile: Single column layout
- Tablet: Optimized spacing
- Desktop: Full-width with max-width constraints

## 🧪 Mock Data

The app includes mock data for testing without a backend:
- Automatically falls back to mock data if API is unavailable
- Shows sample validation results and book recommendations
- Useful for frontend development and demos

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Styling Issues
```bash
# Reinstall Tailwind
npm install -D tailwindcss @tailwindcss/postcss
```

### Type Errors
Check that all imports reference the correct paths defined in `tsconfig.json`.

## 📄 License

Built for Halloween Hackathon 2025 🎃

## 👥 Team

Frontend Developer: [Your Name]
Backend Team: [Backend Team Members]

---

**Happy Halloween! 👻🎃🦇**

