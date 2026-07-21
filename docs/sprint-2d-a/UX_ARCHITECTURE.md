# Sprint 2D-A — Architettura UX ufficiale FABLEA

## Obiettivo

Definire un’esperienza unica e riconoscibile che accompagni la famiglia dalla scoperta di FABLEA alla costruzione continuativa del mondo narrativo del bambino.

La struttura deve distinguere chiaramente:

- ciò che appartiene al genitore;
- ciò che appartiene al bambino;
- ciò che viene vissuto insieme;
- ciò che FABLEA ricorda e fa evolvere.

La promessa centrale è:

> Fablea non racconta una storia al bambino. Costruisce con lui un mondo che cresce.

---

# 1. Architettura generale

## A. Spazio pubblico

### Home

Scopo:

- spiegare il valore in pochi secondi;
- mostrare che il prodotto non è un generatore di favole;
- far percepire qualità editoriale, calma e profondità;
- portare alla prova di 15 giorni senza trasformare la pagina in un listino.

CTA primaria:

- `Inizia il primo mondo`

CTA secondaria:

- `Scopri come cresce`

Elementi essenziali:

- promessa;
- anteprima del Libro vivo;
- memoria e continuità;
- ruolo del genitore;
- esperienze oltre lo schermo;
- sicurezza e assenza di pubblicità;
- prezzo trasparente ma non dominante.

## B. Spazio adulto

### Accesso genitore

Il genitore crea e gestisce l’ambiente familiare.

Funzioni future:

- account;
- prova e abbonamento;
- profili bambino;
- preferenze;
- privacy;
- cronologia;
- temi da evitare;
- gestione della memoria;
- audio;
- esportazione e cancellazione.

### Onboarding bambino

Percorso guidato a step:

1. nome;
2. fascia d’età;
3. genere grammaticale;
4. mondo principale;
5. interessi secondari;
6. compagno preferito;
7. stile e supporto;
8. durata predefinita;
9. conferma del mondo.

Il genitore deve poter tornare indietro senza perdere dati.

Il mondo principale viene scelto una sola volta. Le storie successive chiedono soltanto ciò che cambia oggi.

## C. Spazio bambino

### Child Hub — Casa narrativa

Scopo:

- far percepire un mondo personale;
- rendere visibili continuità e memoria;
- offrire una sola azione primaria evidente;
- evitare dashboard e griglie uniformi.

Gerarchia:

1. grande avventura o storia da continuare;
2. esperienza consigliata per oggi;
3. mondo e compagno;
4. luoghi, personaggi e tesori;
5. Libreria;
6. accesso genitore discreto.

### Story Creator — Preparazione di oggi

Chiede soltanto:

- tipo di esperienza;
- stato emotivo o atmosfera;
- durata;
- eventuale mondo alternativo.

Mostra ciò che FABLEA sa già, senza richiederlo nuovamente.

### Libro vivo

Stati principali:

1. copertina;
2. apertura;
3. lettura;
4. ascolto;
5. lettura + ascolto;
6. pausa;
7. modalità notte;
8. errore audio;
9. finale;
10. rituale;
11. attività fuori dallo schermo;
12. aggiornamento del mondo.

Il player deve nascondere i controlli secondari durante la lettura.

### Libreria

Sezioni:

- continua;
- storie concluse;
- serie;
- mondi visitati;
- personaggi;
- tesori;
- preferiti;
- ricordi familiari futuri.

---

# 2. Flussi principali

## Nuova famiglia

Home → Inizia → Spazio genitore → Onboarding bambino → Conferma mondo → Prima storia → Rituale → Child Hub

## Ritorno del bambino

Home personale → Child Hub → Continua / Nuova esperienza → Libro vivo → Aggiornamento mondo → Child Hub

## Uso serale rapido

Child Hub → Storia della sera → Durata → Libro vivo in modalità notte → Rituale breve → Fine

## Momento emotivo

Area genitore o Child Hub → Storia per un momento difficile → Selezione discreta del tema → Storia → Domanda condivisa → Salvataggio privato

## Riapertura

Libreria → storia salvata → stessa pagina e stesso stato → continuazione della lettura

---

# 3. Gerarchia dei ruoli

## Genitore

- configura;
- protegge;
- accompagna;
- comprende ciò che è stato esplorato;
- non riceve diagnosi o giudizi psicologici.

## Bambino

- esplora;
- sceglie;
- ascolta;
- legge;
- ricorda;
- costruisce il proprio mondo.

## Insieme

- rituali;
- domande;
- attività;
- storie familiari;
- ricordi;
- decisioni condivise.

---

# 4. Differenziazione per età

## 2–4 anni

- audio centrale;
- scene grandi;
- pochissimi controlli;
- testo breve per pagina;
- ritmo rassicurante;
- genitore spesso presente.

## 5–7 anni

- meraviglia ed esplorazione;
- compagno molto visibile;
- mappa semplice;
- prime scelte;
- tesori e rituali chiari.

## 8–10 anni

- maggiore autonomia;
- misteri e conseguenze;
- testo e immagini equilibrati;
- interfaccia meno infantile;
- serie e missioni più strutturate.

## 11–12 anni

- estetica editoriale matura;
- nessuna iconografia da piccoli;
- profondità narrativa;
- controlli più autonomi;
- identità, relazioni, sogni e pensiero critico.

---

# 5. Principi di interazione

- una CTA primaria per schermata;
- niente monete, streak o premi manipolativi;
- nessun paywall nello spazio bambino;
- transizioni lente e utili;
- feedback chiaro dopo ogni azione;
- errori visibili e comprensibili;
- touch target minimo 44px;
- supporto Safari iOS e tablet;
- reduced motion;
- contenuti leggibili con screen reader;
- nessun overflow orizzontale.

---

# 6. Direzioni visive da confrontare

## A — Atlante delle meraviglie

- editoriale;
- materico;
- mappe, tracce e pagine;
- calore familiare;
- oggetti narrativi da conservare;
- composizioni asimmetriche;
- digitale discreto.

## B — Portale dei mondi

- immersivo;
- contemporaneo;
- profondità, luce e scene stratificate;
- interfaccia ridotta;
- passaggi tra mondi;
- movimento lento;
- cinematografico senza sembrare un videogioco.

---

# 7. Criteri di decisione

La direzione scelta deve:

1. rendere memorabile il Libro vivo;
2. funzionare da 2 a 12 anni;
3. essere credibile per un adulto;
4. non dipendere dalle emoji;
5. sostenere World Engine e memoria;
6. restare veloce su iPhone;
7. comunicare qualità senza ostentazione;
8. permettere crescita futura senza un nuovo redesign completo.

---

# 8. Fuori scope di 2D-A

- nessuna modifica al motore narrativo;
- nessuna modifica a localStorage;
- nessuna nuova funzione cloud;
- nessun account o pagamento;
- nessuna generazione immagini definitiva;
- nessun merge automatico;
- nessuna sostituzione delle pagine correnti prima della scelta visiva.
