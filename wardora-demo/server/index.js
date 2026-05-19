import cors from "cors";
import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 8787;
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173" }));
app.use(express.json({ limit: "25mb" }));

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const analysisFallback = {
  styleProfile: "soft smart casual",
  bodyFitNotes: "Analiza demo: pune accent pe linii curate, proportii echilibrate si piese usor de combinat.",
  recommendedColors: ["lavanda", "alb optic", "roz pal", "burgundy"],
  colorPalette: ["#ffffff", "#efe3ff", "#7a3cc7", "#d94f9b"],
  observations: ["Poza si garderoba vor fi analizate complet dupa configurarea OPENAI_API_KEY."],
  combinations: ["Camasa alba + pantaloni wide-leg + blazer lavanda", "Cardigan roz + jeans drepti + sneakers albi"],
  compatibilityScore: 82,
  motivation: "Fallback local folosit pentru dezvoltare fara cheie OpenAI.",
};

function buildImageContent(images) {
  return images
    .filter(Boolean)
    .slice(0, 8)
    .map((imageUrl) => ({
      type: "input_image",
      image_url: imageUrl,
    }));
}

function parseOutput(response, fallback) {
  const text = response.output_text || response.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text;
  if (!text) return fallback;

  try {
    return JSON.parse(text);
  } catch {
    return { ...fallback, rawText: text };
  }
}

async function createJsonResponse({ prompt, images, schema, fallback }) {
  if (!client) return { ...fallback, source: "fallback" };

  const response = await client.responses.create({
    model,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
          ...buildImageContent(images),
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: schema.name,
        strict: true,
        schema: schema.schema,
      },
    },
  });

  return { ...parseOutput(response, fallback), source: "openai" };
}

const analysisSchema = {
  name: "wardora_analysis",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      styleProfile: { type: "string" },
      bodyFitNotes: { type: "string" },
      recommendedColors: { type: "array", items: { type: "string" } },
      colorPalette: { type: "array", items: { type: "string" } },
      observations: { type: "array", items: { type: "string" } },
      combinations: { type: "array", items: { type: "string" } },
      compatibilityScore: { type: "integer" },
      motivation: { type: "string" },
    },
    required: [
      "styleProfile",
      "bodyFitNotes",
      "recommendedColors",
      "colorPalette",
      "observations",
      "combinations",
      "compatibilityScore",
      "motivation",
    ],
  },
};

const outfitSchema = {
  name: "wardora_outfits",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      outfits: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            items: { type: "array", items: { type: "string" } },
            explanation: { type: "string" },
            vibe: { type: "string" },
            score: { type: "integer" },
            completionSuggestions: { type: "array", items: { type: "string" } },
          },
          required: ["title", "items", "explanation", "vibe", "score", "completionSuggestions"],
        },
      },
    },
    required: ["outfits"],
  },
};

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    openaiConfigured: Boolean(client),
    model,
  });
});

app.post("/api/analyze", async (request, response) => {
  try {
    const { userPhoto, wardrobeItems = [], criteria = {} } = request.body;
    const wardrobeSummary = wardrobeItems
      .map((item) => `${item.name || item.category || "haina"}: ${item.category}, ${item.color}, ${item.style}, ${item.season}, ${item.tags}`)
      .join("\n");

    const prompt = `
Esti Wardora AI Fashion Stylist. Analizeaza poza utilizatorului si hainele incarcate.
Nu identifica varsta, sexul sau trasaturi sensibile. Ofera observatii generale despre stil, proportii vizuale, cromatica si potrivirea garderobei.
Criterii utilizator: ${JSON.stringify(criteria)}
Garderoba:
${wardrobeSummary || "Nu exista haine incarcate inca."}
Returneaza doar JSON conform schemei.
`;

    const images = [userPhoto, ...wardrobeItems.map((item) => item.imageUrl || item.photo || item.dataUrl)];
    const analysis = await createJsonResponse({
      prompt,
      images,
      schema: analysisSchema,
      fallback: analysisFallback,
    });

    response.json(analysis);
  } catch (error) {
    response.status(500).json({
      ...analysisFallback,
      source: "error",
      error: error.message,
    });
  }
});

app.post("/api/generate-outfit", async (request, response) => {
  try {
    const { wardrobeItems = [], criteria = {}, analysis = {} } = request.body;
    const wardrobeSummary = wardrobeItems
      .map((item) => `${item.name || item.category || "haina"}: ${item.category}, ${item.color}, ${item.style}, ${item.season}, ${item.tags}`)
      .join("\n");

    const prompt = `
Esti Wardora AI Outfit Generator. Genereaza exact 3 outfituri folosind in primul rand hainele incarcate de utilizator.
Emotie: ${criteria.emotion}
Context: ${criteria.occasion}
Profil cumparaturi: ${criteria.audience}
Analiza stil: ${JSON.stringify(analysis)}
Garderoba:
${wardrobeSummary || "Nu exista haine incarcate; propune outfituri conceptuale si sugestii de completare."}
Fiecare outfit trebuie sa aiba lista articole, explicatie, vibe, scor 0-100 si sugestii de completare.
Returneaza doar JSON conform schemei.
`;

    const images = wardrobeItems.map((item) => item.imageUrl || item.photo || item.dataUrl);
    const data = await createJsonResponse({
      prompt,
      images,
      schema: outfitSchema,
      fallback: {
        source: "fallback",
        outfits: [
          {
            title: "Lavender Smart",
            items: ["camasa alba", "pantaloni wide-leg", "blazer lavanda"],
            explanation: "Tinuta echilibreaza eleganta si confortul pentru context smart casual.",
            vibe: "increzator si feminin",
            score: 86,
            completionSuggestions: ["geanta burgundy", "pantofi nude"],
          },
          {
            title: "Soft Casual",
            items: ["jeans drepti", "cardigan roz", "sneakers albi"],
            explanation: "Combinatie relaxata, potrivita pentru zi si vreme racoroasa.",
            vibe: "calm si relaxat",
            score: 81,
            completionSuggestions: ["esarfa satinata", "tote bag"],
          },
          {
            title: "Evening Plum",
            items: ["rochie satinata", "blazer pruna", "pantofi slingback"],
            explanation: "Look mai sofisticat pentru date night sau eveniment.",
            vibe: "romantic si elegant",
            score: 89,
            completionSuggestions: ["cercei perla", "clutch metalic"],
          },
        ],
      },
    });

    response.json(data);
  } catch (error) {
    response.status(500).json({
      source: "error",
      error: error.message,
      outfits: [],
    });
  }
});

app.listen(port, () => {
  console.log(`Wardora AI server running on http://127.0.0.1:${port}`);
});
