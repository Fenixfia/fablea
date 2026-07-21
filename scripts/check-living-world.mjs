import fs from 'node:fs';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');
const expect = (condition,message) => {if(!condition) errors.push(message);};

const home = read('child-hub.html');
const activity = read('assets/js/fablea-activities.js');
const moods = read('assets/js/fablea-companion-moods.js');
const polish = read('assets/js/fablea-live-book-polish.js');
const livingCss = read('assets/css/fablea-living-world.css');
const unified = read('assets/js/fablea-unified-ui.js');
const play = read('play.html');
const learn = read('learn.html');

for(const label of ['Leggiamo','Inventiamo','Giochiamo','Scopriamo']) expect(home.includes(`>${label}<`),`Casa viva: luogo ${label} mancante`);
expect(home.includes('living-home-map'),'Casa viva: mappa illustrata mancante');
expect(home.includes('fableaActivityProgress'),'Casa viva: tracce delle attività non lette');
expect(home.includes('home-traces'),'Casa viva: tracce recenti non visualizzate');
expect(livingCss.includes('.home-room::before') && livingCss.includes('.living-home-map::after'),'Casa viva: edifici o sentiero illustrato mancanti');

for(const mood of ['calm','curious','happy','encouraging']){
  expect(moods.includes(`'${mood}'`) || moods.includes(`:${mood}`) || moods.includes(`-${mood}`),`Compagno: stato ${mood} mancante`);
  expect(livingCss.includes(`companion-mood-${mood}`),`Compagno: stile ${mood} mancante`);
}
expect(activity.includes("sessionSize = Math.min(3"),'Attività: sessione breve di tre tappe mancante');
expect(activity.includes('buildSession()'),'Attività: rotazione del percorso mancante');
expect(activity.includes('profileProgress[mode]'),'Attività: rotazione non collegata ai progressi del profilo');
expect(activity.includes('activity-skill'),'Attività: riepilogo delle capacità mancante');
expect(activity.includes("setCompanion(correct ? 'happy' : 'encouraging')"),'Attività: reazione contestuale del compagno mancante');
expect(play.includes('data-companion-expression="curious"') && learn.includes('data-companion-expression="curious"'),'Attività: stato iniziale curioso del compagno mancante');

expect(polish.includes('live-book-cover'),'Libro vivo: copertina introduttiva mancante');
expect(polish.includes('dataset.sceneRole'),'Libro vivo: ruolo della scena non sincronizzato');
expect(polish.includes("M.decorate(sceneCompanion"),'Libro vivo: compagno non reagisce alla scena');
expect(livingCss.includes('.live-book-cover') && livingCss.includes('.story-companion-visual'),'Libro vivo: stile copertina o integrazione compagno mancante');
expect(unified.includes('/assets/js/fablea-live-book-polish.js'),'Sistema unificato: polish Libro vivo non caricato');
expect(unified.includes('/assets/css/fablea-living-world.css'),'Sistema unificato: livello Casa viva non caricato');
expect(unified.includes('/assets/css/fablea-integrated-navigation.css'),'Sistema unificato: navigazione integrata non preservata');

if(errors.length){
  console.error('Living world check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Living world check passed: Casa illustrata, companion moods, percorsi ruotati e Libro vivo coerente.');
