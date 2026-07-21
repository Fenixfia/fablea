import fs from 'node:fs';
import vm from 'node:vm';

const storage = {};
const localStorage = {
  getItem:key => storage[key] ?? null,
  setItem:(key,value) => { storage[key] = String(value); },
  removeItem:key => { delete storage[key]; }
};
const window = {localStorage};
const context = {window,localStorage,console,setTimeout,clearTimeout,URL,Math,Date};
vm.createContext(context);

for(const file of [
  'assets/js/fablea-grammar.js',
  'assets/js/fablea-profile.js',
  'stories-v2/age-2-4.js',
  'stories-v2/age-5-7.js',
  'stories-v2/age-8-10.js',
  'stories-v2/age-11-12.js',
  'stories-v2/index.js',
  'stories-v2/supplements.js',
  'stories-v2/final-scenes.js',
  'assets/js/fablea-story-engine.js',
  'assets/js/fablea-shell.js'
]){
  vm.runInContext(fs.readFileSync(file,'utf8'), context, {filename:file});
}

const F = window.FableaProfile;
const E = window.FableaStoryEngine;
const G = window.FableaGrammar;
const S = window.FableaShell;
function assert(condition, message){ if(!condition) throw new Error(message); }

localStorage.setItem(F.KEYS.profiles, JSON.stringify([{
  name:'Lia', age:'5-7', interests:['🦖 Dinosauri','Mare','Spazio'],
  support:'Stimolare curiosità', duration:'Media • 5–8 minuti'
}]));
localStorage.setItem(F.KEYS.memory, JSON.stringify({
  Lia:{treasures:['tesoro legacy'],rituals:[],history:['old-story'],lastStory:'Vecchia storia'}
}));
const migrated = F.getProfiles()[0];
assert(migrated.schemaVersion === 2, 'schema profilo legacy non migrato');
assert(migrated.id.startsWith('legacy-lia-'), 'id legacy non stabile');
assert(migrated.gender === 'unspecified', 'fallback genere legacy errato');
assert(migrated.primaryWorld === 'Dinosauri', 'mondo legacy non derivato');
assert(migrated.duration === 'Media', 'durata legacy non normalizzata');
assert(F.getMemory(migrated).treasures.includes('tesoro legacy'), 'memoria legacy per nome non migrata all’id');

const profiles = [
  ['m','Marco','male'],
  ['f','Marta','female'],
  ['n','Nico','neutral'],
  ['u','Ari','unspecified']
].map(([id,name,gender]) => F.saveProfile({
  id,name,age:'5-7',gender,primaryWorld:'Dinosauri',interests:['Mare','Spazio'],
  support:'Stimolare curiosità',duration:'Breve',storyStyle:'adventurous'
}));
assert(G.words(profiles[0]).explorer === 'esploratore', 'accordo maschile errato');
assert(G.words(profiles[1]).explorer === 'esploratrice', 'accordo femminile errato');
assert(G.words(profiles[2]).explorer === 'protagonista', 'forma neutra non naturale');
assert(!G.words(profiles[3]).subject.includes('persona speciale'), 'fallback non specificato artificiale');

const profile = profiles[0];
const common = {scenario:'Dinosauri',family:'avventura',mood:'Curiosità e voglia di scoprire'};
const shortStory = E.buildStory(profile,{...common,duration:'Breve'});
const mediumStory = E.buildStory(profile,{...common,duration:'Media'});
const longStory = E.buildStory(profile,{...common,duration:'Lunga'});
assert(shortStory.wordCount < mediumStory.wordCount && mediumStory.wordCount < longStory.wordCount, 'durate non realmente crescenti');
assert(shortStory.world === 'Dinosauri', 'mondo richiesto non conservato');
assert(shortStory.text.includes('Valle delle Felci Giganti'), 'testo non adattato al mondo Dinosauri');
assert(shortStory.text.includes(shortStory.companion), 'compagno nei metadati non coincide con il testo');
assert(!/Nel dettaglio|passo narrativo riconoscibile|5-7-avventura-/i.test(shortStory.text), 'padding generato ancora presente');
assert(longStory.pages.length > mediumStory.pages.length, 'la versione lunga non aggiunge scene narrative');

E.saveStory(shortStory);
const progressed = E.updateProgress(shortStory, 2);
assert(progressed.resumePage === 2, 'pagina di ripresa non salvata');
const reopened = JSON.parse(localStorage.getItem('fableaCurrentStory'));
assert(reopened.profileSnapshot && reopened.pages.length, 'snapshot o pagine mancanti nella riapertura');
assert(reopened.resumePage === 2, 'riapertura non conserva la pagina');

localStorage.removeItem('fableaStoryRotation');
const firstSelection = E.selectStory(profile, common).id;
const secondSelection = E.selectStory(profile, common).id;
assert(firstSelection !== secondSelection, 'rotazione per bambino non varia due selezioni consecutive');

const other = F.saveProfile({
  id:'other',name:'Luca',age:'5-7',gender:'unspecified',primaryWorld:'Mare',interests:['Spazio'],
  support:'Calmare la sera',duration:'Breve',storyStyle:'calm'
});
F.updateMemory(profile,{treasures:['ambra']});
F.updateMemory(other,{treasures:['conchiglia']});
assert(F.getMemory(profile).treasures[0] !== F.getMemory(other).treasures[0], 'memoria condivisa tra bambini');

assert(Object.keys(S.WORLD_PRESENTATION).length === 8, 'la shell non copre gli otto mondi');
assert(S.storiesFor(profile).length === 4, 'Scopri non restituisce le quattro storie della fascia');
assert(S.previewTemplate('{{name}} attraversa {{world}}',profile) === 'Marco attraversa Dinosauri', 'anteprima editoriale non personalizzata');
assert(S.savedFor(profile).some(story => story.id === shortStory.id), 'Libreria shell non separa o non legge le storie salvate');
assert(S.renderDock('discover').includes('discover.html') && S.renderDock('discover').includes('active'), 'dock esplorabile incompleto');

const onboarding = fs.readFileSync('onboarding.html','utf8');
const createChild = fs.readFileSync('create-child.html','utf8');
const creator = fs.readFileSync('story.html','utf8');
const player = fs.readFileSync('story-result.html','utf8');
const hub = fs.readFileSync('child-hub.html','utf8');
const discover = fs.readFileSync('discover.html','utf8');
const worldPage = fs.readFileSync('world.html','utf8');
const library = fs.readFileSync('library.html','utf8');
assert(onboarding.includes('F.KEYS.prepared') && onboarding.includes('Prima storia proposta'), 'prima storia non preparata nell’onboarding');
assert(createChild.includes('F.KEYS.prepared') && createChild.includes('Prima storia proposta'), 'prima storia non preparata in create-child');
for(const [fileName, html] of [['onboarding.html',onboarding],['create-child.html',createChild]]){
  assert(html.includes("const nameInput = document.getElementById('name')"), `${fileName}: riferimento esplicito al campo nome mancante`);
  assert(html.includes("const formEl = document.getElementById('profileForm')"), `${fileName}: riferimento esplicito al form mancante`);
  assert(!/\bname\.value\b/.test(html), `${fileName}: collisione con window.name reintrodotta`);
  assert(html.includes("formEl.addEventListener('submit'"), `${fileName}: submit handler non collegato al form reale`);
}
assert(creator.includes('Usa il suo mondo') && creator.includes('Curiosità e voglia di scoprire'), 'story creator duplica o perde il profilo');
assert(player.includes("fetch('/api/tts'") && player.includes('fableaReopenStory'), 'contratto TTS o riapertura mancanti');
assert(player.includes('resumePage') && player.includes('Conserva nel suo mondo'), 'ripresa o memoria rituale mancanti');
for(const [fileName,html,active] of [
  ['child-hub.html',hub,'continue'],
  ['discover.html',discover,'discover'],
  ['world.html',worldPage,'world'],
  ['library.html',library,'library']
]){
  assert(html.includes('/assets/js/fablea-shell.js'), `${fileName}: helper shell mancante`);
  assert(html.includes(`S.renderDock('${active}')`), `${fileName}: destinazione dock errata`);
}
assert(discover.includes('S.openCatalogStory') && discover.includes('data-story-id'), 'Scopri non apre storie editoriali reali');
assert(worldPage.includes('F.getMemory(profile)') && worldPage.includes('S.savedFor(profile)'), 'Mondo non legge memoria e storie reali');

console.log('Smoke completato: profili, grammatica, storie, durate, rotazione, memoria, TTS e Product Shell con Home, Scopri, Mondo e Libreria.');
