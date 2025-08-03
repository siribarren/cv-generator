// analyzeCV.js - CommonJS compatible

const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeCV(cvPath, reqText) {
  const cvText = fs.readFileSync(cvPath, "utf-8");

  const prompt = `
Eres un experto en reclutamiento IT.
Analiza el siguiente CV comparándolo con el requerimiento y genera un JSON con:
{
  "nombre": "",
  "rol": "",
  "match": 0,
  "puntos_fuertes": [],
  "puntos_debiles": [],
  "resumen": [],
  "tecnologias": [],
  "habilidades": [ { "habilidad": "", "evidencia": "" } ],
  "experiencias": [ { "empresa": "", "rol": "", "periodo": "", "detalle": "" } ],
  "formacion": [],
  "cursos": []
}

Requerimiento:
${reqText}

CV:
${cvText}

Responde SOLO con el JSON válido.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content.trim();
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Error parseando JSON:", content);
    throw new Error("Respuesta no válida de OpenAI");
  }
}

module.exports = analyzeCV;
