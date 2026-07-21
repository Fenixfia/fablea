import fs from 'node:fs';
import vm from 'node:vm';

const errors = [];
const expect = (condition,message) => {if(!condition) errors.push(message);};
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');

const catalogCode = read('stories-classics/catalog.js');
const discover = read('discover.html');
const library = read('library.html');
const shell = read('assets/js/fablea-shell.js');
const css = read('assets/css/fablea-library.css');
const policy = read('docs/editorial/PUBLIC_DOMAIN_CLASSICS.md');

const context = {window:{}};
vm.createContext(context);
if(catalogCode) vm.runInContext(catalogCode,context,{filename:'stories-classics/catalog.js'});
const stories = context.window.FABLEA_CLASSICS_V1 || [];
const ages = ['2-4','5-7','8-10','11-12'];
const allowedTokens = new Set(['name','world','companion','place','threshold','landmark','sound','sky','material','scent']);

expect(stories.length === 8,`Classici: attesi 8 titoli nella prima collana, trovati ${stories.length}`);
for(const age of ages) expect(stories.filter(story => story.age === age).length === 2,`Classici: la fascia ${age} deve avere due titoli`);

const ids = new Set();
for(const story of stories){
  expect(String(story.id || '').startsWith('classic-'),`Classici: id non separato per ${story.title || 'titolo mancante'}`);
  expect(!ids.has(story.id),`Classici: id duplicato ${story.id}`);
  ids.add(story.id);
  expect(story.collection === 'classic',`${story.id}: collection deve essere classic`);
  expect(story.source && story.source.author && story.source.originalTitle && story.source.origin,`${story.id}: attribuzione incompleta`);
  expect(story.source && story.source.status === 'public-domain',`${story.id}: status pubblico dominio mancante`);
  expect(story.source && /FABLEA/.test(story.source.adaptation || ''),`${story.id}: rinarramento FABLEA non dichiarato`);
  expect(story.title && story.subtitle && story.cover && story.cover.icon && story.cover.art,`${story.id}: scheda editoriale incompleta`);
  expect(story.defaultWorld,`${story.id}: mondo editoriale predefinito mancante`);
  expect(Array.isArray(story.pages) && story.pages.length >= 6,`${story.id}: servono almeno sei scene`);
  expect(story.treasure && story.ritual && story.activity,`${story.id}: esperienza finale incompleta`);
  const text = JSON.stringify(story);
  expect(!/Disney|Pixar|Netflix|DreamWorks|Warner|©|traduzione di/i.test(text),`${story.id}: possibile riferimento a versione moderna o marchio`);
  const unknown = [...text.matchAll(/\{\{([a-zA-Z]+)\}\}/g)].map(match => match[1]).filter(token => !allowedTokens.has(token));
  expect(!unknown.length,`${story.id}: token sconosciuti ${[...new Set(unknown)].join(', ')}`);
}

expect(discover.includes('/stories-classics/catalog.js'),'Biblioteca: catalogo classici non caricato');
expect(discover.includes('/assets/css/fablea-library.css'),'Biblioteca: stile editoriale non caricato');
for(const label of ['Originali FABLEA','Classici rinarrati','Le mie storie']) expect(discover.includes(label),`Biblioteca: sezione ${label} mancante`);
expect(discover.includes('Rinarrato integralmente da FABLEA'),'Biblioteca: attribuzione pubblica del rinarramento mancante');
expect(discover.includes('catalogStoryById'),'Biblioteca: apertura classici non collegata al catalogo completo');
expect(library.includes('Classici rinarrati') && library.includes('story.source'),'Libreria personale: metadati dei classici non mostrati');
expect(shell.includes("const collection = options.collection || 'original'"),'Shell: gli originali non restano la collezione predefinita');
expect(shell.includes("if(collection === 'classic') return classicsFor(profile)"),'Shell: collezione classici non separata');
expect(shell.includes("source:story.collection === 'classic' ? 'classic-catalog' : 'editorial-catalog'"),'Shell: provenienza V3 dei classici non dichiarata');
expect(shell.includes("built = {...built,collection:story.collection || 'original',source:story.source || null}"),'Shell: provenienza non conservata nella storia salvata');
expect(css.includes('.editorial-grid') && css.includes('@media(max-width:660px)'),'Biblioteca: layout editoriale o smartphone mancante');
expect(policy.includes('Non si copiano frasi') && policy.includes('verificato lo status nel territorio'),'Politica pubblico dominio incompleta');

if(errors.length){
  console.error('Classics library check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Classics library check passed: 8 rinarramenti, attribuzione, separazione dal Creator, metadata e responsive coperti.');
