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

## Getting Started 🚀

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
