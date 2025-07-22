# Horoscope Submission Application

## Overview

This is a full-stack web application built with Express.js backend and React frontend that allows users to submit their horoscope sign and mood information. The application collects user data, stores it, and forwards submissions to a Make.com webhook for further processing. It features a modern UI built with shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client-side application
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for server state management and API calls
- **React Hook Form** with Zod validation for form handling
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with CSS variables for theming

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with `/api/submissions` endpoint
- **In-memory storage** using a custom MemStorage class (temporary storage solution)
- **Webhook integration** to forward submissions to Make.com
- **Zod validation** for request/response schemas
- **Drizzle ORM** configuration (ready for PostgreSQL integration)

### Development Setup
- **Monorepo structure** with shared types and schemas
- **Hot reload** in development with Vite integration
- **TypeScript** throughout the entire stack
- **ESBuild** for production server bundling

## Key Components

### Data Models
- **Submissions**: Contains email, horoscope sign, mood, and timestamp
- **Horoscope Signs**: Predefined list of 12 zodiac signs with emoji symbols
- **Validation**: Zod schemas for type safety and runtime validation

### API Endpoints
- `POST /api/submissions`: Accepts user submissions, validates data, stores locally, and forwards to webhook

### Frontend Pages
- **Home Page**: Main form for collecting user data with horoscope sign selection and mood input
- **404 Page**: Simple not found page with helpful messaging

### UI Components
- Complete shadcn/ui component library including forms, buttons, cards, dialogs, etc.
- Custom form validation with error messaging
- Success/error state handling with smooth scrolling
- Mobile-responsive design

## Data Flow

1. User fills out the form on the home page with email, horoscope sign, and mood
2. Frontend validates data using Zod schemas
3. Form submission triggers API call to `/api/submissions`
4. Backend validates request and stores submission in memory
5. Backend forwards data to configured Make.com webhook
6. Success/error response returned to frontend
7. UI updates with appropriate feedback message

## External Dependencies

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL driver for future database integration
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **@radix-ui/***: Accessible UI primitives
- **drizzle-orm**: Type-safe database operations
- **zod**: Runtime type validation
- **date-fns**: Date manipulation utilities
- **wouter**: Lightweight routing

### Development Tools
- **Vite**: Build tool with hot reload
- **TypeScript**: Static typing
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing
- **ESBuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using ESBuild
3. Static assets served by Express in production

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection (currently optional)
- `MAKE_WEBHOOK_URL` or `WEBHOOK_URL`: Make.com webhook endpoint
- `NODE_ENV`: Environment flag for development/production

### Production Setup
- Express serves both API routes and static frontend assets
- Single-process deployment with built-in static file serving
- Ready for database migration from in-memory to PostgreSQL using Drizzle

### Database Migration Path
The application is structured to easily migrate from in-memory storage to PostgreSQL:
- Drizzle configuration already in place
- Schema definitions ready for database deployment
- Storage interface allows swapping implementations without code changes

## Recent Changes

### July 22, 2025 - Webhook Integration Completed
- Successfully integrated Make.com webhook functionality
- Fixed webhook URL parsing to handle Make.com format (token@hook.region.make.com)
- Replaced fetch with axios to resolve URL credential parsing issues
- Added proper error handling and logging for webhook requests
- Webhook now successfully sends user submissions to Make.com
- Confirmed working with clean JSON payload format sending email, horoscope_sign, and mood fields