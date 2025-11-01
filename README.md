# watchful-halloween-hackathon

## HalloFright - Transform Horror Stories into Kid-Friendly Books

Transform any story into an enchanting, age-appropriate children's book with AI-powered content validation and beautiful illustrations.

### Project Structure

- `frontend/` - Next.js application (port 3001)
- `backend/` - NestJS API server (port 3000)

### Quick Start

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API Key

#### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd watchful-halloween-hackathon
```

2. **Backend Setup**
```bash
cd backend
npm install
# Create .env file
echo "OPENAI_API_KEY=your_openai_key_here" > .env
npm run start:dev
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
# Create .env.local file (optional, defaults to localhost:3000)
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3000" > .env.local
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### How to Use

1. Click "Create Your Book" on the home page
2. Enter your story details:
   - Title
   - Age range (3-18 years)
   - Story text (max 3000 characters)
3. Click "Generate my Story"
4. View your transformed kid-friendly book!

### Development

#### Running Both Services Together
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### API Endpoints

**POST** `/story`
- Request: `{ text: string, paragraph: string, age: number }`
- Response: StoryResponse with 5 pages of kid-friendly content

### Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, TypeScript
- **Backend**: NestJS, OpenAI API, TypeScript
- **AI**: GPT-3.5-turbo for content transformation

### Links

- Discord: https://discord.gg/qwJJK72F
- Trello Board: https://trello.com/invite/b/69053746c31caf4bb0fa76f9/ATTI48635eec43f62551e9170502b70ffc9fF54ED05F/watchful-halloween-hackathon
- Workflow: https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
