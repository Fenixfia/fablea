# FABLEA Design System

## Visione
FABLEA è una piattaforma narrativa per l'infanzia che comunica immaginazione calma, qualità editoriale, calore familiare e affidabilità per il genitore. Il sistema non è un tema decorativo: è la base condivisa per home, profili, hub bambino, creazione storia, libro vivo, libreria, manualità e manifesto.

## Principi
- **Editoriale prima di ludico**: gerarchie ampie, ritmo leggibile, poca competizione visiva.
- **Magia discreta**: gradienti sobri, silhouette, bagliori lenti e sostituibili da illustrazioni future.
- **Premium accessibile**: superfici calde, bordi sottili, microinterazioni leggere.
- **Memoria, non gamification**: tesori e rituali sono tracce narrative, non badge competitivi.
- **Mobile-first reale**: nessun overflow orizzontale intenzionale, target touch minimi e layout fluidi.

## Palette e token
I token sono definiti in `assets/css/fablea.css` dentro `:root` e nel modificatore notte. I nomi sono semantici:
- `--paper`, `--paper-soft`: fondi caldi.
- `--surface`, `--surface-quiet`, `--surface-deep`: superfici e profondità.
- `--ink`, `--text`, `--muted`, `--subtle`: livelli di testo.
- `--accent`, `--accent-2`, `--accent-soft`: accenti narrativi.
- `--success`, `--warning`, `--danger`: stati.
- `--line`, `--shadow`, `--shadow-soft`: separazione e profondità.
- `--r-*`, `--space-*`, `--max`, `--read`, `--fast`, `--slow`: raggi, spazi, larghezze e transizioni.

## Tipografia
- **Display / wordmark**: Cormorant Garamond, usata per `h1`, `.wordmark`, titoli narrativi e libro.
- **UI / testo**: Nunito, usata per controlli, caption, descrizioni e navigazione.
- **Kicker e badge**: `.badge`, `.kicker`, maiuscolo con tracking controllato.
- **Testo editoriale**: `.intro`, `.description`, `.lead`, paragrafi.
- **Status e caption**: `.status`, `.meta span`, `.footer`.

## Componenti
- Layout: `.page`, `.card`, `.stage`, `.home-shell`, `.book`.
- Navigazione: `.top`, `.menu`, `.actions`, `.footer-actions`.
- Azioni: `.button`, `.button.secondary`, `.button.primary`, `.back`, `.small-btn`.
- Form: `label`, `input`, `select`, `.choice`, `.theme`.
- Profili: `.profile-card`, `.avatar`, `.profile-list`, `.selected`.
- Empty state e pannelli: `.empty`, `.section`, `.saved`, `.quote`, `.audio-zone`, `.ritual`.
- Libro/player: `.illustration`, `.scene-art`, `.page-card`, `.story-title`, `.text`, `.progress`, `.progress-fill`, `.controls`.

## Scene
Classi condivise pronte per asset futuri:
- `.scene-forest` / `.forest`
- `.scene-sky` / `.sky`
- `.scene-ocean` / `.ocean`
- `.scene-space` / `.space`
- `.scene-castle` / `.castle`
- `.scene-bridge` / `.bridge`
- `.scene-night`, `.night`, `.calm`

Le emoji possono restare come fallback nel DOM, ma la scena deve funzionare tramite composizione CSS anche senza emoji.

## Fasce d'età
I modificatori `.age-2-4`, `.age-5-7`, `.age-8-10`, `.age-11-12` cambiano accenti, raggi e tono visivo senza creare quattro sistemi diversi.

## Accessibilità
- `focus-visible` evidente su link, bottoni, input, select e scelte.
- Bottoni disabilitati distinguibili.
- Animazioni decorative disattivate con `prefers-reduced-motion`.
- Touch target minimi di 44px.
- `aria-live` preservato nel player audio.

## Esempi d'uso
```html
<section class="page age-8-10">
  <div class="badge">Mondo bambino</div>
  <h1>Il mondo di Ada</h1>
  <p class="intro">Storie, rituali e tracce ricordate.</p>
  <a class="button" href="/story.html">Nuova esperienza</a>
</section>
```

```html
<div class="illustration scene-ocean">
  <div class="scene-art">fallback visuale</div>
</div>
```

## Cosa non fare
- Non introdurre colori saturi da videogioco o app scolastica generica.
- Non trasformare tesori e rituali in punteggi.
- Non duplicare CSS comune nelle pagine.
- Non aggiungere framework CSS o JS.
- Non rompere chiavi localStorage esistenti.

## Estensione futura
Negli sprint successivi aggiungere componenti solo se riutilizzati in almeno due pagine. Nuove illustrazioni dovranno entrare negli slot scena (`.illustration`, `.scene-art`) senza cambiare il contratto del libro vivo. Nuovi stati devono usare token semantici e rispettare reduced motion.

## Audit classi e QA CSS
Lo script `npm run check:css-classes` estrae le classi statiche dai file HTML core e le confronta con i selettori definiti in `assets/css/fablea.css`. Le classi dinamiche documentate sono: `active`, `primary`, `secondary`, `selected`, `theme-night`, `scene-night`, `age-2-4`, `age-5-7`, `age-8-10`, `age-11-12`.

## Applicazione runtime delle fasce d'età
Le pagine legate a un bambino usano `FableaUI.applyAgeFromStorage(document.body)`, che preferisce sempre il profilo selezionato e usa `fableaStoryData` solo come fallback. Il player usa `FableaUI.applyAge(document.body, age)` dopo aver calcolato l’età effettiva, includendo le storie riaperte da `fableaCurrentStory`. In entrambi i casi viene applicato al `body` il modificatore coerente (`age-2-4`, `age-5-7`, `age-8-10`, `age-11-12`) senza cambiare chiavi o struttura dati.

## Tema notte editoriale
`story-result.html` e `library.html` applicano `theme-night` e `data-theme="night"` al `body`. Il tema ridefinisce token, superfici, testo, metadati, progress bar, stati audio, rituali, card e filtri per creare un ambiente scuro editoriale e leggibile, non un semplice sfondo scuro.
