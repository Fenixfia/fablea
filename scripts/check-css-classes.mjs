import fs from 'node:fs';
import path from 'node:path';

const coreFiles = [
  'index.html',
  'onboarding.html',
  'create-child.html',
  'profile.html',
  'child-hub.html',
  'story.html',
  'story-result.html',
  'library.html',
  'manualita.html',
  'about.html'
];

const css = fs.readFileSync('assets/css/fablea.css', 'utf8');
const defined = new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map(match => match[1]));

// Dynamic/template classes that are intentionally generated or represented by a base selector.
const allowedDynamic = new Set([
  'active',
  'primary',
  'secondary',
  'selected',
  'theme-night',
  'scene-night',
  'age-2-4',
  'age-5-7',
  'age-8-10',
  'age-11-12'
]);

const used = new Map();

for (const file of coreFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/class\s*=\s*(["'`])([\s\S]*?)\1/g)) {
    const raw = match[2];
    if (raw.includes('${')) continue;
    for (const className of raw.split(/\s+/).filter(Boolean)) {
      if (!used.has(className)) used.set(className, new Set());
      used.get(className).add(file);
    }
  }
}

const missing = [...used.keys()]
  .filter(className => !defined.has(className) && !allowedDynamic.has(className))
  .sort();

if (missing.length) {
  console.error('Classi statiche significative senza stile condiviso:');
  for (const className of missing) {
    console.error(`- ${className}: ${[...used.get(className)].join(', ')}`);
  }
  process.exit(1);
}

console.log(`CSS class audit passed: ${used.size} classi statiche coperte o documentate.`);
