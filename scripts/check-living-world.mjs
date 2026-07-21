import fs from 'node:fs';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');
const expect = (condition,message) => {if(!condition) errors.push(message);};

const home = read('child-hub.html');
const activity = read('assets/js/fablea-activities.js');
const catalog = read('assets/js/fablea-activity-catalog.js');
const betaState = read('assets/js/fablea-beta-state.js');
const continuity = read('assets/js/fablea-story-continuity.js');
const moods = read('assets/js/fablea-companion-moods.js');
const polish = read('assets/js/fablea-live-book-polish.js');
const livingCss = read('assets/css/fablea-living-world.css');
const betaCss = read('assets/css/fablea-beta.css');
const unified = read('assets/js/fablea-unified-ui.js');
const play = read('play.html');
const learn = read('learn.html');
const world = read('world.html');

for(const label of ['Leggiamo','Inventiamo','Giochiamo','Scopriamo']) expect(home.includes(`>${label}<`),`Casa viva: luogo ${label} mancante`);
expect(home.includes('beta-today') && home.includes('recommendation'),'Casa viva: proposta contestuale non presente');
expect(home.includes('Il mondo è cambiato') && home.includes('Stanza dei ricordi'),'Casa viva: cambiamento o ricordo visibile mancante');
expect(!home.includes('In crescita'),'Casa viva: ambienti futuri ancora mostrati');
expect(betaCss.includes('.beta-room') && betaCss.includes('.beta-world-change'),'Casa viva: stanze o traccia visuale non stilizzate');
expect(betaState.includes('function reconcile(') && betaState.includes('function recommendation('),'Casa viva: memoria integrata non disponibile');

for(const mood of ['calm','curious','happy','encouraging']){
  expect(moods.includes(`'${mood}'`) || moods.includes(`:${mood}`) || moods.includes(`-${mood}`),`Compagno: stato ${mood} mancante`);
  expect(livingCss.includes(`companion-mood-${mood}`),`Compagno: stile ${mood} mancante`);
}
expect(activity.includes('const SESSION_SIZE = 4'),'Attività: sessione adattiva di quattro tappe mancante');
expect(activity.includes('buildSession(path)'),'Attività: costruzione del percorso tematico mancante');
expect(activity.includes('profileProgress.itemStats') && activity.includes('profileProgress.skillStats'),'Attività: adattività non collegata ai progressi del profilo');
expect(activity.includes('activity-skill'),'Attività: riepilogo delle capacità mancante');
expect(activity.includes("setCompanion(correct ? 'happy' : 'encouraging')"),'Attività: reazione contestuale del compagno mancante');
expect(catalog.includes('FableaActivityCatalog'),'Attività: catalogo editoriale separato mancante');
expect(play.includes('data-companion-expression="curious"') && learn.includes('data-companion-expression="curious"'),'Attività: stato iniziale curioso del compagno mancante');
expect(world.includes('Capacità incontrate') && world.includes('Fuori dallo schermo'),'Mondo: tracce delle attività non integrate');
expect(world.includes('beta-continuity') && world.includes('Stanza dei ricordi'),'Mondo: continuità storia-oggetto-attività non visualizzata');
expect(continuity.includes('La storia ha aperto una nuova porta'),'Libro vivo: ponte verso il percorso successivo mancante');

expect(polish.includes('live-book-cover'),'Libro vivo: copertina introduttiva mancante');
expect(polish.includes('dataset.sceneRole'),'Libro vivo: ruolo della scena non sincronizzato');
expect(polish.includes('M.decorate(sceneCompanion'),'Libro vivo: compagno non reagisce alla scena');
expect(livingCss.includes('.live-book-cover') && livingCss.includes('.story-companion-visual'),'Libro vivo: stile copertina o integrazione compagno mancante');
expect(unified.includes('/assets/js/fablea-live-book-polish.js'),'Sistema unificato: polish Libro vivo non caricato');
expect(unified.includes('/assets/js/fablea-story-continuity.js'),'Sistema unificato: continuità dopo il rituale non caricata');
expect(unified.includes('/assets/css/fablea-living-world.css'),'Sistema unificato: livello Casa viva non caricato');
expect(unified.includes('/assets/css/fablea-integrated-navigation.css'),'Sistema unificato: navigazione integrata non preservata');

if(errors.length){
  console.error('Living world check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Living world check passed: Casa contestuale, companion moods, attività adattive, continuità nel Mondo e Libro vivo coerente.');