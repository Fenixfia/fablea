import fs from 'node:fs';
import vm from 'node:vm';

const errors = [];
const expect = (condition,message) => {if(!condition) errors.push(message);};
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');

const catalogCode = read('assets/js/fablea-activity-catalog.js');
const engine = read('assets/js/fablea-activities.js');
const play = read('play.html');
const learn = read('learn.html');
const world = read('world.html');
const css = read('assets/css/fablea-activities.css');

const context = {window:{}};
vm.createContext(context);
if(catalogCode) vm.runInContext(catalogCode,context,{filename:'assets/js/fablea-activity-catalog.js'});
const catalog = context.window.FableaActivityCatalog && context.window.FableaActivityCatalog.all();
const ages = ['2-4','5-7','8-10','11-12'];
const modes = ['play','learn'];
const allowedTypes = new Set(['choice','multi','order']);
const ids = new Set();
let count = 0;

expect(Boolean(catalog),'Catalogo attività non esportato');
if(catalog){
  for(const mode of modes){
    expect(catalog[mode] && typeof catalog[mode] === 'object',`Catalogo ${mode} mancante`);
    for(const age of ages){
      const items = catalog[mode] && catalog[mode][age] || [];
      expect(items.length === 8,`${mode}/${age}: attese 8 attività, trovate ${items.length}`);
      const types = new Set(items.map(item => item.type));
      expect(types.has('choice') && types.has('multi') && types.has('order'),`${mode}/${age}: servono scelta, selezione multipla e ordinamento`);
      for(const item of items){
        count += 1;
        expect(item.id && !ids.has(item.id),`${mode}/${age}: id mancante o duplicato ${item.id}`);
        ids.add(item.id);
        expect(item.prompt && item.hint && item.success && item.learn && item.skill,`${item.id}: contenuto incompleto`);
        expect(Array.isArray(item.answers) && item.answers.length >= 3,`${item.id}: risposte insufficienti`);
        expect(allowedTypes.has(item.type),`${item.id}: tipo non supportato ${item.type}`);
        expect(item.type === 'choice' ? typeof item.correct === 'string' : Array.isArray(item.correct),`${item.id}: soluzione incompatibile con il tipo`);
        expect(item.mission && item.mission.length > 12,`${item.id}: missione reale mancante`);
      }
    }
  }
}
expect(count === 64,`Attese 64 attività complessive, trovate ${count}`);

for(const [fileName,html] of [['play.html',play],['learn.html',learn]]){
  expect(html.includes('/assets/js/fablea-activity-catalog.js'),`${fileName}: catalogo non caricato`);
  expect(html.indexOf('fablea-activity-catalog.js') < html.indexOf('fablea-activities.js'),`${fileName}: ordine script errato`);
  expect(html.includes('Scegli il percorso'),`${fileName}: ingresso ai percorsi mancante`);
}

expect(engine.includes("const SESSION_SIZE = 4"),'Motore: sessione da quattro tappe mancante');
expect(engine.includes("item.type === 'multi'") && engine.includes("item.type === 'order'"),'Motore: interazioni multiple o ordinate mancanti');
expect(engine.includes('recentIds') && engine.includes('itemStats') && engine.includes('skillStats'),'Motore: adattività o statistiche per profilo mancanti');
expect(engine.includes('speechSynthesis') && engine.includes("utterance.lang = 'it-IT'"),'Motore: lettura locale della domanda mancante');
expect(!engine.includes("fetch('"),'Motore: la lettura delle attività non deve inviare testo a servizi esterni');
expect(engine.includes('FABLEA fuori dallo schermo') && engine.includes('mission'),'Motore: missione reale mancante');
expect(engine.includes('Nessun voto e nessuna classifica'),'Motore: principio non competitivo mancante');
expect(!/leaderboard|punteggio|classifica generale|confronta con/i.test(catalogCode),'Catalogo: meccanica competitiva rilevata');

expect(world.includes("F.readJSON('fableaActivityProgress',{})"),'Mondo: avanzamento attività non letto');
expect(world.includes('Percorsi esplorati') && world.includes('FABLEA fuori dallo schermo'),'Mondo: tracce delle attività incomplete');
expect(css.includes('.activity-route-grid') && css.includes('.activity-order') && css.includes('.activity-real-mission'),'CSS: nuovi percorsi o interazioni non stilizzati');
expect(css.includes('@media(max-width:390px)'),'CSS: adattamento per iPhone stretti mancante');

if(errors.length){
  console.error('Activity worlds check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Activity worlds check passed: 64 attività, percorsi adattivi, tre interazioni, voce locale, missioni reali e tracce nel Mondo.');
