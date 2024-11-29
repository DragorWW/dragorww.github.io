import type { AstroIntegration } from "astro";
import fs from "fs/promises";
import path from "path";
import puppeteer, {
  type Browser,
  type PDFOptions as PuppeteerPDFOptions,
  type WaitForOptions,
  type PaperFormat,
} from "puppeteer";
import { bold, dim, green, red, gray, bgGreen, blue } from "kleur/colors";
import { performance } from "perf_hooks";

// Константы
const DEFAULT_PDF_OPTIONS: PuppeteerPDFOptions = {
  format: "a4",
  margin: {
    top: "20mm",
    bottom: "20mm",
    left: "15mm",
    right: "15mm",
  },
  printBackground: true,
  preferCSSPageSize: true,
};

const VIEWPORT_CONFIG = {
  width: 2480,
  height: 3508,
  deviceScaleFactor: 2,
} as const;

const BROWSER_CONFIG = {
  headless: true,
} as const;

const PAGE_NAVIGATION_OPTIONS: WaitForOptions = {
  waitUntil: ["networkidle0", "domcontentloaded"],
  timeout: 30000,
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 секунда

// Интерфейсы
interface GeneratePDFOptions {
  url: string;
  format?: PaperFormat;
  margin?: typeof DEFAULT_PDF_OPTIONS.margin;
  outputPath?: string;
}

// Синглтон для браузера
let browserInstance: Browser | null = null;

async function getBrowserWithRetry(retries = MAX_RETRIES): Promise<Browser> {
  try {
    if (!browserInstance || !browserInstance.connected) {
      if (browserInstance) {
        try {
          await browserInstance.close();
        } catch (e) {
          console.warn("Failed to close existing browser instance:", e);
        }
        browserInstance = null;
      }

      browserInstance = await puppeteer.launch({
        ...BROWSER_CONFIG,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });
    }
    return browserInstance;
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `Browser launch failed, retrying... (${retries} attempts left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return getBrowserWithRetry(retries - 1);
    }
    throw error;
  }
}

// Основная функция генерации PDF
export async function generatePDF({
  url,
  format = DEFAULT_PDF_OPTIONS.format,
  margin = DEFAULT_PDF_OPTIONS.margin,
  outputPath,
}: GeneratePDFOptions): Promise<Buffer> {
  let page = null;
  let retries = MAX_RETRIES;

  while (retries > 0) {
    try {
      const browser = await getBrowserWithRetry();
      page = await browser.newPage();

      await page.setViewport(VIEWPORT_CONFIG);
      await page.goto(url, PAGE_NAVIGATION_OPTIONS);

      // Ждем загрузки шрифтов
      await page.evaluateHandle("document.fonts.ready");

      const pdfOptions: PuppeteerPDFOptions = {
        ...DEFAULT_PDF_OPTIONS,
        format,
        margin,
      };

      const pdf = await page.pdf(pdfOptions);

      if (outputPath) {
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, pdf);
      }

      return Buffer.from(pdf);
    } catch (error) {
      retries--;
      console.error(`PDF generation failed, ${retries} retries left:`, error);

      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.warn("Failed to close page:", e);
        }
      }

      if (retries <= 0) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }

  throw new Error("Failed to generate PDF after all retries");
}

// Middleware для обработки PDF запросов
const createPdfMiddleware = (urls: string[]) => {
  return async (req: any, res: any, next: any) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const isPdfRequest = urls.some(
      (pdfUrl) => url.pathname === `${pdfUrl}.pdf`,
    );

    if (!isPdfRequest) return next();

    try {
      const htmlUrl = `http://${req.headers.host}${url.pathname.replace(".pdf", "")}`;
      const pdf = await generatePDF({
        url: htmlUrl,
        ...DEFAULT_PDF_OPTIONS,
      });

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

function getFormattedTime() {
  return gray(new Date().toLocaleTimeString("ru-RU", { hour12: false }));
}

// Функция для генерации PDF в процессе сборки
async function generatePDFsAtBuild(urls: string[], dir: URL) {
  const startTime = performance.now();
  console.log(`\n${bgGreen(" generating PDFs ")}`);

  try {
    for (const url of urls) {
      const startUrlTime = performance.now();
      const htmlPath = path.join(dir.pathname, url, "index.html");
      const pdfPath = path.join(dir.pathname, `${url}.pdf`);

      try {
        console.log(`${getFormattedTime()}${green(" ▶ ")}src/pages${url}`);
        await fs.access(htmlPath);
        await generatePDF({
          url: `file://${htmlPath}`,
          outputPath: pdfPath,
        });

        const duration = Math.round(performance.now() - startUrlTime);

        console.log(
          `${getFormattedTime()}${blue("   └─ ")}${gray(path.basename(pdfPath))} ${dim(`(+${duration}ms)`)}`,
        );
      } catch (err) {
        console.log(
          `${getFormattedTime()}   ${red("└─")} ${path.basename(pdfPath)} ${dim("(failed)")}`,
        );
        console.warn(
          `${getFormattedTime()}     ${red("⚠")} Error: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    const totalDuration = Math.round(performance.now() - startTime);
    console.log(
      `${getFormattedTime()} ${green("✓")} ${green(`Completed in ${totalDuration}ms.`)}\n`,
    );
  } catch (error) {
    console.error(
      `${getFormattedTime()} ${red("✗")} ${bold("PDF generation failed")}`,
    );
    if (error instanceof Error) {
      console.error(`${getFormattedTime()}   ${red(error.message)}`);
    }
  } finally {
    await closeBrowser();
  }
}

// Обновляем функцию закрытия браузера
async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    try {
      await browserInstance.close();
    } catch (e) {
      console.warn("Error closing browser:", e);
    } finally {
      browserInstance = null;
    }
  }
}

// Интеграция Astro
export default function pdf(urls: string[]): AstroIntegration {
  return {
    name: "PDF",
    hooks: {
      "astro:server:setup": async ({ server }) => {
        await getBrowserWithRetry();
        server.middlewares.use(createPdfMiddleware(urls));
      },
      "astro:build:done": async ({ dir }) => {
        await generatePDFsAtBuild(urls, dir);
      },
      "astro:server:done": closeBrowser,
    },
  };
}
