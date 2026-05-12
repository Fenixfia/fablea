export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();
    const text = body.text || "";

    if (!text.trim()) {
      return new Response("Missing text", { status: 400 });
    }

    const apiKey = env.ELEVENLABS_API_KEY;
    const voiceId = env.ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      return new Response("Missing ElevenLabs configuration", { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.42,
            similarity_boost: 0.82,
            style: 0.22,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return new Response(error.message || "Server error", { status: 500 });
  }
}
