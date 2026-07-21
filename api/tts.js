const MAX_TEXT_LENGTH = 12000;
const MAX_CHUNK_LENGTH = 2400;
const MAX_CHUNKS = 6;
const MIN_TEXT_LENGTH = 1;

const VOICE_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.82,
  style: 0.18,
  use_speaker_boost: true
};

function applySecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Vary", "Origin");
}

function sendJson(res, status, payload) {
  applySecurityHeaders(res);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function firstHeader(value) {
  return String(value || "").split(",")[0].trim();
}

function isSameOriginRequest(req) {
  const fetchSite = firstHeader(req.headers?.["sec-fetch-site"]);
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) return false;

  const origin = firstHeader(req.headers?.origin);
  if (!origin) return true;

  const host = firstHeader(req.headers?.["x-forwarded-host"] || req.headers?.host);
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch (_error) {
    return false;
  }
}

function acceptsJson(req) {
  const contentType = firstHeader(req.headers?.["content-type"]).toLowerCase();
  return contentType.startsWith("application/json");
}

function validateText(value) {
  if (typeof value !== "string") {
    return { ok: false, status: 400, error: "Il testo deve essere una stringa." };
  }

  const normalized = value.replace(/\u0000/g, "").replace(/[\t ]+/g, " ").trim();

  if (normalized.length < MIN_TEXT_LENGTH) {
    return { ok: false, status: 400, error: "Inserisci un testo da narrare." };
  }

  if (normalized.length > MAX_TEXT_LENGTH) {
    return { ok: false, status: 413, error: "Il testo è troppo lungo per la generazione audio." };
  }

  const controlChars = normalized.match(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g);
  if (controlChars && controlChars.length > 0) {
    return { ok: false, status: 400, error: "Il testo contiene caratteri non supportati." };
  }

  return { ok: true, text: normalized };
}

function splitTextIntoChunks(text) {
  const paragraphs = text.split(/\n{2,}/).map(part => part.trim()).filter(Boolean);
  const chunks = [];

  for (const paragraph of paragraphs.length ? paragraphs : [text]) {
    const sentences = paragraph.match(/[^.!?…]+[.!?…]+[”’'")\]]*|[^.!?…]+$/gu) || [paragraph];
    let current = "";

    for (const rawSentence of sentences) {
      const sentence = rawSentence.trim();
      if (!sentence) continue;

      if (sentence.length > MAX_CHUNK_LENGTH) {
        if (current) {
          chunks.push(current.trim());
          current = "";
        }
        for (let index = 0; index < sentence.length; index += MAX_CHUNK_LENGTH) {
          chunks.push(sentence.slice(index, index + MAX_CHUNK_LENGTH).trim());
        }
        continue;
      }

      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length > MAX_CHUNK_LENGTH) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current = candidate;
      }
    }

    if (current) chunks.push(current.trim());
  }

  return chunks.filter(Boolean);
}

async function synthesizeChunk({ apiKey, voiceId, text }) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: VOICE_SETTINGS
    })
  });

  if (!response.ok) throw new Error("TTS_PROVIDER_ERROR");
  return Buffer.from(await response.arrayBuffer());
}

export default async function handler(req, res) {
  try {
    applySecurityHeaders(res);

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return sendJson(res, 405, { error: "Metodo non consentito. Usa POST." });
    }

    if (!isSameOriginRequest(req)) {
      return sendJson(res, 403, { error: "Richiesta non autorizzata." });
    }

    if (!acceptsJson(req)) {
      return sendJson(res, 415, { error: "Formato della richiesta non supportato." });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      return sendJson(res, 503, { error: "Voce narrante non configurata." });
    }

    const validation = validateText(req.body?.text);
    if (!validation.ok) {
      return sendJson(res, validation.status, { error: validation.error });
    }

    const chunks = splitTextIntoChunks(validation.text);
    if (!chunks.length || chunks.length > MAX_CHUNKS || chunks.some(chunk => chunk.length > MAX_CHUNK_LENGTH)) {
      return sendJson(res, 400, { error: "Il testo non può essere preparato per l’audio." });
    }

    const buffers = [];
    for (const chunk of chunks) {
      buffers.push(await synthesizeChunk({ apiKey, voiceId, text: chunk }));
    }

    applySecurityHeaders(res);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("X-Fablea-TTS-Chunks", String(chunks.length));
    return res.status(200).send(Buffer.concat(buffers));
  } catch (error) {
    const status = error.message === "TTS_PROVIDER_ERROR" ? 502 : 500;
    return sendJson(res, status, { error: "Voce narrante temporaneamente non disponibile." });
  }
}

export { acceptsJson, isSameOriginRequest, splitTextIntoChunks, validateText };
