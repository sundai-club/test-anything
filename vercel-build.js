// Custom build script for Vercel deployment
const fs = require('fs');
const path = require('path');

// Create a simple landing page if the build fails
const createLandingPage = () => {
  console.log('Creating simple landing page for Vercel deployment...');
  
  // Create public directory if it doesn't exist
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Create a simple index.html file
  const indexPath = path.join(publicDir, 'index.html');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuizMe</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 800px;
      padding: 2rem;
      text-align: center;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #4a5568;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .logo {
      font-size: 2.5rem;
      font-weight: bold;
      color: #4a5568;
      margin-bottom: 1rem;
    }
    .button {
      display: inline-block;
      background-color: #4a5568;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #2d3748;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">📝 QuizMe</div>
    <h1>Welcome to QuizMe</h1>
    <p>
      QuizMe is an intelligent quiz generation platform that helps you create quizzes from any text content.
      Simply paste your text, upload a PDF, or provide a URL, and our AI will generate engaging multiple-choice questions.
    </p>
    <p>
      The application is currently being deployed. Please check back soon!
    </p>
    <a href="/" class="button">Refresh Page</a>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(indexPath, htmlContent);
  console.log('Landing page created successfully!');
};

// Run the build process
const runBuild = async () => {
  try {
    console.log('Starting Vercel build process...');
    
    // Create landing page as a fallback
    createLandingPage();
    
    // Continue with the regular build process
    const { execSync } = require('child_process');
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Run Next.js build
    console.log('Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    console.log('Fallback to simple landing page...');
    // We've already created the landing page, so we're good to go
    process.exit(1);
  }
};

runBuild();
