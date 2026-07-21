import fs from 'node:fs';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');

const html = read('story-result.html');
const ui = read('assets/js/fablea-unified-ui.js');
const script = read('assets/js/fablea-page-turn.js');
const css = read('assets/css/fablea-page-turn.css');

if(!/body[^>]+class=["'][^"']*live-book/.test(html)) errors.push('story-result.html: classe live-book mancante');
if(!html.includes('id="prev"') || !html.includes('id="next"')) errors.push('story-result.html: controlli pagina mancanti');
if(!ui.includes('/assets/css/fablea-page-turn.css')) errors.push('fablea-unified-ui.js: caricamento CSS page-turn mancante');
if(!ui.includes('/assets/js/fablea-page-turn.js')) errors.push('fablea-unified-ui.js: caricamento JS page-turn mancante');
if(!script.includes("['touch','pen']")) errors.push('fablea-page-turn.js: gesto touch/pen non limitato esplicitamente');
if(!script.includes("touch-action") && !css.includes('touch-action:pan-y')) errors.push('page-turn: scorrimento verticale non preservato');
if(!script.includes('pointermove') || !script.includes('pointerup')) errors.push('fablea-page-turn.js: ciclo del gesto incompleto');
if(!script.includes('fableaPageTurnHintSeen')) errors.push('fablea-page-turn.js: suggerimento one-shot mancante');
if(!css.includes('@media(prefers-reduced-motion:reduce)')) errors.push('fablea-page-turn.css: reduced motion non gestito');
if(!css.includes('.page-edge-button')) errors.push('fablea-page-turn.css: pulsanti desktop laterali mancanti');
if(!css.includes('perspective:')) errors.push('fablea-page-turn.css: profondità della pagina mancante');

if(errors.length){
  console.error('Live Book page-turn check failed:');
  for(const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Live Book page-turn check passed: touch, pulsanti desktop, scorrimento verticale, accessibilità e reduced motion coperti.');
