import fs from 'node:fs';

const errors = [];
const read = file => fs.existsSync(file) ? fs.readFileSync(file,'utf8') : (errors.push(`${file}: file mancante`),'');

const vercel = read('vercel.json');
const cloudflare = read('_headers');
const tts = read('api/tts.js');
const dataControl = read('assets/js/fablea-data-control.js');
const settings = read('family-settings.html');
const profile = read('profile.html');
const baseline = read('docs/security/DATA_SECURITY_BASELINE.md');

for(const [name,content] of [['vercel.json',vercel],['_headers',cloudflare]]){
  for(const token of ['Content-Security-Policy','X-Content-Type-Options','X-Frame-Options','Permissions-Policy','frame-ancestors']){
    if(!content.includes(token)) errors.push(`${name}: protezione ${token} mancante`);
  }
}

for(const token of ['isSameOriginRequest','acceptsJson','Cache-Control','no-store','Cross-Origin-Resource-Policy','MAX_CHUNKS']){
  if(!tts.includes(token)) errors.push(`api/tts.js: controllo ${token} mancante`);
}
if(/console\.(log|info|debug)\s*\(/.test(tts)) errors.push('api/tts.js: log applicativo potenzialmente contenente dati');

for(const token of ['storageKeys','exportData','purgeAll','fablea-dati-famiglia']){
  if(!dataControl.includes(token)) errors.push(`fablea-data-control.js: funzione ${token} mancante`);
}
if(/fetch\s*\(/.test(dataControl)) errors.push('fablea-data-control.js: il centro dati locale non deve inviare dati in rete');

if(!settings.includes('/assets/js/fablea-data-control.js')) errors.push('family-settings.html: controllo dati non caricato');
if(!settings.includes('Scrivi CANCELLA')) errors.push('family-settings.html: conferma distruttiva mancante');
if(!settings.includes('Scarica una copia')) errors.push('family-settings.html: esportazione non esposta');
if(!profile.includes('/family-settings.html')) errors.push('profile.html: centro dati non raggiungibile');
if(!baseline.includes('Non va descritta come cifratura locale')) errors.push('baseline sicurezza: limite della protezione locale non dichiarato');

if(errors.length){
  console.error('Security baseline check failed:');
  for(const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Security baseline check passed: controllo dati locale, API voce, headers e documentazione coperti.');
