import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

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
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Extract text from all pages
    const numberOfPages = pdfDoc.getPageCount();
    let fullText = '';
    
    for (let i = 0; i < numberOfPages; i++) {
      const page = pdfDoc.getPage(i);
      const text = await page.getText();
      fullText += text + ' ';
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