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
  'assets/js/fablea-story-variables-v3.js',
  'assets/js/fablea-story-engine-v3.js',
  'assets/js/fablea-world-effects-v3.js'
]) vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});

const F = window.FableaProfile;
const E = window.FableaStoryEngine;
const W = window.FableaWorldStateV3;
const V3 = window.FableaStoryVariablesV3;
const E3 = window.FableaStoryEngineV3;
const Effects = window.FableaWorldEffectsV3;
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
  scenario:'Dinosauri',continueStoryId:storyA.id,solution:'observation',ending:'open-thread',source:'test'
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
const persisted = V3.buildAndSave(profile,input,{worldState:state,persistWorldState:false});
const saved = JSON.parse(localStorage.getItem(V3.STORAGE_KEY));
const qa = JSON.parse(localStorage.getItem(V3.QA_STORAGE_KEY));
assert(saved.id === persisted.id && persisted.id === first.id,'richiesta V3 non salvata');
assert(!Object.prototype.hasOwnProperty.call(qa,'name'),'snapshot QA espone il nome');
assert(qa.valid === true,'snapshot QA non segnala validità');

const baseNext = E.buildStory(profile,{family:'avventura',scenario:'Dinosauri',duration:'Breve',mood:'Curiosità e voglia di scoprire'});
const enriched = E3.apply(baseNext,first);
assert(enriched.v3 && enriched.v3.requestId === first.id,'adattamento V3 non marcato');
assert(enriched.pages.length === baseNext.pages.length + 1,'scena di svolta V3 non inserita');
assert(enriched.pages[0].text.includes(storyA.title),'continuità con la storia precedente non visibile');
assert(enriched.pages.some(page => page.v3Role === 'turning-point' && page.scene === 'Il dettaglio che mancava'),'soluzione osservativa non applicata');
assert(enriched.pages.at(-1).v3Role === 'consequence','finale V3 non applicato');
assert(enriched.v3Consequences.openThreads.length === 1,'filo futuro non creato');
assert(enriched.wordCount > baseNext.wordCount,'testo V3 non ha modificato la storia');
assert(E3.apply(enriched,first).pages.length === enriched.pages.length,'adattamento V3 duplicato alla riapertura');

const coCreateRequest = V3.build(profile,{mode:'cocreate',scenario:'Dinosauri',duration:'Breve',ending:'choice',coCreateChoices:3},{worldState:state,persistWorldState:false});
const coCreated = E3.apply(baseNext,coCreateRequest);
const choicePage = coCreated.pages.find(page => page.v3Role === 'choice');
assert(choicePage && choicePage.choices.length === 3,'scelta co-creata non inserita');

const familyRequest = V3.build(profile,{mode:'family',scenario:'Dinosauri',duration:'Breve',presentWith:['mamma','nonno']},{worldState:state,persistWorldState:false});
const familyStory = E3.apply(baseNext,familyRequest);
assert(familyStory.pages[0].text.includes('mamma') && familyStory.pages[0].text.includes('nonno'),'partecipanti familiari non entrano nella storia');

const committed = Effects.commit(profile,enriched);
assert(committed.openThreads.some(thread => thread.sourceStoryId === enriched.id),'conseguenza aperta non salvata nel mondo');
assert(committed.decisions.length > 0,'decisione narrativa non salvata');
assert(committed.relationships.length > 0,'relazione col compagno non salvata');

assert(Object.keys(V3.MODES).length >= 9,'modalità V3 incomplete');
for(const mode of Object.keys(V3.MODES)){
  const request = V3.build(profile,{mode,scenario:'Dinosauri',duration:'Breve'},{worldState:state,persistWorldState:false});
  assert(V3.validate(request).valid,`modalità ${mode} non valida`);
}

const secondState = W.get(secondProfile,{legacyMemory:{treasures:['frammento stellare']},savedStories:[],persist:false});
assert(secondState.childId !== state.childId,'stato V3 condiviso tra profili');
assert(!secondState.objects.includes('ambra antica'),'memoria V3 contaminata tra profili');

const player = fs.readFileSync('story-result.html','utf8');
const discover = fs.readFileSync('discover.html','utf8');
const world = fs.readFileSync('world.html','utf8');
assert(player.includes('E3.apply') && player.includes('W3Effects.commit'),'Libro vivo non applica o non conserva il V3');
assert(discover.includes('fablea-story-engine-v3.js'),'catalogo editoriale non carica il V3');
assert(world.includes('Fili ancora aperti') && world.includes('Scelte ricordate'),'Mondo non mostra le conseguenze V3');
assert(world.includes('beta-continuity') && world.includes('Stanza dei ricordi'),'Mondo non collega conseguenze, ricordi e prossima porta');

console.log('V3 check completato: schema, memoria selettiva, continuità visibile, svolta, finali, co-creazione, conseguenze persistenti, fallback v2 e separazione profili.');