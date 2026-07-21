# Fondazione produzione FABLEA

Stato: **architettura predisposta, servizi remoti non ancora collegati**.

Questa distinzione è intenzionale. La beta integrata può simulare il percorso completo sul dispositivo, ma non deve presentare come sicure o operative funzioni che richiedono infrastruttura esterna.

## Cosa esiste nella beta

- schema locale versionato `fableaIntegratedBeta`;
- prova locale di 15 giorni;
- più profili separati sullo stesso browser;
- PIN genitore locale da 4–6 cifre;
- adapter espliciti per storage, account, sincronizzazione e billing;
- esportazione e cancellazione dei dati presenti nel browser;
- prezzi di prodotto definiti: €5,99/mese e €59,90/anno;
- nessun checkout attivo e nessuna falsa autenticazione.

## Limiti da mostrare con chiarezza

Il PIN locale è una separazione d’interfaccia, non una protezione equivalente a un account. Chi controlla completamente il dispositivo o gli strumenti del browser può accedere ai dati locali. La prova locale può essere alterata cancellando lo storage. Non esiste ancora sincronizzazione tra dispositivi, backup remoto o recupero dell’account.

## Servizi da scegliere prima della beta pubblica

### 1. Identità del genitore

Requisiti:

- email verificata o accesso tramite provider affidabile;
- sessioni revocabili;
- recupero account;
- protezione da tentativi automatizzati;
- consenso e gestione dell’autorità genitoriale;
- nessun account autonomo del bambino.

L’adapter pubblico è `FableaPlatform.account`.

### 2. Database europeo

Requisiti:

- regione UE documentata;
- isolamento per famiglia/tenant;
- Row Level Security o autorizzazione equivalente;
- cifratura in transito e a riposo;
- versionamento dei profili e delle storie;
- backup cifrati e procedure di ripristino testate;
- log privi di nomi, testi delle storie e contenuti dei bambini;
- politiche di retention separate per account, audio temporaneo e diagnostica.

L’adapter pubblico è `FableaPlatform.sync`; lo storage locale resta disponibile come cache e modalità prototipo.

### 3. Pagamenti

Requisiti:

- checkout ospitato dal provider;
- prova gratuita di 15 giorni gestita lato server;
- piano famiglia mensile da €5,99;
- piano famiglia annuale da €59,90;
- più profili inclusi;
- webhook firmati per attivazione, rinnovo, insoluto e cancellazione;
- portale cliente per fatture e disdetta;
- nessun dato carta conservato da FABLEA.

L’adapter pubblico è `FableaPlatform.billing`.

### 4. Cancellazione verificabile

La cancellazione di produzione deve rimuovere o anonimizzare, secondo la policy approvata:

- account famiglia;
- profili bambino;
- storie e memoria persistente;
- attività e preferenze;
- asset generati;
- copie operative e backup secondo una finestra dichiarata.

Deve essere generata una ricevuta tecnica dell’operazione senza conservare il contenuto eliminato.

## Schema minimo lato server

- `families`: titolare, piano, trial, locale, consensi;
- `parent_identities`: provider, email verificata, sessioni;
- `child_profiles`: fascia, sesso, preferenze, compagno visuale;
- `stories`: origine, versione editoriale, stato e metadati;
- `world_events`: conseguenze, oggetti, fili aperti, relazioni;
- `activity_journeys`: percorso, capacità, missione, timestamp;
- `entitlements`: stato del piano e funzioni accessorie;
- `deletion_requests`: stato, scadenza e ricevuta.

## Regola di migrazione

La migrazione dal browser deve avvenire soltanto dopo autenticazione del genitore e conferma esplicita. I dati locali non devono essere caricati automaticamente su un account appena creato senza una schermata di riepilogo.

## Criteri per dichiarare la produzione pronta

- test di isolamento tra famiglie;
- test di cancellazione e ripristino;
- verifica dei webhook di pagamento;
- monitoraggio errori senza contenuti personali;
- revisione privacy e condizioni d’uso;
- revisione legale dei classici per territorio;
- test reali su Safari iOS, Android e desktop;
- piano di risposta agli incidenti;
- dominio e marchio definitivamente approvati.