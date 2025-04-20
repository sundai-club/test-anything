# QuizMe 🧠

An interactive learning tool that automatically generates quiz questions from any text content using AI. Perfect for students, teachers, and lifelong learners.

## Features ✨

- **Instant Question Generation**: Paste any text and get intelligent multiple-choice questions
- **AI-Powered**: Utilizes GPT-4 Turbo to create relevant and challenging questions
- **Interactive Quiz Interface**: User-friendly design with immediate feedback
- **Progress Tracking**: Monitor your progress through the question set
- **Helpful Hints**: Get assistance when you're stuck on a question
- **Mobile Responsive**: Works seamlessly on all devices
- **Modern UI**: Clean, accessible interface with smooth animations
- **URL Content Extraction**: Generate quizzes directly from web pages
- **User Authentication**: Secure login and user-specific quiz history
- **Community Quizzes**: Explore and attempt quizzes created by other users

## How It Works 🛠️

1. **Input**: Paste any study material, article, or text content into the input field, or provide a URL
2. **Generation**: Our AI analyzes the content and creates targeted multiple-choice questions
3. **Quiz**: Answer the questions one by one, with options to:
   - Submit an answer and get immediate feedback
   - View hints when needed
   - Skip questions
   - Track your progress
4. **Review**: See your performance and start over with new material
5. **Share**: Your quizzes are saved to your account and can be shared with the community

## Technology Stack 💻

- **Frontend**: Next.js 15.0.3 with TypeScript and React 18
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL (containerized with Docker)
- **AI Integration**: OpenAI GPT-4 Turbo
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Web Scraping**: Cheerio for URL content extraction

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- Docker and Docker Compose
- OpenAI API key
- Clerk account and API keys

### Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with the following variables:

```
# OpenAI API key for generating quizzes
OPENAI_API_KEY=your_openai_api_key

# PostgreSQL database connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/learn_anything

# Clerk authentication keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

#### Environment Variables Explained

- **OPENAI_API_KEY**: Required for the AI-powered quiz generation. You can obtain this from the [OpenAI platform](https://platform.openai.com/).
- **DATABASE_URL**: Connection string for the PostgreSQL database. The format is: `postgresql://[user]:[password]@[host]:[port]/[database]`
  - For local development with Docker, use: `postgresql://postgres:postgres@localhost:5432/learn_anything`
  - For production, use your hosted PostgreSQL database URL
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Public key for Clerk authentication, used on the client-side
- **CLERK_SECRET_KEY**: Secret key for Clerk authentication, used on the server-side

> **Important Security Note**: Never commit your `.env.local` file to version control. It contains sensitive API keys and credentials. The repository's `.gitignore` file should already exclude this file.

### 1. Docker Setup for Database

The application uses PostgreSQL in Docker for local development. Here's how to set it up:

```bash
# Start the database containers
docker-compose up -d
```

This command starts two containers:
- `postgres`: The main PostgreSQL database server
- `backup`: A service that creates regular backups of the database

To verify the containers are running:

```bash
docker ps
```

You should see output similar to:
```
CONTAINER ID   IMAGE             COMMAND                   STATUS                    PORTS                    NAMES
bd8640303c5d   postgres:latest   "bash -c '\n  while t…"   Up 27 minutes             5432/tcp                 test-anything-backup-1
f0d97b285653   postgres:latest   "docker-entrypoint.s…"    Up 27 minutes (healthy)   0.0.0.0:5432->5432/tcp   test-anything-postgres-1
```

The database will be available at:

- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: learn_anything

To view database logs:
```bash
docker-compose logs -f postgres
```

To stop the database:
```bash
docker-compose down
```

### 2. Initialize the Database

After starting the Docker containers, you need to initialize the database with the Prisma schema:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (explicitly setting the DATABASE_URL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learn_anything" npx prisma migrate dev
```

This will create all necessary tables in the PostgreSQL database.

To inspect the database with Prisma Studio:
```bash
npx prisma studio
```

### 3. Run the Development Server

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 4. Complete Local Deployment

For a complete local deployment, follow these steps:

1. Ensure Docker containers are running:
   ```bash
   docker ps
   ```

2. If containers are not running, start them:
   ```bash
   docker-compose up -d
   ```

3. Verify database connection:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learn_anything" npx prisma db push
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Verify the application is running by visiting:
   - Main application: [http://localhost:3000](http://localhost:3000)
   - Prisma Studio (optional): [http://localhost:5555](http://localhost:5555) (after running `npx prisma studio`)

### 5. Set Up Clerk Webhook (Optional for Local Development)

Clerk uses webhooks to notify your application about authentication events. To test this locally, you need **ngrok** to expose your development server.

1. Install ngrok: https://ngrok.com/download
2. Start ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```
3. Configure the webhook in your Clerk dashboard using the ngrok URL
4. Set the webhook secret in your `.env.local` file:
   ```
   WEBHOOK_SECRET=your_webhook_secret
   ```

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

If you encounter database connection errors:

1. Ensure Docker containers are running:
   ```bash
   docker ps
   ```
2. Verify the DATABASE_URL in your environment variables
3. Run migrations explicitly with the DATABASE_URL:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learn_anything" npx prisma migrate dev
   ```

#### Authentication Errors

If you encounter authentication issues:

1. Check that your Clerk API keys are correct in `.env.local`
2. Ensure the middleware configuration is correct in `src/middleware.ts`
3. Clear browser cookies and local storage

#### API Errors

If you encounter API errors:

1. Check the server logs for detailed error messages
2. Ensure the database tables exist by running migrations
3. Verify that the OpenAI API key is valid

## Deployment

### Deploying to Vercel

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Import your repository in the Vercel dashboard

3. Configure the following environment variables in Vercel:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (use a production PostgreSQL database)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

4. Deploy the application

## Project Structure

```
/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   ├── lib/               # Utility functions and libraries
│   ├── providers/         # React context providers
│   └── middleware.ts      # Authentication middleware
├── .env.local             # Environment variables (local)
├── docker-compose.yaml    # Docker configuration
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel deployment configuration
└── vercel-build.js        # Custom build script for Vercel
```

## Recent Fixes and Improvements

### Database Configuration
- Fixed PostgreSQL connection issues in Docker
- Added proper initialization of database tables via Prisma migrations
- Ensured correct environment variable handling for database connections

### Authentication
- Simplified Clerk middleware configuration for better compatibility
- Added automatic user creation when a new user logs in
- Fixed authentication flow for protected routes

### Error Handling
- Improved error handling in API routes
- Added graceful fallbacks for missing data
- Enhanced user feedback for error states

### Deployment
- Added custom Vercel build script for better deployment compatibility
- Configured Vercel with legacy peer dependencies flag
- Created fallback landing page for deployment issues

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
