import fs from 'fs';
import vm from 'vm';
const context={window:{}}; vm.createContext(context);
for(const f of ['stories-v2/age-2-4.js','stories-v2/age-5-7.js','stories-v2/age-8-10.js','stories-v2/age-11-12.js','stories-v2/index.js']) vm.runInContext(fs.readFileSync(f,'utf8'), context, {filename:f});
const stories=context.window.FABLEA_STORIES_V2||[];
const targets={'2-4':{Breve:[250,380],Media:[350,550],Lunga:[500,700]},'5-7':{Breve:[480,650],Media:[650,900],Lunga:[850,1150]},'8-10':{Breve:[700,950],Media:[900,1300],Lunga:[1200,1650]},'11-12':{Breve:[900,1250],Media:[1200,1700],Lunga:[1600,2100]}};
const fail=[]; const ids=new Set(); const families=['avventura','calma-sera','emozioni','scoperta'];
const wc=t=>String(t||'').trim().split(/\s+/).filter(Boolean).length;
function pagesFor(s,d){ if(d==='Breve') return s.pages.filter(p=>!p.optionalForShort).map(p=>p.text); if(d==='Media') return s.pages.slice(0,7).map(p=>p.text); return s.pages.map(p=>p.extendedForLong||p.text); }
for(const age of Object.keys(targets)){ const list=stories.filter(s=>s.age===age); if(list.length<4) fail.push(`${age}: meno di 4 storie`); for(const fam of families) if(!list.some(s=>s.family===fam)) fail.push(`${age}: manca famiglia ${fam}`); }
for(const s of stories){ if(ids.has(s.id)) fail.push(`id duplicato ${s.id}`); ids.add(s.id); if(!s.title||!s.subtitle) fail.push(`${s.id}: titolo/sottotitolo mancante`); if(!Array.isArray(s.pages)||s.pages.length<6) fail.push(`${s.id}: poche pagine`); if(!s.treasure||!s.ritual||!s.activity) fail.push(`${s.id}: tesoro/rituale/attività mancante`); for(const p of s.pages) if(!p.text||!p.text.trim()) fail.push(`${s.id}: testo vuoto`); for(const d of ['Breve','Media','Lunga']){ const n=wc(pagesFor(s,d).join(' ')); const [min,max]=targets[s.age][d]; if(n<min||n>max) fail.push(`${s.id} ${d}: ${n} parole fuori target ${min}-${max}`); } }
const mainFlow=['story-result.html','assets/js/fablea-story-engine.js','library.html'].map(f=>fs.readFileSync(f,'utf8')).join('\n'); if(mainFlow.includes('fableaExpandStory')) fail.push('fableaExpandStory presente nel flusso principale'); if((context.window.FABLEA_STORIES_V2||[]).some(s=>s.legacy)) fail.push('storia legacy nel catalogo principale');
for(let i=0;i<stories.length;i++) for(let j=i+1;j<stories.length;j++){ const a=pagesFor(stories[i],'Breve').join(' ').slice(0,180); const b=pagesFor(stories[j],'Breve').join(' '); if(a.length>220 && b.includes(a)) fail.push(`duplicazione estesa ${stories[i].id}/${stories[j].id}`); }
if(fail.length){ console.error(fail.join('\n')); process.exit(1); }
for(const s of stories) console.log(`${s.id}: breve=${wc(pagesFor(s,'Breve').join(' '))}, media=${wc(pagesFor(s,'Media').join(' '))}, lunga=${wc(pagesFor(s,'Lunga').join(' '))}, pagine=${s.pages.length}`);
