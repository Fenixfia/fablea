import fs from 'node:fs';

const editorialFiles = [
  'stories-v2/age-2-4.js',
  'stories-v2/age-5-7.js',
  'stories-v2/age-8-10.js',
  'stories-v2/age-11-12.js'
];

const missing = editorialFiles.filter(file => !fs.existsSync(file));
if(missing.length){
  console.error(`Catalogo editoriale incompleto. File mancanti: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Il catalogo stories-v2 è editoriale e non viene generato automaticamente.');
console.log('Modificare direttamente i file per fascia e validare con npm run check:stories.');
