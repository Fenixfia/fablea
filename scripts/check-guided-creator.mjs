import fs from 'node:fs';

const html = fs.readFileSync('story.html','utf8');
const js = fs.readFileSync('assets/js/fablea-guided-creator.js','utf8');
const css = fs.readFileSync('assets/css/fablea-guided-creator.css','utf8');
const errors = [];

function expect(condition,message){ if(!condition) errors.push(message); }

expect(html.includes('/assets/css/fablea-guided-creator.css'),'story.html non carica il livello visivo del creator guidato');
expect(html.includes('/assets/js/fablea-guided-creator.js'),'story.html non carica il controller del creator guidato');
expect(html.includes('id="guidedCreator"'),'contenitore creator guidato mancante');
expect(html.includes('creator-world-art'),'atlante visivo dei mondi mancante');
expect(!html.includes('<select'),'story.html contiene ancora menu a tendina tecnici');

for(const label of ['Da questo momento','Dal mio mondo','Da una mia idea']){
  expect(js.includes(label),`porta principale mancante: ${label}`);
}
for(const mode of ['moment','world','idea','continue','bedtime','family','prepare','discovery','cocreate']){
  expect(new RegExp(`\\b${mode}:\\{`).test(js),`modalità guidata non dichiarata: ${mode}`);
}
expect(js.includes("V3.buildAndSave(profile,input)"),'il creator non alimenta realmente il motore V3');
expect(js.includes("source:'guided-creator-v1'"),'provenienza guidata non tracciata nella richiesta V3');
expect(js.includes("mode:state.mode"),'la modalità selezionata non viene trasferita alla richiesta');
expect(js.includes("ritualRequested:state.mode === 'bedtime'"),'rituale della modalità buonanotte non collegato');
expect(js.includes("activityRequested:state.mode === 'family'"),'attività contestuale non collegata');
expect(js.includes("continueStoryId:state.answers.continueStoryId"),'continuità da storia salvata non collegata');
expect(!/\bmode\s*===\s*['"](?:bedtime|moment|family|discovery)['"]/.test(js.replaceAll('state.mode','')),'riferimento libero a mode reintrodotto');

for(const world of ['Dinosauri','Mare','Animali','Spazio','Magia','Foresta','Regni e castelli','Misteri e scoperte']){
  expect(css.includes(`body[data-world="${world}"]`),`scena grafica dedicata mancante: ${world}`);
}
expect(css.includes('min-height:52px'),'touch target principale inferiore alla soglia prevista');
expect(css.includes('@media(max-width:840px)'),'layout mobile dedicato mancante');
expect(css.includes('prefers-reduced-motion'),'riduzione movimento non rispettata');

if(errors.length){
  console.error('Guided creator check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Guided creator check passed: percorso adattivo V3 e otto scene mondo presenti.');
