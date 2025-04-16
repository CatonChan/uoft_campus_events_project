# UofT Campus Events Application - Project Documentation

## Project Overview

This is an AI-powered campus event discovery platform for University of Toronto students, featuring personalized recommendations for events happening around campus. The application provides a complete solution for students to discover, track, and RSVP to campus events.

## Technology Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js with Express.js 
- **Database**: In-memory storage (can be upgraded to PostgreSQL)
- **AI Integration**: OpenAI API integration for personalized recommendations
- **State Management**: React Context for authentication, @tanstack/react-query for data fetching

## Project Structure

```
├── client/                  # Frontend code
│   ├── src/                 # React source files
│   │   ├── components/      # UI components
│   │   │   ├── clubs/       # Club-related components
│   │   │   ├── events/      # Event-related components
│   │   │   ├── layouts/     # Layout components (Header, Footer)
│   │   │   ├── organizer/   # Organizer dashboard components
│   │   │   ├── recommendations/ # Recommendation components
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Main App component
│   │   ├── index.css        # Global CSS
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend code
│   ├── ai.ts                # AI recommendation functions
│   ├── index.ts             # Express server setup
│   ├── routes.ts            # API route handlers
│   ├── storage.ts           # Data storage implementation
│   └── vite.ts              # Vite server integration
├── shared/                  # Shared code between frontend and backend
│   └── schema.ts            # Database schema and types
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── theme.json               # Theme configuration
└── drizzle.config.ts        # Drizzle ORM configuration
```

## Key Features

1. **Event Discovery**: Browse and search for campus events
2. **Personalized Recommendations**: AI-powered event suggestions based on user interests and major
3. **Calendar Integration**: View events in a calendar format
4. **Club Directory**: Browse campus clubs and organizations
5. **Organizer Dashboard**: For event creators to manage their events
6. **User Authentication**: Login/signup functionality

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local server (usually http://localhost:5000)

## API Endpoints

- **GET /api/events**: Get all events
- **GET /api/events/:id**: Get a specific event
- **GET /api/events/organizer**: Get events for current organizer
- **POST /api/events/:id/rsvp**: RSVP to an event
- **GET /api/clubs**: Get all clubs
- **GET /api/clubs/recommended**: Get recommended clubs
- **POST /api/clubs/:id/follow**: Follow a club
- **GET /api/recommendations**: Get personalized event recommendations
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login a user
- **POST /api/auth/logout**: Logout a user
- **GET /api/auth/me**: Get current user info

## AI Integration

The application uses OpenAI's GPT-4o model to generate personalized event recommendations based on user profiles. The AI takes into account:

1. User interests
2. Academic major
3. Past event attendance patterns
4. Popular events among similar users

The AI integration is handled in the `server/ai.ts` file.

## Known Issues and Future Improvements

1. Authentication system needs proper integration with session storage
2. Mobile responsiveness could be enhanced
3. Calendar integration could be improved with more features
4. AI recommendations system could be enhanced with more user data
5. Add push notifications for upcoming events
6. Implement social features to see friends' attended events