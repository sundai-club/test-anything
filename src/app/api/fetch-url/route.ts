import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await fetch(url);
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

    // Extract text from body, focusing on content areas
    const content = $('article, main, .content, #content, .post, #main')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    // If no content found in specific areas, get all body text
    const finalContent = content || $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    return NextResponse.json({ content: finalContent });

  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL content' },
      { status: 500 }
    );
  }
} 