import fs from 'node:fs';

const productPages = [
  'onboarding.html',
  'create-child.html',
  'profile.html',
  'child-hub.html',
  'discover.html',
  'story.html',
  'story-result.html',
  'world.html',
  'library.html',
  'manualita.html'
];
const publicPages = ['index.html','about.html'];
const errors = [];

function read(file){
  if(!fs.existsSync(file)){
    errors.push(`${file}: file mancante`);
    return '';
  }
  return fs.readFileSync(file,'utf8');
}

for(const file of productPages){
  const html = read(file);
  if(!html.includes('/assets/css/fablea-unified.css')) errors.push(`${file}: sistema visivo unificato non caricato`);
  if(!/body[^>]+class=["'][^"']*fablea-product/.test(html)) errors.push(`${file}: body non marcato come prodotto FABLEA`);
  if(!html.includes('/assets/css/fablea-shell.css')) errors.push(`${file}: token dei mondi non caricati`);
  if(!html.includes('class="brand"') && !html.includes('class="shell-top"')) errors.push(`${file}: testata FABLEA assente`);
}

for(const file of publicPages){
  const html = read(file);
  if(!html.includes('/assets/css/fablea-unified.css')) errors.push(`${file}: sistema visivo unificato non caricato`);
  if(!html.includes('/assets/css/fablea-public.css')) errors.push(`${file}: livello pubblico non caricato`);
  if(!/body[^>]+class=["'][^"']*fablea-public/.test(html)) errors.push(`${file}: body non marcato come pagina pubblica`);
}

const childHub = read('child-hub.html');
const unifiedIndex = childHub.indexOf('/assets/css/fablea-unified.css');
const emotionIndex = childHub.indexOf('/assets/css/fablea-mobile-emotion.css');
if(unifiedIndex < 0 || emotionIndex < 0 || emotionIndex < unifiedIndex){
  errors.push('child-hub.html: il livello mobile emozionale deve essere caricato dopo la base unificata');
}

const onboarding = read('onboarding.html');
const createChild = read('create-child.html');
if(onboarding !== createChild) errors.push('onboarding.html e create-child.html non sono più identici');
if(!onboarding.includes('placeholder="Es. Leo"')) errors.push('onboarding: placeholder fittizio standard mancante');
if(!onboarding.includes('/assets/css/fablea-onboarding.css')) errors.push('onboarding: livello cromatico dedicato non caricato');
if(!onboarding.includes('onboarding-page')) errors.push('onboarding: classe visiva dedicata mancante');
if(!onboarding.includes('data-sex="male"') || !onboarding.includes('data-sex="female"')) errors.push('onboarding: scelte Maschio/Femmina incomplete');
if(onboarding.includes('data-sex="neutral"') || onboarding.includes('data-sex="unspecified"')) errors.push('onboarding: opzioni aggiuntive non previste');
if(!onboarding.includes("!['male','female'].includes(genderInput.value)")) errors.push('onboarding: validazione binaria mancante');

const oldOnly = [...productPages,...publicPages].filter(file => {
  const html = read(file);
  return html.includes('/assets/css/fablea.css') && !html.includes('/assets/css/fablea-unified.css');
});
if(oldOnly.length) errors.push(`pagine rimaste sul solo stile storico: ${oldOnly.join(', ')}`);

if(errors.length){
  console.error('Visual system check failed:');
  for(const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Visual system check passed: ${productPages.length} pagine prodotto e ${publicPages.length} pagine pubbliche condividono lo stesso sistema.`);