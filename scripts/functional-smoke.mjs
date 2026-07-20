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
  'assets/js/fablea-story-engine.js'
]){
  vm.runInContext(fs.readFileSync(file,'utf8'), context, {filename:file});
}

const F = window.FableaProfile;
const E = window.FableaStoryEngine;
const G = window.FableaGrammar;
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

E.saveStory(shortStory);
const progressed = E.updateProgress(shortStory, 2);
assert(progressed.resumePage === 2, 'pagina di ripresa non salvata');
const reopened = JSON.parse(localStorage.getItem('fableaCurrentStory'));
assert(reopened.profileSnapshot && reopened.pages.length, 'snapshot o pagine mancanti nella riapertura');
assert(reopened.resumePage === 2, 'riapertura non conserva la pagina');

const firstSelection = E.selectStory(profile, common).id;
const secondSelection = E.selectStory(profile, common).id;
assert(firstSelection !== secondSelection, 'rotazione per bambino non varia il catalogo recente');

const other = F.saveProfile({
  id:'other',name:'Luca',age:'5-7',gender:'unspecified',primaryWorld:'Mare',interests:['Spazio'],
  support:'Calmare la sera',duration:'Breve',storyStyle:'calm'
});
F.updateMemory(profile,{treasures:['ambra']});
F.updateMemory(other,{treasures:['conchiglia']});
assert(F.getMemory(profile).treasures[0] !== F.getMemory(other).treasures[0], 'memoria condivisa tra bambini');

const onboarding = fs.readFileSync('onboarding.html','utf8');
const creator = fs.readFileSync('story.html','utf8');
const player = fs.readFileSync('story-result.html','utf8');
assert(onboarding.includes(F.KEYS.prepared) && onboarding.includes('Prima storia proposta'), 'prima storia non preparata nell’onboarding');
assert(creator.includes('Usa il suo mondo') && creator.includes('Curiosità e voglia di scoprire'), 'story creator duplica o perde il profilo');
assert(player.includes("fetch('/api/tts'") && player.includes('fableaReopenStory'), 'contratto TTS o riapertura mancanti');
assert(player.includes('resumePage') && player.includes('Conserva nel suo mondo'), 'ripresa o memoria rituale mancanti');

console.log('Smoke completato: migrazione, grammatica, mondo, durate, rotazione, prepared story, ripresa, memoria separata e TTS non invocato.');
