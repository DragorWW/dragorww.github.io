import type { APIRoute } from "astro";
import { LANGUAGES } from "../constants/languages";
import { generatePDF } from "../utils/pdf-generator";

export const getStaticPaths = () => {
  return [
    { params: { lang: LANGUAGES.RU } },
    { params: { lang: LANGUAGES.EN } },
  ];
};

export const GET: APIRoute = async ({ params, request }) => {
  // Only work in dev mode
  if (import.meta.env.PROD) {
    return new Response(null, { status: 404 });
  }

  const lang = params.lang?.toLowerCase();
  if (!lang || !["ru", "en"].includes(lang)) {
    return new Response(null, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const htmlUrl = `${baseUrl}/cv_andreev_sergey_cto_${lang}`;

    const pdf = await generatePDF({ url: htmlUrl });

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="cv_andreev_sergey_cto_${lang}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response(String(error), { status: 500 });
  }
};
