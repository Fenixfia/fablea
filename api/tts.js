export default async function handler(req, res) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        apiKeyPresent: Boolean(apiKey),
        voiceIdPresent: Boolean(voiceId),
        voiceId: voiceId || null,
        message: "API FABLEA attiva. Usa POST per generare audio."
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!apiKey || !voiceId) {
      return res.status(500).json({
        error: "Missing env variables",
        apiKeyPresent: Boolean(apiKey),
        voiceIdPresent: Boolean(voiceId)
      });
    }

    const text = req.body?.text || "Ciao, benvenuto in FABLEA.";

    const eleven = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text.slice(0, 700),
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.8,
            style: 0.15,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!eleven.ok) {
      const details = await eleven.text();

      return res.status(500).json({
        error: "ElevenLabs error",
        status: eleven.status,
        details: details
      });
    }

    const audioBuffer = Buffer.from(await eleven.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(audioBuffer);

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
