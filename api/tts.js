const MAX_TEXT_LENGTH = 12000;
const MAX_CHUNK_LENGTH = 2400;
const MIN_TEXT_LENGTH = 1;

const VOICE_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.82,
  style: 0.18,
  use_speaker_boost: true
};

function sendJson(res, status, payload) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
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

    if (current) {
      chunks.push(current.trim());
    }
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

  if (!response.ok) {
    throw new Error("TTS_PROVIDER_ERROR");
  }

  return Buffer.from(await response.arrayBuffer());
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return sendJson(res, 405, { error: "Metodo non consentito. Usa POST." });
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
    if (!chunks.length || chunks.some(chunk => chunk.length > MAX_CHUNK_LENGTH)) {
      return sendJson(res, 400, { error: "Il testo non può essere preparato per l’audio." });
    }

    const buffers = [];
    for (const chunk of chunks) {
      buffers.push(await synthesizeChunk({ apiKey, voiceId, text: chunk }));
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Fablea-TTS-Chunks", String(chunks.length));
    return res.status(200).send(Buffer.concat(buffers));
  } catch (error) {
    const status = error.message === "TTS_PROVIDER_ERROR" ? 502 : 500;
    return sendJson(res, status, { error: "Voce narrante temporaneamente non disponibile." });
  }
}

export { splitTextIntoChunks, validateText };
