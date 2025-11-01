# Quick Start Guide

Get HalloFright running in 3 minutes!

## Prerequisites
- Node.js 18+
- OpenAI API Key

## Setup Steps

### 1. Backend (Terminal 1)
```bash
cd backend
npm install

# Create .env file with your OpenAI key
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# Start backend on port 3000
npm run start:dev
```

**Success**: You should see "Nest application successfully started" on port 3000

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install

# Start frontend on port 3001
npm run dev
```

**Success**: You should see "Ready on http://localhost:3001"

### 3. Test It!
1. Open http://localhost:3001 in your browser
2. Click "Create Your Book"
3. Fill in the form:
   - Title: "A Magical Adventure"
   - Age: 5
   - Story: "Once upon a time, there was a brave little dragon..."
4. Click "Generate my Story"
5. Watch the magic happen! ✨

## What Happens Behind the Scenes

```
User Form → Frontend → Backend → OpenAI → Backend → Frontend → Display
                     (port 3001→3000)    (API)          ↓
                                                   5 pages of
                                                 kid-friendly
                                                     content
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Kill the process or change backend port |
| Port 3001 in use | Change `-p 3001` to another port in `package.json` |
| CORS error | Check backend CORS origin matches frontend URL |
| OpenAI error | Verify API key in `.env` file |
| npm install fails | Delete `node_modules` and `package-lock.json`, reinstall |

## Common Commands

```bash
# Backend
npm run start:dev      # Start with auto-reload
npm run build         # Build for production
npm run test          # Run tests

# Frontend  
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Check code quality
```

## Files You'll Need

### Backend `.env`:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### Frontend `.env.local` (optional):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Next Steps

- Read `INTEGRATION.md` for detailed architecture
- Check `SETUP_COMPLETE.md` for implementation details
- See `README.md` for full documentation

---

**Ready? Let's make some kid-friendly stories! 🎃📚**

