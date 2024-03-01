import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfMakePrinter from 'pdfmake/src/printer';

@Injectable()
export class PdfService {
  protected fonts = {
    THSarabun: {
      normal: 'src/fonts/THSarabun.ttf',
      bold: 'src/fonts/THSarabun-Bold.ttf',
      italics: 'src/fonts/THSarabun-Italic.ttf',
      bolditalics: 'src/fonts/THSarabun-Bold-Italic.ttf',
    },
  };
  async generatePdf(data: any, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const printer = new pdfMakePrinter(this.fonts);

      const documentDefinition = {
        content: [
          { text: 'Hello World! สวัสดีครับผมมมมมม', fontSize: 16, bold: true },
          { text: 'This is a sample PDF generated with pdfmake.' },
          // Customize the content based on your data
        ],
        defaultStyle: {
          font: 'THSarabun',
        },
      };

      const pdfDocGenerator = printer.createPdfKitDocument(documentDefinition);

      // Create a writable stream to store the PDF content
      const stream = fs.createWriteStream(filePath);

      // When the stream is closed (finished), resolve the promise
      stream.on('finish', () => {
        resolve();
      });

      // Handle errors during the stream
      stream.on('error', (error) => {
        reject(error);
      });

      // Finalize the PDF document and write to the stream
      pdfDocGenerator.pipe(stream);
      pdfDocGenerator.end();
    });
  }
}
