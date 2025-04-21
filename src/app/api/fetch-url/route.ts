import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';

async function checkRobotsTxt(url: string) {
  try {
    const parsedUrl = new URL(url);
    const robotsTxtUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/robots.txt`;
    const response = await fetch(robotsTxtUrl, { 
      headers: { 'User-Agent': 'QuizMeBot/1.0' },
      cache: 'no-store'
    });
    const robotsTxt = await response.text();
    const robots = robotsParser(robotsTxtUrl, robotsTxt);
    
    return robots.isAllowed(url);
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    return true; // If we can't check robots.txt, we'll assume it's allowed
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('Fetching content from URL:', url);

    // Check if scraping is allowed
    const isAllowed = await checkRobotsTxt(url);
    
    if (!isAllowed) {
      return NextResponse.json({
        error: 'This website does not allow content scraping. Please try generating a PDF of the content instead.',
        type: 'SCRAPING_BLOCKED'
      }, { status: 403 });
    }

    // Fetch the webpage with improved headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return NextResponse.json({
        error: 'URL does not point to an HTML page. Only HTML pages are supported.',
        type: 'UNSUPPORTED_CONTENT'
      }, { status: 415 });
    }

    const html = await response.text();

    // Parse the HTML and extract text content
    const $ = cheerio.load(html);

    // Remove script tags, style tags, and comments
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    $('iframe').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();
    $('aside').remove();
    $('svg').remove();
    $('form').remove();
    $('.cookie-banner, .ad, .ads, .advertisement').remove();

    // Get the page title
    const title = $('title').text().trim();

    // Extract text from body, focusing on content areas
    let content = '';
    
    // Try to get content from main content areas first
    const mainContent = $('article, main, .content, #content, .post, #main, .article, .entry-content, .post-content')
      .text()
      .replace(/\s+/g, ' ')
      .trim();
    
    if (mainContent && mainContent.length > 100) {
      content = mainContent;
    } else {
      // If no specific content areas, get paragraphs
      const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
      content = paragraphs.join(' ').replace(/\s+/g, ' ').trim();
      
      // If still no content, get all body text
      if (!content || content.length < 100) {
        content = $('body')
          .text()
          .replace(/\s+/g, ' ')
          .trim();
      }
    }

    // Add title to the beginning if available
    const finalContent = title ? `${title}\n\n${content}` : content;
    
    if (!finalContent || finalContent.length < 50) {
      return NextResponse.json({
        error: 'Could not extract meaningful content from the URL',
        type: 'NO_CONTENT'
      }, { status: 422 });
    }

    // Truncate content if it's too long (OpenAI has token limits)
    // A safe limit is around 12000 characters (approximately 3000 tokens)
    const MAX_CONTENT_LENGTH = 12000;
    let truncatedContent = finalContent;
    let wasTruncated = false;
    
    if (finalContent.length > MAX_CONTENT_LENGTH) {
      // Keep the title and beginning of the content
      const titlePart = title ? `${title}\n\n` : '';
      const contentWithoutTitle = title ? finalContent.substring(title.length + 2) : finalContent;
      
      // Take first part of the content
      truncatedContent = titlePart + contentWithoutTitle.substring(0, MAX_CONTENT_LENGTH - titlePart.length - 100);
      truncatedContent += '\n\n[Content truncated due to length limitations]';
      wasTruncated = true;
      
      console.log(`Content truncated from ${finalContent.length} to ${truncatedContent.length} characters`);
    }

    console.log('Successfully extracted content from URL, length:', truncatedContent.length);
    
    return NextResponse.json({ 
      content: truncatedContent,
      wasTruncated: wasTruncated
    });

  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch URL content' },
      { status: 500 }
    );
  }
}