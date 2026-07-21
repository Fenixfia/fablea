import fs from 'node:fs';

const productPages = [
  'onboarding.html',
  'create-child.html',
  'profile.html',
  'family-settings.html',
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
const onboardingCss = read('assets/css/fablea-onboarding.css');
if(onboarding !== createChild) errors.push('onboarding.html e create-child.html non sono più identici');
if(!onboarding.includes('placeholder="Es. Leo"')) errors.push('onboarding: placeholder fittizio standard mancante');
if(!onboarding.includes('/assets/css/fablea-onboarding.css')) errors.push('onboarding: foglio stile dedicato non caricato');
if(!onboarding.includes('class="onboarding-layout"') || !onboarding.includes('class="form-grid"')) errors.push('onboarding: impaginazione desktop strutturata mancante');
if(!onboarding.includes('<label for="gender">Sesso</label>')) errors.push('onboarding: etichetta Sesso mancante');
if(!onboarding.includes('<option value="male">Maschio</option>') || !onboarding.includes('<option value="female">Femmina</option>')) errors.push('onboarding: opzioni Maschio/Femmina incomplete');
if(onboarding.includes('Forma neutra') || onboarding.includes('Preferisco non specificarlo') || onboarding.includes('Genere grammaticale')) errors.push('onboarding: vecchie opzioni o diciture ancora presenti');
if(!onboarding.includes("!['male','female'].includes(genderSelect.value)")) errors.push('onboarding: validazione Maschio/Femmina mancante');
if(!onboarding.includes('data-world="FABLEA"')) errors.push('onboarding: palette neutra iniziale mancante');
if(onboarding.includes('document.body.dataset.world = primary')) errors.push('onboarding: il mondo scelto altera ancora lo sfondo durante la compilazione');
if(!onboardingCss.includes('grid-template-columns:minmax(300px,.72fr) minmax(620px,1.28fr)')) errors.push('onboarding: layout desktop a due colonne mancante');
if(!onboardingCss.includes('@media(max-width:900px)')) errors.push('onboarding: breakpoint tablet/mobile mancante');

const profilePage = read('profile.html');
const unifiedUI = read('assets/js/fablea-unified-ui.js');
if(!profilePage.includes('data-world="FABLEA"')) errors.push('profile.html: stato iniziale neutro mancante');
if(!profilePage.includes("applyWorld(window.FableaUnifiedUI.NEUTRAL_WORLD || 'FABLEA')")) errors.push('profile.html: ritorno neutro dopo eliminazione ultimo profilo mancante');
if(!unifiedUI.includes("const NEUTRAL_WORLD = 'FABLEA'")) errors.push('fablea-unified-ui.js: fallback neutro non dichiarato');
if(!unifiedUI.includes("'--sky-1':'#68746f'")) errors.push('fablea-unified-ui.js: palette neutra FABLEA mancante');
if(unifiedUI.includes("const next = world || 'Magia'")) errors.push('fablea-unified-ui.js: Magia ancora usata come fallback globale');

const familySettings = read('family-settings.html');
const familySettingsCss = read('assets/css/fablea-family-settings.css');
if(!familySettings.includes('/assets/css/fablea-family-settings.css')) errors.push('family-settings.html: foglio stile dedicato non caricato');
if(!familySettings.includes('class="settings-layout"')) errors.push('family-settings.html: layout desktop mancante');
if(!familySettingsCss.includes('grid-template-columns:minmax(280px,.72fr) minmax(0,1.28fr)')) errors.push('family settings: impaginazione desktop a due colonne mancante');
if(!familySettingsCss.includes('@media(max-width:900px)')) errors.push('family settings: adattamento tablet/mobile mancante');

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
