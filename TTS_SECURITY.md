# Protezione TTS Fablea

`/api/tts` accetta solo richieste `POST`, valida il testo e lo suddivide in blocchi prima di inoltrarlo a ElevenLabs.

## Protezioni applicate nello Sprint 1

- Nessuna risposta diagnostica pubblica via `GET`.
- Validazione del tipo `text` e della lunghezza massima.
- Rifiuto di caratteri di controllo anomali.
- Errori puliti senza dettagli di provider, chiavi o configurazione.
- Suddivisione del testo in blocchi sotto soglia, preferendo paragrafi e frasi.

## Da completare prima della produzione

In ambiente serverless non è affidabile un rate limiting in memoria: ogni istanza può avere stato separato o essere riciclata. Prima della produzione occorre aggiungere una protezione esterna, ad esempio:

- Vercel Firewall / WAF o protezione per route sensibili;
- quota persistente per dispositivo, profilo o sessione su storage condiviso;
- eventuale controllo anti-abuso con log aggregati e soglie per IP o account.
