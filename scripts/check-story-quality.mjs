import fs from 'node:fs';
import vm from 'node:vm';

const files = [
  'stories-v2/age-2-4.js',
  'stories-v2/age-5-7.js',
  'stories-v2/age-8-10.js',
  'stories-v2/age-11-12.js',
  'stories-v2/index.js',
  'stories-v2/supplements.js'
];
const context = {window:{}};
vm.createContext(context);
for(const file of files){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}

const stories = context.window.FABLEA_STORIES_V2 || [];
const ages = ['2-4','5-7','8-10','11-12'];
const families = ['avventura','calma-sera','emozioni','scoperta'];
const targets = {
  '2-4': {Breve:[200,380],Media:[300,600],Lunga:[430,800]},
  '5-7': {Breve:[380,750],Media:[520,1050],Lunga:[760,1400]},
  '8-10': {Breve:[500,1100],Media:[750,1500],Lunga:[1050,1900]},
  '11-12': {Breve:[800,1450],Media:[1000,2000],Lunga:[1350,2500]}
};
const failures = [];
const ids = new Set();
const titles = new Set();
const allowedTokens = new Set([
  'name','pronoun','subject','child','explorer','curious','ready','brave','possessive',
  'world','place','threshold','landmark','sound','sky','material','companion','scent'
]);

function wordCount(text){
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function normalizeSentence(sentence){
  return sentence
    .toLowerCase()
    .replace(/\{\{[a-z]+\}\}/g,'{{token}}')
    .replace(/[^a-zà-öø-ÿ0-9\s]/gi,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function sentences(text){
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map(normalizeSentence)
    .filter(sentence => sentence.split(' ').length >= 7);
}

function combinedPages(story){
  const byAnchor = new Map();
  (story.extensions || []).forEach(extension => {
    const list = byAnchor.get(extension.after) || [];
    list.push({...extension,isExtension:true});
    byAnchor.set(extension.after,list);
  });
  const combined = [];
  (story.pages || []).forEach(page => {
    combined.push({...page,isExtension:false});
    combined.push(...(byAnchor.get(page.id) || []));
  });
  const known = new Set((story.pages || []).map(page => page.id));
  (story.extensions || []).filter(extension => !known.has(extension.after)).forEach(extension => {
    combined.push({...extension,isExtension:true});
  });
  return combined;
}

function requiredAnchors(story,duration){
  const required = new Set();
  (story.extensions || []).forEach(extension => {
    if(duration === 'Breve' && extension.includeInShort) required.add(extension.after);
    if(duration === 'Media' && extension.includeInMedium) required.add(extension.after);
  });
  return required;
}

function visible(page,duration,anchors){
  if(page.isExtension){
    if(duration === 'Breve') return Boolean(page.includeInShort);
    if(duration === 'Media') return Boolean(page.includeInMedium);
    return true;
  }
  if(duration === 'Breve') return !page.optionalForShort || anchors.has(page.id);
  if(duration === 'Media') return !page.optionalForMedium || anchors.has(page.id);
  return true;
}

function textsFor(story,duration){
  const anchors = requiredAnchors(story,duration);
  return combinedPages(story)
    .filter(page => visible(page,duration,anchors))
    .map(page => duration === 'Breve' ? page.text : [page.text,page.detail].filter(Boolean).join(' '));
}

function jaccard(first,second){
  const a = new Set(sentences(first));
  const b = new Set(sentences(second));
  if(!a.size || !b.size) return 0;
  const intersection = [...a].filter(value => b.has(value)).length;
  return intersection / new Set([...a,...b]).size;
}

for(const age of ages){
  const ageStories = stories.filter(story => story.age === age);
  if(ageStories.length !== 4) failures.push(`${age}: attese esattamente 4 storie editoriali, trovate ${ageStories.length}`);
  for(const family of families){
    if(ageStories.filter(story => story.family === family).length !== 1){
      failures.push(`${age}: la famiglia ${family} deve comparire esattamente una volta`);
    }
  }
}

for(const story of stories){
  if(ids.has(story.id)) failures.push(`id duplicato: ${story.id}`);
  ids.add(story.id);
  const cleanTitle = String(story.title || '').toLowerCase();
  if(titles.has(cleanTitle)) failures.push(`titolo duplicato: ${story.title}`);
  titles.add(cleanTitle);

  if(!story.title || !story.subtitle) failures.push(`${story.id}: titolo o sottotitolo mancante`);
  if(!story.adaptableToWorld && (!Array.isArray(story.worlds) || !story.worlds.length)) failures.push(`${story.id}: mondi mancanti`);
  if(!Array.isArray(story.pages) || story.pages.length < 9) failures.push(`${story.id}: servono almeno 9 scene principali`);
  if(!Array.isArray(story.extensions) || story.extensions.length < 2) failures.push(`${story.id}: approfondimenti di durata mancanti`);
  if(!story.treasure || !story.ritual || !story.activity) failures.push(`${story.id}: tesoro, rituale o attività mancanti`);
  if(!story.cover || !story.cover.icon || !story.cover.art) failures.push(`${story.id}: copertina incompleta`);

  const pageIds = new Set();
  for(const page of combinedPages(story)){
    if(!page.id) failures.push(`${story.id}: scena senza id`);
    if(pageIds.has(page.id)) failures.push(`${story.id}: id scena duplicato ${page.id}`);
    pageIds.add(page.id);
    if(!page.scene || !page.text) failures.push(`${story.id}/${page.id}: titolo scena o testo mancante`);
  }

  const allText = [story.title,story.subtitle,story.treasure,story.ritual,story.activity]
    .concat(combinedPages(story).flatMap(page => [page.scene,page.text,page.detail]))
    .filter(Boolean)
    .join(' ');

  if(/Nel dettaglio|passo narrativo riconoscibile|\b\d+-\d+-(?:avventura|calma-sera|emozioni|scoperta)-\w+-\d+\b/i.test(allText)){
    failures.push(`${story.id}: rilevato padding o codice-seme nel testo`);
  }
  if(/fableaExpandStory|extendedForLong/.test(allText)) failures.push(`${story.id}: formato legacy presente`);

  const unknownTokens = [...allText.matchAll(/\{\{([a-zA-Z]+)\}\}/g)]
    .map(match => match[1])
    .filter(token => !allowedTokens.has(token));
  if(unknownTokens.length) failures.push(`${story.id}: token sconosciuti ${[...new Set(unknownTokens)].join(', ')}`);

  const seenSentences = new Map();
  for(const sentence of sentences(allText)) seenSentences.set(sentence,(seenSentences.get(sentence) || 0) + 1);
  for(const [sentence,count] of seenSentences){
    if(count > 1) failures.push(`${story.id}: frase ripetuta ${count} volte: “${sentence.slice(0,90)}…”`);
  }

  let previousCount = 0;
  for(const duration of ['Breve','Media','Lunga']){
    const text = textsFor(story,duration).join(' ');
    const count = wordCount(text);
    const [minimum,maximum] = targets[story.age][duration];
    if(count < minimum || count > maximum) failures.push(`${story.id} ${duration}: ${count} parole, target ${minimum}-${maximum}`);
    if(count <= previousCount) failures.push(`${story.id}: la durata ${duration} non cresce rispetto alla precedente`);
    previousCount = count;
  }
}

for(let i = 0; i < stories.length; i += 1){
  for(let j = i + 1; j < stories.length; j += 1){
    const similarity = jaccard(textsFor(stories[i],'Media').join(' '),textsFor(stories[j],'Media').join(' '));
    if(similarity > 0.18){
      failures.push(`somiglianza eccessiva ${(similarity * 100).toFixed(1)}% tra ${stories[i].id} e ${stories[j].id}`);
    }
  }
}

const generator = fs.readFileSync('scripts/generate-stories.mjs','utf8');
if(/while\s*\([^)]*word|function\s+pad|\.repeat\s*\(/i.test(generator)) failures.push('generate-stories.mjs contiene logiche di padding o ripetizione');

const mainFlow = ['story-result.html','assets/js/fablea-story-engine.js','library.html']
  .map(file => fs.readFileSync(file,'utf8'))
  .join('\n');
if(mainFlow.includes('fableaExpandStory')) failures.push('fableaExpandStory presente nel flusso principale');
if(stories.some(story => story.legacy)) failures.push('storia legacy nel catalogo principale');

if(failures.length){
  console.error(`Quality gate fallito con ${failures.length} problema/i:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

for(const story of stories){
  const counts = ['Breve','Media','Lunga']
    .map(duration => `${duration.toLowerCase()}=${wordCount(textsFor(story,duration).join(' '))}`)
    .join(', ');
  console.log(`${story.id}: ${counts}, scene=${combinedPages(story).length}`);
}
