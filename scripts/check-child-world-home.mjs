import fs from 'node:fs';
import vm from 'node:vm';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');
const expect = (condition,message) => {if(!condition) errors.push(message);};

const home = read('child-hub.html');
const onboarding = read('onboarding.html');
const createChild = read('create-child.html');
const play = read('play.html');
const learn = read('learn.html');
const activities = read('assets/js/fablea-activities.js');
const companion = read('assets/js/fablea-companion.js');
const unified = read('assets/js/fablea-unified-ui.js');
const story = read('story.html');
const homeCss = read('assets/css/fablea-child-home.css');
const livingCss = read('assets/css/fablea-living-world.css');
const activityCss = read('assets/css/fablea-activities.css');
const navigationCss = read('assets/css/fablea-integrated-navigation.css');

for(const [label,href] of [['Leggiamo','/discover.html'],['Inventiamo','/story.html'],['Giochiamo','/play.html'],['Scopriamo','/learn.html']]){
  expect(home.includes(`>${label}<`) && home.includes(`href="${href}"`),`Casa FABLEA: porta ${label} mancante o non collegata`);
}
expect(home.includes('id="homeCompanion"'),'Casa FABLEA: compagno centrale mancante');
expect(home.includes('living-home-map') && home.includes('Nuovi luoghi stanno prendendo forma'),'Casa FABLEA: mappa viva o ambienti futuri mancanti');
expect(home.includes('/assets/css/fablea-child-home.css'),'Casa FABLEA: foglio stile dedicato mancante');
expect(homeCss.includes('grid-template-columns:repeat(4') || livingCss.includes('grid-template-columns:repeat(4'),'Casa FABLEA: quattro porte desktop non impaginate');
expect(homeCss.includes('@media(max-width:640px)') || livingCss.includes('@media(max-width:640px)'),'Casa FABLEA: adattamento smartphone mancante');

expect(onboarding === createChild,'I due percorsi di creazione profilo non sono identici');
expect(onboarding.includes('Crea la sua Casa FABLEA'),'Onboarding: destinazione Casa non dichiarata');
expect(onboarding.includes("location.assign('/child-hub.html?welcome=1')"),'Onboarding: ingresso diretto nella Casa mancante');
expect(onboarding.includes('companionVisual'),'Onboarding: compagno visuale non salvato');
expect(onboarding.includes('id="companionPreview"'),'Onboarding: anteprima del compagno mancante');
expect(!onboarding.includes('Apri la prima storia'),'Onboarding: la prima storia è ancora imposta come destinazione');

expect(play.includes('data-activity="play"'),'Giochiamo: modalità attività mancante');
expect(learn.includes('data-activity="learn"'),'Scopriamo: modalità attività mancante');
for(const age of ['2-4','5-7','8-10','11-12']){
  expect(activities.includes(`'${age}':[`) || activities.includes(`'${age}': [`),`Attività: fascia ${age} non coperta`);
}
expect(activities.includes("const STORAGE_KEY = 'fableaActivityProgress'"),'Attività: progressi separati non persistenti');
expect(activities.includes('progressState[profile.id]'),'Attività: progressi non separati per profilo');
expect(activityCss.includes('min-height:76px'),'Attività: touch target delle risposte insufficiente');

const storage = {};
const localStorage = {getItem:key => storage[key] ?? null,setItem:(key,value) => {storage[key] = String(value);},removeItem:key => {delete storage[key];}};
const context = {window:{localStorage},localStorage,console,Math,String,Array,Object,Set};
vm.createContext(context);
vm.runInContext(companion,context,{filename:'assets/js/fablea-companion.js'});
const C = context.window.FableaCompanion;
expect(C.resolve('Orso con uno zaino rosso','Foresta','test').type === 'bear','Compagno: Orso non riconosciuto');
expect(C.resolve('Orso con uno zaino rosso','Foresta','test').accessory === 'backpack','Compagno: accessorio zaino non riconosciuto');
const first = C.resolve('Orso','Foresta','same-child');
const second = C.resolve('Orso','Foresta','same-child');
expect(JSON.stringify(first) === JSON.stringify(second),'Compagno: raffigurazione non deterministica');
expect(C.render({favoriteCompanion:'Orso',primaryWorld:'Foresta',id:'same-child'}).includes('<svg'),'Compagno: SVG non generato');

expect(story.includes('data-fablea-companion'),'Creator: compagno persistente non montato');
expect(unified.includes('story-companion-visual'),'Libro vivo: compagno non aggiunto accanto alla storia');
expect(unified.includes('/assets/js/fablea-companion.js'),'Sistema unificato: caricamento del compagno mancante');
expect(unified.includes('/assets/css/fablea-integrated-navigation.css'),'Sistema unificato: navigazione integrata non caricata');
expect(navigationCss.includes('position:relative!important'),'Navigazione: barre non riportate nel flusso della pagina');
expect(navigationCss.includes('.fablea-product .explore-dock'),'Navigazione: dock inferiore non coperto');
expect(!navigationCss.includes('.explore-dock{\n  position:fixed'),'Navigazione: dock inferiore nuovamente sovrapposto');
expect(navigationCss.includes('padding:18px 16px 26px!important'),'Navigazione: spazio mobile non corretto dopo la rimozione della testata fissa');

if(errors.length){
  console.error('Child world home check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Child world home check passed: Casa viva, compagno persistente, attività per età, Libro vivo e navigazione non sovrapposta coperti.');
