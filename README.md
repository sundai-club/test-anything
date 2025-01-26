# Learn Anything! 🚀

An interactive learning tool that automatically generates quiz questions from any text content using AI. Perfect for students, teachers, and lifelong learners.

## Features ✨

- **Instant Question Generation**: Paste any text and get intelligent multiple-choice questions
- **AI-Powered**: Utilizes GPT-4 to create relevant and challenging questions
- **Interactive Quiz Interface**: User-friendly design with immediate feedback
- **Progress Tracking**: Monitor your progress through the question set
- **Helpful Hints**: Get assistance when you're stuck on a question
- **Mobile Responsive**: Works seamlessly on all devices
- **Modern UI**: Clean, accessible interface with smooth animations

## How It Works 🛠️

1. **Input**: Paste any study material, article, or text content into the input field
2. **Generation**: Our AI analyzes the content and creates targeted multiple-choice questions
3. **Quiz**: Answer the questions one by one, with options to:
   - Submit an answer and get immediate feedback
   - View hints when needed
   - Skip questions
   - Track your progress
4. **Review**: See your performance and start over with new material

## Technology Stack 💻

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4
- **Animations**: CSS transitions
- **State Management**: React Hooks

## Getting Started
### 1. Start the Database

First, start the PostgreSQL database using Docker:

```bash
# Start the database
docker-compose up -d

# To stop the database
docker-compose down

# To view database logs
docker-compose logs -f postgres
```

The database will be available at:

- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: learn_anything

### 2. Run the Development Server
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
### 3. Install Ngrok and Set Up Clerk Webhook

Clerk uses webhooks to notify your application about authentication events. To test this locally, you need **ngrok** to expose your development server.

Follow the steps 1, 2 and 3 from this link.
https://clerk.com/docs/webhooks/sync-data

The SignIn Secret key should be set as WEBHOOK_SECRET in the environment file.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
=======
1. Fork and clone the repository:

```bash
git clone https://github.com/yourusername/learn-anything.git
```

2. Navigate to the project directory:

```bash
cd learn-anything
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Environment variables:

```bash
cp .env.example .env
```

6. Install Postgres and Start the server:

Note: these are instructions for MacOSX. If you're on Windows or Linux, you'll need to find the equivalent commands.
```bash
brew install postgresql
brew services start postgresql

Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14

```


7. Create a database user:

```bash
createuser -s postgres
```

8. Create a database:

```bash
psql -U postgres -c "CREATE DATABASE quizme;"
```

8. Migrate the database:

```bash
npx prisma migrate dev
```

9. Inspect the database:

```bash
npx prisma studio
```

10. Run the server:

```bash
npm run dev
```
