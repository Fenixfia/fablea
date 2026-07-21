import fs from 'node:fs';

const coreFiles = [
  'index.html',
  'onboarding.html',
  'create-child.html',
  'profile.html',
  'child-hub.html',
  'discover.html',
  'story.html',
  'story-result.html',
  'world.html',
  'library.html',
  'manualita.html',
  'about.html'
];

const cssFiles = [
  'assets/css/fablea.css',
  'assets/css/fablea-shell.css',
  'assets/css/fablea-unified.css',
  'assets/css/fablea-public.css',
  'assets/css/fablea-mobile-emotion.css'
].filter(file => fs.existsSync(file));
const css = cssFiles.map(file => fs.readFileSync(file,'utf8')).join('\n');
const defined = new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map(match => match[1]));

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

const behaviorHooks = new Set([
  'delete-child',
  'delete-story',
  'enter-child',
  'quick-mode',
  'reopen-story',
  'select-child'
]);

const inheritedSemantic = new Set(['muted']);

const used = new Map();
for(const file of coreFiles){
  const html = fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/class\s*=\s*(["'`])([\s\S]*?)\1/g)){
    const raw = match[2];
    if(raw.includes('${')) continue;
    for(const className of raw.split(/\s+/).filter(Boolean)){
      if(!used.has(className)) used.set(className,new Set());
      used.get(className).add(file);
    }
  }
}

const missing = [...used.keys()]
  .filter(className => !defined.has(className))
  .filter(className => !allowedDynamic.has(className))
  .filter(className => !behaviorHooks.has(className))
  .filter(className => !inheritedSemantic.has(className))
  .sort();

if(missing.length){
  console.error('Classi statiche significative senza stile condiviso o documentazione:');
  for(const className of missing){
    console.error(`- ${className}: ${[...used.get(className)].join(', ')}`);
  }
  process.exit(1);
}

console.log(`CSS class audit passed: ${used.size} classi statiche coperte o documentate in ${cssFiles.length} fogli condivisi.`);