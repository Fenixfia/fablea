import fs from 'node:fs';
import vm from 'node:vm';

const storage = {};
const localStorage = {
  getItem:key => storage[key] ?? null,
  setItem:(key,value) => { storage[key] = String(value); },
  removeItem:key => { delete storage[key]; }
};
const window = {localStorage};
const context = {window,localStorage,console,Math,Date};
vm.createContext(context);

for(const file of [
  'assets/js/fablea-grammar.js',
  'assets/js/fablea-profile.js',
  'stories-v2/age-2-4.js',
  'stories-v2/age-5-7.js',
  'stories-v2/age-8-10.js',
  'stories-v2/age-11-12.js',
  'stories-v2/index.js',
  'assets/js/fablea-story-engine.js',
  'assets/js/fablea-world-state-v3.js',
  'assets/js/fablea-story-variables-v3.js'
]) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});

const F = window.FableaProfile;
const E = window.FableaStoryEngine;
const W = window.FableaWorldStateV3;
const V3 = window.FableaStoryVariablesV3;
const assert = (condition,message) => { if(!condition) throw new Error(message); };

const profile = F.saveProfile({
  id:'v3-a',name:'Ari',age:'5-7',gender:'unspecified',primaryWorld:'Dinosauri',
  interests:['Mare'],favoriteCompanion:'Timo',support:'Stimolare curiosità',duration:'Media',storyStyle:'adventurous'
});
const secondProfile = F.saveProfile({
  id:'v3-b',name:'Nico',age:'8-10',gender:'neutral',primaryWorld:'Spazio',
  interests:['Misteri e scoperte'],favoriteCompanion:'Astra',support:'Accendere l’immaginazione',duration:'Breve',storyStyle:'mysterious'
});

const storyA = E.buildStory(profile,{family:'avventura',scenario:'Dinosauri',duration:'Media',mood:'Curiosità e voglia di scoprire'});
E.saveStory(storyA);
F.updateMemory(profile,{treasures:['ambra antica'],rituals:['seguire tre impronte'],promises:['tornare al vulcano']});

const state = W.get(profile);
assert(state.schemaVersion === 3,'world state non versionato');
assert(state.childId === profile.id,'world state associato al profilo errato');
assert(state.visitedWorlds.includes('Dinosauri'),'mondo principale assente');
assert(state.objects.includes('ambra antica'),'tesoro legacy non migrato');
assert(state.openThreads.length === 1,'filo aperto legacy non migrato');

const input = {
  mode:'continue',family:'avventura',mood:'Curiosità e voglia di scoprire',duration:'Media',
  scenario:'Dinosauri',continueStoryId:storyA.id,source:'test'
};
const first = V3.build(profile,input,{worldState:state,persistWorldState:false});
const second = V3.build(profile,input,{worldState:state,persistWorldState:false});
assert(first.id === second.id,'richiesta V3 non deterministica a parità di input');
assert(V3.validate(first).valid,'richiesta V3 non valida');
assert(first.world.selectedMemory.length <= 3,'selezione memoria oltre il limite');
assert(first.world.selectedMemory.some(item => item.id === storyA.id),'storia da continuare non selezionata');
assert(first.safety.diagnosticLanguage === false,'linguaggio diagnostico non disattivato');
assert(first.safety.commercialProfiling === false,'profilazione commerciale non disattivata');

const legacy = V3.toLegacy(first);
assert(legacy.profileId === profile.id && legacy.scenario === 'Dinosauri','fallback legacy non coerente');
V3.save(first);
const saved = JSON.parse(localStorage.getItem(V3.STORAGE_KEY));
const qa = JSON.parse(localStorage.getItem(V3.QA_STORAGE_KEY));
assert(saved.id === first.id,'richiesta V3 non salvata');
assert(!Object.prototype.hasOwnProperty.call(qa,'name'),'snapshot QA espone il nome');
assert(qa.valid === true,'snapshot QA non segnala validità');

assert(Object.keys(V3.MODES).length >= 9,'modalità V3 incomplete');
for(const mode of Object.keys(V3.MODES)){
  const request = V3.build(profile,{mode,scenario:'Dinosauri',duration:'Breve'},{worldState:state,persistWorldState:false});
  assert(V3.validate(request).valid,`modalità ${mode} non valida`);
}

const secondState = W.get(secondProfile,{legacyMemory:{treasures:['frammento stellare']},savedStories:[],persist:false});
assert(secondState.childId !== state.childId,'stato V3 condiviso tra profili');
assert(!secondState.objects.includes('ambra antica'),'memoria V3 contaminata tra profili');

console.log('V3 check completato: schema, determinismo, modalità, sicurezza, memoria selettiva, fallback v2 e separazione profili.');