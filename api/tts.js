export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const text = req.body.text || "Ciao Cesare";

    const eleven = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8
          }
        })
      }
    );

    if (!eleven.ok) {

      const errorText = await eleven.text();

      return res.status(500).json({
        error: errorText
      });

    }

    const audioBuffer = await eleven.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');

    return res.send(Buffer.from(audioBuffer));

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
