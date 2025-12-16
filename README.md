# BLR Riders - Bangalore Bike Riding Community Platform

A comprehensive Next.js application for bike riders in Bangalore to connect, share experiences, host rides, and get AI-powered assistance.

## Features

- **Community Feed**: Reddit-like post system with comments and voting
- **Ride Hosting**: Create and join bike rides with filtering and search
- **Real-time Chat**: 1-on-1 and group chat functionality
- **AI Rules Assistant**: Chatbot with knowledge base for traffic rules and safety
- **AI-Powered Features**: 
  - Smart ride recommendations based on user preferences
  - Auto-generated rides using AI
- **User Profiles**: Social features with follow/unfollow and reputation system
- **Authentication**: Secure login and registration with NextAuth.js

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Real-time**: Supabase Realtime (for chat)
- **UI**: Tailwind CSS + shadcn/ui components
- **AI**: OpenAI API
- **Background Jobs**: Node-cron

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Supabase account (for realtime chat)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blr-riders
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a secret key
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `CRON_SECRET`: Secret for cron job endpoints

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed-knowledge.ts
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
blr-riders/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Main application pages
│   └── api/             # API routes
├── components/           # React components
├── lib/                  # Utility functions and configurations
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## Key Features Implementation

### Authentication
- User registration and login
- Protected routes with middleware
- Session management with NextAuth.js

### Community Posts
- Create, read, update, delete posts
- Upvote/downvote system
- Nested comments
- Filter by community type

### Ride Management
- Create rides with details (location, date, difficulty)
- Join/leave rides
- Filter and search rides
- AI-generated ride suggestions

### Chat System
- 1-on-1 conversations
- Group chats
- Real-time messaging (polling-based, can be upgraded to WebSockets)

### AI Assistant
- Knowledge base of traffic rules and safety guidelines
- Context-aware responses using OpenAI
- Source citations

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:
- User
- Post
- Comment
- Ride
- RideParticipant
- Conversation
- Message
- RulesKnowledgeBase
- Notification
- Follow
- Vote
- Bookmark

## Deployment

1. Set up your production database
2. Configure environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Build the application: `npm run build`
5. Start the server: `npm start`

## License

MIT
