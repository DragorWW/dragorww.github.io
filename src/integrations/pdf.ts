import type { AstroIntegration } from "astro";
import fs from "fs/promises";
import path from "path";
import puppeteer, { type Browser } from "puppeteer";

interface PDFOptions {
  url: string;
  format?: "a4";
  margin?: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  outputPath?: string;
}

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: "new",
    });
  }
  return browserInstance;
}

export async function generatePDF({
  url,
  format = "a4",
  margin = {
    top: "20mm",
    bottom: "20mm",
    left: "15mm",
    right: "15mm",
  },
  outputPath,
}: PDFOptions): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport to A4
    await page.setViewport({
      width: 2480,
      height: 3508,
      deviceScaleFactor: 2,
    });

    // Navigate to URL
    await page.goto(url, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    // Generate PDF
    const pdf = await page.pdf({
      format,
      printBackground: true,
      margin,
      preferCSSPageSize: true,
    });

    // If output path is specified, save the file
    if (outputPath) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, pdf);
    }

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

// Добавляем middleware для обработки PDF запросов
const devPdfMiddleware = function (urls: string[]) {
  return async (req: any, res: any, next: any) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);

    // Проверяем, является ли запрос запросом PDF
    const isPdfRequest = urls.some(
      (pdfUrl) => url.pathname === `/${pdfUrl}.pdf`,
    );

    if (!isPdfRequest) {
      return next();
    }

    try {
      // Получаем соответствующий HTML URL
      const htmlUrl = `http://${req.headers.host}${url.pathname.replace(".pdf", "")}`;

      // Генерируем PDF
      const pdf = await generatePDF({
        url: htmlUrl,
        format: "a4",
        margin: {
          top: "20mm",
          bottom: "20mm",
          left: "15mm",
          right: "15mm",
        },
      });

      // Отправляем PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${path.basename(url.pathname)}"`,
      );
      res.end(pdf);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.statusCode = 500;
      res.end("Error generating PDF");
    }
  };
};
export default function pdfIntegration(urls: string[]): AstroIntegration {
  return {
    name: "PDF",
    hooks: {
      "astro:server:setup": async ({ server }) => {
        await getBrowser();

        server.middlewares.use(devPdfMiddleware(urls));
      },
      "astro:build:done": async ({ dir }) => {
        console.log("📄 Generating PDF versions of CV...");

        try {
          for (const url of urls) {
            const htmlPath = path.join(dir.pathname, url, "index.html");
            const pdfPath = path.join(dir.pathname, `${url}.pdf`);

            try {
              // Check if the HTML file exists
              await fs.access(htmlPath);

              // Generate PDF
              await generatePDF({
                url: `file://${htmlPath}`,
                outputPath: pdfPath,
              });

              console.log(`✅ Generated PDF: ${pdfPath}`);
            } catch (err) {
              console.warn(`⚠️ Error processing ${url}:`, err);
              continue;
            }
          }

          console.log("✨ PDF generation complete!");
        } catch (error) {
          console.error("❌ Error generating PDFs:", error);
        } finally {
          // Закрываем браузер после генерации всех PDF
          if (browserInstance) {
            await browserInstance.close();
            browserInstance = null;
          }
        }
      },
      "astro:server:done": async () => {
        // Закрываем браузер при остановке сервера
        if (browserInstance) {
          await browserInstance.close();
          browserInstance = null;
        }
      },
    },
  };
}
