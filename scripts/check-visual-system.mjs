import fs from 'node:fs';

const productPages = [
  'onboarding.html','create-child.html','profile.html','family-settings.html','parent-area.html','child-hub.html','discover.html',
  'story.html','story-result.html','world.html','library.html','manualita.html','play.html','learn.html'
];
const publicPages = ['index.html','about.html'];
const betaPages = new Set(['index.html','onboarding.html','create-child.html','parent-area.html','child-hub.html','discover.html','world.html']);
const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');

for(const file of productPages){
  const html = read(file);
  if(!html.includes('/assets/css/fablea-unified.css')) errors.push(`${file}: sistema visivo unificato non caricato`);
  const isBeta = betaPages.has(file);
  if(isBeta){
    if(!/body[^>]+class=["'][^"']*beta-page/.test(html)) errors.push(`${file}: body non marcato come superficie beta`);
    if(!html.includes('/assets/css/fablea-beta.css')) errors.push(`${file}: sistema beta condiviso non caricato`);
    if(!html.includes('class="beta-brand"')) errors.push(`${file}: testata beta FABLEA assente`);
  }else{
    if(!/body[^>]+class=["'][^"']*fablea-product/.test(html)) errors.push(`${file}: body non marcato come prodotto FABLEA`);
    if(!html.includes('/assets/css/fablea-shell.css')) errors.push(`${file}: token dei mondi non caricati`);
    if(!html.includes('class="brand"') && !html.includes('class="shell-top"')) errors.push(`${file}: testata FABLEA assente`);
  }
}

for(const file of publicPages){
  const html = read(file);
  if(!html.includes('/assets/css/fablea-unified.css')) errors.push(`${file}: sistema visivo unificato non caricato`);
  if(file === 'index.html'){
    if(!html.includes('/assets/css/fablea-beta.css') || !/body[^>]+class=["'][^"']*beta-page/.test(html)) errors.push(`${file}: Home pubblica beta non configurata`);
  }else{
    if(!html.includes('/assets/css/fablea-public.css')) errors.push(`${file}: livello pubblico non caricato`);
    if(!/body[^>]+class=["'][^"']*fablea-public/.test(html)) errors.push(`${file}: body non marcato come pagina pubblica`);
  }
}

const childHub = read('child-hub.html');
const betaCss = read('assets/css/fablea-beta.css');
if(!childHub.includes('/assets/css/fablea-beta.css')) errors.push('child-hub.html: livello visivo beta non caricato');
if(!childHub.includes('class="beta-child-hero"') || !childHub.includes('class="beta-room-grid')) errors.push('child-hub.html: struttura Casa contestuale mancante');
if(!childHub.includes('Il mondo è cambiato') || !childHub.includes('Stanza dei ricordi')) errors.push('child-hub.html: traccia visuale del mondo mancante');
if(!betaCss.includes('grid-template-columns:repeat(4')) errors.push('Casa FABLEA: quattro porte desktop non impaginate');
if(!betaCss.includes('@media(max-width:640px)') || !betaCss.includes('@media(max-width:390px)')) errors.push('Casa FABLEA: layout smartphone incompleto');
if(betaCss.includes('position:fixed')) errors.push('Sistema beta: elemento fisso potenzialmente sovrapposto');

const onboarding = read('onboarding.html');
const createChild = read('create-child.html');
if(onboarding !== createChild) errors.push('onboarding.html e create-child.html non sono più identici');
if(!onboarding.includes('/assets/css/fablea-beta.css')) errors.push('onboarding: foglio beta condiviso non caricato');
for(const stage of ['data-stage="1"','data-stage="2"','data-stage="3"']) if(!onboarding.includes(stage)) errors.push(`onboarding: ${stage} mancante`);
if(!onboarding.includes('class="beta-world-picker"') || !onboarding.includes('class="beta-companion-builder"')) errors.push('onboarding: scelta mondo o compagno non strutturata');
if(!onboarding.includes('<label for="gender">Sesso</label>')) errors.push('onboarding: etichetta Sesso mancante');
if(!onboarding.includes('<option value="male">Maschio</option>') || !onboarding.includes('<option value="female">Femmina</option>')) errors.push('onboarding: opzioni Maschio/Femmina incomplete');
if(onboarding.includes('Forma neutra') || onboarding.includes('Preferisco non specificarlo') || onboarding.includes('Genere grammaticale')) errors.push('onboarding: vecchie opzioni o diciture ancora presenti');
if(!onboarding.includes("!['male','female'].includes(genderSelect.value)")) errors.push('onboarding: validazione Maschio/Femmina mancante');
if(!onboarding.includes('id="companionPreview"')) errors.push('onboarding: anteprima compagno mancante');
if(!onboarding.includes("location.assign('/child-hub.html?welcome=1')")) errors.push('onboarding: ingresso nella Casa FABLEA mancante');
if(!betaCss.includes('.beta-onboarding') || !betaCss.includes('.beta-form-stage')) errors.push('onboarding: stili multi-passaggio mancanti');

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

const parent = read('parent-area.html');
if(!parent.includes('beta-parent-layout') || !parent.includes('beta-parent-gate')) errors.push('area genitore: gate o dashboard visuale mancanti');
if(!betaCss.includes('.beta-parent-layout') || !betaCss.includes('.beta-pin-row')) errors.push('area genitore: stili dedicati mancanti');

for(const file of ['play.html','learn.html']){
  const html = read(file);
  if(!html.includes('/assets/css/fablea-activities.css')) errors.push(`${file}: ambiente attività non caricato`);
  if(!html.includes('class="activity-main"')) errors.push(`${file}: layout attività mancante`);
}
const activityCss = read('assets/css/fablea-activities.css');
if(!activityCss.includes('grid-template-columns:minmax(280px,.72fr) minmax(520px,1.28fr)')) errors.push('attività: layout desktop separato mancante');
if(!activityCss.includes('@media(max-width:920px)')) errors.push('attività: adattamento mobile mancante');

const oldOnly = [...productPages,...publicPages].filter(file => {const html = read(file);return html.includes('/assets/css/fablea.css') && !html.includes('/assets/css/fablea-unified.css');});
if(oldOnly.length) errors.push(`pagine rimaste sul solo stile storico: ${oldOnly.join(', ')}`);

if(errors.length){console.error('Visual system check failed:');for(const error of errors) console.error(`- ${error}`);process.exit(1);}
console.log(`Visual system check passed: ${productPages.length} pagine prodotto e ${publicPages.length} pagine pubbliche condividono il sistema unificato o beta.`);