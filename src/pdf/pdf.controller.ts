import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generate')
  async generatePdf(@Res() res: Response): Promise<void> {
    const documentDefinition = {
      content: [
        { text: 'Hello World!', fontSize: 16, bold: true },
        { text: 'This is a sample PDF generated with pdfmake.' },
        // Customize the content based on your data
      ],
    };

    try {
      // Create a temporary file path
      const filePath = path.join(os.tmpdir(), 'generated.pdf');

      // Generate PDF content and stream it directly to the response
      await this.pdfService.generatePdf(documentDefinition, filePath);

      // Set response headers for file download
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${encodeURIComponent('generated.pdf')}`,
      );
      res.setHeader('Content-Type', 'application/pdf');

      // Stream the file to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Remove the temporary file after streaming
      fileStream.on('close', () => {
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      res.status(500).send(`Failed to generate PDF: ${error.message}`);
    }
  }
}
