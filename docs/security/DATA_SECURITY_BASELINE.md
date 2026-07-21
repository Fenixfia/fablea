# FABLEA — Fondazione di sicurezza dei dati

## Stato attuale

FABLEA è ancora una beta locale. Profili, preferenze, storie, memoria narrativa e avanzamento sono salvati nel browser del dispositivo tramite Web Storage.

Questo significa che:

- i dati non vengono sincronizzati automaticamente con un account FABLEA;
- non esiste ancora un database centrale dei bambini;
- chi ha accesso al profilo del browser può tecnicamente leggere o cancellare i dati locali;
- cambiare dominio di preview, browser o dispositivo crea un archivio separato;
- la cancellazione dei dati del browser elimina anche i dati FABLEA non esportati.

Non va descritta come cifratura locale: al momento i valori sono leggibili nel browser.

## Protezioni introdotte nella fondazione

1. Inventario dinamico di tutte le chiavi FABLEA presenti in localStorage e sessionStorage.
2. Centro famiglia e dati con:
   - riepilogo dei dati presenti;
   - esportazione completa in JSON;
   - cancellazione totale con conferma esplicita.
3. API voce limitata a richieste POST JSON provenienti dallo stesso sito.
4. Limiti di lunghezza e numero di segmenti per la sintesi vocale.
5. Risposte audio e di errore con `Cache-Control: no-store`.
6. Security headers per Vercel e Cloudflare:
   - Content Security Policy;
   - blocco dell’incorporamento in iframe;
   - disattivazione di camera, microfono, geolocalizzazione, pagamenti e USB;
   - protezione MIME e referrer ridotto.
7. Test automatici che impediscono di rimuovere accidentalmente queste protezioni.

## Dati inviati fuori dal dispositivo

Il testo della pagina o della storia viene inviato all’endpoint `/api/tts` soltanto quando l’utente richiede l’ascolto. L’endpoint inoltra il testo al fornitore configurato per generare l’audio.

FABLEA non deve registrare nei log applicativi:

- nomi dei bambini;
- testo delle storie;
- preferenze;
- memoria narrativa;
- contenuto delle esportazioni.

## Requisiti prima di una beta pubblica con account

- Account genitore con autenticazione robusta e recupero sicuro.
- Separazione logica per famiglia e controllo di accesso server-side.
- Database in area geografica definita, cifrato in transito e a riposo.
- Segreti soltanto server-side e rotazione delle chiavi.
- Backup cifrati, test di ripristino e retention documentata.
- Cancellazione verificabile dell’account e dei dati associati.
- Audit degli accessi senza contenuti narrativi sensibili.
- Protezione da abuso e rate limiting persistente delle API.
- Privacy policy, consensi e valutazione GDPR specifica per servizi rivolti a famiglie e minori.
- Contratti e configurazioni privacy verificati per i fornitori esterni.

## Cifratura locale

Una cifratura locale reale richiede un archivio asincrono basato su Web Crypto, una chiave derivata da un PIN genitore e la migrazione di tutti i punti che oggi leggono e scrivono in modo sincrono.

Non usare encoding, Base64 o offuscamento come se fossero cifratura. La migrazione va progettata come sprint separato, con recupero, cambio PIN, perdita PIN e test di integrità.
