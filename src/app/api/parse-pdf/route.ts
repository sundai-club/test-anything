import { NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Initialize PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    // Load document
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdfDoc = await loadingTask.promise;
    
    // Extract text from all pages
    const numberOfPages = pdfDoc.numPages;
    let fullText = '';
    
    for (let i = 1; i <= numberOfPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => 'str' in item ? item.str : '')
        .join(' ');
      fullText += pageText + ' ';
    }

    // Clean up the text
    const cleanText = fullText
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000); // Limit content length if needed

    return NextResponse.json({ content: cleanText });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF file' },
      { status: 500 }
    );
  }
} 