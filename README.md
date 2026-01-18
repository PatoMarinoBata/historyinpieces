# History in Pieces

A portfolio project for tracking the ownership history and details of historic collectibles. Built with Next.js 16, Prisma, PostgreSQL, and NextAuth.

## Features

- **Admin Dashboard**: Manage historic pieces, upload images, and track ownership history (admin only)
- **Public Gallery**: Browse all collectible pieces with detailed information
- **Authentication**: Secure login for admin operations
- **Dark Mode UI**: Modern dark theme across the application
- **Image Management**: Upload and manage images for each piece
- **Ownership Tracking**: Record and display the history of previous owners

## Tech Stack

- **Frontend**: Next.js 16 with React 19, Tailwind CSS
- **Backend**: Next.js API routes, NextAuth v5 for authentication
- **Database**: PostgreSQL via Neon, managed with Prisma ORM
- **Styling**: Tailwind CSS v3 with dark mode
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites
- Node.js v24+
- PostgreSQL database (Neon recommended)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/PatoMarinoBata/historyinpieces.git
cd historyinpieces
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (`.env`):
```
DATABASE_URL=your_postgresql_url
AUTH_SECRET=your_secret_key
```

4. Push Prisma schema:
```bash
npx prisma db push
```

5. Seed the database:
```bash
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

Or use the provided batch file:
```bash
start-dev.bat
```

Visit `http://localhost:3000` to see the application.

## Admin Access

- **Email**: `admin@example.com`
- **Password**: `test123`

## Database Management

Use Prisma Studio for visual database management:
```bash
npx prisma studio
```

Opens at `http://localhost:5555`

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/app/admin` - Admin dashboard pages
- `/src/app/auth` - Authentication pages
- `/src/app/api` - API endpoints and authentication handlers
- `/prisma` - Database schema and seeding scripts
- `/src/lib` - Utility functions and Prisma client

## Development

The project uses:
- Next.js Turbopack for fast development
- Tailwind CSS for styling
- Prisma for type-safe database access
- NextAuth for authentication

## Future Features

- Custom admin panel with next-admin integration
- Public gallery with search and filtering
- Advanced piece details and history timeline
- Image gallery and zoom functionality

## Notes

- Dark mode is enabled globally
- Admin interface currently uses Prisma Studio for data management
- Next.js 16 with Turbopack provides fast hot-reload development

## License

MIT

