import fs from 'node:fs';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');
const expect = (condition,message) => {if(!condition) errors.push(message);};

const home = read('index.html');
const onboarding = read('onboarding.html');
const createChild = read('create-child.html');
const casa = read('child-hub.html');
const world = read('world.html');
const discover = read('discover.html');
const parent = read('parent-area.html');
const betaState = read('assets/js/fablea-beta-state.js');
const platform = read('assets/js/fablea-platform-adapters.js');
const worldArt = read('assets/js/fablea-world-art.js');
const betaCss = read('assets/css/fablea-beta.css');
const activityRoute = read('assets/js/fablea-activity-route.js');
const storyContinuity = read('assets/js/fablea-story-continuity.js');
const productionDoc = read('docs/architecture/PRODUCTION_FOUNDATION.md');
const play = read('play.html');
const learn = read('learn.html');
const profiles = read('profile.html');

// 1. Public promise and approved business model.
expect(home.includes('Un mondo personale per crescere, creare e imparare'),'Home beta: promessa ecosistema mancante');
for(const label of ['Storie','Crea','Gioca','Impara','Scuola']) expect(home.includes(`>${label}<`),`Home beta: ambiente ${label} mancante`);
expect(home.includes('15 giorni') && home.includes('5,99 €') && home.includes('59,90 €'),'Home beta: prova o prezzi approvati mancanti');
expect(!home.includes('2–12 anni · nessuna pubblicità'),'Home beta: vecchia pillola commerciale ancora presente');
expect(home.includes('Ogni bambino segue un percorso personale'),'Home beta: messaggio famiglia positivo assente');

// 2. Three-step onboarding, required sex, advanced preferences moved away.
expect(onboarding === createChild,'Onboarding beta: i due ingressi di creazione profilo non coincidono');
for(const stage of ['data-stage="1"','data-stage="2"','data-stage="3"']) expect(onboarding.includes(stage),`Onboarding beta: ${stage} mancante`);
expect(onboarding.includes('<label for="gender">Sesso</label>'),'Onboarding beta: campo Sesso mancante');
expect(onboarding.includes('>Maschio<') && onboarding.includes('>Femmina<'),'Onboarding beta: opzioni Maschio/Femmina mancanti');
expect(!onboarding.includes('id="support"') && !onboarding.includes('id="duration"') && !onboarding.includes('id="storyStyle"'),'Onboarding beta: preferenze avanzate non rimosse');
expect(onboarding.includes('beta-world-picker') && onboarding.includes('FableaWorldArt'),'Onboarding beta: scelta visuale del mondo mancante');

// 3. Casa focused on one contextual recommendation, real rooms and a clearly labelled future school area.
expect(casa.includes('beta-today') && casa.includes('recommendation') && casa.includes('Continua il tuo viaggio'),'Casa beta: invito contestuale mancante');
for(const label of ['Leggiamo','Inventiamo','Giochiamo','Scopriamo']) expect(casa.includes(`>${label}<`),`Casa beta: stanza ${label} mancante`);
expect(!casa.includes('In crescita') && !casa.includes('Nuovi luoghi stanno prendendo forma') && casa.includes('beta-room--future') && casa.includes('In sviluppo'),'Casa beta: area Scuola futura non dichiarata correttamente');
expect(casa.includes('Il mondo è cambiato') && casa.includes('Stanza dei ricordi'),'Casa beta: cambiamento del mondo non visibile');
expect(!betaState.includes('Oggi per te'),'Casa beta: è tornata la dicitura promozionale “Oggi per te”');

// 3b. Family switcher belongs to the same product and never exposes a demo profile.
expect(profiles.includes('beta-profile-page') && profiles.includes('Scegli chi entra.'),'Profili beta: pagina non allineata a Home e Casa');
expect(profiles.includes('Entra nella Casa') && profiles.includes('Aggiungi un bambino'),'Profili beta: azioni familiari poco chiare');
expect(!profiles.includes('Federico') && !profiles.includes('Profilo di test'),'Profili beta: dati demo inseriti nella pagina');

// 4. Story -> artifact -> activity -> world continuity.
expect(betaState.includes('function artifact(') && betaState.includes('function relatedActivity(') && betaState.includes('function recommendation('),'Continuità beta: motore incompleto');
expect(storyContinuity.includes('La storia ha aperto una nuova porta'),'Continuità beta: ponte dopo il rituale mancante');
expect(play.includes('fablea-activity-route.js') && learn.includes('fablea-activity-route.js'),'Continuità beta: percorsi attività non apribili da una storia');
expect(activityRoute.includes('data-route'),'Continuità beta: selezione automatica percorso mancante');
expect(world.includes('beta-continuity') && world.includes('Stanza dei ricordi'),'Mondo beta: sequenza di continuità non mostrata');

// 5. Child library clean; adult details separated.
expect(discover.includes('beta-story-card') && discover.includes('Apri il Libro vivo'),'Biblioteca beta: schede bambino mancanti');
expect(discover.includes('<details class="beta-card beta-editorial-details">'),'Biblioteca beta: dettagli adulto non separati');
expect(!discover.includes('editorial-source'),'Biblioteca beta: note legali ancora dentro ogni scheda');

// 6. Parent area and preferences.
expect(parent.includes('Area genitore') && parent.includes('Crea un PIN locale'),'Area genitore: gate locale mancante');
expect(parent.includes('Non è una pagella'),'Area genitore: impostazione non competitiva mancante');
for(const field of ['id="duration"','id="storyStyle"','id="support"']) expect(parent.includes(field),`Area genitore: preferenza ${field} mancante`);
expect(parent.includes('Esporta o cancella dati'),'Area genitore: controllo dati non collegato');

// 7. Honest production foundation.
expect(platform.includes("mode:'disabled'") && platform.includes('checkout:unavailable'),'Piattaforma beta: adapter disattivati non espliciti');
expect(betaState.includes("mode:'local-beta'") && betaState.includes('checkoutEnabled:false'),'Piattaforma beta: stato locale o checkout disattivo mancante');
expect(parent.includes('Checkout non ancora attivo'),'Area genitore: checkout presentato in modo ambiguo');
for(const section of ['Identità del genitore','Database europeo','Pagamenti','Cancellazione verificabile']) expect(productionDoc.includes(section),`Fondazione produzione: sezione ${section} mancante`);

// Visual and mobile foundations.
expect(worldArt.includes('Dinosauri') && worldArt.includes('Misteri e scoperte') && worldArt.includes('<svg'),'Atlante visuale beta incompleto');
expect(betaCss.includes('@media(max-width:390px)') && betaCss.includes('min-height:44px'),'Beta responsive: iPhone o touch target non coperti');
expect(!betaCss.includes('position:fixed'),'Beta responsive: introdotto un elemento fisso sovrapposto');

if(errors.length){
  console.error('Integrated beta check failed:');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Integrated beta check passed: public promise, short onboarding, focused Casa, continuity, clean library, parent area and honest production adapters are present.');
