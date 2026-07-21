import fs from 'node:fs';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');

const html = read('story-result.html');
const ui = read('assets/js/fablea-unified-ui.js');
const script = read('assets/js/fablea-page-turn.js');
const css = read('assets/css/fablea-page-turn.css');

if(!/body[^>]+class=["'][^"']*live-book/.test(html)) errors.push('story-result.html: classe live-book mancante');
if(!html.includes('class="page-sheet"') || !html.includes('class="illustration"') || !html.includes('class="page-card"')) errors.push('story-result.html: foglio illustrato unificato incompleto');
if(!html.includes('id="prev"') || !html.includes('id="next"')) errors.push('story-result.html: controlli pagina mancanti');
if(!html.includes('/assets/css/fablea-page-turn.css') || !html.includes('/assets/js/fablea-page-turn.js')) errors.push('story-result.html: caricamento diretto del page-turn mancante');
if(!html.includes('data-fablea-page-turn')) errors.push('story-result.html: protezione anti-doppio caricamento mancante');
if(!ui.includes('/assets/css/fablea-page-turn.css') || !ui.includes('/assets/js/fablea-page-turn.js')) errors.push('fablea-unified-ui.js: fallback page-turn mancante');
if(!script.includes('touchstart') || !script.includes('touchmove') || !script.includes('touchend')) errors.push('fablea-page-turn.js: ciclo touch Safari incompleto');
if(!script.includes("event.pointerType !== 'pen'")) errors.push('fablea-page-turn.js: fallback penna mancante');
if(!css.includes('touch-action:pan-y pinch-zoom')) errors.push('page-turn: scorrimento verticale e zoom non preservati');
if(!script.includes('fableaPageTurnHintSeen')) errors.push('fablea-page-turn.js: suggerimento one-shot mancante');
if(!css.includes('@media(prefers-reduced-motion:reduce)')) errors.push('fablea-page-turn.css: reduced motion non gestito');
if(!css.includes('.page-edge-button')) errors.push('fablea-page-turn.css: pulsanti laterali mancanti');
if(!css.includes('env(safe-area-inset-bottom)')) errors.push('fablea-page-turn.css: safe area mobile non gestita');
if(!css.includes('data-density="dense"') || !html.includes('densityFor')) errors.push('Live Book: adattamento alla lunghezza del testo mancante');
if(!css.includes('.fablea-product.live-book .book') || !css.includes('display:block')) errors.push('Live Book: vecchia griglia a due colonne non neutralizzata');
if(!css.includes('perspective:')) errors.push('fablea-page-turn.css: profondità della pagina mancante');

if(errors.length){
  console.error('Live Book page-turn check failed:');
  for(const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Live Book page-turn check passed: foglio illustrato unico, touch Safari, densità testo, safe area, pulsanti e reduced motion coperti.');